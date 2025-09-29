package com.agrisync.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.agrisync.backend.dto.driver.DriverRatingRequest;
import com.agrisync.backend.dto.driver.DriverRatingResponse;
import com.agrisync.backend.service.DriverRatingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/driver/ratings")
@RequiredArgsConstructor
public class DriverRatingController {

    private final DriverRatingService ratingService;

    @PostMapping("/{driverId}")
    public ResponseEntity<DriverRatingResponse> giveRating(
            @PathVariable Long driverId,
            @RequestBody DriverRatingRequest request) {
        return ResponseEntity.ok(ratingService.giveRating(driverId, request));
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<List<DriverRatingResponse>> getDriverRatings(@PathVariable Long driverId) {
        return ResponseEntity.ok(ratingService.getDriverRatings(driverId));
    }

    @GetMapping("/{driverId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long driverId) {
        return ResponseEntity.ok(ratingService.getAverageRating(driverId));
    }
}

