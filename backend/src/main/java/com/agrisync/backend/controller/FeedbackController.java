package com.agrisync.backend.controller;
import com.agrisync.backend.dto.feedback.FeedbackRequest;
import com.agrisync.backend.dto.feedback.FeedbackResponse;
import com.agrisync.backend.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/buyer/feedbacks")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/add")
    public ResponseEntity<FeedbackResponse> addFeedback(
            @RequestParam Long buyerId,
            @RequestParam String buyerName,
            @RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.addFeedback(buyerId, buyerName, request));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<FeedbackResponse>> getFarmerFeedbacks(@PathVariable Long farmerId) {
        return ResponseEntity.ok(feedbackService.getFarmerFeedbacks(farmerId));
    }
}

