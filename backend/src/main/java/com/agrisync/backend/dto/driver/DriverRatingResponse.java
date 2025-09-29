package com.agrisync.backend.dto.driver;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverRatingResponse {
    private Long id;
    private Long driverId;
    private String driverName;
    private Integer rating;
    private String comment;
    private String ratedByName;
    private LocalDateTime createdAt;
}