package com.agrisync.backend.controller;

import com.agrisync.backend.dto.buyer.BuyerDashboardResponse;
import com.agrisync.backend.service.BuyerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/buyer/dashboard")
@RequiredArgsConstructor
public class BuyerDashboardController {

    private final BuyerDashboardService dashboardService;

    @GetMapping("/{buyerId}")
    public ResponseEntity<BuyerDashboardResponse> getDashboard(@PathVariable Long buyerId) {
        BuyerDashboardResponse dashboard = dashboardService.getDashboard(buyerId);
        return ResponseEntity.ok(dashboard);
    }
}

