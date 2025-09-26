package com.agrisync.backend.service;

import com.agrisync.backend.dto.buyer.BuyerDashboardResponse;
import com.agrisync.backend.dto.buyer.BuyerSummary;
import com.agrisync.backend.dto.buyer.BuyerProfileResponse;
import com.agrisync.backend.dto.feedback.FeedbackResponse;
import com.agrisync.backend.dto.bid.BidResponse;
import com.agrisync.backend.dto.notification.NotificationResponse;
import com.agrisync.backend.dto.order.OrderResponse;
import com.agrisync.backend.dto.produce.ProduceResponse;
import com.agrisync.backend.dto.transaction.PaymentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
@RequiredArgsConstructor
public class BuyerDashboardService {

    private final BuyerProfileService buyerProfileService;
    private final BuyerOrderService buyerOrderService;
    private final BidService bidService;
    private final ProduceService produceService;
    private final NotificationService notificationService;
    private final FeedbackService feedbackService;

    public BuyerDashboardResponse getDashboard(Long buyerId) {

        // 1. Profile
        BuyerProfileResponse profile = buyerProfileService.getBuyerProfile(buyerId);

        // 2. Summary
        BuyerSummary summary = BuyerSummary.builder()
                .totalSpentAllTime(buyerOrderService.getTotalSpentAllTime(buyerId))
                .spentLast30Days(buyerOrderService.getSpentLast30Days(buyerId))
                .totalOrders(buyerOrderService.getBuyerOrdersCount(buyerId))
                .activeBids(bidService.getActiveBidsCountForBuyer(buyerId))
                .pendingPayments(buyerOrderService.getPendingPaymentsCount(buyerId))
                .build();

        // 3. Recent Orders
        List<OrderResponse> recentOrders = buyerOrderService.getBuyerOrders(buyerId);

        // 4. Active Bids
        List<BidResponse> activeBids = bidService.getActiveBidsForBuyer(buyerId);

        // 5. Available Produces (limit 10)
        List<ProduceResponse> availableProduces = produceService.getAllAvailableProduces(10);

        // 6. Recent Transactions
        List<PaymentResponse> recentTransactions = buyerOrderService.getRecentTransactions(buyerId);

        // 7. Notifications
        List<NotificationResponse> notifications = notificationService.getUnreadNotifications(buyerId);

        // 8. Recent Feedbacks
        List<FeedbackResponse> recentFeedbacks = feedbackService.getRecentFeedbacksByBuyer(buyerId);

        return BuyerDashboardResponse.builder()
                .profile(profile)
                .summary(summary)
                .recentOrders(recentOrders)
                .activeBids(activeBids)
                .availableProduces(availableProduces)
                .recentTransactions(recentTransactions)
                .notifications(notifications)
                .recentFeedbacks(recentFeedbacks)
                .build();
    }
}
