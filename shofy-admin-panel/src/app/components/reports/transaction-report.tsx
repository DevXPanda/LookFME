"use client";
import React from "react";
import { useGetTransactionReportQuery } from "@/redux/report/reportApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";

interface TransactionReportProps {
  month?: number;
  year?: number;
}

const TransactionReport: React.FC<TransactionReportProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useGetTransactionReportQuery({ month, year });

  if (isLoading) {
    return <Loading loading={isLoading} spinner="scale" />;
  }

  if (isError || !data?.success) {
    return <ErrorMsg msg="Failed to load transaction report" />;
  }

  const report = data.data;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h3 className="text-2xl font-semibold mb-6">Transaction Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{report.totalProducts}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Active Products</p>
          <p className="text-3xl font-bold text-green-600">{report.activeProducts}</p>
        </div>
        <div className="bg-red-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Inactive Products</p>
          <p className="text-3xl font-bold text-red-600">{report.inactiveProducts}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionReport;
