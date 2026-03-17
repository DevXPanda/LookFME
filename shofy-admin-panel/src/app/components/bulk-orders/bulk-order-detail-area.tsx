"use client";
import React from "react";
import Link from "next/link";
import ErrorMsg from "@/app/components/common/error-msg";
import { useGetBulkOrderRequestQuery } from "@/redux/bulk-order/bulkOrderApi";
import BulkOrderStatusChange from "@/app/components/orders/bulk-order-status-change";

const BulkOrderDetailArea = ({ id }: { id: string }) => {
  const { data: request, isLoading, isError, refetch } = useGetBulkOrderRequestQuery(id);

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div>
        <ErrorMsg msg="Bulk order request not found" />
        <Link href="/bulk-orders" className="text-theme hover:underline mt-4 inline-block">
          Back to Bulk Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/bulk-orders" className="text-sm text-theme hover:underline">
          ← Back to Bulk Orders
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <BulkOrderStatusChange
            id={id}
            currentStatus={request.status || "pending"}
            onUpdated={() => refetch()}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h4>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</dt>
            <dd className="mt-1 text-sm font-medium text-gray-900">{request.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</dt>
            <dd className="mt-1 text-sm text-gray-600">
              <a href={`mailto:${request.email}`} className="text-theme hover:underline">
                {request.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</dt>
            <dd className="mt-1 text-sm text-gray-600">
              <a href={`tel:${request.phone}`} className="text-theme hover:underline">
                {request.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preferred Contact</dt>
            <dd className="mt-1 text-sm text-gray-600 capitalize">{request.preferredContact}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</dt>
            <dd className="mt-1 text-sm text-gray-600">{request.city}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">State</dt>
            <dd className="mt-1 text-sm text-gray-600">{request.state}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pin Code</dt>
            <dd className="mt-1 text-sm text-gray-600">{request.pinCode}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</dt>
            <dd className="mt-1 text-sm text-gray-600">
              {request.createdAt
                ? new Date(request.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </dd>
          </div>
          {(request.updatedAt || (request.statusHistory && request.statusHistory.length > 1)) && (
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last updated</dt>
              <dd className="mt-1 text-sm text-gray-600">
                {request.statusHistory?.length > 0
                  ? new Date(request.statusHistory[request.statusHistory.length - 1].updatedAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : request.updatedAt
                    ? new Date(request.updatedAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {(request.statusHistory && request.statusHistory.length > 0) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Status updates</h4>
          <ul className="space-y-2">
            {request.statusHistory.map((entry: any, idx: number) => (
              <li key={idx} className="flex items-center gap-3 text-sm">
                <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                  {entry.status}
                </span>
                <span className="text-gray-500">
                  {entry.updatedAt
                    ? new Date(entry.updatedAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Products Requested</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(request.items || []).map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {request.comments && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Comments / Message</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
            {request.comments}
          </p>
        </div>
      )}

    </div>
  );
};

export default BulkOrderDetailArea;
