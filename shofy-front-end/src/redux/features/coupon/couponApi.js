import { apiSlice } from "@/redux/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    // get offer coupon
    getOfferCoupons: builder.query({
      query: () => `api/coupon`,
      providesTags:['Coupon'],
      keepUnusedDataFor: 600,
    }),
    // get homepage coupons
    getHomepageCoupons: builder.query({
      query: () => `api/coupon/homepage`,
      providesTags:['HomepageCoupons'],
      keepUnusedDataFor: 600,
    }),
    // get product coupons
    getProductCoupons: builder.query({
      query: (productId) => `api/coupon/product/${productId}`,
      providesTags:['ProductCoupons'],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const { useGetOfferCouponsQuery, useGetHomepageCouponsQuery, useGetProductCouponsQuery } = authApi;
