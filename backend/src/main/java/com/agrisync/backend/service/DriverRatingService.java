package com.agrisync.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.agrisync.backend.dto.driver.DriverRatingRequest;
import com.agrisync.backend.dto.driver.DriverRatingResponse;
import com.agrisync.backend.entity.DriverRating;
import com.agrisync.backend.entity.User;
import com.agrisync.backend.repository.DriverRatingRepository;
import com.agrisync.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DriverRatingService {

    private final DriverRatingRepository ratingRepository;
    private final UserRepository userRepository;

    public DriverRatingResponse giveRating(Long driverId, DriverRatingRequest request) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (!"DRIVER".equalsIgnoreCase(driver.getRole())) {
            throw new RuntimeException("User is not a DRIVER");
        }

        DriverRating rating = DriverRating.builder()
                .driver(driver)
                .ratedById(request.getRatedById())
                .ratedByName(request.getRatedByName())
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        DriverRating saved = ratingRepository.save(rating);
        return mapToResponse(saved);
    }

    public List<DriverRatingResponse> getDriverRatings(Long driverId) {
        List<DriverRating> ratings = ratingRepository.findByDriverId(driverId);
        return ratings.stream().map(this::mapToResponse).toList();
    }

    public Double getAverageRating(Long driverId) {
        return ratingRepository.getAverageRating(driverId);
    }

    private DriverRatingResponse mapToResponse(DriverRating rating) {
        return DriverRatingResponse.builder()
                .id(rating.getId())
                .driverId(rating.getDriver().getId())
                .driverName(rating.getDriver().getFirstName() + " " + rating.getDriver().getLastName())
                .rating(rating.getRating())
                .comment(rating.getComment())
                .ratedByName(rating.getRatedByName())
                .createdAt(rating.getCreatedAt())
                .build();
    }
}
 
