package com.agrisync.backend.dto.user;

import com.agrisync.backend.model.OtpType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OtpVerificationRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String otp;

    @NotNull(message = "OTP type is required")
    private OtpType type;  // REGISTRATION or FORGOT_PASSWORD
}
