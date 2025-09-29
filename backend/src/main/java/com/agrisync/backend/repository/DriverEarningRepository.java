package com.agrisync.backend.repository;

import com.agrisync.backend.entity.DriverEarning;
import com.agrisync.backend.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DriverEarningRepository extends JpaRepository<DriverEarning, Long> {
    List<DriverEarning> findByDriver_Id(Long driverId);
      List<DriverEarning> findByDriver(User driver);
    Optional<DriverEarning> findByDriverOrder_Id(Long driverOrderId);

}

