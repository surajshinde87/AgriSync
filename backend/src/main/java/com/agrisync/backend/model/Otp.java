package com.agrisync.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import com.agrisync.backend.enums.OtpType;

@Entity
@Table(name = "otps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OtpType type; // REGISTRATION / FORGOT_PASSWORD

    @Column(nullable = false)
    private LocalDateTime expiryTime;
}

