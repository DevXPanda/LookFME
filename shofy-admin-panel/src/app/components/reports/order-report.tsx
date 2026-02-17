"use client";
import React from "react";
import { useGetOrderReportQuery } from "@/redux/report/reportApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";

interface OrderReportProps {
  month?: number;
  year?: number;
}

const OrderReport: React.FC<OrderReportProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useGetOrderReportQuery({ month, year });

  if (isLoading) {
    return <Loading loading={isLoading} spinner="scale" />;
  }

  if (isError || !data?.success) {
    return <ErrorMsg msg="Failed to load order report" />;
  }

  const report = data.data;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h3 className="text-2xl font-semibold mb-6">Order Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-blue-600">{report.totalOrders}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Order Amount</p>
          <p className="text-2xl font-bold text-green-600">₹{report.totalOrderAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Cancelled</p>
          <p className="text-3xl font-bold text-red-600">{report.cancelled}</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Ongoing</p>
          <p className="text-3xl font-bold text-yellow-600">{report.ongoing}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Completed</p>
          <p className="text-3xl font-bold text-emerald-600">{report.completed}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderReport;
