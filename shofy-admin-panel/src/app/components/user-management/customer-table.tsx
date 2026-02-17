"use client";
import React, { useState } from "react";
import ErrorMsg from "@/app/components/common/error-msg";
import Image from "next/image";
import Pagination from "@/app/components/ui/Pagination";
import { useGetAllCustomersQuery } from "@/redux/user-management/userManagementApi";
import usePagination from "@/hooks/use-pagination";
import CustomerActions from "@/app/components/user-management/customer-actions";
import { Search } from "@/svg";
import Link from "next/link";
import ReactSelect from "react-select";

const CustomerTable = () => {
  const [searchVal, setSearchVal] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: customersData, isError, isLoading } = useGetAllCustomersQuery({
    search: searchVal || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    sortBy,
    sortOrder,
  });

  const allCustomers = customersData?.data || [];
  const paginationData = usePagination(allCustomers, 9999);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "blocked", label: "Blocked" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Registration Date" },
    { value: "totalSpent", label: "Total Spent" },
    { value: "totalOrders", label: "Total Orders" },
    { value: "name", label: "Name" },
  ];

  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "36px",
      height: "36px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
      "&:hover": { borderColor: "#d1d5db" },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided: any) => ({ ...provided, padding: "6px 8px" }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f9fafb" : "white",
      color: state.isSelected ? "#2563eb" : "#374151",
      padding: "8px 12px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 9999,
    }),
    singleValue: (provided: any) => ({ ...provided, color: "#374151" }),
  };

  let content = null;

  if (isLoading) {
    content = (
      <div className="py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Loading customers...</p>
      </div>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && customersData?.data.length === 0) {
    content = (
      <div className="py-16 text-center">
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  if (!isLoading && !isError && currentItems) {
    content = (
      <>
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">#{item._id.slice(-8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/user-management/customers/${item._id}`} className="flex items-center gap-3 group">
                      {item.imageURL ? (
                        <Image src={item.imageURL} alt={item.name} width={40} height={40} className="rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-theme/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-theme">{item.name?.charAt(0).toUpperCase() || "U"}</span>
                        </div>
                      )}
                      <span className="font-medium text-gray-900 group-hover:text-theme transition-colors">{item.name}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.phone || item.contactNumber || "—"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.totalOrders ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{(item.totalSpent ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                        item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : item.status === "blocked"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CustomerActions customer={item} viewAsText />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">1–{currentItems.length}</span> of <span className="font-medium text-gray-700">{allCustomers.length}</span> customers
          </p>
          {pageCount > 1 && <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />}
        </div>
      </>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Search />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[140px]">
              <ReactSelect
                value={statusOptions.find((o) => o.value === statusFilter)}
                onChange={(o) => setStatusFilter(o?.value || "all")}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>
            <div className="w-[160px]">
              <ReactSelect
                value={sortOptions.find((o) => o.value === sortBy)}
                onChange={(o) => setSortBy(o?.value || "createdAt")}
                options={sortOptions}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

export default CustomerTable;
