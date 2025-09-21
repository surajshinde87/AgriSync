package com.agrisync.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.agrisync.backend.enums.PaymentStatus;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation to Order
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // ESCROW, RELEASED

    private LocalDateTime timestamp;

    private Boolean active = true; // soft delete
}
