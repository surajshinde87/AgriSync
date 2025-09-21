package com.agrisync.backend.repository;

import com.agrisync.backend.dto.farmer.TopCropResponse;
import com.agrisync.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByProduce_FarmerIdAndActiveTrue(Long farmerId);

    List<Order> findByBuyerIdAndActiveTrue(Long buyerId);

    List<Order> findByFarmer_Id(Long farmerId);

    // Total earnings (all time)
    @Query("SELECT COALESCE(SUM(o.totalAmount),0) FROM Order o WHERE o.farmer.id = :farmerId AND o.paymentStatus = 'RELEASED'")
    Double getTotalEarnings(@Param("farmerId") Long farmerId);

    // Earnings last 30 days
    @Query("SELECT o FROM Order o WHERE o.farmer.id = :farmerId AND o.createdAt > :fromDate")
    List<Order> findOrdersLast30Days(@Param("farmerId") Long farmerId,
            @Param("fromDate") LocalDateTime fromDate);

    // Total quantity sold
    @Query("SELECT COALESCE(SUM(o.quantityKg),0) FROM Order o WHERE o.farmer.id = :farmerId AND o.paymentStatus = 'RELEASED'")
    Double getTotalQuantitySold(@Param("farmerId") Long farmerId);

    // Pending payments
    @Query("SELECT COALESCE(SUM(o.totalAmount),0) FROM Order o WHERE o.farmer.id = :farmerId AND o.paymentStatus = 'PENDING'")
    Double getPendingPayments(@Param("farmerId") Long farmerId);

    // Top crops by revenue
    @Query("SELECT new com.agrisync.backend.dto.farmer.TopCropResponse(p.cropType, SUM(o.totalAmount), SUM(o.quantityKg)) "
            +
            "FROM Order o JOIN o.produce p WHERE p.farmer.id = :farmerId " +
            "GROUP BY p.cropType ORDER BY SUM(o.totalAmount) DESC")
    List<TopCropResponse> findTopCropsByFarmerId(@Param("farmerId") Long farmerId);
}
