export const API_ENDPOINTS = {
  // User
  REGISTER: "/users/register",
  VERIFY_OTP: "/users/verify-otp",
  LOGIN: "/users/login",
  FORGOT_PASSWORD: "/users/forgot-password",
  RESET_PASSWORD: "/users/reset-password",

  // Farmer
  FARMER_ORDERS: "/farmer/orders",
  UPDATE_PRODUCE: (id) => `/farmer/produce/${id}`,
  ACCEPT_BID: (bidId) => `/farmer/bids/${bidId}/accept`,
  PRODUCE_BY_ID: (id) => `/farmer/produce/${id}`,
  FARMER_BIDS: "/farmer/bids",
  FARMER_DASHBOARD: "/farmer/dashboard",
  UPDATE_FARMER_PROFILE: (userId) => `/farmer/profile/${userId}`,
  CREATE_PRODUCE: "/farmer/produce",
  DELETE_PRODUCE: (id) => `/farmer/produce/${id}`,
  SALES_ANALYTICS: "/farmer/analytics/sales",
  REJECT_BID: (bidId) => `/farmer/bids/${bidId}/reject`,
  ORDER_BY_ID: (id) => `/farmer/orders/${id}`,
  FARMER_PROFILE: (userId) => `/farmer/profile/${userId}`,
  ALL_PRODUCE: "/farmer/produce",
  MARK_DELIVERED: (id) => `/farmer/orders/${id}/mark-delivered`,

  // Buyer
  SEARCH_PRODUCE: "/buyer/produce/search",
  BUYER_ORDERS: "/buyer/orders",
  BUYER_DASHBOARD: (buyerId) => `/buyer/dashboard/${buyerId}`,
  PLACE_BID: "/buyer/bids",
  UPDATE_BUYER_PROFILE: (userId) => `/buyer/profile/${userId}`,
  BUYER_BIDS: "/buyer/bids",
  PLACE_ORDER: "/buyer/orders/place",
  CANCEL_BID: (bidId) => `/buyer/bids/${bidId}/cancel`,
  ADD_FEEDBACK: "/buyer/feedbacks/add",
  BUYER_PRODUCE: "/buyer/produce",
  BUYER_PROFILE: (userId) => `/buyer/profile/${userId}`,
  FEEDBACKS_BY_FARMER: (farmerId) => `/buyer/feedbacks/farmer/${farmerId}`,
  MARK_NOTIFICATION_READ: (notificationId) =>
    `/notifications/mark-read/${notificationId}`,
  UNREAD_NOTIFICATIONS: (buyerId) => `/notifications/unread/${buyerId}`,
  BUYER_NOTIFICATIONS: (buyerId) => `/notifications/${buyerId}`,

  // Driver
  ADD_RATING: (driverId) => `/driver/ratings/${driverId}`,
  UPDATE_ORDER_STATUS: (driverOrderId) =>
    `/driver/orders/${driverOrderId}/status`,
  UPDATE_DRIVER_PROFILE: (userId) => `/driver/profile/${userId}`,
  ADD_EARNING: (driverOrderId) => `/driver/earnings/${driverOrderId}`,
  GET_RATINGS: (driverId) => `/driver/ratings/${driverId}`,
  EARNINGS_BY_ORDER: (driverId) => `/driver/earnings/${driverId}`,
  GET_ORDERS: (driverId) => `/driver/orders/${driverId}`,
  TOTAL_EARNINGS: (driverId) => `/driver/earnings/${driverId}/total`,
  SEARCH_ORDERS: (driverId) => `/driver/orders/${driverId}/search`,
  ASSIGN_ORDER: "/driver/orders/assign",
  MARK_PAID: (earningId) => `/driver/earnings/mark-paid/${earningId}`,
  DRIVER_DASHBOARD: (driverId) => `/driver/dashboard/${driverId}`,
  DRIVER_PROFILE: (userId) => `/driver/profile/${userId}`,
  AVERAGE_RATING: (driverId) => `/driver/ratings/${driverId}/average`,
};

export const ROLES = {
  FARMER: "FARMER",
  BUYER: "BUYER",
  DRIVER: "DRIVER",
};
