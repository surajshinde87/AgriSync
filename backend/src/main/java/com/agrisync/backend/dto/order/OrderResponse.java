package com.agrisync.backend.dto.order;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.enums.PaymentStatus;

@Data
@Builder
public class OrderResponse {

    private Long orderId;
    private Long produceId;
    private String produceName;
    private String cropType;

    private Long farmerId;
    private String farmerName;
    private String farmerCity;

    private Long buyerId;
    private String buyerName;
    private String buyerEmail;

    private Double quantityKg;
    private Double pricePerKg;
    private Double totalAmount;

    private OrderStatus status;
    private PaymentStatus paymentStatus;

    private LocalDateTime deliveryExpectedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

