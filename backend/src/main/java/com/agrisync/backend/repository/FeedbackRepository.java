package com.agrisync.backend.repository;
import com.agrisync.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    @Query("SELECT f FROM Feedback f WHERE f.farmer.id = :farmerId ORDER BY f.createdAt DESC")
    List<Feedback> findByFarmerId(@Param("farmerId") Long farmerId);
}
