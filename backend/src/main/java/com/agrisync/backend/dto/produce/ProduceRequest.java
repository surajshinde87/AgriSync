package com.agrisync.backend.dto.produce;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProduceRequest {
    private String cropType;
    private Double quantityKg;
    private Double pricePerKg;
    private LocalDate harvestDate;
    private String city;
    private String state;
    private MultipartFile photoFile; // optional for upload
    private String photoUrl;         // optional if already uploaded
}
