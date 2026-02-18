import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { Notification, Close } from "@/svg";
import Link from "next/link";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  INotification,
} from "@/redux/notification/notificationApi";
import { notifySuccess, notifyError } from "@/utils/toast";

// prop type
type IPropType = {
  nRef: React.RefObject<HTMLDivElement>;
  notificationOpen: boolean;
  handleNotificationOpen: () => void;
};

const NotificationArea = ({ nRef, notificationOpen, handleNotificationOpen }: IPropType) => {
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const { data: unreadCountData, refetch: refetchUnreadCount } = useGetUnreadCountQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const notifications = notificationsData?.data || [];
  const unreadCount = unreadCountData?.count || 0;

  // Refetch notifications when dropdown opens
  useEffect(() => {
    if (notificationOpen) {
      refetch();
      refetchUnreadCount();
    }
  }, [notificationOpen, refetch, refetchUnreadCount]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAsRead(id).unwrap();
      refetch();
      refetchUnreadCount();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await markAllAsRead().unwrap();
      notifySuccess("All notifications marked as read");
      refetch();
      refetchUnreadCount();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to mark all as read");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteNotification(id).unwrap();
      refetch();
      refetchUnreadCount();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to delete notification");
    }
  };

  return (
    <div ref={nRef}>
      <button
        onClick={handleNotificationOpen}
        className="relative w-[40px] h-[40px] leading-[40px] rounded-md text-gray border border-gray hover:bg-themeLight hover:text-theme hover:border-themeLight"
      >
        <Notification />
        {unreadCount > 0 && (
          <span className="w-[20px] h-[20px] inline-block bg-danger rounded-full absolute -top-[4px] -right-[4px] border-[2px] border-white text-xs leading-[18px] font-medium text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notificationOpen && (
        <div className="absolute w-[280px] sm:w-[350px] max-h-[500px] overflow-y-auto top-full -right-[60px] sm:right-0 shadow-lg rounded-md bg-white py-5 px-5 z-50">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray">
            <h5 className="text-base font-semibold mb-0">Notifications</h5>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-theme hover:text-theme/80 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No notifications</div>
          ) : (
            <>
              {notifications.map((notification: INotification) => (
                <Link
                  key={notification._id}
                  href={notification.orderId ? `/orders/${notification.orderId._id}` : "#"}
                  className={`flex items-start justify-between last:border-0 border-b border-gray pb-4 mb-4 last:pb-0 last:mb-0 hover:bg-gray/50 rounded-md p-2 -mx-2 transition-colors ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification._id, {} as React.MouseEvent);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      !notification.isRead ? "bg-theme" : "bg-transparent"
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm mb-1 leading-tight font-medium text-heading">
                        {notification.title}
                      </h5>
                      <p className="text-xs text-gray-600 mb-2 leading-snug">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        {notification.orderId && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md leading-none text-theme bg-theme/10 font-medium">
                            Order #{notification.orderId.invoice}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-500">
                          {dayjs(notification.createdAt).format("MMM D, h:mm A")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 ml-2">
                    <button
                      onClick={(e) => handleDelete(notification._id, e)}
                      className="hover:text-danger text-gray-400 transition-colors"
                      title="Delete"
                    >
                      <Close />
                    </button>
                  </div>
                </Link>
              ))}
              {notifications.length >= 10 && (
                <Link
                  href="/notifications"
                  className="block text-center text-sm text-theme hover:text-theme/80 py-2 mt-2 border-t border-gray"
                  onClick={() => handleNotificationOpen()}
                >
                  View all notifications
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationArea;
