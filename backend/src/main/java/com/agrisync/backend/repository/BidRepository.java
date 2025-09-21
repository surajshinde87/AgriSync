package com.agrisync.backend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.agrisync.backend.model.Bid;
import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByProduce_Farmer_IdAndActiveTrue(Long farmerId);

    List<Bid> findByProduceIdAndActiveTrue(Long produceId);

    // Optional: active bids for dashboard
    @Query("SELECT b FROM Bid b WHERE b.produce.farmer.id = :farmerId AND b.status = 'OPEN'")
    List<Bid> findActiveBidsForFarmer(@Param("farmerId") Long farmerId);
}
