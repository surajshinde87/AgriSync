package com.agrisync.backend.repository;

import org.springframework.stereotype.Repository;

import com.agrisync.backend.entity.Bid;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByProduce_Farmer_IdAndActiveTrue(Long farmerId);

    List<Bid> findByProduceIdAndActiveTrue(Long produceId);

    // find active bids by buyer
    List<Bid> findByBuyerIdAndActiveTrue(Long buyerId);
}
