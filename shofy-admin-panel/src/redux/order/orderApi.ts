import { apiSlice } from "../api/apiSlice";
import {
  IOrderAmounts,
  ISalesReport,
  IMostSellingCategory,
  IDashboardRecentOrders,
  IGetAllOrdersRes,
  IUpdateStatusOrderRes,
  Order,
} from "@/types/order-amount-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // getUserOrders
    getDashboardAmount: builder.query<IOrderAmounts, void>({
      query: () => `/api/user-order/dashboard-amount`,
      providesTags: ["DashboardAmount"],
      keepUnusedDataFor: 600,
    }),
    // get sales report
    getSalesReport: builder.query<ISalesReport, void>({
      query: () => `/api/user-order/sales-report`,
      providesTags: ["DashboardSalesReport"],
      keepUnusedDataFor: 600,
    }),
    // get selling category
    getMostSellingCategory: builder.query<IMostSellingCategory, void>({
      query: () => `/api/user-order/most-selling-category`,
      providesTags: ["DashboardMostSellingCategory"],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getRecentOrders: builder.query<IDashboardRecentOrders, void>({
      query: () => `/api/user-order/dashboard-recent-order`,
      providesTags: ["DashboardRecentOrders"],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getAllOrders: builder.query<IGetAllOrdersRes, void>({
      query: () => `/api/order/orders`,
      providesTags: ["AllOrders"],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    getSingleOrder: builder.query<Order, string>({
      query: (id) => `/api/order/${id}`,
      providesTags: (result, error, arg) => [{ type: "SingleOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
    // get recent orders
    updateStatus: builder.mutation<IUpdateStatusOrderRes, { id: string, status: { status: string } }>({
      query({ id, status }) {
        return {
          url: `/api/order/update-status/${id}`,
          method: "PATCH",
          body: status,
        };
      },
      invalidatesTags: (result, error, arg) => [
        "AllOrders",
        "DashboardRecentOrders",
        { type: "SingleOrder", id: arg.id },
      ],
    }),
    // process refund
    processRefund: builder.mutation<any, { id: string, returnItemIndex: number, approve: boolean }>({
      query({ id, returnItemIndex, approve }) {
        return {
          url: `/api/order/process-refund/${id}`,
          method: "PATCH",
          body: { returnItemIndex, approve },
        };
      },
      invalidatesTags: (result, error, arg) => [
        "AllOrders",
        "DashboardRecentOrders",
        { type: "SingleOrder", id: arg.id },
      ],
    }),
    // process exchange
    processExchange: builder.mutation<any, { id: string, exchangeItemIndex: number, approve: boolean }>({
      query({ id, exchangeItemIndex, approve }) {
        return {
          url: `/api/order/process-exchange/${id}`,
          method: "PATCH",
          body: { exchangeItemIndex, approve },
        };
      },
      invalidatesTags: (result, error, arg) => [
        "AllOrders",
        "DashboardRecentOrders",
        { type: "SingleOrder", id: arg.id },
      ],
    }),
    // download bulk shipping labels
    downloadBulkShippingLabels: builder.mutation<Blob, { orderIds: string[] }>({
      query({ orderIds }) {
        return {
          url: `/api/order/download-bulk-shipping-labels`,
          method: "POST",
          body: { orderIds },
          responseHandler: (response) => response.blob(),
        };
      },
    }),
    // download single shipping label
    downloadSingleShippingLabel: builder.mutation<Blob, { orderId: string }>({
      query({ orderId }) {
        return {
          url: `/api/order/download-shipping-label/${orderId}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),
  }),
});

export const {
  useGetDashboardAmountQuery,
  useGetSalesReportQuery,
  useGetMostSellingCategoryQuery,
  useGetRecentOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateStatusMutation,
  useGetSingleOrderQuery,
  useProcessRefundMutation,
  useProcessExchangeMutation,
  useDownloadBulkShippingLabelsMutation,
  useDownloadSingleShippingLabelMutation,
} = authApi;
