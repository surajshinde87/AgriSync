package com.agrisync.backend.service;

import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.dto.transaction.PaymentResponse;
import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.entity.Order;
import com.agrisync.backend.entity.Produce;
import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.enums.PaymentStatus;
import com.agrisync.backend.repository.OrderRepository;
import com.agrisync.backend.repository.ProduceRepository;
import com.agrisync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class BuyerOrderService {

    private final OrderRepository orderRepository;
    private final ProduceRepository produceRepository;

    /**
     * Buyer places a direct order for a produce
     */
    @Transactional
    public OrderResponse placeOrder(Long buyerId, Long produceId, Double quantityKg) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new RuntimeException("Produce not found"));

        if (produce.getQuantityKg() < quantityKg) {
            throw new RuntimeException("Not enough quantity available");
        }

        // Fetch farmer
        FarmerProfile farmer = produce.getFarmer();

        double pricePerKg = produce.getPricePerKg();
        double totalAmount = pricePerKg * quantityKg;

        Order order = Order.builder()
                .produce(produce)
                .farmer(farmer)
                .buyerId(buyerId)
                .quantityKg(quantityKg)
                .pricePerKg(pricePerKg)
                .totalAmount(totalAmount)
                .status(OrderStatus.CREATED)
                .paymentStatus(PaymentStatus.PENDING)
                .deliveryExpectedAt(LocalDateTime.now().plusDays(7)) 
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .active(true)
                .build();

        orderRepository.save(order);

        // reduce available produce quantity
        produce.setQuantityKg(produce.getQuantityKg() - quantityKg);
        produceRepository.save(produce);

        return mapToResponse(order);
    }

    /**
     * Fetch all orders of a buyer
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getBuyerOrders(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Total spent by buyer all time
public Double getTotalSpentAllTime(Long buyerId) {
    return orderRepository.findByBuyerId(buyerId)
            .stream()
            .mapToDouble(Order::getTotalAmount)
            .sum();
}

// Total spent in last 30 days
public Double getSpentLast30Days(Long buyerId) {
    LocalDateTime from = LocalDateTime.now().minusDays(30);
    return orderRepository.findByBuyerId(buyerId)
            .stream()
            .filter(o -> o.getCreatedAt().isAfter(from))
            .mapToDouble(Order::getTotalAmount)
            .sum();
}

// Count of orders
public Integer getBuyerOrdersCount(Long buyerId) {
    return orderRepository.countByBuyerId(buyerId);
}

// Count of pending payments
public Integer getPendingPaymentsCount(Long buyerId) {
    return (int) orderRepository.findByBuyerId(buyerId)
            .stream()
            .filter(o -> o.getPaymentStatus() == PaymentStatus.PENDING)
            .count();
}

// Recent transactions
public List<PaymentResponse> getRecentTransactions(Long buyerId) {
    return orderRepository.findByBuyerId(buyerId)
            .stream()
            .map(o -> PaymentResponse.builder()
                    .paymentId(o.getId())
                    .orderId(o.getId())
                    .amount(o.getTotalAmount())
                    .status(o.getPaymentStatus().name())
                    .timestamp(o.getUpdatedAt())
                    .build())
            .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
            .limit(5)
            .toList();
}


  private OrderResponse mapToResponse(Order order) {
    Produce produce = order.getProduce();
    FarmerProfile farmer = order.getFarmer();

    return OrderResponse.builder()
            .orderId(order.getId())
            .produceId(produce.getId())
            .produceName(produce.getCropType())
            .cropType(produce.getCropType())

            .farmerId(farmer.getId())
            .farmerName(farmer.getUser().getFirstName() + " " + farmer.getUser().getLastName())
            .farmerCity(farmer.getUser().getCity())

            .buyerId(order.getBuyerId())
            .buyerName(getBuyerName(order.getBuyerId())) // helper method
            .buyerEmail(getBuyerEmail(order.getBuyerId()))

            .quantityKg(order.getQuantityKg())
            .pricePerKg(order.getPricePerKg())
            .totalAmount(order.getTotalAmount())

            .status(order.getStatus())
            .paymentStatus(order.getPaymentStatus())

            .deliveryExpectedAt(order.getDeliveryExpectedAt())
            .createdAt(order.getCreatedAt())
            .updatedAt(order.getUpdatedAt())
            .build();
}
@Autowired
private UserRepository userRepository;

private String getBuyerName(Long buyerId) {
    return userRepository.findById(buyerId)
            .map(u -> u.getFirstName() + " " + u.getLastName())
            .orElse("Unknown Buyer");
}

private String getBuyerEmail(Long buyerId) {
    return userRepository.findById(buyerId)
            .map(u -> u.getEmail())
            .orElse("N/A");
}

}

