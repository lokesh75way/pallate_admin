import authSlice from "./slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../services/api";
import alertSlice from "./slices/alertSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    alert: alertSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(apiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
