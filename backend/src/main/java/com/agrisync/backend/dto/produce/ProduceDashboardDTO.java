package com.agrisync.backend.dto.produce;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProduceDashboardDTO {
    private Long id;
    private String cropType;
    private Double quantityKg;
    private Double pricePerKg;
    private LocalDate harvestDate;
    private String city;
    private String photoUrl;
    private String qualityGrade;
    private String status;
    private Integer activeBidsCount;
    private Double bestBidPrice;
}
