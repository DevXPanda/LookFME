import { apiSlice } from "../api/apiSlice";
import { IDelReviewsRes } from "@/types/product-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // delete review product (all reviews for a product)
    deleteReviews: builder.mutation<IDelReviewsRes, string>({
      query(id) {
        return {
          url: `/api/review/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ReviewProducts", "AllReviews"],
    }),
    // delete a single review by id
    deleteReviewById: builder.mutation<{ success: boolean; message: string }, string>({
      query(reviewId) {
        return {
          url: `/api/review/one/${reviewId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["AllReviews", "ReviewProducts"],
    }),
    // bulk delete reviews
    bulkDeleteReviews: builder.mutation<
      { success: boolean; message: string; deletedCount: number },
      { reviewIds: string[] }
    >({
      query({ reviewIds }) {
        return {
          url: `/api/review/bulk-delete`,
          method: "POST",
          body: { reviewIds },
        };
      },
      invalidatesTags: ["AllReviews", "ReviewProducts"],
    }),
    // bulk toggle visibility
    bulkToggleVisibility: builder.mutation<
      { success: boolean; message: string; modifiedCount: number },
      { reviewIds: string[]; visible: boolean }
    >({
      query({ reviewIds, visible }) {
        return {
          url: `/api/review/bulk-visibility`,
          method: "PATCH",
          body: { reviewIds, visible },
        };
      },
      invalidatesTags: ["AllReviews", "ReviewProducts"],
    }),
    // get all reviews for admin
    getAllReviews: builder.query<any, void>({
      query: () => `/api/review/all`,
      providesTags: ["AllReviews"],
    }),
    // toggle review visibility
    toggleReviewVisibility: builder.mutation<any, { reviewId: string; visible: boolean }>({
      query({ reviewId, visible }) {
        return {
          url: `/api/review/${reviewId}/visibility`,
          method: "PATCH",
          body: { visible },
        };
      },
      invalidatesTags: ["AllReviews", "ReviewProducts"],
    }),
    // block/unblock customer reviews
    blockCustomerReviews: builder.mutation<any, { userId: string; reviewBlocked: boolean }>({
      query({ userId, reviewBlocked }) {
        return {
          url: `/api/user/${userId}/block-reviews`,
          method: "PATCH",
          body: { reviewBlocked },
        };
      },
      invalidatesTags: ["AllReviews", "ReviewProducts"],
    }),
  }),
});

export const {
  useDeleteReviewsMutation,
  useDeleteReviewByIdMutation,
  useBulkDeleteReviewsMutation,
  useBulkToggleVisibilityMutation,
  useGetAllReviewsQuery,
  useToggleReviewVisibilityMutation,
  useBlockCustomerReviewsMutation,
} = authApi;
