import { configureStore } from '@reduxjs/toolkit';
import { employeeApi } from './api/employeeApi';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice'; // <--- Import this

export const store = configureStore({
  reducer: {
    [employeeApi.reducerPath]: employeeApi.reducer,
    ui: uiReducer,
    auth: authReducer, // <--- Add this
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeeApi.middleware),
});