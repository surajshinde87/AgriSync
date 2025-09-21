package com.agrisync.backend.dto.order;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private Long produceId;
    private String buyerName;
    private Double quantityKg;
    private Double finalPricePerKg;
    private Double totalAmount;
    private String status;
    private String paymentStatus;
    private LocalDateTime deliveryExpectedAt;
}

