package com.agrisync.backend.service;

import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.entity.Order;
import com.agrisync.backend.entity.Produce;
import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.enums.PaymentStatus;
import com.agrisync.backend.repository.OrderRepository;
import com.agrisync.backend.repository.ProduceRepository;
import lombok.RequiredArgsConstructor;
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

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .produceId(order.getProduce().getId())
                .buyerName("Buyer-" + order.getBuyerId()) // later fetch from BuyerProfile
                .quantityKg(order.getQuantityKg())
                .finalPricePerKg(order.getPricePerKg())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .paymentStatus(order.getPaymentStatus().name())
                .deliveryExpectedAt(order.getDeliveryExpectedAt())
                .build();
    }
}

