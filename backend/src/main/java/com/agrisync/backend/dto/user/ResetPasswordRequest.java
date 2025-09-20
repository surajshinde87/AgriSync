package com.agrisync.backend.dto.user;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ResetPasswordRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String otp;

    @NotBlank
    private String newPassword;
}
