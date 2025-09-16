import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import { apiSlice } from "./slices/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Export types for TypeScript if needed
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
