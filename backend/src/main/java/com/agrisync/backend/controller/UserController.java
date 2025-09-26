package com.agrisync.backend.controller;


import com.agrisync.backend.dto.user.ForgotPasswordRequest;
import com.agrisync.backend.dto.user.LoginRequest;
import com.agrisync.backend.dto.user.OtpVerificationRequest;
import com.agrisync.backend.dto.user.ResetPasswordRequest;
import com.agrisync.backend.dto.user.UserRegistrationRequest;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.service.UserService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<String> register(@Valid @RequestBody UserRegistrationRequest request){

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

        // Register user via service with password confirmation
        userService.registerUser(user, request.getConfirmPassword());

        return ResponseEntity.ok(" OTP sent to email.");
    }

    // ================= Verify OTP =================
  @PostMapping("/verify-otp")
public ResponseEntity<String> verifyOtp(@Valid @RequestBody OtpVerificationRequest request){
    userService.verifyOtp(request.getEmail(), request.getOtp(), request.getType());
    return ResponseEntity.ok("Email verified successfully!");
}


    // ================= Login =================
    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request){
        userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("Login successful!");
    }

    // ================= Forgot Password =================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request){
        userService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("OTP sent to email for password reset.");
    }

    // ================= Reset Password =================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        userService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successful!");
    }
}
