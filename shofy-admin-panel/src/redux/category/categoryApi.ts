import { apiSlice } from "../api/apiSlice";
import {
  CategoryResponse,
  IAddCategory,
  IAddCategoryResponse,
  ICategoryDeleteRes,
} from "@/types/category-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all categories
    getAllCategories: builder.query<CategoryResponse, void>({
      query: () => `/api/category/all`,
      providesTags: ["AllCategory"],
      keepUnusedDataFor: 600,
    }),
    // add category
    addCategory: builder.mutation<IAddCategoryResponse, IAddCategory>({
      query(data: IAddCategory) {
        return {
          url: `/api/category/add`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AllCategory"],
    }),
    // delete category
    deleteCategory: builder.mutation<ICategoryDeleteRes, string>({
      query(id: string) {
        return {
          url: `/api/category/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllCategory"],
    }),
    // bulk delete categories
    bulkDeleteCategories: builder.mutation<{ success: boolean; message: string }, string[]>({
      query(ids: string[]) {
        return {
          url: `/api/category/delete-bulk`,
          method: "POST",
          body: { ids },
        };
      },
      invalidatesTags: ["AllCategory"],
    }),
    // bulk update category status (Show / Hide)
    bulkUpdateCategoryStatus: builder.mutation<
      { success: boolean; message: string },
      { ids: string[]; status: "Show" | "Hide" }
    >({
      query({ ids, status }) {
        return {
          url: `/api/category/bulk-status`,
          method: "PATCH",
          body: { ids, status },
        };
      },
      invalidatesTags: ["AllCategory"],
    }),
    // editCategory
    editCategory: builder.mutation<IAddCategoryResponse, { id: string; data: Partial<IAddCategory> }>({
      query({ id, data }) {
        return {
          url: `/api/category/edit/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["AllCategory","getCategory"],
    }),
    // get single product
    getCategory: builder.query<IAddCategory, string>({
      query: (id) => `/api/category/get/${id}`,
      providesTags:['getCategory']
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useBulkDeleteCategoriesMutation,
  useBulkUpdateCategoryStatusMutation,
  useEditCategoryMutation,
  useGetCategoryQuery,
} = authApi;
