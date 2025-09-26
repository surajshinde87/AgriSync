package com.agrisync.backend.dto.notification;

import lombok.Data;

@Data
public class NotificationResponse {
    private Long notificationId;
    private Long userId;       
    private String message;    
    private String status;    
    private String createdAt;

}
