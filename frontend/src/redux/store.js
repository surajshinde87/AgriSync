import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import farmerReducer from './farmerSlice';
import buyerReducer from './buyerSlice';
import driverReducer from './driverSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    farmer: farmerReducer,
    buyer: buyerReducer,
    driver: driverReducer,
  },
});