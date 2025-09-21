package com.agrisync.backend.dto.farmer;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TopCropResponse {
    private String crop;
    private Double revenue;
    private Double qtyKg;
}
