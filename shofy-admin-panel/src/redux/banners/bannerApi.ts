import { apiSlice } from "../api/apiSlice";
import { IBanner } from "@/types/banner-type";

interface IBannersResponse {
  success: boolean;
  data: IBanner[];
}

interface IBannerResponse {
  success: boolean;
  data: IBanner;
  message?: string;
}

export const bannerApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBannersAll: builder.query<IBannersResponse, void>({
      query: () => "/api/banners/all",
      providesTags: ["Banners"],
    }),
    getBannerById: builder.query<IBannerResponse, string>({
      query: (id) => `/api/banners/single/${id}`,
      providesTags: (result, error, id) => [{ type: "Banner" as const, id }],
    }),
    addBanner: builder.mutation<IBannerResponse, Partial<IBanner>>({
      query: (body) => ({
        url: "/api/banners",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),
    updateBanner: builder.mutation<IBannerResponse, { id: string; data: Partial<IBanner> }>({
      query: ({ id, data }) => ({
        url: `/api/banners/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/banners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useGetBannersAllQuery,
  useGetBannerByIdQuery,
  useAddBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
