package com.agrisync.backend.controller;

import com.agrisync.backend.dto.farmer.SalesAnalyticsResponse;
import com.agrisync.backend.service.FarmerAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farmer/analytics")
@RequiredArgsConstructor
public class FarmerAnalyticsController {

    private final FarmerAnalyticsService analyticsService;

    /**
     * GET /api/farmer/analytics/sales
     * Query params: farmerId, period (days)
     */
    @GetMapping("/sales")
    public ResponseEntity<SalesAnalyticsResponse> getSalesAnalytics(
            @RequestParam Long farmerId,
            @RequestParam(defaultValue = "30") int period
    ) {
        SalesAnalyticsResponse analytics = analyticsService.getSalesAnalytics(farmerId, period);
        return ResponseEntity.ok(analytics);
    }
}
