package com.agrisync.backend.entity;

import com.agrisync.backend.enums.PaymentMethod;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "buyer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    private PaymentMethod preferredPaymentMethod; // UPI, CARD, NETBANKING, COD
    
    private String gstNumber;
    private String companyName;

    private String upiId;
    private String cardLast4;

    private String profileImageUrl;
}

