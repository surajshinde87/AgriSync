package com.agrisync.backend.dto.buyer;
import com.agrisync.backend.enums.PaymentMethod;

import lombok.*;


@Data
@Builder
public class BuyerProfileResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String city;
    private String state;
    private String pincode;
    private String role;

    private String deliveryAddress;
    private PaymentMethod preferredPaymentMethod;
    private String gstNumber;
    private String companyName;

    private String upiId;
    private String cardLast4;
    private String profileImageUrl;
}
