import { apiSlice } from "../api/apiSlice";

export interface INotification {
  _id: string;
  type: "new_order" | "order_status_change" | "stock_out" | "other";
  title: string;
  message: string;
  orderId?: {
    _id: string;
    invoice: number;
    totalAmount: number;
    name: string;
    status: string;
  };
  isRead: boolean;
  readAt?: string;
  metadata?: {
    invoice?: number;
    totalAmount?: number;
    customerName?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IGetNotificationsRes {
  success: boolean;
  data: INotification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IUnreadCountRes {
  success: boolean;
  count: number;
}

export const notificationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all notifications
    getNotifications: builder.query<IGetNotificationsRes, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 }) => `/api/notifications?page=${page}&limit=${limit}`,
      providesTags: ["Notifications"],
      keepUnusedDataFor: 60, // Keep for 60 seconds
    }),
    // Get unread count
    getUnreadCount: builder.query<IUnreadCountRes, void>({
      query: () => `/api/notifications/unread-count`,
      providesTags: ["Notifications"],
      keepUnusedDataFor: 30, // Keep for 30 seconds
    }),
    // Mark notification as read
    markAsRead: builder.mutation<{ success: boolean; message: string; notification: INotification }, string>({
      query: (id) => ({
        url: `/api/notifications/mark-read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    // Mark all as read
    markAllAsRead: builder.mutation<{ success: boolean; message: string; count: number }, void>({
      query: () => ({
        url: `/api/notifications/mark-all-read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    // Delete notification
    deleteNotification: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/api/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
