package com.agrisync.backend.controller;

import com.agrisync.backend.dto.user.ForgotPasswordRequest;
import com.agrisync.backend.dto.user.LoginRequest;
import com.agrisync.backend.dto.user.OtpVerificationRequest;
import com.agrisync.backend.dto.user.ResetPasswordRequest;
import com.agrisync.backend.dto.user.UserRegistrationRequest;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ================= Register User =================
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody UserRegistrationRequest request) {
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole())
                .pincode(request.getPincode())
                .city(request.getCity())
                .state(request.getState())
                .verified(false)
                .build();

        userService.registerUser(user, request.getConfirmPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent to email.");
        return ResponseEntity.ok(response);
    }

    // ================= Verify OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        userService.verifyOtp(request.getEmail(), request.getOtp(), request.getType());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Email verified successfully!");
        return ResponseEntity.ok(response);
    }

    // ================= Login =================
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful!");
        response.put("user", Map.of(
                "id", user.getId(),
                "role", user.getRole()));

        return ResponseEntity.ok(response);
    }

    // ================= Forgot Password =================
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "OTP sent to email for password reset.");
        return ResponseEntity.ok(response);
    }

    // ================= Reset Password =================
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Password reset successful!");
        return ResponseEntity.ok(response);
    }
}
