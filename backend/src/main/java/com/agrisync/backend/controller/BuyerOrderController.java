package com.agrisync.backend.controller;

import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.service.BuyerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/buyer/orders")
@RequiredArgsConstructor
public class BuyerOrderController {

    private final BuyerOrderService buyerOrderService;

    // Place a direct order
    @PostMapping("/place")
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestParam Long buyerId,
            @RequestParam Long produceId,
            @RequestParam Double quantityKg
    ) {
        return ResponseEntity.ok(buyerOrderService.placeOrder(buyerId, produceId, quantityKg));
    }

    // Get all orders for a buyer
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getBuyerOrders(@RequestParam Long buyerId) {
        return ResponseEntity.ok(buyerOrderService.getBuyerOrders(buyerId));
    }
}
