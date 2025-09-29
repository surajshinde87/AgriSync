package com.agrisync.backend.service;

import com.agrisync.backend.dto.order.DriverOrderResponse;
import com.agrisync.backend.entity.BuyerProfile;
import com.agrisync.backend.entity.DriverOrder;
import com.agrisync.backend.entity.Order;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.enums.DriverOrderStatus;
import com.agrisync.backend.enums.OrderStatus;
import com.agrisync.backend.repository.BuyerProfileRepository;
import com.agrisync.backend.repository.DriverOrderRepository;
import com.agrisync.backend.repository.OrderRepository;
import com.agrisync.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverOrderService {

    private final DriverOrderRepository driverOrderRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final BuyerProfileRepository buyerProfileRepository;

    // Assign order to driver
    public DriverOrderResponse assignOrderToDriver(Long orderId, Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (!"DRIVER".equalsIgnoreCase(driver.getRole())) {
            throw new RuntimeException("User is not a DRIVER");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        DriverOrder driverOrder = DriverOrder.builder()
                .driver(driver)
                .order(order)
                .status(DriverOrderStatus.ASSIGNED)
                .assignedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        DriverOrder saved = driverOrderRepository.save(driverOrder);
        return mapToResponse(saved);
    }

    // Update order status
    public DriverOrderResponse updateStatus(Long driverOrderId, DriverOrderStatus status) {
        DriverOrder driverOrder = driverOrderRepository.findById(driverOrderId)
                .orElseThrow(() -> new RuntimeException("DriverOrder not found"));

        driverOrder.setStatus(status);
        driverOrder.setUpdatedAt(LocalDateTime.now());

        // If delivered, also update order status
        if (status == DriverOrderStatus.DELIVERED) {
            driverOrder.getOrder().setStatus(OrderStatus.DELIVERED);
            orderRepository.save(driverOrder.getOrder());
        }

        DriverOrder saved = driverOrderRepository.save(driverOrder);
        return mapToResponse(saved);
    }

    // Get all orders assigned to a driver
    public List<DriverOrderResponse> getDriverOrders(Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        List<DriverOrder> driverOrders = driverOrderRepository.findByDriver(driver);
        return driverOrders.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DriverOrderResponse> searchDriverOrders(Long driverId, DriverOrderStatus status,
                                                    String city, String cropType,
                                                    LocalDateTime startDate, LocalDateTime endDate) {
    User driver = userRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    List<DriverOrder> driverOrders = driverOrderRepository.findByDriver(driver);

    return driverOrders.stream()
            .filter(o -> status == null || o.getStatus() == status)
            .filter(o -> city == null || o.getOrder().getProduce().getCity().equalsIgnoreCase(city))
            .filter(o -> cropType == null || o.getOrder().getProduce().getCropType().equalsIgnoreCase(cropType))
            .filter(o -> startDate == null || !o.getAssignedAt().isBefore(startDate))
            .filter(o -> endDate == null || !o.getAssignedAt().isAfter(endDate))
            .map(this::mapToResponse)
            .collect(Collectors.toList());
}


    // Mapping entity to DTO
private DriverOrderResponse mapToResponse(DriverOrder driverOrder) {
    Order order = driverOrder.getOrder();


    // Fetch buyer using buyerId
    User buyerUser = userRepository.findById(order.getBuyerId())
            .orElseThrow(() -> new RuntimeException("Buyer not found"));

    BuyerProfile buyerProfile = buyerProfileRepository.findByUser(buyerUser)
            .orElseThrow(() -> new RuntimeException("Buyer profile not found"));

    return DriverOrderResponse.builder()
            .id(driverOrder.getId())
            .driverId(driverOrder.getDriver().getId())
            .driverName(driverOrder.getDriver().getFirstName() + " " + driverOrder.getDriver().getLastName())
            .orderId(order.getId())
            .orderStatus(order.getStatus().name())
            .assignedAt(driverOrder.getAssignedAt())
            .updatedAt(driverOrder.getUpdatedAt())
            .buyerName(buyerUser.getFirstName() + " " + buyerUser.getLastName())
            .buyerEmail(buyerUser.getEmail())
            .deliveryAddress(buyerProfile.getDeliveryAddress())
            .produceId(order.getProduce().getId())
            .cropType(order.getProduce().getCropType())
            .quantityKg(order.getQuantityKg())
            .pricePerKg(order.getPricePerKg())
            .city(order.getProduce().getCity())
            .state(order.getProduce().getState())
            .build();
}


}
