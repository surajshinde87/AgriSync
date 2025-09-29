package com.agrisync.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.agrisync.backend.dto.driver.DriverEarningResponse;
import com.agrisync.backend.service.DriverEarningService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/driver/earnings")
@RequiredArgsConstructor
public class DriverEarningController {

    private final DriverEarningService earningService;

    // Idempotent: create or update earning for a delivered driverOrder
    @PostMapping("/{driverOrderId}")
    public ResponseEntity<DriverEarningResponse> addOrUpdate(
            @PathVariable Long driverOrderId,
            @RequestParam Double amount) {
        return ResponseEntity.ok(earningService.addOrUpdateEarning(driverOrderId, amount));
    }

    // List earnings for a driver
    @GetMapping("/{driverId}")
    public ResponseEntity<List<DriverEarningResponse>> list(@PathVariable Long driverId) {
        return ResponseEntity.ok(earningService.getDriverEarnings(driverId));
    }

    // Sum total earnings
    @GetMapping("/{driverId}/total")
    public ResponseEntity<Double> total(@PathVariable Long driverId) {
        return ResponseEntity.ok(earningService.getTotalEarnings(driverId));
    }

    // Mark a single earning as paid
    @PostMapping("/mark-paid/{earningId}")
    public ResponseEntity<DriverEarningResponse> markPaid(@PathVariable Long earningId) {
        return ResponseEntity.ok(earningService.markPaid(earningId));
    }
}
