"use client";
import React, { useState } from "react";
import ErrorMsg from "@/app/components/common/error-msg";
import Pagination from "@/app/components/ui/Pagination";
import { useGetAllSubscribersQuery } from "@/redux/user-management/userManagementApi";
import usePagination from "@/hooks/use-pagination";
import SubscriberActions from "@/app/components/user-management/subscriber-actions";
import { Search } from "@/svg";
import ReactSelect from "react-select";
import * as XLSX from "xlsx";
import { notifySuccess, notifyError } from "@/utils/toast";

const SubscriberTable = () => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data: subscribersData, isError, isLoading } = useGetAllSubscribersQuery({
    search: searchVal || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const allSubscribers = subscribersData?.data || [];
  const paginationData = usePagination(allSubscribers, 9999);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "unsubscribed", label: "Unsubscribed" },
  ];

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "36px",
      height: "36px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
      "&:hover": { borderColor: "#d1d5db" },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided: any) => ({ ...provided, padding: "6px 8px" }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f9fafb" : "white",
      color: state.isSelected ? "#2563eb" : "#374151",
      padding: "8px 12px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 9999,
    }),
    singleValue: (provided: any) => ({ ...provided, color: "#374151" }),
  };

  const handleExportToExcel = () => {
    try {
      const subscribers = subscribersData?.data || [];
      
      if (subscribers.length === 0) {
        notifyError("No data to export");
        return;
      }

      // Prepare data for export
      const exportData = subscribers.map((subscriber) => ({
        Email: subscriber.email,
        "Subscription Date": new Date(subscriber.subscriptionDate || subscriber.createdAt).toLocaleDateString(),
        Status: subscriber.status?.charAt(0).toUpperCase() + subscriber.status?.slice(1),
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");

      // Generate filename
      const filename = `Subscribers_${new Date().toISOString().split("T")[0]}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
      notifySuccess("Subscribers exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      notifyError("Failed to export subscribers");
    }
  };

  let content = null;

  if (isLoading) {
    content = (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Loading subscribers...</p>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && allSubscribers.length === 0) {
    content = (
      <div className="py-16 text-center">
        <p className="text-gray-500">No subscribers found</p>
      </div>
    );
  }

  if (!isLoading && !isError && currentItems.length > 0) {
    content = (
      <>
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">#{item._id.slice(-8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(item.subscriptionDate || item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                        item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <SubscriberActions subscriber={item} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">1–{currentItems.length}</span> of <span className="font-medium text-gray-700">{allSubscribers.length}</span> subscribers
          </p>
          {pageCount > 1 && <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />}
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search />
              </span>
              <input
                type="text"
                placeholder="Search by email..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[140px]">
              <ReactSelect
                value={statusOptions.find((opt) => opt.value === statusFilter)}
                onChange={(option) => setStatusFilter(option?.value || "all")}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              title="From date"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              title="To date"
            />
            <button
              onClick={handleExportToExcel}
              className="px-4 py-2.5 text-sm font-medium text-white bg-theme rounded-lg hover:bg-theme/90 transition-colors"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

export default SubscriberTable;
