"use client";
import React from "react";
import { useGetCustomerWalletTransactionsQuery } from "@/redux/user-management/userManagementApi";
import ErrorMsg from "@/app/components/common/error-msg";

interface CustomerWalletTransactionsProps {
  customerId: string;
}

const CustomerWalletTransactions = ({ customerId }: CustomerWalletTransactionsProps) => {
  const { data: transactionsData, isLoading, isError } = useGetCustomerWalletTransactionsQuery(customerId);

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (isError) {
    return <ErrorMsg msg="Failed to load transactions" />;
  }

  const transactions = transactionsData?.data || [];

  if (transactions.length === 0) {
    return <div className="text-center py-8 text-gray-500">No wallet transactions found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base text-left text-gray-500">
        <thead>
          <tr className="border-b border-gray6 text-tiny">
            <th className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">Date</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Type</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Amount</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Reason</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Previous Balance</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">New Balance</th>
            <th className="px-3 py-3 text-tiny text-text2 uppercase font-semibold">Admin</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="bg-white border-b border-gray6 last:border-0">
              <td className="px-3 py-3 font-normal text-[#55585B]">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </td>
              <td className="px-3 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    transaction.type === "credit"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"} {transaction.type.toUpperCase()}
                </span>
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B]">{transaction.amount}</td>
              <td className="px-3 py-3 font-normal text-[#55585B]">{transaction.reason}</td>
              <td className="px-3 py-3 font-normal text-[#55585B]">{transaction.previousBalance}</td>
              <td className="px-3 py-3 font-normal text-[#55585B] font-semibold">
                {transaction.newBalance}
              </td>
              <td className="px-3 py-3 font-normal text-[#55585B]">
                {transaction.adminId?.name || "System"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerWalletTransactions;
