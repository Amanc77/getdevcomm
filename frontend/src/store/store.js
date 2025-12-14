import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './slices/toastSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
});

