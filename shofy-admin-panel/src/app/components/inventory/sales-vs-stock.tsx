"use client";
import React, { useMemo } from "react";
import { useGetSalesVsStockQuery } from "@/redux/api/inventoryApi";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import usePagination from "@/hooks/use-pagination";

const InventorySalesVsStock = () => {
  const { data, isLoading, isError } = useGetSalesVsStockQuery();
  const paginationData = usePagination(data?.data || [], 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!data?.data) return null;
    
    const totalSold = data.data.reduce(
      (sum: number, item: any) => sum + (item.sold || 0),
      0
    );
    const totalStock = data.data.reduce(
      (sum: number, item: any) => sum + (item.stock || 0),
      0
    );
    const totalProducts = data.data.length;

    return {
      totalSold,
      totalStock,
      totalProducts,
      stockRatio: totalStock > 0 ? ((totalStock / (totalSold + totalStock)) * 100).toFixed(1) : 0,
    };
  }, [data?.data]);

  let content = null;

  if (isLoading) {
    content = <div className="p-8 text-center">Loading...</div>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="Error loading sales vs stock data" />;
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
                  Sold
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Current Stock
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Total Units
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Stock Ratio
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row: any, i: number) => {
                const totalUnits = (row.sold || 0) + (row.stock || 0);
                const stockRatio = totalUnits > 0 
                  ? ((row.stock / totalUnits) * 100).toFixed(1) 
                  : 0;
                const isLowStock = (row.stock || 0) < 10;

                return (
                  <tr
                    key={i}
                    className={`bg-white border-b border-gray6 last:border-0 text-start ${
                      isLowStock ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="px-3 py-3 font-medium text-heading">
                      {row.product}
                    </td>
                    <td className="px-3 py-3 font-normal text-success text-end">
                      {row.sold?.toLocaleString() || 0}
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      {row.stock?.toLocaleString() || 0}
                    </td>
                    <td className="px-3 py-3 font-semibold text-heading text-end">
                      {totalUnits.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-gray6 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(stockRatio) < 20
                                ? "bg-danger"
                                : parseFloat(stockRatio) < 50
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                            style={{ width: `${stockRatio}%` }}
                          ></div>
                        </div>
                        <span className="text-tiny font-medium text-text2 min-w-[40px]">
                          {stockRatio}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        <h2 className="text-xl font-semibold text-heading">Product-wise Sales vs Stock</h2>
        <p className="text-tiny text-text3 mt-1">Compare sales performance with current inventory levels</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-4 border-b border-gray6">
          <div className="bg-success/10 rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Total Sold</p>
            <p className="text-2xl font-semibold text-success">
              {summary.totalSold.toLocaleString()}
            </p>
          </div>
          <div className="bg-themeLight rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Total Stock</p>
            <p className="text-2xl font-semibold text-heading">
              {summary.totalStock.toLocaleString()}
            </p>
          </div>
          <div className="bg-info/10 rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Total Products</p>
            <p className="text-2xl font-semibold text-info">
              {summary.totalProducts}
            </p>
          </div>
          <div className="bg-warning/10 rounded-md p-4">
            <p className="text-tiny text-text3 mb-1">Stock Ratio</p>
            <p className="text-2xl font-semibold text-warning">
              {summary.stockRatio}%
            </p>
          </div>
        </div>
      )}

      {content}
    </div>
  );
};

export default InventorySalesVsStock;
