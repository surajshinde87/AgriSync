package com.agrisync.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrisync.backend.dto.driver.DriverDashboardResponse;
import com.agrisync.backend.service.DriverDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/driver/dashboard")
@RequiredArgsConstructor
public class DriverDashboardController {

    private final DriverDashboardService driverDashboardService;

    @GetMapping("/{driverId}")
    public ResponseEntity<DriverDashboardResponse> getDashboard(@PathVariable Long driverId) {
        return ResponseEntity.ok(driverDashboardService.getDashboard(driverId));
    }
}

