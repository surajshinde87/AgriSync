import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const addDriverRating = createAsyncThunk(
  'driver/addRating',
  async ({ driverId, ratingData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/driver/ratings/${driverId}`, ratingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDriverOrderStatus = createAsyncThunk(
  'driver/updateOrderStatus',
  async ({ driverOrderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/driver/orders/${driverOrderId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDriverProfile = createAsyncThunk(
  'driver/updateProfile',
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/driver/profile/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addDriverEarning = createAsyncThunk(
  'driver/addEarning',
  async ({ driverOrderId, earningData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/driver/earnings/${driverOrderId}`, earningData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverRatings = createAsyncThunk(
  'driver/getRatings',
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/ratings/${driverId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverEarningsByOrder = createAsyncThunk(
  'driver/getEarningsByOrder',
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/earnings/${driverId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverOrders = createAsyncThunk(
  'driver/getOrders',
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/orders/${driverId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverTotalEarnings = createAsyncThunk(
  'driver/getTotalEarnings',
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/earnings/${driverId}/total`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchDriverOrders = createAsyncThunk(
  'driver/searchOrders',
  async ({ driverId, query }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/orders/${driverId}/search?query=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const assignDriverOrder = createAsyncThunk(
  'driver/assignOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/driver/orders/assign', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markEarningPaid = createAsyncThunk(
  'driver/markEarningPaid',
  async (earningId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/driver/earnings/mark-paid/${earningId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverDashboard = createAsyncThunk(
  'driver/getDashboard',
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/dashboard/${driverId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverProfile = createAsyncThunk(
  'driver/getProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDriverAverageRating = createAsyncThunk(
  'driver/getAverageRating',
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/driver/ratings/${driverId}/average`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  orders: [],
  earnings: [],
  ratings: [],
  dashboard: null,
  profile: null,
  totalEarnings: null,
  averageRating: null,
  loading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    clearDriverError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || 'Operation failed';
        }
      )
      // Specific fulfilled cases
      .addCase(addDriverRating.fulfilled, (state, action) => {
        state.ratings.push(action.payload);
      })
      .addCase(updateDriverOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) => (o.id === action.meta.arg.driverOrderId ? action.payload : o));
      })
      .addCase(updateDriverProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(addDriverEarning.fulfilled, (state, action) => {
        state.earnings.push(action.payload);
      })
      .addCase(getDriverRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })
      .addCase(getDriverEarningsByOrder.fulfilled, (state, action) => {
        state.earnings = action.payload;
      })
      .addCase(getDriverOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getDriverTotalEarnings.fulfilled, (state, action) => {
        state.totalEarnings = action.payload;
      })
      .addCase(searchDriverOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(assignDriverOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })
      .addCase(markEarningPaid.fulfilled, (state, action) => {
        state.earnings = state.earnings.map((e) => (e.id === action.meta.arg ? { ...e, paid: true } : e));
      })
      .addCase(getDriverDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(getDriverProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getDriverAverageRating.fulfilled, (state, action) => {
        state.averageRating = action.payload;
      });
  },
});

export const { clearDriverError } = driverSlice.actions;
export default driverSlice.reducer;