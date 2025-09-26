package com.agrisync.backend.service;

import com.agrisync.backend.entity.Otp;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.enums.OtpType;
import com.agrisync.backend.repository.UserRepository;
import com.agrisync.backend.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ================= Registration =================
    public void registerUser(User user, String confirmPassword) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email already registered");
        }

        if(!user.getPassword().equals(confirmPassword)){
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        userRepository.save(user);

        // Send OTP for registration
        sendOtp(user.getEmail(), OtpType.REGISTRATION);
    }

    // ================= Login =================
    public User login(String email, String password){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if(!user.getVerified()){
            throw new RuntimeException("Email not verified");
        }

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // ================= Send OTP =================
    public void sendOtp(String email, OtpType type){
        // Remove existing OTP of same type for email
        otpRepository.deleteByEmailAndType(email, type);

        String otpStr = generateOtp();
        Otp otp = Otp.builder()
                .email(email)
                .otp(otpStr)
                .type(type)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .build();
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpStr, type.name());
    }

    // ================= Verify OTP =================
    @Transactional
    public void verifyOtp(String email, String otp, OtpType type){
        Otp otpEntity = otpRepository.findByEmailAndOtpAndType(email, otp, type)
                .orElseThrow(() -> new RuntimeException("Invalid OTP"));

        if(otpEntity.getExpiryTime().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP expired");
        }

        // Mark user as verified only for registration
        if(type == OtpType.REGISTRATION){
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setVerified(true);
            userRepository.save(user);
        }

        // Delete OTP after successful verification
        otpRepository.deleteByEmailAndType(email, type);
    }

    // ================= Forgot Password =================
public void forgotPassword(String email){
    if(!userRepository.findByEmail(email).isPresent()){
        throw new RuntimeException("Email not found");
    }
    sendOtp(email, OtpType.FORGOT_PASSWORD);
}


    // ================= Reset Password =================
    public void resetPassword(String email, String otp, String newPassword){
        // Verify OTP first
        verifyOtp(email, otp, OtpType.FORGOT_PASSWORD);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // ================= Utility =================
    private String generateOtp(){
        Random random = new Random();
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }
}
