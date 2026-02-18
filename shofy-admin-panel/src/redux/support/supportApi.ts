import { apiSlice } from "../api/apiSlice";
import type {
  ISupportMessagesResponse,
  ISupportMessageDetailResponse,
  IUpdateSupportStatusRequest,
  IReplyToSupportRequest,
} from "@/types/support-type";

export const supportApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSupportMessages: builder.query<ISupportMessagesResponse, void>({
      query: () => "/api/support",
      providesTags: ["SupportMessages"],
      keepUnusedDataFor: 600,
    }),
    getSupportMessageById: builder.query<ISupportMessageDetailResponse, string>({
      query: (id) => `/api/support/${id}`,
      providesTags: (result, error, id) => [{ type: "SupportMessage", id }],
    }),
    updateSupportMessageStatus: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; data: IUpdateSupportStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/support/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "SupportMessages",
        { type: "SupportMessage", id },
      ],
    }),
    replyToSupportMessage: builder.mutation<
      { success: boolean; message: string; data: any },
      { id: string; data: IReplyToSupportRequest }
    >({
      query: ({ id, data }) => ({
        url: `/api/support/reply/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "SupportMessages",
        { type: "SupportMessage", id },
      ],
    }),
  }),
});

export const {
  useGetSupportMessagesQuery,
  useGetSupportMessageByIdQuery,
  useUpdateSupportMessageStatusMutation,
  useReplyToSupportMessageMutation,
} = supportApi;
