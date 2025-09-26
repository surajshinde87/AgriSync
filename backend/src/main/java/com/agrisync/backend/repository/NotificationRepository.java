package com.agrisync.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.agrisync.backend.entity.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserIdAndReadFlagFalse(Long userId);

    List<Notification> findByUserId(Long userId);
}

