package com.agrisync.backend.service;

import org.springframework.stereotype.Service;

import com.agrisync.backend.dto.farmer.FarmerProfileRequest;
import com.agrisync.backend.dto.farmer.FarmerProfileResponse;
import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.repository.FarmerProfileRepository;
import com.agrisync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FarmerProfileService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final UserRepository userRepository;
    private final GithubImageService githubImageService;


    // Save/Update farmer profile
public FarmerProfileResponse updateProfile(Long userId, FarmerProfileRequest request) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!"FARMER".equalsIgnoreCase(user.getRole())) {
        throw new RuntimeException("Only FARMER can update profile");
    }

    FarmerProfile profile = farmerProfileRepository.findByUser(user)
            .orElse(new FarmerProfile());

    profile.setUser(user);

    // Handle image: file upload or existing URL
    if (request.getProfileImageFile() != null && !request.getProfileImageFile().isEmpty()) {
        String fileName = "farmer_" + userId + "_" + request.getProfileImageFile().getOriginalFilename();
        String imageUrl = githubImageService.uploadImage(request.getProfileImageFile(), fileName);
        profile.setProfileImageUrl(imageUrl);
    } else if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isEmpty()) {
        profile.setProfileImageUrl(request.getProfileImageUrl());
    }

    // Set other fields
    profile.setBankAccountNumber(request.getBankAccountNumber());
    profile.setIfscCode(request.getIfscCode());
    profile.setUpiId(request.getUpiId());
    profile.setBankName(request.getBankName());
    profile.setAadhaarNumber(request.getAadhaarNumber());
    profile.setFarmLocation(request.getFarmLocation());

    FarmerProfile saved = farmerProfileRepository.save(profile);

    return mapToResponse(user, saved);
}



    public FarmerProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FarmerProfile profile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer profile not found"));

        return mapToResponse(user, profile);
    }

    private FarmerProfileResponse mapToResponse(User user, FarmerProfile profile) {
        return FarmerProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .role(user.getRole())
                .profileImageUrl(profile.getProfileImageUrl())
                .bankAccountNumber(profile.getBankAccountNumber())
                .ifscCode(profile.getIfscCode())
                .upiId(profile.getUpiId())
                .bankName(profile.getBankName())
                .aadhaarNumber(profile.getAadhaarNumber())
                .farmLocation(profile.getFarmLocation())
                .build();
    }
}