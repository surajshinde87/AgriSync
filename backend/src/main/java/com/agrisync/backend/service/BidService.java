package com.agrisync.backend.service;

import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.enums.BidStatus;
import com.agrisync.backend.model.Bid;
import com.agrisync.backend.model.Produce;
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

    /**
     * Get all bids for a farmer's produces as DTOs
     */
    @Transactional(readOnly = true)
    public List<BidResponse> getFarmerBidsDTO(Long farmerId) {
        // Fetch all active bids for produces belonging to this farmer
        List<Bid> bids = bidRepository.findByProduce_Farmer_IdAndActiveTrue(farmerId);

        // Map Bid -> BidResponse
        return bids.stream()
                .map(bid -> BidResponse.builder()
                        .bidId(bid.getId())
                        .produceId(bid.getProduce().getId())
                        .cropType(bid.getProduce().getCropType())
                        .farmerId(bid.getProduce().getFarmer().getId()) // Access via User
                        .buyerId(bid.getBuyerId())
                        .buyerName(bid.getBuyerName())
                        .bidPricePerKg(bid.getBidPricePerKg())
                        .quantityKg(bid.getQuantityKg())
                        .status(bid.getStatus().name())
                        .placedAt(bid.getPlacedAt())
                        .build()
                )
                .collect(Collectors.toList());
    }

    /**
     * Accept a bid
     */
    @Transactional
    public Bid acceptBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        bid.setStatus(BidStatus.ACCEPTED);
        bidRepository.save(bid);

        return bid;
    }

    /**
     * Reject a bid
     */
    @Transactional
    public Bid rejectBid(Long bidId) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        bid.setStatus(BidStatus.REJECTED);
        bidRepository.save(bid);

        return bid;
    }

    /**
     * Create a dummy bid for testing
     */
    @Transactional
    public Bid createDummyBid(Long produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new RuntimeException("Produce not found"));

        Bid bid = Bid.builder()
                .produce(produce)
                .buyerId(99L)
                .buyerName("Hotel GoodFood")
                .bidPricePerKg(produce.getPricePerKg() + 2)
                .quantityKg(produce.getQuantityKg() / 2)
                .status(BidStatus.OPEN)
                .placedAt(LocalDateTime.now())
                .active(true)
                .build();

        return bidRepository.save(bid);
    }
}
