package com.agrisync.backend.controller;

import com.agrisync.backend.dto.bid.BidRequest;
import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.entity.Bid;
import com.agrisync.backend.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/buyer/bids")
@RequiredArgsConstructor
public class BuyerBidController {

    private final BidService bidService;

    // ================= Place a new bid =================
    @PostMapping
    public ResponseEntity<BidResponse> placeBid(@RequestBody BidRequest request) {
        Bid bid = bidService.placeBid(request);
        return ResponseEntity.ok(mapToResponse(bid));
    }

    // ================= View all bids placed by a buyer =================
    @GetMapping
    public ResponseEntity<List<BidResponse>> getBuyerBids(@RequestParam Long buyerId) {
        return ResponseEntity.ok(bidService.getBuyerBidsDTO(buyerId));
    }

    // ================= Cancel a bid =================
    @PostMapping("/{bidId}/cancel")
    public ResponseEntity<BidResponse> cancelBid(@PathVariable Long bidId) {
        Bid bid = bidService.cancelBid(bidId);
        return ResponseEntity.ok(mapToResponse(bid));
    }

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

