package com.agrisync.backend.dto.driver;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverSummary {
    private Integer totalOrdersAssigned;
    private Integer ordersInTransit;
    private Integer ordersDelivered;
    private Integer pendingOrders;
    private Double totalEarningsAllTime;
    private Double earningsLast30Days;
    private Double averageRating;
    private Integer totalRatings;
}

