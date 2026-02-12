"use client";
import React, { useMemo } from "react";
import { useGetAllOrdersQuery } from "@/redux/order/orderApi";
import ErrorMsg from "../common/error-msg";
import Link from "next/link";

const BusinessAnalytics = () => {
  const { data: orders, isError, isLoading } = useGetAllOrdersQuery();

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    if (!orders?.data) return {};

    const counts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      packaging: 0,
      "out-for-delivery": 0,
      delivered: 0,
      returned: 0,
      "failed-to-deliver": 0,
      canceled: 0,
    };

    orders.data.forEach((order: any) => {
      const status = order.status?.toLowerCase() || "";

      if (status === "pending") {
        counts.pending++;
      } else if (status === "processing") {
        // Processing orders count for confirmed, packaging, and out-for-delivery
        counts.confirmed++;
        counts.packaging++;
        counts["out-for-delivery"]++;
      } else if (status === "delivered") {
        counts.delivered++;
      } else if (status === "returned" || status === "exchanged") {
        counts.returned++;
      } else if (status === "cancel" || status === "canceled") {
        counts.canceled++;
        counts["failed-to-deliver"]++;
      }
    });

    return counts;
  }, [orders?.data]);

  const statusCards = [
    {
      label: "Pending",
      value: statusCounts.pending || 0,
      iconBg: "bg-orange-100",
      iconDot: "bg-orange-500",
      link: "/orders?status=pending",
    },
    {
      label: "Confirmed",
      value: statusCounts.confirmed || 0,
      iconBg: "bg-green-100",
      iconDot: "bg-green-500",
      link: "/orders?status=confirmed",
    },
    {
      label: "Packaging",
      value: statusCounts.packaging || 0,
      iconBg: "bg-yellow-100",
      iconDot: "bg-yellow-500",
      link: "/orders?status=packaging",
    },
    {
      label: "Out For Delivery",
      value: statusCounts["out-for-delivery"] || 0,
      iconBg: "bg-teal-100",
      iconDot: "bg-teal-500",
      link: "/orders?status=out-for-delivery",
    },
    {
      label: "Delivered",
      value: statusCounts.delivered || 0,
      iconBg: "bg-orange-100",
      iconDot: "bg-orange-500",
      link: "/orders?status=delivered",
    },
    {
      label: "Canceled",
      value: statusCounts.canceled || 0,
      iconBg: "bg-red-100",
      iconDot: "bg-red-500",
      link: "/orders?status=canceled",
    },
    {
      label: "Returned",
      value: statusCounts.returned || 0,
      iconBg: "bg-orange-100",
      iconDot: "bg-orange-500",
      link: "/orders?status=returned",
    },
    {
      label: "Failed To Delivery",
      value: statusCounts["failed-to-deliver"] || 0,
      iconBg: "bg-red-100",
      iconDot: "bg-red-500",
      link: "/orders?status=failed-to-deliver",
    },
  ];

  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError) {
    content = (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {statusCards.map((card, index) => (
          <Link
            key={index}
            href={card.link}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow hover:border-gray-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${card.iconBg}`}>
                <div className={`w-6 h-6 rounded-full ${card.iconDot} opacity-30`}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Business Analytics</h3>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="relative">
          <select className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Overall Statistics</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

export default BusinessAnalytics;
