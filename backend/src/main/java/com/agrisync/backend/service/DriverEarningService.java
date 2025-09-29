package com.agrisync.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.agrisync.backend.dto.driver.DriverEarningResponse;
import com.agrisync.backend.entity.DriverEarning;
import com.agrisync.backend.entity.DriverOrder;
import com.agrisync.backend.enums.DriverOrderStatus;
import com.agrisync.backend.repository.DriverEarningRepository;
import com.agrisync.backend.repository.DriverOrderRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverEarningService {

    private final DriverEarningRepository earningRepository;
    private final DriverOrderRepository driverOrderRepository;

    @Transactional
    public DriverEarningResponse addOrUpdateEarning(Long driverOrderId, Double amount) {
        DriverOrder dOrder = driverOrderRepository.findById(driverOrderId)
                .orElseThrow(() -> new RuntimeException("Driver order not found"));

        if (dOrder.getStatus() != DriverOrderStatus.DELIVERED) {
            throw new RuntimeException("Earning can be added only after delivery");
        }

        // Idempotent: update if exists, else create
        DriverEarning earning = earningRepository.findByDriverOrder_Id(driverOrderId)
                .map(e -> { e.setAmount(amount); return e; })
                .orElseGet(() -> DriverEarning.builder()
                        .driver(dOrder.getDriver())
                        .driverOrder(dOrder)
                        .amount(amount)
                        .paid(false)
                        .createdAt(LocalDateTime.now())
                        .build()
                );

        DriverEarning saved = earningRepository.save(earning);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<DriverEarningResponse> getDriverEarnings(Long driverId) {
        return earningRepository.findByDriver_Id(driverId)
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public Double getTotalEarnings(Long driverId) {
        return earningRepository.findByDriver_Id(driverId)
                .stream().mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0).sum();
    }

    @Transactional
    public DriverEarningResponse markPaid(Long earningId) {
        DriverEarning e = earningRepository.findById(earningId)
                .orElseThrow(() -> new RuntimeException("Earning not found"));
        e.setPaid(true);
        return toDto(earningRepository.save(e));
    }

    private DriverEarningResponse toDto(DriverEarning e) {
        var driver = e.getDriver();
        var driverName = (driver != null)
                ? (String.valueOf(driver.getFirstName()) + " " + String.valueOf(driver.getLastName())).trim()
                : null;
        var orderId = (e.getDriverOrder() != null && e.getDriverOrder().getOrder() != null)
                ? e.getDriverOrder().getOrder().getId()
                : null;

        return DriverEarningResponse.builder()
                .id(e.getId())
                .driverId(driver != null ? driver.getId() : null)
                .driverName(driverName)
                .driverOrderId(e.getDriverOrder() != null ? e.getDriverOrder().getId() : null)
                .orderId(orderId)
                .amount(e.getAmount())
                .paid(e.getPaid())
                .createdAt(e.getCreatedAt())
                .build();
    }
}