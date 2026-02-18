import { apiSlice } from "../api/apiSlice";

export interface IWelcomeOffer {
  _id?: string;
  title: string;
  discountPercent: number;
  isActive: boolean;
  bannerText: string;
  createdAt?: string;
  updatedAt?: string;
}

export const welcomeOfferApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getWelcomeOfferAdmin: builder.query<{ success: boolean; data: IWelcomeOffer }, void>({
      query: () => "/api/welcome-offer/admin",
      providesTags: ["WelcomeOffer"],
    }),
    updateWelcomeOffer: builder.mutation<
      { success: boolean; message: string; data: IWelcomeOffer },
      Partial<IWelcomeOffer>
    >({
      query: (body) => ({
        url: "/api/welcome-offer",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["WelcomeOffer"],
    }),
  }),
});

export const { useGetWelcomeOfferAdminQuery, useUpdateWelcomeOfferMutation } = welcomeOfferApi;
