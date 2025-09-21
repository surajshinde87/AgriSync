package com.agrisync.backend.controller;

import com.agrisync.backend.dto.produce.ProduceRequest;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.service.ProduceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/farmer/produce")
@RequiredArgsConstructor
public class ProduceController {

    private final ProduceService produceService;

    @PostMapping
    public ResponseEntity<ProduceResponse> createProduce(
            @RequestParam Long farmerId,
            @RequestParam String cropType,
            @RequestParam Double quantityKg,
            @RequestParam Double pricePerKg,
            @RequestParam String harvestDate,
            @RequestParam String city,
            @RequestParam String state,
            @RequestParam(required = false) MultipartFile photoFile,
            @RequestParam(required = false) String photoUrl
    ) {
        ProduceRequest request = ProduceRequest.builder()
                .cropType(cropType)
                .quantityKg(quantityKg)
                .pricePerKg(pricePerKg)
                .harvestDate(java.time.LocalDate.parse(harvestDate))
                .city(city)
                .state(state)
                .photoFile(photoFile)
                .photoUrl(photoUrl)
                .build();

        return ResponseEntity.ok(produceService.createProduce(farmerId, request));
    }

    @GetMapping
    public ResponseEntity<List<ProduceResponse>> getFarmerProduces(@RequestParam Long farmerId) {
        return ResponseEntity.ok(produceService.getFarmerProduces(farmerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduceResponse> getProduce(@PathVariable Long id) {
        return ResponseEntity.ok(produceService.getProduce(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduceResponse> updateProduce(
            @PathVariable Long id,
            @RequestParam(required = false) String cropType,
            @RequestParam(required = false) Double quantityKg,
            @RequestParam(required = false) Double pricePerKg,
            @RequestParam(required = false) String harvestDate,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) MultipartFile photoFile,
            @RequestParam(required = false) String photoUrl
    ) {
        ProduceRequest request = ProduceRequest.builder()
                .cropType(cropType)
                .quantityKg(quantityKg)
                .pricePerKg(pricePerKg)
                .harvestDate(harvestDate != null ? java.time.LocalDate.parse(harvestDate) : null)
                .city(city)
                .state(state)
                .photoFile(photoFile)
                .photoUrl(photoUrl)
                .build();

        return ResponseEntity.ok(produceService.updateProduce(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduce(@PathVariable Long id) {
        produceService.deleteProduce(id);
        return ResponseEntity.ok("Produce soft-deleted successfully");
    }
}
