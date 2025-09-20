package com.agrisync.backend.dto.farmer;


import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class FarmerProfileResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String city;
    private String state;
    private String pincode;
    private String role;

    private String profileImageUrl;
    private String bankAccountNumber;
    private String ifscCode;
    private String upiId;
    private String bankName;
    private String aadhaarNumber;
    private String farmLocation;
}
