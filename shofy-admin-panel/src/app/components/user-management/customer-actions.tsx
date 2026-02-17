"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import { View } from "@/svg";
import { useUpdateCustomerStatusMutation, useUpdateWalletCoinsMutation } from "@/redux/user-management/userManagementApi";
import { notifySuccess, notifyError } from "@/utils/toast";
import { ICustomer } from "@/types/user-management-type";

interface CustomerActionsProps {
  customer: ICustomer;
  showWalletButton?: boolean;
  hideViewButton?: boolean;
  viewAsText?: boolean;
}

const CustomerActions = ({ customer, showWalletButton = false, hideViewButton = false, viewAsText = false }: CustomerActionsProps) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCoins, setWalletCoins] = useState(customer.walletCoins || 0);
  const [reason, setReason] = useState("");
  
  const [updateStatus] = useUpdateCustomerStatusMutation();
  const [updateWalletCoins] = useUpdateWalletCoinsMutation();

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "blocked", label: "Blocked" },
  ];

  const currentStatus = useMemo(() => {
    return statusOptions.find((opt) => opt.value === customer.status) || statusOptions[0];
  }, [customer.status]);

  const handleStatusChange = async (value: string | undefined) => {
    if (value && value !== customer.status) {
      try {
        const res = await updateStatus({
          id: customer._id,
          data: { status: value as "active" | "inactive" | "blocked" },
        });
        
        if ("error" in res) {
          if ("data" in res.error) {
            const errorData = res.error.data as { message?: string };
            if (typeof errorData.message === "string") {
              return notifyError(errorData.message);
            }
          }
          notifyError("Failed to update status");
        } else {
          notifySuccess(res.data?.message || "Status updated successfully");
        }
      } catch (error) {
        notifyError("Failed to update status");
      }
    }
  };

  const handleWalletUpdate = async () => {
    const coins = Number(walletCoins);
    
    if (isNaN(coins) || coins < 0) {
      return notifyError("Please enter a valid number");
    }

    Swal.fire({
      title: "Update Wallet Coins?",
      text: `Set wallet coins to ${coins} for ${customer.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await updateWalletCoins({
            id: customer._id,
            data: { coins, reason: reason || "Admin adjustment" },
          });
          
          if ("error" in res) {
            if ("data" in res.error) {
              const errorData = res.error.data as { message?: string };
              if (typeof errorData.message === "string") {
                return notifyError(errorData.message);
              }
            }
            notifyError("Failed to update wallet coins");
          } else {
            notifySuccess(res.data?.message || "Wallet coins updated successfully");
            setShowWalletModal(false);
            setReason("");
          }
        } catch (error) {
          notifyError("Failed to update wallet coins");
        }
      }
    });
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "38px",
      height: "38px",
      border: "1px solid #EFF2F5",
      borderRadius: "6px",
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
      "&:hover": {
        border: "1px solid #EFF2F5",
      },
    }),
    indicatorSeparator: () => ({
      display: "block",
      width: "1px",
      height: "20px",
      backgroundColor: "#EFF2F5",
      margin: "4px 0",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: "4px 8px",
      color: "#777778",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#E3F2FD"
        : state.isFocused
        ? "#F5F5F5"
        : "white",
      color: state.isSelected ? "#1976D2" : "#333",
      padding: "8px 12px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#E3F2FD",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "6px",
      border: "1px solid #EFF2F5",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#333",
      display: "flex",
      alignItems: "center",
    }),
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <div className="w-[110px]">
          <ReactSelect
            onChange={(value) => handleStatusChange(value?.value)}
            options={statusOptions}
            value={currentStatus}
            placeholder="Select..."
            isSearchable={false}
            styles={customStyles}
          />
        </div>
        {!hideViewButton && (
          viewAsText ? (
            <Link
              href={`/user-management/customers/${customer._id}`}
              className="px-3 py-2 text-sm font-medium text-theme hover:text-theme/80 hover:underline"
            >
              View
            </Link>
          ) : (
            <Link
              href={`/user-management/customers/${customer._id}`}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-theme/10 text-theme hover:bg-theme hover:text-white transition-colors"
              title="View details"
            >
              <View />
            </Link>
          )
        )}
        {showWalletButton && (
          <button
            onClick={() => {
              setWalletCoins(customer.walletCoins || 0);
              setReason("");
              setShowWalletModal(true);
            }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-gray-100 text-gray-700 hover:bg-theme hover:text-white transition-colors"
            title="Update Wallet Coins"
          >
            💰
          </button>
        )}
      </div>

      {/* Wallet Coins Modal */}
      {showWalletModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowWalletModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Update Wallet Coins</h3>
              <p className="text-sm text-gray-600 mb-4">
                Customer: <strong>{customer.name}</strong>
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Wallet Coins
                </label>
                <input
                  type="number"
                  min="0"
                  value={walletCoins}
                  onChange={(e) => setWalletCoins(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for adjustment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-theme"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWalletUpdate}
                  className="px-4 py-2 text-sm bg-theme text-white rounded-md hover:bg-theme-dark"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CustomerActions;
