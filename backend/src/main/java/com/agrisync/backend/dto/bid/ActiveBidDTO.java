package com.agrisync.backend.dto.bid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActiveBidDTO {
    private Long bidId;
    private Long produceId;
    private Long buyerId;
    private String buyerName;
    private Double bidPricePerKg;
    private Double quantityKg;
    private String status;
    private LocalDateTime placedAt;
}

