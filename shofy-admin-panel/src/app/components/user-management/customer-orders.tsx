"use client";
import React from "react";
import Link from "next/link";
import { useGetCustomerOrdersQuery } from "@/redux/user-management/userManagementApi";
import ErrorMsg from "@/app/components/common/error-msg";

interface CustomerOrdersProps {
  customerId: string;
}

const CustomerOrders = ({ customerId }: CustomerOrdersProps) => {
  const { data: ordersData, isLoading, isError } = useGetCustomerOrdersQuery(customerId);

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (isError) {
    return <ErrorMsg msg="Failed to load orders" />;
  }

  const orders = ordersData?.data || [];

  if (orders.length === 0) {
    return <div className="text-center py-8 text-gray-500">No orders found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancel":
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base text-left text-gray-500">
        <thead>
          <tr className="border-b border-gray6 text-tiny">
            <th className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">Order ID</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Date</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Amount</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Payment Method</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Status</th>
            <th className="px-9 py-3 text-tiny text-text2 uppercase font-semibold text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="bg-white border-b border-gray6 last:border-0">
              <td className="px-3 py-3 font-normal text-[#55585B]">#{order.invoice || order._id.slice(-8)}</td>
              <td className="px-3 py-3 font-normal text-[#55585B]">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B]">
                ₹{(order.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B]">{order.paymentMethod || "N/A"}</td>
              <td className="px-3 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status || "")}`}>
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "N/A"}
                </span>
              </td>
              <td className="px-9 py-3 text-end">
                <Link
                  href={`/orders/${order._id}`}
                  className="text-theme hover:underline text-sm font-medium"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerOrders;
