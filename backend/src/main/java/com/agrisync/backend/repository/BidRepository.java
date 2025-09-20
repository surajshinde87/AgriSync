package com.agrisync.backend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.agrisync.backend.model.Bid;
import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByProduce_Farmer_IdAndActiveTrue(Long farmerId);

    List<Bid> findByProduceIdAndActiveTrue(Long produceId);
}
