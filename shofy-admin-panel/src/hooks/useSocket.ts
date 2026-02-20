import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { notificationApi } from "@/redux/notification/notificationApi";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:7000";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};

export const useOrderNotifications = (
  onNewOrder: (data: {
    notification: any;
    unreadCount: number;
  }) => void
) => {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (data: {
      notification: any;
      unreadCount: number;
    }) => {
      // Invalidate RTK Query cache to refetch notifications
      dispatch(notificationApi.util.invalidateTags(["Notifications"]));
      onNewOrder(data);
    };

    socket.on("new_order_notification", handleNewOrder);

    return () => {
      socket.off("new_order_notification", handleNewOrder);
    };
  }, [socket, onNewOrder, dispatch]);
};
