package com.agrisync.backend.dto.farmer;

import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.dto.transaction.PaymentResponse;
import lombok.Builder;
import lombok.Data;
import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.dto.feedback.FeedbackResponse;
import java.util.List;

@Data
@Builder
public class FarmerDashboardResponse {

    private FarmerProfileResponse profile;

    private DashboardSummary summary;

    private List<TopCropResponse> topCrops;

    private List<ProduceResponse> produceList;

    private List<BidResponse> activeBids;

    private List<OrderResponse> orders;

    private List<PaymentResponse> recentTransactions;

    private List<FeedbackResponse> feedbacks;
     private List<FeedbackResponse> recentFeedbacks; 
}


