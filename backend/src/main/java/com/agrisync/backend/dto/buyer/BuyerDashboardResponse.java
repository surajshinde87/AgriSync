package com.agrisync.backend.dto.buyer;
import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.dto.feedback.FeedbackResponse;
import com.agrisync.backend.dto.notification.NotificationResponse;
import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.dto.transaction.PaymentResponse;
import lombok.Builder;
import lombok.Data;
import java.util.List;



@Data
@Builder
public class BuyerDashboardResponse {

    private BuyerProfileResponse profile;

    private BuyerSummary summary;

    private List<OrderResponse> recentOrders;

    private List<BidResponse> activeBids;

    private List<ProduceResponse> availableProduces;

    private List<PaymentResponse> recentTransactions;

    private List<NotificationResponse> notifications;

    private List<FeedbackResponse> recentFeedbacks;
}
