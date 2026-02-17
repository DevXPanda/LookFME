"use client";
import React from "react";
import { ICustomerDetail } from "@/types/user-management-type";

interface CustomerBasicInfoProps {
  customer: ICustomerDetail;
}

const CustomerBasicInfo = ({ customer }: CustomerBasicInfoProps) => {
  const infoItems = [
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone || customer.contactNumber || "—" },
    { label: "Address", value: customer.address || customer.shippingAddress || "—" },
    { label: "Joined", value: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{customer.totalOrders ?? 0}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-5">
          <p className="text-sm font-medium text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₹{(customer.totalSpent ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-gray-500">Account Status</p>
          <p className="text-lg font-semibold mt-1 capitalize text-gray-900">{customer.status ?? "—"}</p>
        </div>
      </div>

      {/* Contact & details */}
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Contact & details</h3>
        </div>
        <div className="p-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {infoItems.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-sm font-medium text-gray-500">{label}</dt>
                <dd className="mt-1 text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          {customer.bio && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-gray-900">{customer.bio}</dd>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerBasicInfo;
