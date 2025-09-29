package com.agrisync.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverOrderResponse {
    private Long id;
    private Long driverId;
    private String driverName;
    private Long orderId;
    private String orderStatus; 
    private LocalDateTime assignedAt;
    private LocalDateTime updatedAt;
     private String buyerName;
    private String buyerEmail;     
    private String deliveryAddress;

    private Long produceId;
    private String cropType;
    private Double quantityKg;
    private Double pricePerKg;
    private String city;
    private String state;
}
