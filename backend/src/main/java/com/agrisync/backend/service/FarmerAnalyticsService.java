package com.agrisync.backend.service;

import com.agrisync.backend.dto.farmer.SalesAnalyticsResponse;
import com.agrisync.backend.model.Order;
import com.agrisync.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmerAnalyticsService {

    private final OrderRepository orderRepository;

    /**
     * Get sales analytics for a farmer
     *
     * @param farmerId ID of the farmer
     * @param periodDays Number of days for sales analysis (e.g., last 30 days)
     * @return SalesAnalyticsResponse
     */
    public SalesAnalyticsResponse getSalesAnalytics(Long farmerId, int periodDays) {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime startDate = now.minusDays(periodDays);

        // Fetch all farmer's orders
        List<Order> orders = Optional.ofNullable(orderRepository.findByFarmer_Id(farmerId))
                .orElse(Collections.emptyList());

        // Filter released orders within period
        List<Order> releasedOrders = orders.stream()
                .filter(o -> o.getPaymentStatus() != null
                        && "RELEASED".equalsIgnoreCase(o.getPaymentStatus().name())
                        && o.getCreatedAt() != null
                        && o.getCreatedAt().isAfter(startDate))
                .collect(Collectors.toList());

        // 1) Total revenue in period
        double totalRevenue = releasedOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        // 2) Total quantity sold
        double totalQuantity = releasedOrders.stream()
                .mapToDouble(o -> Optional.ofNullable(o.getQuantityKg()).orElse(0.0))
                .sum();

        // 3) Average price per kg per crop
        Map<String, Double> avgPricePerKgByCrop = releasedOrders.stream()
                .filter(o -> o.getProduce() != null && o.getPricePerKg() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getProduce().getCropType(),
                        Collectors.averagingDouble(Order::getPricePerKg)
                ));

        // 4) Best-selling crops (by revenue)
        Map<String, Double> revenueByCrop = releasedOrders.stream()
                .filter(o -> o.getProduce() != null && o.getTotalAmount() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getProduce().getCropType(),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        List<SalesAnalyticsResponse.CropRevenue> bestSellingCrops = revenueByCrop.entrySet().stream()
                .map(e -> SalesAnalyticsResponse.CropRevenue.builder()
                        .crop(e.getKey())
                        .revenue(e.getValue())
                        .build())
                .sorted((a, b) -> Double.compare(b.getRevenue(), a.getRevenue()))
                .limit(5)
                .collect(Collectors.toList());

        // 5) Daily sales for chart
        Map<LocalDateTime, Double> dailySalesMap = new TreeMap<>();
        for (int i = 0; i <= periodDays; i++) {
            LocalDateTime day = startDate.plusDays(i);
            double dayRevenue = releasedOrders.stream()
                    .filter(o -> o.getCreatedAt().truncatedTo(ChronoUnit.DAYS).equals(day.truncatedTo(ChronoUnit.DAYS)))
                    .mapToDouble(Order::getTotalAmount)
                    .sum();
            dailySalesMap.put(day, dayRevenue);
        }

        return SalesAnalyticsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalQuantityKg(totalQuantity)
                .avgPricePerKgByCrop(avgPricePerKgByCrop)
                .bestSellingCrops(bestSellingCrops)
                .dailySales(dailySalesMap)
                .build();
    }
}
