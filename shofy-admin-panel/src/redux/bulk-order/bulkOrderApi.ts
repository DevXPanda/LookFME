import { apiSlice } from "../api/apiSlice";

export const bulkOrderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBulkOrderRequests: builder.query<any[], string | void>({
      query: (status) => {
        const params = status && status !== "all" ? `?status=${status}` : "";
        return `/api/bulk-order${params}`;
      },
      providesTags: (result, error, arg) => ["BulkOrderRequests"],
      transformResponse: (res: { success: boolean; data: any[] }) => res.data || [],
    }),
    getBulkOrderRequest: builder.query({
      query: (id) => `/api/bulk-order/${id}`,
      providesTags: (result, error, id) => [{ type: "BulkOrderRequest", id }],
      transformResponse: (res: { success: boolean; data: any }) => res.data,
    }),
    updateBulkOrderStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: "pending" | "accepted" | "rejected" }) => ({
        url: `/api/bulk-order/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["BulkOrderRequests", "BulkOrderRequest"],
    }),
    getBulkProductsAdmin: builder.query<any[], void>({
      query: () => "/api/bulk-products/admin",
      providesTags: ["BulkProducts"],
      transformResponse: (res: { success: boolean; data: any[] }) => res.data || [],
    }),
    createBulkProduct: builder.mutation({
      query: (body: { name: string; description?: string; isActive?: boolean }) => ({
        url: "/api/bulk-products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BulkProducts"],
    }),
    updateBulkProduct: builder.mutation({
      query: ({ id, ...body }: { id: string; name?: string; description?: string; isActive?: boolean }) => ({
        url: `/api/bulk-products/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["BulkProducts", "BulkProduct"],
    }),
    deleteBulkProduct: builder.mutation({
      query: (id: string) => ({
        url: `/api/bulk-products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BulkProducts"],
    }),
  }),
});

export const {
  useGetBulkOrderRequestsQuery,
  useGetBulkOrderRequestQuery,
  useUpdateBulkOrderStatusMutation,
  useGetBulkProductsAdminQuery,
  useCreateBulkProductMutation,
  useUpdateBulkProductMutation,
  useDeleteBulkProductMutation,
} = bulkOrderApi;
