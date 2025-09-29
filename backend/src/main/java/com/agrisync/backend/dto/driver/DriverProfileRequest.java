package com.agrisync.backend.dto.driver;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverProfileRequest {

    private String phoneNumber;
    private String vehicleNumber;
    private String vehicleType;
    private Double maxLoadKg;
    private String licenseNumber;

    private MultipartFile profileImageFile; // Optional
    
}
