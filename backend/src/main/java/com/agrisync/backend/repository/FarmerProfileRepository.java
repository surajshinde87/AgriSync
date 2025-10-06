package com.agrisync.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.entity.User;

@Repository
public interface FarmerProfileRepository extends JpaRepository<FarmerProfile, Long> {
    Optional<FarmerProfile> findByUser(User user);
     Optional<FarmerProfile> findByUserId(Long userId);
}