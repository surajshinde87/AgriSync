import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

// ===================== ASYNC THUNKS ===================== //
export const searchBuyerProduce = createAsyncThunk(
  "buyer/searchProduce",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/buyer/produce/search", query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBuyerOrders = createAsyncThunk(
  'buyer/getOrders',
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/buyer/orders', {
        params: { buyerId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const getBuyerDashboard = createAsyncThunk(
  "buyer/getDashboard",
  async (buyerId, { rejectWithValue }) => {
    try {
      if (!buyerId) throw new Error("Buyer ID is missing");

      const response = await axiosInstance.get(`/buyer/dashboard/${buyerId}`);

      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid dashboard data received from API");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const placeBuyerBid = createAsyncThunk(
  "buyer/placeBid",
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/buyer/bids", bidData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBuyerProfile = createAsyncThunk(
  "buyer/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/buyer/profile/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBuyerBids = createAsyncThunk(
  'buyer/getBids',
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/buyer/bids`, {
        params: { buyerId },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const placeBuyerOrder = createAsyncThunk(
  "buyer/placeOrder",
  async ({ buyerId, produceId, quantityKg }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/buyer/orders/place?buyerId=${buyerId}&produceId=${produceId}&quantityKg=${quantityKg}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to place order:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const cancelBid = createAsyncThunk(
  "buyer/cancelBid",
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/buyer/bids/${bidId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addBuyerFeedback = createAsyncThunk(
  "buyer/addFeedback",
  async ({ buyerId, buyerName, orderId, rating, comment }, { rejectWithValue }) => {
    try {

      const response = await axiosInstance.post(
        `/buyer/feedbacks/add?buyerId=${buyerId}&buyerName=${encodeURIComponent(buyerName)}`,
        {
          orderId,
          rating,
          comment,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit feedback");
    }
  }
);





export const getBuyerProduce = createAsyncThunk(
  "buyer/getProduce",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/buyer/produce");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBuyerProfile = createAsyncThunk(
  "buyer/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/buyer/profile/${userId}`);

      const profileData = response.data?.data || response.data;

      if (!profileData || typeof profileData !== "object") {
        throw new Error("Invalid profile data");
      }

      return profileData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getBuyerFeedbacksByFarmer = createAsyncThunk(
  "buyer/getFeedbacksByFarmer",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/buyer/feedbacks/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "buyer/markNotificationRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/notifications/mark-read/${notificationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUnreadNotifications = createAsyncThunk(
  "buyer/getUnreadNotifications",
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/unread/${buyerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBuyerNotifications = createAsyncThunk(
  "buyer/getNotifications",
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/${buyerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ===================== INITIAL STATE ===================== //
const initialState = {
  orders: [],
  produce: [],
  bids: [],
  dashboard: null,
  profile: null,
  feedbacks: [],
  notifications: [],
  unreadNotifications: [],
  loading: false,
  error: null,
};

// ===================== SLICE ===================== //
const buyerSlice = createSlice({
  name: "buyer",
  initialState,
  reducers: {
    clearBuyerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuyerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getBuyerDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(placeBuyerBid.fulfilled, (state, action) => {
        state.bids.push(action.payload);
      })
      .addCase(getBuyerBids.fulfilled, (state, action) => {
        state.bids = action.payload;
      })
      .addCase(placeBuyerOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(cancelBid.fulfilled, (state, action) => {
        state.bids = state.bids.map((b) =>
          b.id === action.meta.arg ? { ...b, status: "cancelled" } : b
        );
      })
      .addCase(addBuyerFeedback.fulfilled, (state, action) => {
        state.feedbacks.push(action.payload);
      })
      .addCase(getBuyerProduce.fulfilled, (state, action) => {
        state.produce = action.payload;
      })
      .addCase(getBuyerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getBuyerFeedbacksByFarmer.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n.id === action.meta.arg ? { ...n, read: true } : n
        );
      })
      .addCase(getUnreadNotifications.fulfilled, (state, action) => {
        state.unreadNotifications = action.payload;
      })
      .addCase(getBuyerNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(searchBuyerProduce.fulfilled, (state, action) => {
        state.produce = action.payload;
      })
      .addCase(updateBuyerProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
      });

    builder.addMatcher(
      (action) => action.type.endsWith("/pending"),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith("/fulfilled"),
      (state) => {
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state, action) => {
        state.loading = false;
        state.error = action.payload || "Operation failed";
      }
    );
  },
});

export const { clearBuyerError } = buyerSlice.actions;
export default buyerSlice.reducer;
