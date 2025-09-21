package com.agrisync.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The farmer who receives the feedback
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private FarmerProfile farmer;

    // Buyer who gave the feedback
    @Column(nullable = false)
    private Long buyerId;

    @Column(nullable = false)
    private String buyerName;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 500)
    private String comment;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
