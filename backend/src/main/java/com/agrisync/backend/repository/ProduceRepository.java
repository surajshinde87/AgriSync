package com.agrisync.backend.repository;

import com.agrisync.backend.model.Produce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduceRepository extends JpaRepository<Produce, Long> {

    // Find all active produces for a farmer
    List<Produce> findByFarmer_IdAndActiveTrue(Long farmerId);

    // Optional: find all produces by status
    List<Produce> findByFarmer_IdAndStatus(Long farmerId, String status);

      // Count active produces (for dashboard)
    @Query("SELECT COUNT(p) FROM Produce p WHERE p.farmer.id = :farmerId AND p.status = 'AVAILABLE'")
    Integer countActiveProduces(@Param("farmerId") Long farmerId);

    // find produces by status
    List<Produce> findByStatus(String status);
}
