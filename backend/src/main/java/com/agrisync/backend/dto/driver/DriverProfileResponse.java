package com.agrisync.backend.dto.driver;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverProfileResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String city;
    private String state;
    private String pincode;
    private String role;

    private String phoneNumber;
    private String vehicleNumber;
    private String vehicleType;
    private Double maxLoadKg;
    private String licenseNumber;
    private String profileImageUrl;
    private Boolean active;
}
