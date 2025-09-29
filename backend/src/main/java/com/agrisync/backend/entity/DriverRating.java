package com.agrisync.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "driver_ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who is rated (the driver)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    // Who gave the rating (buyer or farmer)
    private Long ratedById;  // buyerId or farmerId
    private String ratedByName;

    private Integer rating; // 1 to 5
    @Column(length = 500)
    private String comment;

    private LocalDateTime createdAt;
}

