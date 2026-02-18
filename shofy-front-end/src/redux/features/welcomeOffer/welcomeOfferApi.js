import { apiSlice } from "@/redux/api/apiSlice";

export const welcomeOfferApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWelcomeOffer: builder.query({
      query: () => "api/welcome-offer",
    }),
  }),
});

export const { useGetWelcomeOfferQuery } = welcomeOfferApi;
