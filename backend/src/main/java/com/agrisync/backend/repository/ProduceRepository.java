package com.agrisync.backend.repository;

import com.agrisync.backend.model.Produce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProduceRepository extends JpaRepository<Produce, Long> {
    List<Produce> findByFarmerIdAndActiveTrue(Long farmerId);
}
