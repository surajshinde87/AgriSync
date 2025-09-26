package com.agrisync.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.agrisync.backend.entity.Payment;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("SELECT p FROM Payment p WHERE p.order.produce.farmer.id = :farmerId ORDER BY p.createdAt DESC")
    List<Payment> findRecentByFarmer(@Param("farmerId") Long farmerId);
}

