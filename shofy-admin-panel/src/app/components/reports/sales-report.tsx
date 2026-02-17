"use client";
import React from "react";
import { useGetSalesReportQuery } from "@/redux/report/reportApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";

interface SalesReportProps {
  month?: number;
  year?: number;
}

const SalesReport: React.FC<SalesReportProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useGetSalesReportQuery({ month, year });

  if (isLoading) {
    return <Loading loading={isLoading} spinner="scale" />;
  }

  if (isError || !data?.success) {
    return <ErrorMsg msg="Failed to load sales report" />;
  }

  const report = data.data;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h3 className="text-2xl font-semibold mb-6">Sales Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Gross Sales</p>
          <p className="text-3xl font-bold text-blue-600">₹{report.grossSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-500 mt-2">Including all orders</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Net Sales</p>
          <p className="text-3xl font-bold text-green-600">₹{report.netSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-gray-500 mt-2">Excluding cancelled/returned</p>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
