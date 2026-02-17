import { apiSlice } from "@/redux/api/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => "api/banners",
      providesTags: ["Banners"],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const { useGetBannersQuery } = bannerApi;
