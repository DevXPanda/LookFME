"use client";
import React from "react";
import { useGetLowStockQuery } from "@/redux/api/inventoryApi";
import ErrorMsg from "../common/error-msg";
import { Search } from "@/svg";

const InventoryLowStock = () => {
  const { data, isLoading, isError } = useGetLowStockQuery();
  const [searchVal, setSearchVal] = React.useState<string>("");

  let content = null;

  if (isLoading) {
    content = <div className="p-8 text-center">Loading...</div>;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="Error loading low stock alerts" />;
  }

  if (!isLoading && !isError && data?.success) {
    let filteredData = data?.data || [];
    
    if (searchVal) {
      filteredData = filteredData.filter((item: any) =>
        item.product?.toLowerCase().includes(searchVal.toLowerCase())
      );
    }

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
                  Stock Left
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-8 text-center text-text3">
                    No low stock items found
                  </td>
                </tr>
              ) : (
                filteredData.map((row: any, i: number) => (
                  <tr
                    key={i}
                    className="bg-white border-b border-gray6 last:border-0 text-start"
                  >
                    <td className="px-3 py-3 font-medium text-heading">
                      {row.product}
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      {row.stock}
                    </td>
                    <td className="px-3 py-3 text-end">
                      <span className="text-[11px] text-danger bg-danger/10 px-3 py-1 rounded-md leading-none font-medium">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      <div className="px-8 py-6 border-b border-gray6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-heading">Low Stock Alerts</h2>
          <p className="text-tiny text-text3 mt-1">Products running low on inventory</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center px-3 py-1 bg-danger/10 rounded-md">
            <span className="text-danger font-semibold text-sm">
              {data?.data?.length || 0} Alert{(data?.data?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      <div className="tp-search-box flex items-center justify-between px-8 py-8">
        <div className="search-input relative">
          <input
            className="input h-[44px] w-full pl-14"
            type="text"
            placeholder="Search by product name"
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
            <Search />
          </button>
        </div>
      </div>
      {content}
    </div>
  );
};

export default InventoryLowStock;
