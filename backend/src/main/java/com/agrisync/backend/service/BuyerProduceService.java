package com.agrisync.backend.service;

import com.agrisync.backend.dto.produce.ProduceFilterRequest;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.entity.Produce;
import com.agrisync.backend.repository.ProduceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
public class BuyerProduceService {

    private final ProduceRepository produceRepository;

    public List<ProduceResponse> searchFilterSort(ProduceFilterRequest request) {
        List<Produce> produces = produceRepository.findByActiveTrue();

        // Filter by cropType
        if (request.getCropType() != null && !request.getCropType().isEmpty()) {
            produces = produces.stream()
                    .filter(p -> p.getCropType().toLowerCase().contains(request.getCropType().toLowerCase()))
                    .toList();
        }

        // Filter by city
        if (request.getCity() != null && !request.getCity().isEmpty()) {
            produces = produces.stream()
                    .filter(p -> p.getCity() != null && p.getCity().equalsIgnoreCase(request.getCity()))
                    .toList();
        }

        // Filter by state
        if (request.getState() != null && !request.getState().isEmpty()) {
            produces = produces.stream()
                    .filter(p -> p.getState() != null && p.getState().equalsIgnoreCase(request.getState()))
                    .toList();
        }

        // Filter by price range
        if (request.getMinPrice() != null && request.getMaxPrice() != null) {
            produces = produces.stream()
                    .filter(p -> p.getPricePerKg() >= request.getMinPrice() && p.getPricePerKg() <= request.getMaxPrice())
                    .toList();
        }

        // Sorting
        if (request.getSortBy() != null) {
            switch (request.getSortBy()) {
                case "priceAsc" -> produces = produces.stream().sorted(Comparator.comparing(Produce::getPricePerKg)).toList();
                case "priceDesc" -> produces = produces.stream().sorted(Comparator.comparing(Produce::getPricePerKg).reversed()).toList();
                case "quantityAsc" -> produces = produces.stream().sorted(Comparator.comparing(Produce::getQuantityKg)).toList();
                case "quantityDesc" -> produces = produces.stream().sorted(Comparator.comparing(Produce::getQuantityKg).reversed()).toList();
            }
        }

        return produces.stream().map(this::mapToResponse).toList();
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

