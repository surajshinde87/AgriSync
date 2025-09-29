package com.agrisync.backend.dto.driver;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverRatingRequest {
    private Long ratedById;
    private String ratedByName;
    private Integer rating;
    private String comment;
}
