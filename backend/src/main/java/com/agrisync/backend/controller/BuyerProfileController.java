package com.agrisync.backend.controller;

import com.agrisync.backend.dto.buyer.BuyerProfileRequest;
import com.agrisync.backend.dto.buyer.BuyerProfileResponse;
import com.agrisync.backend.enums.PaymentMethod;
import com.agrisync.backend.service.BuyerProfileService;
import com.agrisync.backend.service.GithubImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/buyer/profile")
@RequiredArgsConstructor
public class BuyerProfileController {

    private final BuyerProfileService buyerProfileService;
    private final GithubImageService githubImageService;

    @PostMapping(value = "/{userId}", consumes = "multipart/form-data")
    public ResponseEntity<BuyerProfileResponse> updateProfile(
            @PathVariable Long userId,
            @RequestParam(value = "profileImageFile", required = false) MultipartFile profileImageFile,
            @RequestParam(value = "profileImageUrl", required = false) String profileImageUrl,
            @RequestParam(value = "deliveryAddress", required = false) String deliveryAddress,
            @RequestParam(value = "preferredPaymentMethod", required = false) String preferredPaymentMethod,
            @RequestParam(value = "gstNumber", required = false) String gstNumber,
            @RequestParam(value = "companyName", required = false) String companyName,
            @RequestParam(value = "upiId", required = false) String upiId,
            @RequestParam(value = "cardLast4", required = false) String cardLast4
    ) {
        // Handle file upload first
        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            profileImageUrl = githubImageService.uploadImage(profileImageFile, "buyer_" + userId + ".jpg");
        }

        BuyerProfileRequest request = BuyerProfileRequest.builder()
                .profileImageUrl(profileImageUrl)
                .deliveryAddress(deliveryAddress)
                .preferredPaymentMethod(preferredPaymentMethod != null ? PaymentMethod.valueOf(preferredPaymentMethod) : null)
                .gstNumber(gstNumber)
                .companyName(companyName)
                .upiId(upiId)
                .cardLast4(cardLast4)
                .build();

        BuyerProfileResponse response = buyerProfileService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<BuyerProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(buyerProfileService.getBuyerProfile(userId));
    }
}
