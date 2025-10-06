import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

// ===================== ASYNC THUNKS ===================== //
export const searchBuyerProduce = createAsyncThunk(
  'buyer/searchProduce',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/buyer/produce/search', query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerOrders = createAsyncThunk(
  'buyer/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/buyer/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerDashboard = createAsyncThunk(
  'buyer/getDashboard',
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/buyer/dashboard/${buyerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const placeBuyerBid = createAsyncThunk(
  'buyer/placeBid',
  async (bidData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/buyer/bids', bidData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBuyerProfile = createAsyncThunk(
  'buyer/updateProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/buyer/profile/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerBids = createAsyncThunk(
  'buyer/getBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/buyer/bids');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const placeBuyerOrder = createAsyncThunk(
  'buyer/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/buyer/orders/place', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelBid = createAsyncThunk(
  'buyer/cancelBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/buyer/bids/${bidId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addBuyerFeedback = createAsyncThunk(
  'buyer/addFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/buyer/feedbacks/add', feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerProduce = createAsyncThunk(
  'buyer/getProduce',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/buyer/produce');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerProfile = createAsyncThunk(
  'buyer/getProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/buyer/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerFeedbacksByFarmer = createAsyncThunk(
  'buyer/getFeedbacksByFarmer',
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/buyer/feedbacks/farmer/${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'buyer/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/notifications/mark-read/${notificationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUnreadNotifications = createAsyncThunk(
  'buyer/getUnreadNotifications',
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/unread/${buyerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBuyerNotifications = createAsyncThunk(
  'buyer/getNotifications',
  async (buyerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notifications/${buyerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
  name: 'buyer',
  initialState,
  reducers: {
    clearBuyerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ All addCase() come first
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
          b.id === action.meta.arg ? { ...b, status: 'cancelled' } : b
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
      });

    // ✅ Matchers AFTER addCase()
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state) => {
        state.loading = false;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Operation failed';
      }
    );
  },
});

export const { clearBuyerError } = buyerSlice.actions;
export default buyerSlice.reducer;
