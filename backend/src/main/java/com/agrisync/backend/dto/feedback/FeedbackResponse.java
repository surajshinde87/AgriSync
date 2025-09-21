package com.agrisync.backend.dto.feedback;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponse {
    private Long ratingId;
    private Long buyerId;
    private String buyerName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
