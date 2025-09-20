package com.agrisync.backend.dto.user;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ForgotPasswordRequest {
    @Email
    @NotBlank
    private String email;
}
