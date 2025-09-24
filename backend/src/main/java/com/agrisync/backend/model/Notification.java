package com.agrisync.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;          // Buyer ID

    private String message;       // Notification message

    private String status;        // ACCEPTED / REJECTED / INFO

    private boolean readFlag;     // true if read, false otherwise

    private LocalDateTime createdAt;
}

