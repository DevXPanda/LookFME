"use client";
import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import ErrorMsg from "../common/error-msg";
import { useGetSalesReportQuery } from "@/redux/order/orderApi";
Chart.register(CategoryScale);

type TimeRange = "year" | "month" | "week";

const EarningStatistics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("year");
  const { data: sales, isError, isLoading } = useGetSalesReportQuery();

  // Filter and process data based on time range
  const chartData = useMemo(() => {
    if (!sales?.salesReport) return null;

    const salesReport = [...sales.salesReport].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const now = new Date();
    let filteredData = salesReport;

    if (timeRange === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = salesReport.filter(
        (item) => new Date(item.date) >= weekAgo
      );
    } else if (timeRange === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredData = salesReport.filter(
        (item) => new Date(item.date) >= monthAgo
      );
    }
    // "year" uses all data

    return {
      labels: filteredData.map((item) => {
        const date = new Date(item.date);
        if (timeRange === "week") {
          return date.toLocaleDateString("en-US", { weekday: "short" });
        } else if (timeRange === "month") {
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } else {
          return date.toLocaleDateString("en-US", { month: "short" });
        }
      }),
      income: filteredData.map((item) => item.total || 0),
      commission: filteredData.map((item) => (item.total || 0) * 0.1), // 10% commission as example
    };
  }, [sales?.salesReport, timeRange]);

  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && chartData) {
    const barOptions = {
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Income",
            data: chartData.income,
            borderColor: "#3E97FF",
            backgroundColor: "#3E97FF",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
          {
            label: "Commission given",
            data: chartData.commission,
            borderColor: "#50CD89",
            backgroundColor: "#50CD89",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#F3F4F6",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    };

    content = (
      <div className="h-[400px] w-full">
        <Line {...barOptions} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Earning Statistics</h3>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("year")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "year"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Commission given</span>
        </div>
      </div>

      {/* Chart */}
      {content}
    </div>
  );
};

export default EarningStatistics;
