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

    private final FarmerDashboardService dashboardService;

    /**
     * GET /api/farmer/dashboard
     * Returns dashboard payload including profile, summary, top crops, produces, active bids, orders, transactions, feedbacks
     *
     * @param farmerId ID of the farmer (could be obtained from JWT in production)
     * @return FarmerDashboardResponse
     */
    @GetMapping("/dashboard")
    public ResponseEntity<FarmerDashboardResponse> getDashboard(@RequestParam Long farmerId) {
        FarmerDashboardResponse dashboard = dashboardService.getDashboard(farmerId);
        return ResponseEntity.ok(dashboard);
    }
}
