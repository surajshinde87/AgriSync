package com.agrisync.backend.repository;

import com.agrisync.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByProduce_FarmerIdAndActiveTrue(Long farmerId);

    List<Order> findByBuyerIdAndActiveTrue(Long buyerId);
     List<Order> findByFarmer_Id(Long farmerId);
}
