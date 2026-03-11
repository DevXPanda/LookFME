import React, { useMemo } from "react";
import ReactSelect from "react-select";
import { notifySuccess } from "@/utils/toast";
import { useUpdateStatusMutation } from "@/redux/order/orderApi";

interface OrderStatusChangeProps {
  id: string;
  currentStatus?: string;
}

const OrderStatusChange = ({ id, currentStatus }: OrderStatusChangeProps) => {
  const [updateStatus, { data: updateStatusData }] = useUpdateStatusMutation();

  // Map backend statuses to display options
  const options = useMemo(() => {
    return [
      { value: "delivered", label: "Delivered" },
      { value: "processing", label: "Processing" },
      { value: "pending", label: "Pending" },
      { value: "exchanged", label: "Exchanged" },
      { value: "cancel", label: "Cancel" },
      { value: "returned", label: "Returned" },
      { value: "failed-to-deliver", label: "Failed to Deliver" },
      { value: "canceled", label: "Canceled" },
    ];
  }, []);

  const handleChange = async (value: string | undefined, id: string) => {
    if (value) {
      // Map frontend status values to backend valid statuses
      let backendStatus = value;

      // Map "failed-to-deliver" and "canceled" to "cancel" (valid backend status)
      if (value === "failed-to-deliver" || value === "canceled") {
        backendStatus = "cancel";
      }

      const res = await updateStatus({ id, status: { status: backendStatus } });
      if ("data" in res) {
        if ("message" in res.data) {
          notifySuccess(res.data.message);
        }
      }
    }
  };

  // Find current value based on currentStatus
  const currentValue = useMemo(() => {
    if (!currentStatus) return undefined;
    const statusLower = currentStatus.toLowerCase().trim();

    // Direct match first - check if exact value exists in options
    const directMatch = options.find((opt) => opt.value.toLowerCase() === statusLower);
    if (directMatch) return directMatch;

    // Handle status mappings from backend to frontend display
    // Backend "cancel" can be displayed as "canceled" in UI (preferred) or "cancel"
    if (statusLower === "cancel") {
      return options.find((opt) => opt.value === "canceled") || options.find((opt) => opt.value === "cancel");
    }

    // Handle variations of "failed-to-deliver"
    if (statusLower === "failedtodeliver" || statusLower === "failed_to_deliver" || statusLower === "failed-to-deliver") {
      return options.find((opt) => opt.value === "failed-to-deliver");
    }

    // Return undefined if no match found (will show placeholder)
    return undefined;
  }, [currentStatus, options]);

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "40px",
      height: "40px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      borderRadius: "10px",
      boxShadow: state.isFocused ? "0 0 0 4px rgba(190, 89, 133, 0.1)" : "none",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      "&:hover": {
        border: "1px solid #be5985",
        backgroundColor: "#fff",
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
        ? "#be5985"
        : state.isFocused
          ? "#fdeff4"
          : "white",
      color: state.isSelected ? "white" : "#1a1c1d",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: state.isSelected ? "700" : "500",
      "&:active": {
        backgroundColor: "#be5985",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      zIndex: 9999,
      overflow: "hidden",
      marginTop: "8px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#1a1c1d",
      display: "flex",
      alignItems: "center",
    }),
  };

  return (
    <ReactSelect
      onChange={(value) => handleChange(value?.value, id)}
      options={options}
      value={currentValue}
      placeholder="Select..."
      isSearchable={false}
      styles={customStyles}
    />
  );
};

export default OrderStatusChange;
