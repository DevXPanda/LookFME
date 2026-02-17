import { apiSlice } from "../api/apiSlice";
import {
  ITransactionReport,
  ISalesReport,
  IProfitReport,
  IProductReport,
  IOrderReport,
  IVATReport,
  IReportResponse,
  IExportParams,
} from "@/types/report-type";

export const reportApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Transaction Report
    getTransactionReport: builder.query<
      IReportResponse<ITransactionReport>,
      { month?: number; year?: number }
    >({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/transaction?${params.toString()}`;
      },
      providesTags: ["TransactionReport"],
    }),

    // Sales Report
    getSalesReport: builder.query<
      IReportResponse<ISalesReport>,
      { month?: number; year?: number }
    >({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/sales?${params.toString()}`;
      },
      providesTags: ["SalesReport"],
    }),

    // Profit Report
    getProfitReport: builder.query<
      IReportResponse<IProfitReport>,
      { month?: number; year?: number }
    >({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/profit?${params.toString()}`;
      },
      providesTags: ["ProfitReport"],
    }),

    // Product Report
    getProductReport: builder.query<
      IReportResponse<IProductReport>,
      { month?: number; year?: number }
    >({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/product?${params.toString()}`;
      },
      providesTags: ["ProductReport"],
    }),

    // Order Report
    getOrderReport: builder.query<
      IReportResponse<IOrderReport>,
      { month?: number; year?: number }
    >({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/order?${params.toString()}`;
      },
      providesTags: ["OrderReport"],
    }),

    // VAT Report
    getVATReport: builder.query<
      IReportResponse<IVATReport>,
      { month?: number; year?: number }
    >({
      query: ({ month, year }) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/vat?${params.toString()}`;
      },
      providesTags: ["VATReport"],
    }),

    // Export Report Data
    exportReportData: builder.query<
      IReportResponse<any>,
      IExportParams
    >({
      query: ({ reportType, month, year }) => {
        const params = new URLSearchParams();
        params.append("reportType", reportType);
        if (month) params.append("month", month.toString());
        if (year) params.append("year", year.toString());
        return `/api/report/export?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetTransactionReportQuery,
  useGetSalesReportQuery,
  useGetProfitReportQuery,
  useGetProductReportQuery,
  useGetOrderReportQuery,
  useGetVATReportQuery,
  useLazyExportReportDataQuery,
} = reportApi;
