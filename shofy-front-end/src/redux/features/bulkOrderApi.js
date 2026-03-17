import { apiSlice } from "../api/apiSlice";

export const bulkOrderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBulkProducts: builder.query({
      query: () => "/api/bulk-products",
    }),
    submitBulkOrder: builder.mutation({
      query: (data) => ({
        url: "/api/bulk-order/submit",
        method: "POST",
        body: data,
      }),
    }),
    getMyBulkRequests: builder.query({
      query: () => "/api/bulk-order/my-requests",
    }),
    getBulkRequestsByEmail: builder.query({
      query: (email) => `/api/bulk-order/by-email?email=${encodeURIComponent(email)}`,
    }),
  }),
});

export const {
  useGetBulkProductsQuery,
  useSubmitBulkOrderMutation,
  useGetMyBulkRequestsQuery,
  useLazyGetBulkRequestsByEmailQuery,
} = bulkOrderApi;
