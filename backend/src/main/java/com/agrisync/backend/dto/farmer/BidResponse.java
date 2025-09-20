package com.agrisync.backend.dto.farmer;

import lombok.*;
import java.time.LocalDateTime;

import com.agrisync.backend.model.User;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidResponse {
    private Long bidId;
    private Long produceId;
    private String cropType;
    private Long farmerId;

    private Long buyerId;
    private String buyerName;
    private Double bidPricePerKg;
    private Double quantityKg;
    private String status;
    private LocalDateTime placedAt;
}
