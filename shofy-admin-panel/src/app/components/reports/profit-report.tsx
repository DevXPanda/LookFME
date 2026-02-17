"use client";
import React from "react";
import { useGetProfitReportQuery } from "@/redux/report/reportApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";

interface ProfitReportProps {
  month?: number;
  year?: number;
}

const ProfitReport: React.FC<ProfitReportProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useGetProfitReportQuery({ month, year });

  if (isLoading) {
    return <Loading loading={isLoading} spinner="scale" />;
  }

  if (isError || !data?.success) {
    return <ErrorMsg msg="Failed to load profit report" />;
  }

  const report = data.data;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h3 className="text-2xl font-semibold mb-6">Profit Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">₹{report.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Direct Expenses</p>
          <p className="text-3xl font-bold text-orange-600">₹{report.totalDirectExpenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className={`p-6 rounded-lg ${report.grossProfit >= 0 ? "bg-green-50" : "bg-red-50"}`}>
          <p className="text-gray-600 mb-2">Gross Profit</p>
          <p className={`text-3xl font-bold ${report.grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{report.grossProfit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitReport;
