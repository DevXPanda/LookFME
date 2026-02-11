"use client";
import React from "react";
import { useGetCategoryStockQuery } from "@/redux/api/inventoryApi";
import ErrorMsg from "../common/error-msg";

const InventoryCategoryStock = () => {
  const { data, isLoading, isError } = useGetCategoryStockQuery();

  let content = null;

  if (isLoading) {
    content = <div className="p-8 text-center">Loading...</div>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="Error loading category stock data" />;
  }

  if (!isLoading && !isError && data?.success) {
    content = (
      <>
        <div className="relative overflow-x-auto mx-8">
          <table className="w-full text-base text-left text-gray-500">
            <thead className="bg-white">
              <tr className="border-b border-gray6 text-tiny">
                <th
                  scope="col"
                  className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Low Stock Alert
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Stock Value (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((row: any, i: number) => (
                <tr
                  key={i}
                  className="bg-white border-b border-gray6 last:border-0 text-start"
                >
                  <td className="px-3 py-3 font-medium text-heading">
                    {row.category}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {row.stock?.toLocaleString() || 0}
                  </td>
                  <td className="px-3 py-3 text-end">
                    {row.lowStock > 0 ? (
                      <span className="text-[11px] text-danger bg-danger/10 px-3 py-1 rounded-md leading-none font-medium">
                        {row.lowStock} items
                      </span>
                    ) : (
                      <span className="text-[11px] text-success bg-success/10 px-3 py-1 rounded-md leading-none font-medium">
                        Good
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    ₹{row.value?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      <div className="px-8 py-6 border-b border-gray6">
        <h2 className="text-xl font-semibold text-heading">Category Stock Details</h2>
        <p className="text-tiny text-text3 mt-1">View stock levels by category</p>
      </div>
      {content}
    </div>
  );
};

export default InventoryCategoryStock;
