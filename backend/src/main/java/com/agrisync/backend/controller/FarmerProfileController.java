package com.agrisync.backend.controller;

import com.agrisync.backend.dto.farmer.FarmerProfileRequest;
import com.agrisync.backend.dto.farmer.FarmerProfileResponse;
import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.service.FarmerProfileService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.agrisync.backend.service.GithubImageService;


@RestController
@RequestMapping("/api/farmer/profile")
@RequiredArgsConstructor
public class FarmerProfileController {

    private final FarmerProfileService farmerProfileService;
    private final GithubImageService githubImageService;

 
    // ================= Update Profile =================
  @PostMapping("/{userId}")
public ResponseEntity<FarmerProfileResponse> updateProfile(
        @PathVariable Long userId,
        @RequestParam(value = "profileImageFile", required = false) MultipartFile profileImageFile,
        @RequestParam(value = "profileImageUrl", required = false) String profileImageUrl,
        @RequestParam(value = "bankAccountNumber", required = false) String bankAccountNumber,
        @RequestParam(value = "ifscCode", required = false) String ifscCode,
        @RequestParam(value = "upiId", required = false) String upiId,
        @RequestParam(value = "bankName", required = false) String bankName,
        @RequestParam(value = "aadhaarNumber", required = false) String aadhaarNumber,
        @RequestParam(value = "farmLocation", required = false) String farmLocation
) {
    // if file is uploaded, override profileImageUrl
    if (profileImageFile != null && !profileImageFile.isEmpty()) {
    profileImageUrl = githubImageService.uploadImage(profileImageFile, "farmer_" + userId + ".jpg");
}


    FarmerProfileRequest request = FarmerProfileRequest.builder()
            .profileImageUrl(profileImageUrl)
            .bankAccountNumber(bankAccountNumber)
            .ifscCode(ifscCode)
            .upiId(upiId)
            .bankName(bankName)
            .aadhaarNumber(aadhaarNumber)
            .farmLocation(farmLocation)
            .build();

    FarmerProfileResponse response = farmerProfileService.updateProfile(userId, request);
    return ResponseEntity.ok(response);
}



    // ================= Get Profile =================
  @GetMapping("/{userId}")
public ResponseEntity<FarmerProfile> getFarmerProfile(@PathVariable Long userId) {
    FarmerProfile profile = farmerProfileService.getProfileByUserId(userId);

    if (profile == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    return ResponseEntity.ok(profile);
}

}

