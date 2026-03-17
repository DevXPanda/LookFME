"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const BulkOrdersDropdown = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  const statusOptions = [
    { key: "all", label: "All Requests" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
  ];

  const isOrdersListActive = pathname === "/bulk-orders";

  return (
    <>
      {statusOptions.map((option) => {
        const isSelected = currentStatus === option.key && isOrdersListActive;

        return (
          <li key={option.key}>
            <Link
              href={`/bulk-orders?status=${option.key}`}
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
      <li>
        <Link
          href="/bulk-orders/products"
          className={`block font-normal w-full transition-all duration-200 rounded-md px-3 py-1.5 nav-dot ${
            pathname === "/bulk-orders/products"
              ? "text-theme font-medium bg-themeLight"
              : "text-[#6D6F71] hover:text-theme hover:bg-gray/50"
          }`}
        >
          Bulk Products
        </Link>
      </li>
    </>
  );
};

export default BulkOrdersDropdown;
