package com.agrisync.backend.dto.feedback;
import lombok.Data;

@Data
public class FeedbackRequest {
    private Long orderId;   // To ensure buyer can only give feedback for a completed order
    private Integer rating; // 1–5
    private String comment;
}
