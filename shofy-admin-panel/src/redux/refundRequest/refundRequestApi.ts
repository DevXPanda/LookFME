import { apiSlice } from "../api/apiSlice";
import {
  IGetRefundRequestsResponse,
  IUpdateRefundStatusRequest,
  IUpdateRefundStatusResponse,
} from "@/types/refund-request-type";

export const refundRequestApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getRefundRequests: builder.query<IGetRefundRequestsResponse, string | void>({
      query: (status) => {
        const params = status && status !== "all" ? `?status=${status}` : "";
        return `/api/refunds${params}`;
      },
      providesTags: ["RefundRequests"],
      keepUnusedDataFor: 600,
    }),
    updateRefundStatus: builder.mutation<
      IUpdateRefundStatusResponse,
      { id: string; data: IUpdateRefundStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/refunds/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["RefundRequests"],
    }),
  }),
});

export const { useGetRefundRequestsQuery, useUpdateRefundStatusMutation } =
  refundRequestApi;
