package com.agrisync.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "produce")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "farmer_id", nullable = false)
private User farmer;


    @Column(nullable = false)
    private String cropType;

    @Column(nullable = false)
    private Double quantityKg;

    @Column(nullable = false)
    private Double pricePerKg;

    @Column(nullable = false)
    private LocalDate harvestDate;

    private String city;
    private String state;

    private String photoUrl;

    private String qualityGrade; // A/B/C

    private String status; // AVAILABLE, SOLD, REMOVED

    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
