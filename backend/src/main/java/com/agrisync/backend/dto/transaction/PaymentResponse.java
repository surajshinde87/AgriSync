package com.agrisync.backend.dto.transaction;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long orderId;
    private Double amount;
    private String status;
    private LocalDateTime timestamp;
}