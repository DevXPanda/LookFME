"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useGetCustomerByIdQuery } from "@/redux/user-management/userManagementApi";
import ErrorMsg from "@/app/components/common/error-msg";
import CustomerBasicInfo from "@/app/components/user-management/customer-basic-info";
import CustomerOrders from "@/app/components/user-management/customer-orders";
import CustomerReviews from "@/app/components/user-management/customer-reviews";
import CustomerWalletTransactions from "@/app/components/user-management/customer-wallet-transactions";
import CustomerActions from "@/app/components/user-management/customer-actions";

interface CustomerDetailAreaProps {
  id: string;
}

const CustomerDetailArea = ({ id }: CustomerDetailAreaProps) => {
  const [activeTab, setActiveTab] = useState<"info" | "orders" | "reviews" | "transactions">("info");
  const { data: customerData, isLoading, isError } = useGetCustomerByIdQuery(id);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading customer...</div>
      </div>
    );
  }

  if (isError || !customerData?.data) {
    return <ErrorMsg msg="Customer not found" />;
  }

  const customer = customerData.data;

  const tabs = [
    { id: "info", label: "Basic Information" },
    { id: "orders", label: "Order History" },
    { id: "reviews", label: "Reviews" },
    { id: "transactions", label: "Wallet Transactions" },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header card with profile and status */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 border-b border-gray-100 px-6 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-5">
            {customer.imageURL ? (
              <Image
                src={customer.imageURL}
                alt={customer.name}
                width={72}
                height={72}
                className="rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl bg-theme/10 flex items-center justify-center ring-2 ring-white shadow-md">
                <span className="text-2xl font-bold text-theme">
                  {customer.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{customer.name}</h1>
              <p className="text-gray-500 mt-0.5">{customer.email}</p>
              <p className="text-sm text-gray-400 mt-2">
                Joined {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <CustomerActions customer={customer} hideViewButton />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <nav className="flex gap-1 px-6 sm:px-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-theme text-theme bg-white -mb-px"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6 sm:p-8">
        {activeTab === "info" && <CustomerBasicInfo customer={customer} />}
        {activeTab === "orders" && <CustomerOrders customerId={id} />}
        {activeTab === "reviews" && <CustomerReviews customerId={id} />}
        {activeTab === "transactions" && <CustomerWalletTransactions customerId={id} />}
      </div>
    </div>
  );
};

export default CustomerDetailArea;
