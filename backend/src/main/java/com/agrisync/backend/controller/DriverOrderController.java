package com.agrisync.backend.controller;

import com.agrisync.backend.dto.order.DriverOrderResponse;
import com.agrisync.backend.enums.DriverOrderStatus;
import com.agrisync.backend.service.DriverOrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/driver/orders")
@RequiredArgsConstructor
public class DriverOrderController {

    private final DriverOrderService driverOrderService;

    // Assign an order to a driver
    @PostMapping("/assign")
    public ResponseEntity<DriverOrderResponse> assignOrder(
            @RequestParam Long orderId,
            @RequestParam Long driverId) {
        DriverOrderResponse response = driverOrderService.assignOrderToDriver(orderId, driverId);
        return ResponseEntity.ok(response);
    }

    // Update status of a driver order
    @PutMapping("/{driverOrderId}/status")
    public ResponseEntity<DriverOrderResponse> updateStatus(
            @PathVariable Long driverOrderId,
            @RequestParam DriverOrderStatus status) {
        DriverOrderResponse response = driverOrderService.updateStatus(driverOrderId, status);
        return ResponseEntity.ok(response);
    }

    // Get all orders assigned to a driver
    @GetMapping("/{driverId}")
    public ResponseEntity<List<DriverOrderResponse>> getDriverOrders(@PathVariable Long driverId) {
        List<DriverOrderResponse> orders = driverOrderService.getDriverOrders(driverId);
        return ResponseEntity.ok(orders);
    }
    //  Searcn orders for driver
    @GetMapping("/{driverId}/search")
    public ResponseEntity<List<DriverOrderResponse>> searchDriverOrders(
            @PathVariable Long driverId,
            @RequestParam(required = false) DriverOrderStatus status,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String cropType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<DriverOrderResponse> orders = driverOrderService.searchDriverOrders(driverId, status, city, cropType,
                startDate, endDate);
        return ResponseEntity.ok(orders);
    }

}
