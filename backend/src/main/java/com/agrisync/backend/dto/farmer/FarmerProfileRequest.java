package com.agrisync.backend.dto.farmer;

import org.springframework.web.multipart.MultipartFile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FarmerProfileRequest {
    private String profileImageUrl;       // optional URL
    private MultipartFile profileImageFile; // optional file
    private String bankAccountNumber;
    private String ifscCode;
    private String upiId;
    private String bankName;
    private String aadhaarNumber;
    private String farmLocation;
}


