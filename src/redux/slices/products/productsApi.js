// src/redux/services/productsApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    }),
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ page = 1, limit = 10, category } = {}) => {
                const params = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString(),
                });
                if (category) {
                    params.append("category", category);
                }
                return `/products?${params.toString()}`;
            },
        }),

        getProductById: builder.query({
            query: (id) => `/products/${id}`,
        }),

        searchByTitle: builder.query({
            query: (q) => `/products/search/title?q=${encodeURIComponent(q)}`,
        }),

        searchByIntent: builder.mutation({
            query: (query) => ({
                url: "/products/search/intent",
                method: "POST",
                body: { query },
            }),
        }),

        chatWithBot: builder.mutation({
            query: (body) => ({
                url: "/chat",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useSearchByTitleQuery,
    useSearchByIntentMutation,
    useChatWithBotMutation,
} = productsApi;
