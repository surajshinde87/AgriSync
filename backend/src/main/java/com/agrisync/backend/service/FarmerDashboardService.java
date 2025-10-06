package com.agrisync.backend.service;

import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.dto.farmer.DashboardSummary;
import com.agrisync.backend.dto.farmer.FarmerDashboardResponse;
import com.agrisync.backend.dto.farmer.FarmerProfileResponse;
import com.agrisync.backend.dto.farmer.TopCropResponse;
import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.dto.transaction.PaymentResponse;
import com.agrisync.backend.dto.feedback.FeedbackResponse;
import com.agrisync.backend.entity.*;
import com.agrisync.backend.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmerDashboardService {

    private final FarmerProfileRepository farmerProfileRepository;
    private final ProduceRepository produceRepository;
    private final OrderRepository orderRepository;
    private final BidRepository bidRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository; // ✅ Add this line

    public FarmerDashboardResponse getDashboard(Long userId) {

        // ✅ FIXED: Find farmer profile using userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FarmerProfile farmerProfile = farmerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        FarmerProfileResponse profileDto = FarmerProfileResponse.builder()
                .firstName(farmerProfile.getUser().getFirstName())
                .lastName(farmerProfile.getUser().getLastName())
                .email(farmerProfile.getUser().getEmail())
                .city(farmerProfile.getUser().getCity())
                .state(farmerProfile.getUser().getState())
                .pincode(farmerProfile.getUser().getPincode())
                .role(farmerProfile.getUser().getRole())
                .profileImageUrl(farmerProfile.getProfileImageUrl())
                .bankAccountNumber(farmerProfile.getBankAccountNumber())
                .ifscCode(farmerProfile.getIfscCode())
                .upiId(farmerProfile.getUpiId())
                .bankName(farmerProfile.getBankName())
                .aadhaarNumber(farmerProfile.getAadhaarNumber())
                .farmLocation(farmerProfile.getFarmLocation())
                .build();

        Long farmerProfileId = farmerProfile.getId(); // ✅ use profileId for internal queries

        // Orders and produces
        List<Order> orders = Optional.ofNullable(orderRepository.findByFarmer_Id(farmerProfileId))
                .orElse(Collections.emptyList());
        List<Produce> produces = Optional.ofNullable(produceRepository.findByFarmer_IdAndActiveTrue(farmerProfileId))
                .orElse(Collections.emptyList());

        // Summary calculations
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

        // Top crops
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

        // Produce list
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

        // Active bids
        List<Bid> activeBidsEntities = Optional.ofNullable(bidRepository.findByProduce_Farmer_IdAndActiveTrue(farmerProfileId))
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

        // Orders DTO
        List<OrderResponse> ordersDto = orders.stream()
                .map(o -> OrderResponse.builder()
                        .orderId(o.getId())
                        .produceId(o.getProduce() != null ? o.getProduce().getId() : null)
                        .buyerName("Buyer-" + (o.getBuyerId() != null ? o.getBuyerId() : "N/A"))
                        .quantityKg(o.getQuantityKg())
                        .finalPricePerKg(o.getPricePerKg())
                        .totalAmount(o.getTotalAmount())
                        .status(o.getStatus() != null ? o.getStatus().name() : "UNKNOWN")
                        .paymentStatus(o.getPaymentStatus() != null ? o.getPaymentStatus().name() : "UNKNOWN")
                        .deliveryExpectedAt(o.getDeliveryExpectedAt())
                        .build())
                .collect(Collectors.toList());

        // Final payload
        return FarmerDashboardResponse.builder()
                .profile(profileDto)
                .summary(summary)
                .topCrops(topCrops)
                .produceList(produceList)
                .activeBids(activeBids)
                .orders(ordersDto)
                .build();
    }
}
