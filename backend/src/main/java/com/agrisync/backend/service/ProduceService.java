package com.agrisync.backend.service;

import com.agrisync.backend.dto.produce.ProduceRequest;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.entity.FarmerProfile;
import com.agrisync.backend.entity.Produce;
import com.agrisync.backend.repository.FarmerProfileRepository;
import com.agrisync.backend.repository.ProduceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProduceService {

    private final ProduceRepository produceRepository;
    private final FarmerProfileRepository farmerProfileRepository;   
    private final GithubImageService githubImageService;

   public ProduceResponse createProduce(Long farmerId, ProduceRequest request) {
    String photoUrl = request.getPhotoUrl();

    // upload to GitHub if photoFile is present
    if (request.getPhotoFile() != null && !request.getPhotoFile().isEmpty()) {
        photoUrl = githubImageService.uploadImage(
                request.getPhotoFile(),
                "produce_" + farmerId + "_" + System.currentTimeMillis() + ".jpg"
        );
    }

    // fetch FarmerProfile entity (not User)
    FarmerProfile farmer = farmerProfileRepository.findById(farmerId)
            .orElseThrow(() -> new RuntimeException("Farmer not found"));

    Produce produce = Produce.builder()
            .farmer(farmer)
            .cropType(request.getCropType())
            .quantityKg(request.getQuantityKg())
            .pricePerKg(request.getPricePerKg())
            .harvestDate(request.getHarvestDate())
            .city(request.getCity())
            .state(request.getState())
            .photoUrl(photoUrl)
            .status("AVAILABLE")
            .active(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    produce = produceRepository.save(produce);

    return mapToResponse(produce);
}


    public List<ProduceResponse> getFarmerProduces(Long farmerId) {
        return produceRepository.findByFarmer_IdAndActiveTrue(farmerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProduceResponse getProduce(Long produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new RuntimeException("Produce not found"));
        return mapToResponse(produce);
    }

    public ProduceResponse updateProduce(Long produceId, ProduceRequest request) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new RuntimeException("Produce not found"));

        if (request.getCropType() != null) produce.setCropType(request.getCropType());
        if (request.getQuantityKg() != null) produce.setQuantityKg(request.getQuantityKg());
        if (request.getPricePerKg() != null) produce.setPricePerKg(request.getPricePerKg());
        if (request.getHarvestDate() != null) produce.setHarvestDate(request.getHarvestDate());
        if (request.getCity() != null) produce.setCity(request.getCity());
        if (request.getState() != null) produce.setState(request.getState());

        // upload new photo if present
        if (request.getPhotoFile() != null && !request.getPhotoFile().isEmpty()) {
            produce.setPhotoUrl(githubImageService.uploadImage(
                    request.getPhotoFile(),
                    "produce_" + produce.getFarmer().getId() + "_" + System.currentTimeMillis() + ".jpg"
            ));
        } else if (request.getPhotoUrl() != null) {
            produce.setPhotoUrl(request.getPhotoUrl());
        }

        produce.setUpdatedAt(LocalDateTime.now());

        produceRepository.save(produce);
        return mapToResponse(produce);
    }

    public void deleteProduce(Long produceId) {
        Produce produce = produceRepository.findById(produceId)
                .orElseThrow(() -> new RuntimeException("Produce not found"));

        produce.setActive(false);
        produce.setStatus("REMOVED");
        produce.setUpdatedAt(LocalDateTime.now());
        produceRepository.save(produce);
    }

    private ProduceResponse mapToResponse(Produce produce) {
        return ProduceResponse.builder()
                .id(produce.getId())
                .cropType(produce.getCropType())
                .quantityKg(produce.getQuantityKg())
                .pricePerKg(produce.getPricePerKg())
                .harvestDate(produce.getHarvestDate())
                .city(produce.getCity())
                .state(produce.getState())
                .photoUrl(produce.getPhotoUrl())
                .qualityGrade(produce.getQualityGrade())
                .status(produce.getStatus())
                .build();
    }
}
