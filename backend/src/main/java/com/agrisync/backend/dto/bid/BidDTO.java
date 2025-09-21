package com.agrisync.backend.dto.bid;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BidDTO {
    private Long bidId;
    private Long produceId;
    private Long buyerId;
    private String buyerName;
    private Double bidPricePerKg;
    private Double quantityKg;
    private String status;
    private LocalDateTime placedAt;
}

