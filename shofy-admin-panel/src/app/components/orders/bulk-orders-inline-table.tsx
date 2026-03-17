"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ErrorMsg from "@/app/components/common/error-msg";
import { useGetBulkOrderRequestsQuery } from "@/redux/bulk-order/bulkOrderApi";
import { Search } from "@/svg";
import BulkOrderActions from "./bulk-order-actions";
import BulkOrderStatusChange from "./bulk-order-status-change";

const BULK_STATUS_OPTIONS = [
  { key: "all", label: "All Requests" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

const BulkOrdersInlineTable = () => {
  const [searchVal, setSearchVal] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
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
        <p className="mt-3 text-sm text-gray-500">Loading bulk orders...</p>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="Failed to load bulk orders" />;
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left text-gray-500 border-separate border-spacing-0">
            <thead className="bg-[#f8fafa]">
              <tr className="text-xs text-[#8e959c] uppercase tracking-wider font-bold">
                <th className="pl-8 pr-4 py-4 border-b border-gray-100">Customer</th>
                <th className="px-4 py-4 border-b border-gray-100">Email / Phone</th>
                <th className="px-4 py-4 border-b border-gray-100">Products</th>
                <th className="px-4 py-4 border-b border-gray-100">Date</th>
                <th className="px-4 py-4 border-b border-gray-100">Updated</th>
                <th className="px-4 py-4 border-b border-gray-100">Status</th>
                <th className="px-8 py-4 border-b border-gray-100 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item._id} className="bg-white border-b border-gray-50 hover:bg-[#fcfdfe]">
                  <td className="pl-8 pr-4 py-4 font-semibold text-[#1a1c1d]">{item.name}</td>
                  <td className="px-4 py-4 text-gray-600">
                    <div>{item.email}</div>
                    <div className="text-gray-500 text-xs">{item.phone}</div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 max-w-[200px]">
                    {(item.items || []).map((it: any, i: number) => (
                      <span key={i} className="block text-xs">
                        {it.productName} × {it.quantity}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600 text-sm">
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
                  <td className="px-4 py-4">
                    <BulkOrderStatusChange
                      id={item._id}
                      currentStatus={item.status || "pending"}
                      onUpdated={() => refetch()}
                    />
                  </td>
                  <BulkOrderActions id={item._id} cls="px-8 py-4 text-end" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{filtered.length}</span> bulk request(s)
          </p>
        </div>
      </>
    );
  }

  const setStatus = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", "bulk");
    if (newStatus && newStatus !== "all") params.set("status", newStatus);
    else params.delete("status");
    router.replace(`/orders?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
        <div className="relative max-w-md flex-1 min-w-[200px]">
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
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="pl-4 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-theme/20 appearance-none cursor-pointer"
          >
            {BULK_STATUS_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>
        <Link
          href="/bulk-orders"
          className="text-sm font-medium text-theme hover:underline"
        >
          Open full Bulk Orders page →
        </Link>
      </div>
      {content}
    </div>
  );
};

export default BulkOrdersInlineTable;
