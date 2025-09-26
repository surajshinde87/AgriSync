package com.agrisync.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.agrisync.backend.enums.BidStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "bids")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produce_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Produce produce;

    private Long buyerId; // optional for now, can be null for dummy data
    private String buyerName;

    private Double bidPricePerKg;
    private Double quantityKg;

    @Enumerated(EnumType.STRING)
    private BidStatus status; // OPEN, ACCEPTED, REJECTED

    private LocalDateTime placedAt;

    private Boolean active = true; // soft delete if needed
}
