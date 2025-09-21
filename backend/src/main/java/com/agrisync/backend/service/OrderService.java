package com.agrisync.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.agrisync.backend.dto.order.OrderDTO;
import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.enums.PaymentStatus;
import com.agrisync.backend.model.Order;
import com.agrisync.backend.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {
     private final OrderRepository orderRepository;

    private OrderDTO mapToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .produceId(order.getProduce().getId())
                .farmerId(order.getFarmer().getId())
                .buyerId(order.getBuyerId())
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

     public List<OrderDTO> getOrdersByFarmer(Long farmerId) {
        return orderRepository.findByFarmer_Id(farmerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

 
    public OrderDTO markOrderDelivered(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.DELIVERED);
        order.setPaymentStatus(PaymentStatus.RELEASED);
        order.setUpdatedAt(LocalDateTime.now());

        orderRepository.save(order);

        return mapToDTO(order);
    }
}
