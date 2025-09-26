package com.agrisync.backend.service;

import com.agrisync.backend.dto.bid.BidRequest;
import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.entity.Bid;
import com.agrisync.backend.entity.Produce;
import com.agrisync.backend.enums.BidStatus;
import com.agrisync.backend.repository.BidRepository;
import com.agrisync.backend.repository.ProduceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ProduceRepository produceRepository;
    private final NotificationService notificationService;

    // ================== FARMER SIDE ==================

    /**
     * Get all bids for a farmer's produces (including open, accepted, rejected)
     */
    @Transactional(readOnly = true)
    public List<BidResponse> getFarmerBidsDTO(Long farmerId) {
        List<Bid> bids = bidRepository.findByProduce_Farmer_IdAndActiveTrue(farmerId); // include all, not only active
        return bids.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Accept a bid (farmer action)
     */
    @Transactional
    public Bid acceptBid(Long bidId) {
        return updateBidStatus(bidId, BidStatus.ACCEPTED);
    }

    /**
     * Reject a bid (farmer action)
     */
    @Transactional
    public Bid rejectBid(Long bidId) {
        return updateBidStatus(bidId, BidStatus.REJECTED);
    }

    // ================== BUYER SIDE ==================

    /**
     * Place a bid (buyer action)
     */
    @Transactional
    public Bid placeBid(BidRequest request) {
        Produce produce = produceRepository.findById(request.getProduceId())
                .orElseThrow(() -> new RuntimeException("Produce not found"));

        if (!"AVAILABLE".equalsIgnoreCase(produce.getStatus())) {
            throw new RuntimeException("Produce is not available for bidding");
        }

        Bid bid = Bid.builder()
                .produce(produce)
                .buyerId(request.getBuyerId())
                .buyerName(request.getBuyerName())
                .bidPricePerKg(request.getBidPricePerKg())
                .quantityKg(request.getQuantityKg())
                .status(BidStatus.OPEN)
                .placedAt(LocalDateTime.now())
                .active(true)
                .build();

        return bidRepository.save(bid);
    }

    /**
     * Get all bids placed by a buyer (including closed bids)
     */
    @Transactional(readOnly = true)
    public List<BidResponse> getBuyerBidsDTO(Long buyerId) {
        List<Bid> bids = bidRepository.findByBuyerIdAndActiveTrue(buyerId); // include accepted/rejected
        return bids.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    /**
     * Cancel a bid (buyer action) – only if still OPEN
     */
    @Transactional
    public Bid cancelBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        if (bid.getStatus() != BidStatus.OPEN) {
            throw new RuntimeException("Only open bids can be canceled");
        }

        bid.setStatus(BidStatus.REJECTED);
        bid.setActive(false);
        bidRepository.save(bid);

        // Notify farmer if needed
        notificationService.sendBidUpdate(
                bid.getProduce().getFarmer().getId(),
                bid.getProduce().getCropType(),
                "CANCELED"
        );

        return bid;
    }

    // Active bids
public List<BidResponse> getActiveBidsForBuyer(Long buyerId) {
    return bidRepository.findByBuyerIdAndStatus(buyerId, BidStatus.OPEN)
            .stream()
            .map(this::mapToResponse)
            .toList();
}

// Count of active bids
public Integer getActiveBidsCountForBuyer(Long buyerId) {
    return bidRepository.countByBuyerIdAndStatus(buyerId, BidStatus.OPEN);
}


    // ================== HELPER ==================

    /**
     * Update bid status and send notification
     */
    @Transactional
    public Bid updateBidStatus(Long bidId, BidStatus status) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        bid.setStatus(status);
        bid.setActive(false); // mark closed
        bidRepository.save(bid);

        // Send real-time notification to buyer via WebSocket
        notificationService.sendBidUpdate(
                bid.getBuyerId(),
                bid.getProduce().getCropType(),
                status.name()
        );

        return bid;
    }

    /**
     * Map Bid entity to BidResponse DTO
     */
    private BidResponse mapToResponse(Bid bid) {
        return BidResponse.builder()
                .bidId(bid.getId())
                .produceId(bid.getProduce().getId())
                .cropType(bid.getProduce().getCropType())
                .farmerId(bid.getProduce().getFarmer().getId())
                .buyerId(bid.getBuyerId())
                .buyerName(bid.getBuyerName())
                .bidPricePerKg(bid.getBidPricePerKg())
                .quantityKg(bid.getQuantityKg())
                .status(bid.getStatus().name())
                .placedAt(bid.getPlacedAt())
                .build();
    }
}
