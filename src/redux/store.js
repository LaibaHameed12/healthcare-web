"use client";

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./slices/auth/authApi";
import authReducer from "./slices/auth/authSlice";
import { usersApi } from "./slices/users/usersApi";
import { productsApi } from "./slices/products/productsApi";

export const store = configureStore({
    reducer: {
        // RTK Query APIs
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [productsApi.reducerPath]: productsApi.reducer,

        // Normal slices
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            productsApi.middleware
        ),
});
