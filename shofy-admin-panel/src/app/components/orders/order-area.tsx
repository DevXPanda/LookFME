"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import OrderTable from "./order-table";
import BulkOrdersInlineTable from "./bulk-orders-inline-table";

const OrderArea = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "orders";

  const isBulk = type === "bulk";

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => router.replace("/orders", { scroll: false })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !isBulk ? "bg-theme text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Orders
        </button>
        <button
          type="button"
          onClick={() => router.replace("/orders?type=bulk", { scroll: false })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isBulk ? "bg-theme text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Bulk Orders
        </button>
      </div>
      {!isBulk ? <OrderTable /> : <BulkOrdersInlineTable />}
    </>
  );
};
export default OrderArea;
