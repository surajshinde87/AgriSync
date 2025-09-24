package com.agrisync.backend.dto.bid;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BidRequest {
    private Long produceId;
    private Long buyerId;
    private String buyerName;
    private Double bidPricePerKg;
    private Double quantityKg;
}

