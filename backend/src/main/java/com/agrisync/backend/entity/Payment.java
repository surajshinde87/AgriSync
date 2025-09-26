package com.agrisync.backend.entity;

import com.agrisync.backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation to order
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; 

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

