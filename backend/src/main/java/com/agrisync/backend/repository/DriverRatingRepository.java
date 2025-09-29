package com.agrisync.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agrisync.backend.entity.DriverRating;

public interface DriverRatingRepository extends JpaRepository<DriverRating, Long> {

    @Query("SELECT dr FROM DriverRating dr WHERE dr.driver.id = :driverId ORDER BY dr.createdAt DESC")
    List<DriverRating> findByDriverId(@Param("driverId") Long driverId);

    @Query("SELECT AVG(dr.rating) FROM DriverRating dr WHERE dr.driver.id = :driverId")
    Double getAverageRating(@Param("driverId") Long driverId);
}

