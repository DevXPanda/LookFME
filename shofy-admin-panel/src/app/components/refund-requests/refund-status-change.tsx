"use client";
import React, { useState } from "react";
import { DownArrow } from "@/svg";
import { useUpdateRefundStatusMutation } from "@/redux/refundRequest/refundRequestApi";
import { notifySuccess, notifyError } from "@/utils/toast";

interface RefundStatusChangeProps {
  id: string;
  currentStatus: "pending" | "approved" | "refunded" | "rejected";
}

const RefundStatusChange = ({ id, currentStatus }: RefundStatusChangeProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateRefundStatusMutation();

  const statusOptions: Array<{
    value: "pending" | "approved" | "refunded" | "rejected";
    label: string;
    disabled?: boolean;
  }> = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved", disabled: currentStatus !== "pending" },
    { value: "refunded", label: "Refunded", disabled: currentStatus !== "approved" },
    { value: "rejected", label: "Rejected", disabled: currentStatus !== "pending" },
  ];

  const handleStatusChange = async (newStatus: "pending" | "approved" | "refunded" | "rejected") => {
    if (newStatus === currentStatus) {
      setIsDropdownOpen(false);
      return;
    }
    try {
      await updateStatus({ id, data: { status: newStatus } }).unwrap();
      notifySuccess("Status updated successfully");
      setIsDropdownOpen(false);
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to update status");
    }
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isLoading}
        className={`text-[11px] px-3 py-1 rounded-md leading-none font-medium ${getStatusClass(
          currentStatus
        )} flex items-center gap-1 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
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
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                disabled={option.disabled || isLoading || option.value === currentStatus}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  option.disabled || option.value === currentStatus
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                } ${option.value === currentStatus ? "bg-themeLight text-theme" : ""}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RefundStatusChange;
