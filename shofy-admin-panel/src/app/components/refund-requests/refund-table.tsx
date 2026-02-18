"use client";
import React, { useState, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, DownArrow } from "@/svg";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import RefundStatusChange from "./refund-status-change";
import { useGetRefundRequestsQuery } from "@/redux/refundRequest/refundRequestApi";
import usePagination from "@/hooks/use-pagination";

const RefundTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlStatus = searchParams.get("status") || "all";
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectVal, setSelectVal] = useState<string>(urlStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { data: refundsData, isError, isLoading, error } = useGetRefundRequestsQuery(
    selectVal === "all" ? undefined : selectVal
  );

  useEffect(() => {
    if (urlStatus) {
      setSelectVal(urlStatus);
    } else {
      setSelectVal("all");
    }
  }, [urlStatus]);

  const filteredRefunds = useMemo(() => {
    // Ensure we always have an array, even if data is undefined
    const refunds = refundsData?.data || [];
    let filtered = [...refunds];
    if (searchVal) {
      filtered = filtered.filter(
        (v) =>
          v.orderId?.invoice?.toString().includes(searchVal) ||
          v.userId?.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
          v.userId?.email?.toLowerCase().includes(searchVal.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const bt = new Date(b.createdAt).getTime();
      const at = new Date(a.createdAt).getTime();
      return bt - at;
    });
  }, [refundsData?.data, searchVal]);

  const paginationData = usePagination(filteredRefunds, 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  const handleStatusSelect = (status: string) => {
    setSelectVal(status);
    setIsDropdownOpen(false);
    if (status === "all" || !status) {
      router.push("/refund-requests");
    } else {
      router.push(`/refund-requests?status=${status}`);
    }
  };

  const getCurrentStatusLabel = (): string => {
    if (!selectVal || selectVal === "all") return "All";
    const labels: Record<string, string> = {
      pending: "Pending",
      approved: "Approved",
      refunded: "Refunded",
      rejected: "Rejected",
    };
    return labels[selectVal] || "All";
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "text-warning bg-warning/10";
      case "approved":
        return "text-blue-600 bg-blue-100";
      case "refunded":
        return "text-success bg-success/10";
      case "rejected":
        return "text-danger bg-danger/10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Loading refund requests...</p>
      </div>
    );
  }

  // Handle error state - only show error if it's a real error (not empty data)
  if (isError) {
    // Check if error is 404 "Not Found" - might be from backend route not found
    const errorMessage = error && 'data' in error 
      ? (error.data as any)?.message || (error.data as any)?.errorMessages?.[0]?.message || "Failed to load refund requests"
      : error && 'status' in error && (error as any).status === 404
      ? "Refund requests endpoint not found. Please check backend configuration."
      : "Failed to load refund requests";
    return <ErrorMsg msg={errorMessage} />;
  }

  // Handle empty data - show friendly message instead of error
  // Show "No refund requests found" when:
  // 1. No data from API (empty array)
  // 2. Filtered results are empty (after search or status filter)
  if (!refundsData?.data || refundsData.data.length === 0 || filteredRefunds.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No refund requests found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
                  type="text"
                  placeholder="Search by Order ID, Customer Name, or Email..."
                  value={searchVal}
                  onChange={handleSearchChange}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Search />
                </span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {getCurrentStatusLabel()}
                <span className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}>
                  <DownArrow />
                </span>
              </button>
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {["all", "pending", "approved", "refunded", "rejected"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusSelect(status)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          selectVal === status ? "bg-themeLight text-theme" : ""
                        }`}
                      >
                        {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-base text-left text-gray-500">
            <thead className="bg-gray-50 text-gray-700 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-end">
                  Refund Amount
                </th>
                <th scope="col" className="px-6 py-3 font-semibold">
                  Reason
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-end">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-end">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 font-semibold text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white border-b border-gray6 last:border-0 text-start"
                >
                  <td className="px-6 py-4 font-normal text-[#55585B]">
                    #{item.orderId?.invoice || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-medium text-heading">
                    {item.userId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 font-normal text-[#55585B] text-end">
                    ₹{item.refundAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 font-normal text-[#55585B] max-w-xs">
                    <div className="truncate" title={item.reason}>
                      {item.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <span
                      className={`text-[11px] ${getStatusClass(
                        item.status
                      )} px-3 py-1 rounded-md leading-none font-medium`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-normal text-[#55585B] text-end">
                    {dayjs(item.createdAt).format("MMM D, YYYY")}
                  </td>
                  <td className="px-6 py-4 text-end">
                    <RefundStatusChange id={item._id} currentStatus={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center flex-wrap p-6 border-t border-gray6">
          <p className="mb-0 text-tiny">
            Showing 1-{currentItems.length} of {filteredRefunds.length}
          </p>
          <div className="pagination py-3 flex justify-end items-center pagination">
            <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundTable;
