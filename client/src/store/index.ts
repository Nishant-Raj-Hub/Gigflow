import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // We will handle gigs/bids state locally via React Query for simplicity in data fetching/caching, 
    // but auth is perfect for global Redux state as requested.
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
