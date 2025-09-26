package com.agrisync.backend.controller;

import com.agrisync.backend.dto.produce.ProduceFilterRequest;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.entity.Produce;
import com.agrisync.backend.repository.ProduceRepository;
import com.agrisync.backend.service.BuyerProduceService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/buyer/produce")
@RequiredArgsConstructor
public class BuyerProduceController {

        private final ProduceRepository produceRepository;

        private final BuyerProduceService produceService;

        @PostMapping("/search")
        public ResponseEntity<List<ProduceResponse>> searchFilterSort(@RequestBody ProduceFilterRequest request) {
                return ResponseEntity.ok(produceService.searchFilterSort(request));
        }

        @GetMapping
        public ResponseEntity<List<ProduceResponse>> getAllAvailableProduce(
                        @RequestParam(required = false) String cropType,
                        @RequestParam(required = false) String city,
                        @RequestParam(required = false) String state,
                        @RequestParam(required = false) Double minPrice,
                        @RequestParam(required = false) Double maxPrice) {
                List<Produce> produces = produceRepository.findByStatus("AVAILABLE");

                // Apply filters
                List<ProduceResponse> response = produces.stream()
                                .filter(p -> cropType == null || p.getCropType().equalsIgnoreCase(cropType))
                                .filter(p -> city == null || p.getCity().equalsIgnoreCase(city))
                                .filter(p -> state == null || p.getState().equalsIgnoreCase(state))
                                .filter(p -> minPrice == null || p.getPricePerKg() >= minPrice)
                                .filter(p -> maxPrice == null || p.getPricePerKg() <= maxPrice)
                                .map(p -> ProduceResponse.builder()
                                                .id(p.getId())
                                                .cropType(p.getCropType())
                                                .quantityKg(p.getQuantityKg())
                                                .pricePerKg(p.getPricePerKg())
                                                .harvestDate(p.getHarvestDate())
                                                .city(p.getCity())
                                                .state(p.getState())
                                                .photoUrl(p.getPhotoUrl())
                                                .qualityGrade(p.getQualityGrade())
                                                .status(p.getStatus())
                                                .build())
                                .toList();

                return ResponseEntity.ok(response);
        }
}
