import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

export const getFarmerOrders = createAsyncThunk(
  "farmer/getOrders",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/orders?farmerId=${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Orders fetch failed" });
    }
  }
);

export const updateFarmerProduce = createAsyncThunk(
  "farmer/updateProduce",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/farmer/produce/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Produce update failed" });
    }
  }
);

export const acceptBid = createAsyncThunk(
  "farmer/acceptBid",
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/bids/${bidId}/accept`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Accept bid failed" });
    }
  }
);

export const rejectBid = createAsyncThunk(
  "farmer/rejectBid",
  async (bidId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/bids/${bidId}/reject`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Reject bid failed" });
    }
  }
);

export const getFarmerAllProduce = createAsyncThunk(
  "farmer/getAllProduce",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/produce?farmerId=${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Produce fetch failed" });
    }
  }
);

export const getFarmerBids = createAsyncThunk(
  "farmer/getBids",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/bids?farmerId=${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Bids fetch failed" });
    }
  }
);

export const getFarmerDashboard = createAsyncThunk(
  "farmer/getDashboard",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/dashboard/${userId}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message =
        status === 403
          ? "Unauthorized: Invalid or missing token"
          : error.response?.data?.message || "Dashboard fetch failed";
      return rejectWithValue({ message });
    }
  }
);

export const getFarmerProfile = createAsyncThunk(
  "farmer/getProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/farmer/profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Profile fetch failed" });
    }
  }
);

export const createFarmerProduce = createAsyncThunk(
  "farmer/createProduce",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/farmer/produce", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Create produce failed" });
    }
  }
);

export const deleteFarmerProduce = createAsyncThunk(
  "farmer/deleteProduce",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/farmer/produce/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Delete produce failed" });
    }
  }
);

export const markOrderDelivered = createAsyncThunk(
  "farmer/markDelivered",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/orders/${orderId}/mark-delivered`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Mark order failed" });
    }
  }
);

export const updateFarmerProfile = createAsyncThunk(
  "farmer/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/farmer/profile/${userId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Profile update failed" });
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
  name: "farmer",
  initialState,
  reducers: {
    clearFarmerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFarmerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getFarmerAllProduce.fulfilled, (state, action) => {
        state.produce = action.payload;
      })
      .addCase(getFarmerBids.fulfilled, (state, action) => {
        state.bids = action.payload;
      })
      .addCase(getFarmerDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(getFarmerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(createFarmerProduce.fulfilled, (state, action) => {
        state.produce.push(action.payload);
      })
      .addCase(updateFarmerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Operation failed";
        }
      );
  },
});

export const { clearFarmerError } = farmerSlice.actions;
export default farmerSlice.reducer;
