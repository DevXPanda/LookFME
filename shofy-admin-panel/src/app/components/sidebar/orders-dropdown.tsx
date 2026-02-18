"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const OrdersDropdown = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const statusOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "packaging", label: "Packaging" },
    { key: "out-for-delivery", label: "Out for delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "returned", label: "Returned" },
    { key: "failed-to-deliver", label: "Failed to Deliver" },
    { key: "canceled", label: "Canceled" },
  ];

  const isActive = pathname === "/orders";

  return (
    <>
      {statusOptions.map((option) => {
        const isSelected = currentStatus === option.key && isActive;

        return (
          <li key={option.key}>
            <Link
              href={`/orders?status=${option.key}`}
              className={`block font-normal w-full transition-all duration-200 rounded-md px-3 py-1.5 nav-dot ${
                isSelected 
                  ? "text-theme font-medium bg-themeLight" 
                  : "text-[#6D6F71] hover:text-theme hover:bg-gray/50"
              }`}
            >
              {option.label}
            </Link>
          </li>
        );
      })}
    </>
  );
};

export default OrdersDropdown;
