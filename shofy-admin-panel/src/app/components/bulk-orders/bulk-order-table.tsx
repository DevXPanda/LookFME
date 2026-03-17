"use client";
import React, { useState } from "react";
import ErrorMsg from "@/app/components/common/error-msg";
import { useGetBulkOrderRequestsQuery } from "@/redux/bulk-order/bulkOrderApi";
import { Search } from "@/svg";
import { useSearchParams } from "next/navigation";
import BulkOrderActions from "@/app/components/orders/bulk-order-actions";
import BulkOrderStatusChange from "@/app/components/orders/bulk-order-status-change";

const BulkOrderTable = () => {
  const [searchVal, setSearchVal] = useState("");
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "all";

  const { data: requests = [], isError, isLoading, refetch } = useGetBulkOrderRequestsQuery(status);

  const filtered = searchVal.trim()
    ? requests.filter(
        (r: any) =>
          r.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
          r.email?.toLowerCase().includes(searchVal.toLowerCase()) ||
          r.phone?.includes(searchVal) ||
          r.city?.toLowerCase().includes(searchVal.toLowerCase())
      )
    : requests;

  let content: React.ReactNode = null;

  if (isLoading) {
    content = (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Loading requests...</p>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="Failed to load bulk order requests" />;
  }
  if (!isLoading && !isError && filtered.length === 0) {
    content = (
      <div className="py-16 text-center">
        <p className="text-gray-500">No bulk order requests found</p>
      </div>
    );
  }

  if (!isLoading && !isError && filtered.length > 0) {
    content = (
      <>
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email / Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">City, State</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((item: any) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{item.email}</div>
                    <div className="text-gray-500">{item.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.city}, {item.state}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {(item.statusHistory?.length > 0
                                            ? item.statusHistory[item.statusHistory.length - 1]?.updatedAt
                                            : item.updatedAt || item.createdAt)
                                            ? new Date(
                                                item.statusHistory?.length > 0
                                                    ? item.statusHistory[item.statusHistory.length - 1].updatedAt
                                                    : item.updatedAt || item.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "—"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <BulkOrderStatusChange
                                            id={item._id}
                                            currentStatus={item.status || "pending"}
                                            onUpdated={() => refetch()}
                                        />
                                    </td>
                                    <BulkOrderActions id={item._id} cls="px-6 py-4 text-right" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{filtered.length}</span> request(s)
          </p>
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
                placeholder="Search by name, email, phone or city..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              />
            </div>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

export default BulkOrderTable;
