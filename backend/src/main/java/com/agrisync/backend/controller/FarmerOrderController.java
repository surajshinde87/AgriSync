package com.agrisync.backend.controller;

import com.agrisync.backend.dto.order.OrderDTO;
import com.agrisync.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmer/orders")
@RequiredArgsConstructor
public class FarmerOrderController {

    private final OrderService orderService;

    // List all orders for logged-in farmer
    @GetMapping
    public List<OrderDTO> getOrders(@RequestParam Long farmerId) {
        return orderService.getOrdersByFarmer(farmerId);
    }

    // Get details of a specific order
    @GetMapping("/{id}")
    public OrderDTO getOrder(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    // Mark order delivered
    @PostMapping("/{id}/mark-delivered")
    public OrderDTO markDelivered(@PathVariable Long id) {
        return orderService.markOrderDelivered(id);
    }
}
