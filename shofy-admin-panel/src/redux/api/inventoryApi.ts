import { apiSlice } from "../api/apiSlice";

export const inventoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryStock: builder.query<any, void>({
      query: () => "/api/inventory/category-stock",
    }),
    getLowStock: builder.query<any, void>({
      query: () => "/api/inventory/low-stock",
    }),
    getStockValuation: builder.query<any, void>({
      query: () => "/api/inventory/valuation",
    }),
    getSalesVsStock: builder.query<any, void>({
      query: () => "/api/inventory/sales-vs-stock",
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoryStockQuery,
  useGetLowStockQuery,
  useGetStockValuationQuery,
  useGetSalesVsStockQuery,
} = inventoryApi;
