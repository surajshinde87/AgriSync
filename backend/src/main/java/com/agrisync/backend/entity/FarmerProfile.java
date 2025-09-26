package com.agrisync.backend.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "farmer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String profileImageUrl;
    private String bankAccountNumber;
    private String ifscCode;
    private String upiId;
    private String bankName;
    private String aadhaarNumber;
    private String farmLocation;
}

