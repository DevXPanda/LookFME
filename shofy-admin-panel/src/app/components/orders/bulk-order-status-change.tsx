"use client";
import React from "react";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useUpdateBulkOrderStatusMutation } from "@/redux/bulk-order/bulkOrderApi";

const OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

interface BulkOrderStatusChangeProps {
  id: string;
  currentStatus: string;
  onUpdated?: () => void;
}

const BulkOrderStatusChange = ({ id, currentStatus, onUpdated }: BulkOrderStatusChangeProps) => {
  const [updateStatus, { isLoading }] = useUpdateBulkOrderStatusMutation();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "pending" | "accepted" | "rejected";
    if (!value) return;
    try {
      await updateStatus({ id, status: value }).unwrap();
      notifySuccess(`Status updated to ${value}`);
      onUpdated?.();
    } catch (err: any) {
      notifyError(err?.data?.message || "Failed to update status");
    }
  };

  const statusLower = (currentStatus || "").toLowerCase();

  return (
    <select
      value={statusLower === "pending" || statusLower === "accepted" || statusLower === "rejected" ? statusLower : "pending"}
      onChange={handleChange}
      disabled={isLoading}
      className="min-h-[36px] px-3 py-1.5 text-sm font-semibold border border-[#e2e8f0] rounded-lg bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme cursor-pointer disabled:opacity-50"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default BulkOrderStatusChange;
