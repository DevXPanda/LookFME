import React from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { INotification } from "@/redux/notification/notificationApi";

interface OrderNotificationToastProps {
  notification: INotification;
}

const OrderNotificationToast: React.FC<OrderNotificationToastProps> = ({ notification }) => {
  // Handle both populated orderId object and metadata fallback
  const orderId = notification.orderId?._id || (notification.orderId as any) || null;
  const invoice = notification.orderId?.invoice || notification.metadata?.invoice || "N/A";
  const customerName = notification.orderId?.name || notification.metadata?.customerName || "Customer";
  const amount = notification.orderId?.totalAmount || notification.metadata?.totalAmount || 0;

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="font-semibold text-sm text-gray-900">{notification.title}</div>
      <div className="text-xs text-gray-600">
        Order #{invoice} • {customerName}
      </div>
      <div className="text-sm font-medium text-gray-900">
        Amount: ₹{amount.toFixed(2)}
      </div>
      {orderId && (
        <Link
          href={`/orders/${orderId}`}
          className="mt-2 inline-block text-xs px-3 py-1.5 bg-theme text-white rounded-md hover:bg-theme/90 transition-colors text-center"
          onClick={() => toast.dismiss()}
        >
          View Order
        </Link>
      )}
    </div>
  );
};

export const showOrderNotificationToast = (notification: INotification) => {
  toast(<OrderNotificationToast notification={notification} />, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "order-notification-toast",
  });
};

export default OrderNotificationToast;
