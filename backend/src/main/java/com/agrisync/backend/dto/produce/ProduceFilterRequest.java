package com.agrisync.backend.dto.produce;
import lombok.Data;

@Data
public class ProduceFilterRequest {
    private String cropType; // optional
    private String city;     // optional
    private String state;    // optional
    private Double minPrice; // optional
    private Double maxPrice; // optional
    private String sortBy;   
}
