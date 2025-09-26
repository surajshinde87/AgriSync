package com.agrisync.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.enums.PaymentStatus;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation to Produce
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produce_id", nullable = false)
    private Produce produce;

    // Relation to Farmer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmerId", nullable = false)
    private FarmerProfile farmer;

    private Long buyerId;

    private Double quantityKg;
    private Double pricePerKg;
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // CREATED, SHIPPED, DELIVERED, COMPLETED

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus; // PENDING, RELEASED, FAILED

    private LocalDateTime deliveryExpectedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Column(nullable = false)
    private Boolean active = true;

}
