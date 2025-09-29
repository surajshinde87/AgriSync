package com.agrisync.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "driver_earnings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverEarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @OneToOne
    @JoinColumn(name = "driver_order_id", nullable = false, unique = true)
    private DriverOrder driverOrder;

    private Double amount; // earning for this order

    @Builder.Default
    private Boolean paid = false;

    private LocalDateTime createdAt;
}

