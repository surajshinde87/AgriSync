package com.agrisync.backend.dto.buyer;

import com.agrisync.backend.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuyerProfileRequest {
    private String profileImageUrl; // final URL after upload
    private String deliveryAddress;
    private PaymentMethod preferredPaymentMethod;
    private String gstNumber;
    private String companyName;
    private String upiId;
    private String cardLast4;
}
