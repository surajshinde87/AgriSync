package com.agrisync.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.agrisync.backend.enums.DriverOrderStatus;

@Entity
@Table(name = "driver_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    private DriverOrderStatus status; // PICKED_UP, IN_TRANSIT, DELIVERED

    private LocalDateTime assignedAt;
    private LocalDateTime updatedAt;
}

