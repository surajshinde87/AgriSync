package com.agrisync.backend.service;

import com.agrisync.backend.dto.feedback.FeedbackRequest;
import com.agrisync.backend.dto.feedback.FeedbackResponse;
import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.entity.Feedback;
import com.agrisync.backend.entity.Order;
import com.agrisync.backend.repository.FeedbackRepository;
import com.agrisync.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.agrisync.backend.enums.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public FeedbackResponse addFeedback(Long buyerId, String buyerName, FeedbackRequest request) {

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getBuyerId().equals(buyerId)) {
            throw new RuntimeException("You are not allowed to review this order");
        }

        if (order.getStatus() != OrderStatus.COMPLETED
                && order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Feedback can only be given after delivery/completion");
        }

        FarmerProfile farmer = order.getFarmer();

        Feedback feedback = Feedback.builder()
                .farmer(farmer)
                .buyerId(buyerId)
                .buyerName(buyerName)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        feedbackRepository.save(feedback);

        return mapToResponse(feedback);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> getFarmerFeedbacks(Long farmerId) {
        return feedbackRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .ratingId(feedback.getId())
                .buyerId(feedback.getBuyerId())
                .buyerName(feedback.getBuyerName())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
