package com.agrisync.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.agrisync.backend.dto.notification.NotificationResponse;
import com.agrisync.backend.entity.Notification;
import com.agrisync.backend.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

   // Fetch unread notifications
@GetMapping("/unread/{buyerId}")
public ResponseEntity<List<NotificationResponse>> getUnread(@PathVariable Long buyerId) {
    List<NotificationResponse> unreadNotifications = notificationService.getUnreadNotifications(buyerId);
    return ResponseEntity.ok(unreadNotifications);
}


    // Fetch all notifications
    @GetMapping("/{buyerId}")
    public ResponseEntity<List<Notification>> getAll(@PathVariable Long buyerId) {
        return ResponseEntity.ok(notificationService.getAllNotifications(buyerId));
    }

    // Mark notification as read
    @PostMapping("/mark-read/{notificationId}")
    public ResponseEntity<Void> markRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }
}

