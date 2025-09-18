package com.agrisync.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ForgotPasswordRequest {
    @Email
    @NotBlank
    private String email;
}
