"use client";
import React from "react";
import { useGetVATReportQuery } from "@/redux/report/reportApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";

interface VATReportProps {
  month?: number;
  year?: number;
}

const VATReport: React.FC<VATReportProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useGetVATReportQuery({ month, year });

  if (isLoading) {
    return <Loading loading={isLoading} spinner="scale" />;
  }

  if (isError || !data?.success) {
    return <ErrorMsg msg="Failed to load VAT report" />;
  }

  const report = data.data;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h3 className="text-2xl font-semibold mb-6">VAT Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Sales</p>
          <p className="text-3xl font-bold text-blue-600">₹{report.totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total VAT Collected</p>
          <p className="text-3xl font-bold text-green-600">₹{report.totalVATCollected.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">VAT Rate</p>
          <p className="text-3xl font-bold text-purple-600">{report.vatRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default VATReport;
