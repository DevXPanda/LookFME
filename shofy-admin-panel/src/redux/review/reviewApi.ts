import { apiSlice } from "../api/apiSlice";
import { IDelReviewsRes } from "@/types/product-type";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // delete review product
    deleteReviews: builder.mutation<IDelReviewsRes, string>({
      query(id) {
        return {
          url: `/api/review/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ReviewProducts", "AllReviews"],
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
  useGetAllReviewsQuery,
  useToggleReviewVisibilityMutation,
  useBlockCustomerReviewsMutation,
} = authApi;
