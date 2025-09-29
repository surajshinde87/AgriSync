package com.agrisync.backend.service;

import com.agrisync.backend.dto.driver.DriverProfileRequest;
import com.agrisync.backend.dto.driver.DriverProfileResponse;
import com.agrisync.backend.entity.DriverProfile;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.repository.DriverProfileRepository;
import com.agrisync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverProfileService {

    private final DriverProfileRepository driverProfileRepository;
    private final UserRepository userRepository;

    public DriverProfileResponse getDriverProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DriverProfile profile = driverProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Driver profile not found"));

        return mapToResponse(user, profile);
    }

    public DriverProfileResponse updateProfile(Long userId, DriverProfileRequest request, String profileImageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"DRIVER".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only DRIVER can update profile");
        }

        DriverProfile profile = driverProfileRepository.findByUser(user)
                .orElse(new DriverProfile());

        profile.setUser(user);
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setVehicleNumber(request.getVehicleNumber());
        profile.setVehicleType(request.getVehicleType());
        profile.setMaxLoadKg(request.getMaxLoadKg());
        profile.setLicenseNumber(request.getLicenseNumber());
        profile.setProfileImageUrl(profileImageUrl);

        DriverProfile saved = driverProfileRepository.save(profile);
        return mapToResponse(user, saved);
    }

    private DriverProfileResponse mapToResponse(User user, DriverProfile profile) {
        return DriverProfileResponse.builder()
                .id(profile.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .role(user.getRole())
                .phoneNumber(profile.getPhoneNumber())
                .vehicleNumber(profile.getVehicleNumber())
                .vehicleType(profile.getVehicleType())
                .maxLoadKg(profile.getMaxLoadKg())
                .licenseNumber(profile.getLicenseNumber())
                .profileImageUrl(profile.getProfileImageUrl())
                .active(profile.getActive())
                .build();
    }
}
