package com.agrisync.backend.dto.driver;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DriverEarningResponse {
    private Long id;
    private Long driverId;
    private String driverName;
    private Long driverOrderId;
    private Long orderId;
    private Double amount;
    private Boolean paid;
    private LocalDateTime createdAt;
}
