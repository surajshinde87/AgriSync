package com.agrisync.backend.controller;

import com.agrisync.backend.dto.driver.DriverProfileRequest;
import com.agrisync.backend.dto.driver.DriverProfileResponse;
import com.agrisync.backend.service.DriverProfileService;
import com.agrisync.backend.service.GithubImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/driver/profile")
@RequiredArgsConstructor
public class DriverProfileController {

    private final DriverProfileService driverProfileService;
    private final GithubImageService githubImageService;

    @PostMapping(value = "/{userId}", consumes = "multipart/form-data")
    public ResponseEntity<DriverProfileResponse> updateProfile(
            @PathVariable Long userId,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "vehicleNumber", required = false) String vehicleNumber,
            @RequestParam(value = "vehicleType", required = false) String vehicleType,
            @RequestParam(value = "maxLoadKg", required = false) Double maxLoadKg,
            @RequestParam(value = "licenseNumber", required = false) String licenseNumber,
            @RequestParam(value = "profileImageFile", required = false) MultipartFile profileImageFile
    ) {
        String profileImageUrl = null;
        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            profileImageUrl = githubImageService.uploadImage(profileImageFile, "driver_" + userId + ".jpg");
        }

        DriverProfileRequest request = DriverProfileRequest.builder()
                .phoneNumber(phoneNumber)
                .vehicleNumber(vehicleNumber)
                .vehicleType(vehicleType)
                .maxLoadKg(maxLoadKg)
                .licenseNumber(licenseNumber)
                .profileImageFile(profileImageFile)
                .build();

        DriverProfileResponse response = driverProfileService.updateProfile(userId, request, profileImageUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<DriverProfileResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(driverProfileService.getDriverProfile(userId));
    }
}
