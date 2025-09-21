package com.agrisync.backend.dto.farmer;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class SalesAnalyticsResponse {

    private double totalRevenue;
    private double totalQuantityKg;
    private Map<String, Double> avgPricePerKgByCrop;
    private List<CropRevenue> bestSellingCrops;
    private Map<LocalDateTime, Double> dailySales;

    @Data
    @Builder
    public static class CropRevenue {
        private String crop;
        private double revenue;
    }
}
