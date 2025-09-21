package com.agrisync.backend.controller;

import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.model.Bid;
import com.agrisync.backend.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    // ================= List all bids for a farmer =================
    @GetMapping
    public ResponseEntity<List<BidResponse>> getFarmerBids(@RequestParam Long farmerId) {
        List<BidResponse> bids = bidService.getFarmerBidsDTO(farmerId);
        return ResponseEntity.ok(bids);
    }

    // ================= Accept a bid =================
    @PostMapping("/{bidId}/accept")
    public ResponseEntity<BidResponse> acceptBid(@PathVariable Long bidId) {
        Bid bid = bidService.acceptBid(bidId);
        BidResponse response = mapToResponse(bid);
        return ResponseEntity.ok(response);
    }

    // ================= Reject a bid =================
    @PostMapping("/{bidId}/reject")
    public ResponseEntity<BidResponse> rejectBid(@PathVariable Long bidId) {
        Bid bid = bidService.rejectBid(bidId);
        BidResponse response = mapToResponse(bid);
        return ResponseEntity.ok(response);
    }

    // ================= Create dummy bid for testing =================
    @PostMapping("/dummy/{produceId}")
    public ResponseEntity<BidResponse> createDummyBid(@PathVariable Long produceId) {
        Bid bid = bidService.createDummyBid(produceId);
        BidResponse response = mapToResponse(bid);
        return ResponseEntity.ok(response);
    }

    // ================= Helper to convert Bid -> BidResponse =================
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
