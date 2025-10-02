import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const getFarmerOrders = createAsyncThunk(
  'farmer/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmer/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateFarmerProduce = createAsyncThunk(
  'farmer/updateProduce',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/farmer/produce/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptBid = createAsyncThunk(
  'farmer/acceptBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/bids/${bidId}/accept`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerProduceById = createAsyncThunk(
  'farmer/getProduceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/produce/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerBids = createAsyncThunk(
  'farmer/getBids',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmer/bids');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerDashboard = createAsyncThunk(
  'farmer/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmer/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateFarmerProfile = createAsyncThunk(
  'farmer/updateProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/profile/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createFarmerProduce = createAsyncThunk(
  'farmer/createProduce',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/farmer/produce', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteFarmerProduce = createAsyncThunk(
  'farmer/deleteProduce',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/farmer/produce/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerSalesAnalytics = createAsyncThunk(
  'farmer/getSalesAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmer/analytics/sales');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectBid = createAsyncThunk(
  'farmer/rejectBid',
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/bids/${bidId}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerOrderById = createAsyncThunk(
  'farmer/getOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerProfile = createAsyncThunk(
  'farmer/getProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFarmerAllProduce = createAsyncThunk(
  'farmer/getAllProduce',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/farmer/produce');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markOrderDelivered = createAsyncThunk(
  'farmer/markDelivered',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/orders/${orderId}/mark-delivered`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  orders: [],
  produce: [],
  bids: [],
  dashboard: null,
  profile: null,
  analytics: null,
  loading: false,
  error: null,
};

const farmerSlice = createSlice({
  name: 'farmer',
  initialState,
  reducers: {
    clearFarmerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Common pending state for all thunks
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // Common fulfilled state
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled'),
      (state) => {
        state.loading = false;
      }
    );

    // Common rejected state
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Operation failed';
      }
    );

    // Specific fulfilled cases
    builder
    .addCase(getFarmerOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    })
    .addCase(updateFarmerProduce.fulfilled, (state, action) => {
      state.produce = state.produce.map((p) => (p.id === action.meta.arg.id ? action.payload : p));
    })
    .addCase(acceptBid.fulfilled, (state, action) => {
      state.bids = state.bids.map((b) => (b.id === action.meta.arg ? { ...b, status: 'accepted' } : b));
    })
    .addCase(getFarmerProduceById.fulfilled, (state, action) => {
      state.produce = [action.payload];
    })
    .addCase(getFarmerBids.fulfilled, (state, action) => {
      state.bids = action.payload;
    })
    .addCase(getFarmerDashboard.fulfilled, (state, action) => {
      state.dashboard = action.payload;
    })
    .addCase(updateFarmerProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    })
    .addCase(createFarmerProduce.fulfilled, (state, action) => {
      state.produce.push(action.payload);
    })
    .addCase(deleteFarmerProduce.fulfilled, (state, action) => {
      state.produce = state.produce.filter((p) => p.id !== action.meta.arg);
    })
    .addCase(getFarmerSalesAnalytics.fulfilled, (state, action) => {
      state.analytics = action.payload;
    })
    .addCase(rejectBid.fulfilled, (state, action) => {
      state.bids = state.bids.map((b) => (b.id === action.meta.arg ? { ...b, status: 'rejected' } : b));
    })
    .addCase(getFarmerOrderById.fulfilled, (state, action) => {
      state.orders = state.orders.map((o) => (o.id === action.meta.arg ? action.payload : o));
    })
    .addCase(getFarmerProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    })
    .addCase(getFarmerAllProduce.fulfilled, (state, action) => {
      state.produce = action.payload;
    })
    .addCase(markOrderDelivered.fulfilled, (state, action) => {
      state.orders = state.orders.map((o) => (o.id === action.meta.arg ? { ...o, status: 'delivered' } : o));
    });
  },
});

export const { clearFarmerError } = farmerSlice.actions;
export default farmerSlice.reducer;