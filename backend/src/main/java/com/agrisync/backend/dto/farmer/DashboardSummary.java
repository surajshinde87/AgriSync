package com.agrisync.backend.dto.farmer;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummary {
    private Double totalEarningsAllTime;
    private Double earningsLast30Days;
    private Double totalQuantitySoldKg;
    private Integer activeListings;
    private Double pendingPayments;
}
