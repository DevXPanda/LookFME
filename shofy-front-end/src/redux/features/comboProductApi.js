import { apiSlice } from "../api/apiSlice";

export const comboProductApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getComboProducts: builder.query({
      query: () => "/api/combo-products",
      providesTags: ["ComboProducts"],
    }),
    getComboProductById: builder.query({
      query: (id) => `/api/combo-products/${id}`,
      providesTags: (result, error, id) => [{ type: "ComboProduct", id }],
    }),
  }),
});

export const {
  useGetComboProductsQuery,
  useGetComboProductByIdQuery,
} = comboProductApi;
