package com.agrisync.backend.service;

import com.agrisync.backend.dto.buyer.BuyerProfileRequest;
import com.agrisync.backend.dto.buyer.BuyerProfileResponse;
import com.agrisync.backend.entity.BuyerProfile;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.repository.BuyerProfileRepository;
import com.agrisync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BuyerProfileService {

    private final BuyerProfileRepository buyerProfileRepository;
    private final UserRepository userRepository;

    public BuyerProfileResponse getBuyerProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BuyerProfile profile = buyerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Buyer profile not found"));

        return mapToResponse(user, profile);
    }

    public BuyerProfileResponse updateProfile(Long userId, BuyerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"BUYER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only BUYER can update profile");
        }

        BuyerProfile profile = buyerProfileRepository.findByUser(user)
                .orElse(new BuyerProfile());

        profile.setUser(user);
        profile.setProfileImageUrl(request.getProfileImageUrl());
        profile.setDeliveryAddress(request.getDeliveryAddress());
        profile.setPreferredPaymentMethod(request.getPreferredPaymentMethod());
        profile.setGstNumber(request.getGstNumber());
        profile.setCompanyName(request.getCompanyName());
        profile.setUpiId(request.getUpiId());
        profile.setCardLast4(request.getCardLast4());

        BuyerProfile saved = buyerProfileRepository.save(profile);
        return mapToResponse(user, saved);
    }

    private BuyerProfileResponse mapToResponse(User user, BuyerProfile profile) {
        return BuyerProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .role(user.getRole())
                .deliveryAddress(profile.getDeliveryAddress())
                .preferredPaymentMethod(profile.getPreferredPaymentMethod())
                .gstNumber(profile.getGstNumber())
                .companyName(profile.getCompanyName())
                .upiId(profile.getUpiId())
                .cardLast4(profile.getCardLast4())
                .profileImageUrl(profile.getProfileImageUrl())
                .build();
    }
}
