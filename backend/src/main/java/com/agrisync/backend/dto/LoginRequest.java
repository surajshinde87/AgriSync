package com.agrisync.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class LoginRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
