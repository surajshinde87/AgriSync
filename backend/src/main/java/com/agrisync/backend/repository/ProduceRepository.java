package com.agrisync.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.agrisync.backend.entity.Produce;

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

     List<Produce> findByActiveTrue();

    // Search by crop type (case-insensitive, partial match)
    List<Produce> findByActiveTrueAndCropTypeContainingIgnoreCase(String cropType);

    // Filter by price range
    @Query("SELECT p FROM Produce p WHERE p.active = true AND p.pricePerKg BETWEEN :minPrice AND :maxPrice")
    List<Produce> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    // Filter by state or city
    List<Produce> findByActiveTrueAndStateIgnoreCase(String state);
    List<Produce> findByActiveTrueAndCityIgnoreCase(String city);

    // Sort by price or quantity (ASC / DESC)
    List<Produce> findByActiveTrueOrderByPricePerKgAsc();
    List<Produce> findByActiveTrueOrderByPricePerKgDesc();
    List<Produce> findByActiveTrueOrderByQuantityKgAsc();
    List<Produce> findByActiveTrueOrderByQuantityKgDesc();
    
}
