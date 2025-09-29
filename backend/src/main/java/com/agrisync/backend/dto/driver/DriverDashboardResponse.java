package com.agrisync.backend.dto.driver;

import java.util.List;

import com.agrisync.backend.dto.order.DriverOrderResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDashboardResponse {

    private DriverProfileResponse profile;

    private DriverSummary summary;

    private List<DriverOrderResponse> recentOrders;

    private List<DriverEarningResponse> recentEarnings;

    private List<DriverRatingResponse> recentRatings;
}

