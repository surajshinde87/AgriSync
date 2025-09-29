package com.agrisync.backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.agrisync.backend.dto.driver.DriverDashboardResponse;
import com.agrisync.backend.dto.driver.DriverEarningResponse;
import com.agrisync.backend.dto.driver.DriverProfileResponse;
import com.agrisync.backend.dto.driver.DriverRatingResponse;
import com.agrisync.backend.dto.driver.DriverSummary;
import com.agrisync.backend.dto.order.DriverOrderResponse;
import com.agrisync.backend.entity.DriverEarning;
import com.agrisync.backend.entity.DriverOrder;
import com.agrisync.backend.entity.DriverRating;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.enums.DriverOrderStatus;
import com.agrisync.backend.repository.DriverEarningRepository;
import com.agrisync.backend.repository.DriverOrderRepository;
import com.agrisync.backend.repository.DriverRatingRepository;
import com.agrisync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverDashboardService {

    private final UserRepository userRepository;
    private final DriverOrderRepository driverOrderRepository;
    private final DriverEarningRepository driverEarningRepository;
    private final DriverRatingRepository driverRatingRepository;

    public DriverDashboardResponse getDashboard(Long driverId) {

        // 1) Fetch driver
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        if (!"DRIVER".equalsIgnoreCase(driver.getRole())) {
            throw new RuntimeException("User is not a DRIVER");
        }

        // 2) Build Profile DTO
        DriverProfileResponse profile = DriverProfileResponse.builder()
                .id(driver.getId())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .email(driver.getEmail())
                .city(driver.getCity())
                .state(driver.getState())
                .pincode(driver.getPincode())
                .role(driver.getRole())
                .build();

        // 3) Fetch all driver orders
        List<DriverOrder> driverOrders = driverOrderRepository.findByDriver(driver);

        int totalOrdersAssigned = driverOrders.size();
        int ordersInTransit = (int) driverOrders.stream().filter(o -> o.getStatus() == DriverOrderStatus.IN_TRANSIT).count();
        int ordersDelivered = (int) driverOrders.stream().filter(o -> o.getStatus() == DriverOrderStatus.DELIVERED).count();
        int pendingOrders = (int) driverOrders.stream().filter(o -> 
            o.getStatus() == DriverOrderStatus.ASSIGNED || o.getStatus() == DriverOrderStatus.PICKED_UP).count();

        // Recent orders list
       List<DriverOrderResponse> recentOrders = driverOrders.stream()
    .sorted(
        Comparator.<DriverOrder, LocalDateTime>comparing(
            (DriverOrder o) -> o.getUpdatedAt(),
            Comparator.nullsLast(Comparator.naturalOrder())
        ).reversed()
    )
    .limit(5)
    .map((DriverOrder o) -> DriverOrderResponse.builder()
            .id(o.getId())                                  // driverOrderId
            .driverId(o.getDriver().getId())
            .driverName(o.getDriver().getFirstName() + " " + o.getDriver().getLastName())
            .orderId(o.getOrder().getId())
            .orderStatus(o.getOrder().getStatus().name())
            .assignedAt(o.getAssignedAt())
            .updatedAt(o.getUpdatedAt())

            // Buyer info (you may have to fetch buyer profile)
            .buyerName("Buyer-" + o.getOrder().getBuyerId()) // later replace with real buyer name
            .buyerEmail("") // optional
            .deliveryAddress("") // optional

            .produceId(o.getOrder().getProduce().getId())
            .cropType(o.getOrder().getProduce().getCropType())
            .quantityKg(o.getOrder().getQuantityKg())
            .pricePerKg(o.getOrder().getPricePerKg())
            .city(o.getOrder().getProduce().getCity())
            .state(o.getOrder().getProduce().getState())
            .build()
    )
    .collect(Collectors.toList());



        // 4) Fetch earnings
        List<DriverEarning> earnings = driverEarningRepository.findByDriver(driver);

        Double totalEarningsAllTime = earnings.stream()
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        LocalDateTime days30 = LocalDateTime.now().minusDays(30);
        Double earningsLast30Days = earnings.stream()
                .filter(e -> e.getCreatedAt() != null && e.getCreatedAt().isAfter(days30))
                .mapToDouble(e -> e.getAmount() != null ? e.getAmount() : 0.0)
                .sum();

        List<DriverEarningResponse> recentEarnings = earnings.stream()
                .sorted(Comparator.comparing(
                        (DriverEarning e) -> e.getCreatedAt(),
                        Comparator.nullsLast(Comparator.naturalOrder())
                ).reversed())
                .limit(5)
                .map(e -> DriverEarningResponse.builder()
                        .id(e.getId())
                        .driverId(driver.getId())
                        .driverName(driver.getFirstName() + " " + driver.getLastName())
                        .driverOrderId(e.getDriverOrder() != null ? e.getDriverOrder().getId() : null)
                        .amount(e.getAmount())
                        .paid(e.getPaid())
                        .createdAt(e.getCreatedAt())
                        .build())
                .toList();

        // 5) Ratings (if implemented)
        List<DriverRating> ratings = driverRatingRepository.findByDriverId(driverId);
        Double averageRating = ratings.isEmpty() ? 0.0 :
                ratings.stream().mapToDouble(r -> r.getRating() != null ? r.getRating() : 0.0).average().orElse(0.0);

        List<DriverRatingResponse> recentRatings = ratings.stream()
                .sorted(Comparator.comparing(
                        (DriverRating r) -> r.getCreatedAt(),
                        Comparator.nullsLast(Comparator.naturalOrder())
                ).reversed())
                .limit(5)
                .map(r -> DriverRatingResponse.builder()
                        .id(r.getId())
                        .driverId(driverId)
                        .driverName(driver.getFirstName() + " " + driver.getLastName())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .ratedByName(r.getRatedByName())
                        .createdAt(r.getCreatedAt())
                        .build())
                .toList();

        // 6) Summary
        DriverSummary summary = DriverSummary.builder()
                .totalOrdersAssigned(totalOrdersAssigned)
                .ordersInTransit(ordersInTransit)
                .ordersDelivered(ordersDelivered)
                .pendingOrders(pendingOrders)
                .totalEarningsAllTime(totalEarningsAllTime)
                .earningsLast30Days(earningsLast30Days)
                .averageRating(averageRating)
                .totalRatings(ratings.size())
                .build();

        // Final Response
        return DriverDashboardResponse.builder()
                .profile(profile)
                .summary(summary)
                .recentOrders(recentOrders)
                .recentEarnings(recentEarnings)
                .recentRatings(recentRatings)
                .build();
    }
}


