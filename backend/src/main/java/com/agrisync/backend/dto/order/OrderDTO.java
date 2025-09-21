package com.agrisync.backend.dto.order;

import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private Long produceId;
    private Long farmerId;
    private Long buyerId;
    private Double quantityKg;
    private Double pricePerKg;
    private Double totalAmount;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private LocalDateTime deliveryExpectedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
