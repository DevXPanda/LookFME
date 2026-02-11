"use client";
import React, { useMemo } from "react";
import { useGetStockValuationQuery } from "@/redux/api/inventoryApi";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import usePagination from "@/hooks/use-pagination";

const InventoryStockValuation = () => {
  const { data, isLoading, isError } = useGetStockValuationQuery();
  const paginationData = usePagination(data?.data || [], 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!data?.data) return null;
    
    const totalValuation = data.data.reduce(
      (sum: number, item: any) => sum + (item.valuation || 0),
      0
    );
    const totalProducts = data.data.length;
    const avgValuation = totalProducts > 0 ? totalValuation / totalProducts : 0;

    return {
      totalValuation,
      totalProducts,
      avgValuation,
    };
  }, [data?.data]);

  let content = null;

  if (isLoading) {
    content = <div className="p-8 text-center">Loading...</div>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="Error loading stock valuation data" />;
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
                  Product
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
                  Unit Price (₹)
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Valuation (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row: any, i: number) => (
                <tr
                  key={i}
                  className="bg-white border-b border-gray6 last:border-0 text-start"
                >
                  <td className="px-3 py-3 font-medium text-heading">
                    {row.product}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    {row.stock?.toLocaleString() || 0}
                  </td>
                  <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                    ₹{row.price?.toLocaleString() || 0}
                  </td>
                  <td className="px-3 py-3 font-semibold text-heading text-end">
                    ₹{row.valuation?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* pagination start */}
        {pageCount > 1 && (
          <div className="flex justify-between items-center flex-wrap mx-8 mt-4">
            <p className="mb-0 text-tiny">
              Showing 1-{currentItems.length} of {data?.data?.length || 0}
            </p>
            <div className="pagination py-3 flex justify-end items-center pagination">
              <Pagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            </div>
          </div>
        )}
        {/* pagination end */}
      </>
    );
  }

  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      <div className="px-8 py-6 border-b border-gray6">
        <h2 className="text-xl font-semibold text-heading">Stock Valuation Report</h2>
        <p className="text-tiny text-text3 mt-1">Current inventory value by product</p>
      </div>
      
      {/* Summary Cards */}
      {summary && (
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray6">
          <div className="bg-themeLight rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Total Valuation</p>
            <p className="text-2xl font-semibold text-heading">
              ₹{summary.totalValuation.toLocaleString()}
            </p>
          </div>
          <div className="bg-greenLight rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Total Products</p>
            <p className="text-2xl font-semibold text-heading">
              {summary.totalProducts}
            </p>
          </div>
          <div className="bg-warning/10 rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Average Valuation</p>
            <p className="text-2xl font-semibold text-heading">
              ₹{summary.avgValuation.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {content}
    </div>
  );
};

export default InventoryStockValuation;
