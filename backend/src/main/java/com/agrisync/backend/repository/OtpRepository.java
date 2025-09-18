package com.agrisync.backend.repository;

import com.agrisync.backend.model.Otp;
import com.agrisync.backend.model.OtpType;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmailAndOtpAndType(String email, String otp, OtpType type);

    @Modifying
    @Transactional
    void deleteByEmailAndType(String email, OtpType type);
}
