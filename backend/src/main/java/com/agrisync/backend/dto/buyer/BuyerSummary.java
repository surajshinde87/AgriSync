package com.agrisync.backend.dto.buyer;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuyerSummary {
    private Double totalSpentAllTime;
    private Double spentLast30Days;
    private Integer totalOrders;
    private Integer activeBids;
    private Integer pendingPayments;
}
