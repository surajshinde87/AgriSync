package com.agrisync.backend.service;

import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.dto.farmer.DashboardSummary;
import com.agrisync.backend.dto.farmer.FarmerDashboardResponse;
import com.agrisync.backend.dto.farmer.FarmerProfileResponse;
import com.agrisync.backend.dto.farmer.TopCropResponse;
import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.entity.*;
import com.agrisync.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Collections;
import java.util.Comparator;
@Service
@RequiredArgsConstructor
public class FarmerDashboardService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final ProduceRepository produceRepository;
    private final OrderRepository orderRepository;
    private final BidRepository bidRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FarmerDashboardResponse getDashboard(Long userId) {

        // 1. Fetch Farmer Profile
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FarmerProfile farmerProfile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        FarmerProfileResponse profileDto = FarmerProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .role(user.getRole())
                .profileImageUrl(farmerProfile.getProfileImageUrl())
                .bankAccountNumber(farmerProfile.getBankAccountNumber())
                .ifscCode(farmerProfile.getIfscCode())
                .upiId(farmerProfile.getUpiId())
                .bankName(farmerProfile.getBankName())
                .aadhaarNumber(farmerProfile.getAadhaarNumber())
                .farmLocation(farmerProfile.getFarmLocation())
                .build();

        Long farmerProfileId = farmerProfile.getId();

        // 2. Fetch Orders and Produces
        List<Order> orders = Optional.ofNullable(orderRepository.findByFarmer_Id(farmerProfileId))
                .orElse(Collections.emptyList());

        List<Produce> produces = Optional.ofNullable(produceRepository.findByFarmer_IdAndActiveTrue(farmerProfileId))
                .orElse(Collections.emptyList());

        // 3. Summary Calculations
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime days30 = now.minusDays(30);

        double totalEarningsAllTime = orders.stream()
                .filter(o -> o.getPaymentStatus() != null && "RELEASED".equalsIgnoreCase(o.getPaymentStatus().name()))
                .mapToDouble(o -> Optional.ofNullable(o.getTotalAmount()).orElse(0.0))
                .sum();

        double earningsLast30Days = orders.stream()
                .filter(o -> o.getPaymentStatus() != null
                        && "RELEASED".equalsIgnoreCase(o.getPaymentStatus().name())
                        && o.getCreatedAt() != null
                        && o.getCreatedAt().isAfter(days30))
                .mapToDouble(o -> Optional.ofNullable(o.getTotalAmount()).orElse(0.0))
                .sum();

        double totalQuantitySoldKg = orders.stream()
                .filter(o -> o.getPaymentStatus() != null && "RELEASED".equalsIgnoreCase(o.getPaymentStatus().name()))
                .mapToDouble(o -> Optional.ofNullable(o.getQuantityKg()).orElse(0.0))
                .sum();

        int activeListings = produces.size();

        double pendingPayments = orders.stream()
                .filter(o -> o.getPaymentStatus() != null && "PENDING".equalsIgnoreCase(o.getPaymentStatus().name()))
                .mapToDouble(o -> Optional.ofNullable(o.getTotalAmount()).orElse(0.0))
                .sum();

        DashboardSummary summary = DashboardSummary.builder()
                .totalEarningsAllTime(totalEarningsAllTime)
                .earningsLast30Days(earningsLast30Days)
                .totalQuantitySoldKg(totalQuantitySoldKg)
                .activeListings(activeListings)
                .pendingPayments(pendingPayments)
                .build();

        // 4. Top Crops
        Map<String, Double> revenueByCrop = orders.stream()
                .filter(o -> o.getProduce() != null && o.getTotalAmount() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getProduce().getCropType(),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        Map<String, Double> qtyByCrop = orders.stream()
                .filter(o -> o.getProduce() != null && o.getQuantityKg() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getProduce().getCropType(),
                        Collectors.summingDouble(Order::getQuantityKg)
                ));

        List<TopCropResponse> topCrops = revenueByCrop.entrySet().stream()
                .map(e -> TopCropResponse.builder()
                        .crop(e.getKey())
                        .revenue(e.getValue())
                        .qtyKg(qtyByCrop.getOrDefault(e.getKey(), 0.0))
                        .build())
                .sorted(Comparator.comparingDouble(TopCropResponse::getRevenue).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // 5. Produce List
        List<ProduceResponse> produceList = produces.stream()
                .map(p -> ProduceResponse.builder()
                        .id(p.getId())
                        .cropType(p.getCropType())
                        .quantityKg(p.getQuantityKg())
                        .pricePerKg(p.getPricePerKg())
                        .harvestDate(p.getHarvestDate())
                        .city(p.getCity())
                        .state(p.getState())
                        .photoUrl(p.getPhotoUrl())
                        .qualityGrade(p.getQualityGrade())
                        .status(p.getStatus())
                        .build())
                .collect(Collectors.toList());

        // 6. Active Bids
        List<Bid> activeBidsEntities = Optional.ofNullable(
                bidRepository.findByProduce_Farmer_IdAndActiveTrue(farmerProfileId))
                .orElse(Collections.emptyList());

        List<BidResponse> activeBids = activeBidsEntities.stream()
                .map(b -> BidResponse.builder()
                        .bidId(b.getId())
                        .produceId(b.getProduce() != null ? b.getProduce().getId() : null)
                        .buyerId(b.getBuyerId())
                        .buyerName(b.getBuyerName() != null ? b.getBuyerName() : "Buyer-" + b.getBuyerId())
                        .bidPricePerKg(b.getBidPricePerKg())
                        .quantityKg(b.getQuantityKg())
                        .status(b.getStatus() != null ? b.getStatus().name() : "UNKNOWN")
                        .placedAt(b.getPlacedAt())
                        .build())
                .collect(Collectors.toList());

        // 7. Orders DTO Mapping
        List<OrderResponse> ordersDto = orders.stream()
        .map((Order o) -> {
            Produce produce = o.getProduce();
            FarmerProfile farmer = o.getFarmer();

            return OrderResponse.builder()
                    .orderId(o.getId())
                    .produceId(produce != null ? produce.getId() : null)
                    .produceName(produce != null ? produce.getCropType() : "Unknown Produce")
                    .cropType(produce != null ? produce.getCropType() : "N/A")

                    .farmerId(farmer != null ? farmer.getId() : null)
                    .farmerName(farmer != null && farmer.getUser() != null
                            ? farmer.getUser().getFirstName() + " " + farmer.getUser().getLastName()
                            : "Unknown Farmer")
                    .farmerCity(farmer != null && farmer.getUser() != null
                            ? farmer.getUser().getCity()
                            : "N/A")

                    .buyerId(o.getBuyerId())
                    .buyerName("Buyer-" + (o.getBuyerId() != null ? o.getBuyerId() : "N/A"))
                    .buyerEmail(getBuyerEmail(o.getBuyerId()))

                    .quantityKg(o.getQuantityKg())
                    .pricePerKg(o.getPricePerKg())
                    .totalAmount(o.getTotalAmount())

                    .status(o.getStatus())
                    .paymentStatus(o.getPaymentStatus())

                    .deliveryExpectedAt(o.getDeliveryExpectedAt())
                    .createdAt(o.getCreatedAt())
                    .updatedAt(o.getUpdatedAt())
                    .build();
        })
        .collect(Collectors.toList());


        // 8. Final Dashboard Response
        return FarmerDashboardResponse.builder()
                .profile(profileDto)
                .summary(summary)
                .topCrops(topCrops)
                .produceList(produceList)
                .activeBids(activeBids)
                .orders(ordersDto)
                .build();
    }

    // Helper method (outside getDashboard)
    private String getBuyerEmail(Long buyerId) {
        if (buyerId == null) return "N/A";
        return userRepository.findById(buyerId)
                .map(User::getEmail)
                .orElse("N/A");
    }
}
