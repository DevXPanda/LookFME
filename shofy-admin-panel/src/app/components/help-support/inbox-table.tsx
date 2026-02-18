"use client";
import React, { useState } from "react";
import ErrorMsg from "@/app/components/common/error-msg";
import Pagination from "@/app/components/ui/Pagination";
import { useGetSupportMessagesQuery } from "@/redux/support/supportApi";
import usePagination from "@/hooks/use-pagination";
import { Search } from "@/svg";
import Link from "next/link";
import { View } from "@/svg";
import type { ISupportMessage } from "@/types/support-type";

const PREVIEW_LENGTH = 60;

const InboxTable = () => {
  const [searchVal, setSearchVal] = useState<string>("");

  const { data: messagesData, isError, isLoading } = useGetSupportMessagesQuery();

  const allMessages = messagesData?.data || [];
  const filtered = searchVal.trim()
    ? allMessages.filter(
        (m) =>
          m.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
          m.email?.toLowerCase().includes(searchVal.toLowerCase()) ||
          m.subject?.toLowerCase().includes(searchVal.toLowerCase())
      )
    : allMessages;

  const paginationData = usePagination(filtered, 9999);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const messagePreview = (msg: ISupportMessage) => {
    const text = msg.message || "";
    if (text.length <= PREVIEW_LENGTH) return text;
    return text.slice(0, PREVIEW_LENGTH) + "...";
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  let content = null;

  if (isLoading) {
    content = (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Loading messages...</p>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && filtered.length === 0) {
    content = (
      <div className="py-16 text-center">
        <p className="text-gray-500">No messages found</p>
      </div>
    );
  }

  if (!isLoading && !isError && currentItems.length > 0) {
    content = (
      <>
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message preview</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-[180px] truncate" title={item.subject}>{item.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate" title={item.message}>{messagePreview(item)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${statusClass(item.status)}`}>
                      {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/help-support/inbox/${item._id}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-theme/10 text-theme hover:bg-theme hover:text-white transition-colors"
                      title="View"
                    >
                      <View />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">1–{currentItems.length}</span> of{" "}
            <span className="font-medium text-gray-700">{filtered.length}</span> messages
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
                placeholder="Search by name, email or subject..."
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

export default InboxTable;
