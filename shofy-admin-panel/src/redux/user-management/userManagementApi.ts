import { apiSlice } from "../api/apiSlice";
import {
  ICustomersResponse,
  ICustomerDetailResponse,
  ISubscribersResponse,
  IUpdateStatusRequest,
  IUpdateWalletCoinsRequest,
  ICustomerOrdersResponse,
  ICustomerReviewsResponse,
  ICustomerWalletTransactionsResponse,
  IToggleReviewVisibilityRequest,
} from "@/types/user-management-type";

export const userManagementApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all customers
    getAllCustomers: builder.query<
      ICustomersResponse,
      { search?: string; status?: string; sortBy?: string; sortOrder?: string } | void
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);
        const queryString = queryParams.toString();
        return `/api/user-management/customers${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AllCustomers"],
      keepUnusedDataFor: 600,
    }),

    // Get customer by ID
    getCustomerById: builder.query<ICustomerDetailResponse, string>({
      query: (id) => `/api/user-management/customers/${id}`,
      providesTags: (result, error, arg) => [{ type: "Customer", id: arg }],
    }),

    // Update customer status
    updateCustomerStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; data: IUpdateStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/user-management/customers/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AllCustomers"],
    }),

    // Update wallet coins
    updateWalletCoins: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; data: IUpdateWalletCoinsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/user-management/customers/${id}/wallet-coins`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AllCustomers"],
    }),

    // Get customer orders
    getCustomerOrders: builder.query<ICustomerOrdersResponse, string>({
      query: (id) => `/api/user-management/customers/${id}/orders`,
      providesTags: (result, error, arg) => [{ type: "CustomerOrders", id: arg }],
    }),

    // Get customer reviews
    getCustomerReviews: builder.query<ICustomerReviewsResponse, string>({
      query: (id) => `/api/user-management/customers/${id}/reviews`,
      providesTags: (result, error, arg) => [{ type: "CustomerReviews", id: arg }],
    }),

    // Get customer wallet transactions
    getCustomerWalletTransactions: builder.query<ICustomerWalletTransactionsResponse, string>({
      query: (id) => `/api/user-management/customers/${id}/wallet-transactions`,
      providesTags: (result, error, arg) => [{ type: "WalletTransactions", id: arg }],
    }),

    // Delete review
    deleteReview: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (reviewId) => ({
        url: `/api/user-management/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CustomerReviews", id: "LIST" },
      ],
    }),

    // Toggle review visibility
    toggleReviewVisibility: builder.mutation<
      { success: boolean; message: string; data: any },
      { reviewId: string; data: IToggleReviewVisibilityRequest }
    >({
      query: ({ reviewId, data }) => ({
        url: `/api/user-management/reviews/${reviewId}/visibility`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CustomerReviews", id: "LIST" },
      ],
    }),

    // Get all subscribers
    getAllSubscribers: builder.query<
      ISubscribersResponse,
      { search?: string; status?: string; dateFrom?: string; dateTo?: string } | void
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
        if (params?.dateTo) queryParams.append("dateTo", params.dateTo);
        const queryString = queryParams.toString();
        return `/api/user-management/subscribers${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AllSubscribers"],
      keepUnusedDataFor: 600,
    }),

    // Add subscriber
    addSubscriber: builder.mutation<
      { success: boolean; message: string; data: any },
      { email: string }
    >({
      query: (data) => ({
        url: `/api/user-management/subscribers`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllSubscribers"],
    }),

    // Unsubscribe
    unsubscribe: builder.mutation<
      { success: boolean; message: string; data: any },
      { email: string }
    >({
      query: (data) => ({
        url: `/api/user-management/subscribers/unsubscribe`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AllSubscribers"],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useUpdateCustomerStatusMutation,
  useUpdateWalletCoinsMutation,
  useGetCustomerOrdersQuery,
  useGetCustomerReviewsQuery,
  useGetCustomerWalletTransactionsQuery,
  useDeleteReviewMutation,
  useToggleReviewVisibilityMutation,
  useGetAllSubscribersQuery,
  useAddSubscriberMutation,
  useUnsubscribeMutation,
} = userManagementApi;
