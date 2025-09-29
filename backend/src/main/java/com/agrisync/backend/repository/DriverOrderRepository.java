package com.agrisync.backend.repository;

import com.agrisync.backend.entity.DriverOrder;
import com.agrisync.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverOrderRepository extends JpaRepository<DriverOrder, Long> {
    List<DriverOrder> findByDriver(User driver);
}
