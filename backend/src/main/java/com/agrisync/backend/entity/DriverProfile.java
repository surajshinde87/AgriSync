package com.agrisync.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "driver_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String phoneNumber;       

    private String vehicleNumber;     
    private String vehicleType;      
    private Double maxLoadKg;        
    private String licenseNumber;     

    @Builder.Default
    private Boolean active = true;    
    private String profileImageUrl;   
}
