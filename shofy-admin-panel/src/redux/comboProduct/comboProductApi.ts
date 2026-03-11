import { apiSlice } from "../api/apiSlice";
import { IComboProduct } from "@/types/combo-product-type";

interface IComboProductsResponse {
  success: boolean;
  data: IComboProduct[];
}

interface IComboProductResponse {
  success: boolean;
  data: IComboProduct;
}

export const comboProductApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getComboProducts: builder.query<IComboProductsResponse, void>({
      query: () => "/api/combo-products",
      providesTags: ["ComboProducts"],
    }),
    getComboProduct: builder.query<IComboProductResponse, string>({
      query: (id) => `/api/combo-products/${id}`,
      providesTags: (_result, _err, id) => [{ type: "ComboProduct", id }],
    }),
    addComboProduct: builder.mutation<
      IComboProductResponse,
      Partial<IComboProduct> & { products: { productId: string }[] }
    >({
      query: (body) => ({
        url: "/api/combo-products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ComboProducts"],
    }),
    updateComboProduct: builder.mutation<
      IComboProductResponse,
      { id: string; data: Partial<IComboProduct> }
    >({
      query: ({ id, data }) => ({
        url: `/api/combo-products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ComboProducts", "ComboProduct"],
    }),
    deleteComboProduct: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/combo-products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ComboProducts"],
    }),
  }),
});

export const {
  useGetComboProductsQuery,
  useGetComboProductQuery,
  useAddComboProductMutation,
  useUpdateComboProductMutation,
  useDeleteComboProductMutation,
} = comboProductApi;
