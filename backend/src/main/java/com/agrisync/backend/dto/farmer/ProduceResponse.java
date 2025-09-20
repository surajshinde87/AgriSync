package com.agrisync.backend.dto.farmer;

import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduceResponse {
    private Long id;
    private String cropType;
    private Double quantityKg;
    private Double pricePerKg;
    private LocalDate harvestDate;
    private String city;
    private String state;
    private String photoUrl;
    private String qualityGrade;
    private String status;
}
