package com.agrisync.backend.service;

import com.agrisync.backend.entity.Notification;
import com.agrisync.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public void sendBidUpdate(Long buyerId, String cropName, String status) {
        String message = "Your bid on " + cropName + " was " + status;

        Notification notification = Notification.builder()
                .userId(buyerId)
                .message(message)
                .status(status)
                .readFlag(false)
                .createdAt(LocalDateTime.now())
                .build();

        // Save to DB
        notificationRepository.save(notification);

        // Send via WebSocket
        messagingTemplate.convertAndSend("/topic/notifications/" + buyerId, notification);
    }

    public List<Notification> getUnreadNotifications(Long buyerId) {
        return notificationRepository.findByUserIdAndReadFlagFalse(buyerId);
    }

    public List<Notification> getAllNotifications(Long buyerId) {
        return notificationRepository.findByUserId(buyerId);
    }

    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setReadFlag(true);
        notificationRepository.save(notification);
    }
}

