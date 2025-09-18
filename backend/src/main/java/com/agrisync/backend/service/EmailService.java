package com.agrisync.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

public void sendOtpEmail(String to, String otp, String purpose) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(to);
    message.setSubject("AgriSync OTP Verification - Secure Your Access");

    String text = "Hello,\n\n" +
                  "Your One-Time Password (OTP) for AgriSync is: " + otp + "\n" +
                  "This code is valid for the next 5 minutes.\n\n";

    if ("REGISTRATION".equalsIgnoreCase(purpose)) {
        text += "Please use this OTP to complete your registration and start connecting with farmers, restaurants, and small businesses on our platform.\n\n";
    } else if ("FORGOT_PASSWORD".equalsIgnoreCase(purpose)) {
        text += "Please use this OTP to reset your password and regain access to your AgriSync account.\n\n";
    } else {
        text += "Use this OTP to proceed with your request on AgriSync.\n\n";
    }

    text +=
        "About AgriSync:\n" +
        "AgriSync is a B2B hyperlocal logistics and marketplace platform developed by Suraj Shinde that connects farmers (supply) with restaurants & small businesses (demand).\n\n" +
        "Our mission:\n" +
        "• Digitize produce listings and bidding\n" +
        "• Reduce food waste through faster connections\n" +
        "• Optimize local logistics\n" +
        "• Add AI-powered insights\n\n" +
        "Thank you for being part of this journey.\n\n" +
        "– Suraj Shinde\n" +
        "Creator, AgriSync";

    message.setText(text);

    mailSender.send(message);
}

}