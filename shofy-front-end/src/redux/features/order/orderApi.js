import { apiSlice } from "../../api/apiSlice";
import { set_client_secret } from "./orderSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // createPaymentIntent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: "api/order/create-payment-intent",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(set_client_secret(result.clientSecret));
        } catch (err) {
          // do nothing
        }
      },

    }),
    // saveOrder
    saveOrder: builder.mutation({
      query: (data) => ({
        url: "api/order/saveOrder",
        method: "POST",
        body: data,
      }),
      invalidatesTags:['UserOrders'],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result) {
            localStorage.removeItem("couponInfo");
            localStorage.removeItem("cart_products");
            localStorage.removeItem("shipping_info");
          }
        } catch (err) {
          // do nothing
        }
      },

    }),
    // getUserOrders
    getUserOrders: builder.query({
      query: () => `/api/user-order`,
      providesTags:["UserOrders"],
      keepUnusedDataFor: 600,
    }),
    // getUserOrders
    getUserOrderById: builder.query({
      query: (id) => `/api/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
    // updateOrderAddress
    updateOrderAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `api/order/update-address/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "UserOrder", id: arg.id },
        "UserOrders",
      ],
    }),
    // cancelOrder
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `api/order/cancel/${id}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "UserOrder", id: arg.id },
        "UserOrders",
      ],
    }),
    // returnOrExchangeOrder (item-level)
    returnOrExchangeOrder: builder.mutation({
      query: ({ id, type, items, reason }) => ({
        url: `api/order/return-exchange/${id}`,
        method: "PATCH",
        body: { type, items, reason },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "UserOrder", id: arg.id },
        "UserOrders",
      ],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useSaveOrderMutation,
  useGetUserOrderByIdQuery,
  useGetUserOrdersQuery,
  useUpdateOrderAddressMutation,
  useCancelOrderMutation,
  useReturnOrExchangeOrderMutation,
} = authApi;
