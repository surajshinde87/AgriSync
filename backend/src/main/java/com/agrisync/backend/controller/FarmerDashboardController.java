package com.agrisync.backend.controller;

import com.agrisync.backend.dto.farmer.FarmerDashboardResponse;
import com.agrisync.backend.service.FarmerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer")
@RequiredArgsConstructor
public class FarmerDashboardController {

    private final FarmerDashboardService farmerDashboardService;

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<FarmerDashboardResponse> getDashboard(@PathVariable Long userId) {
        FarmerDashboardResponse response = farmerDashboardService.getDashboard(userId);
        return ResponseEntity.ok(response);
    }
}
