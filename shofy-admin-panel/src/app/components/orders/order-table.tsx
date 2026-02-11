import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { useSearchParams, useRouter } from "next/navigation";
// internal
import OrderActions from "./order-actions";
import { Search, Orders, DownArrow } from "@/svg";
import ErrorMsg from "../common/error-msg";
import Pagination from "../ui/Pagination";
import OrderStatusChange from "./status-change";
import { useGetAllOrdersQuery } from "@/redux/order/orderApi";
import usePagination from "@/hooks/use-pagination";


const OrderTable = () => {
  const { data: orders, isError, isLoading, error } = useGetAllOrdersQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlStatus = searchParams.get("status") || "";
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectVal, setSelectVal] = useState<string>(urlStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Update selectVal when URL status changes
  useEffect(() => {
    if (urlStatus) {
      setSelectVal(urlStatus);
    } else {
      setSelectVal("");
    }
  }, [urlStatus]);

  // Map dropdown status to actual order status
  const mapStatusToOrderStatus = (status: string): string => {
    switch (status) {
      case "all":
        return "";
      case "pending":
        return "pending";
      case "confirmed":
      case "packaging":
      case "out-for-delivery":
        return "processing";
      case "delivered":
        return "delivered";
      case "returned":
        return "returned";
      case "failed-to-deliver":
      case "canceled":
        return "cancel";
      default:
        return "";
    }
  };

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    if (!orders?.data) return [];

    let filtered = [...orders.data];

    // Sort newest orders first
    filtered.sort((a, b) => {
      const bt = new Date(b.createdAt || b.updatedAt || b._id).getTime();
      const at = new Date(a.createdAt || a.updatedAt || a._id).getTime();
      return bt - at;
    });

    // Apply search filter
    if (searchVal) {
      filtered = filtered.filter(v => v.invoice.toString().includes(searchVal));
    }

    // Apply status filter
    if (selectVal) {
      const mappedStatus = mapStatusToOrderStatus(selectVal);
      if (mappedStatus) {
        filtered = filtered.filter(v => v.status.toLowerCase() === mappedStatus.toLowerCase());
      }
    }

    return filtered;
  }, [orders?.data, searchVal, selectVal]);

  const paginationData = usePagination(filteredOrders, 5);
  const { currentItems, handlePageClick, pageCount } = paginationData;

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    if (!orders?.data) return {};

    const counts: Record<string, number> = {
      all: orders.data.length,
      pending: 0,
      confirmed: 0,
      packaging: 0,
      "out-for-delivery": 0,
      delivered: 0,
      returned: 0,
      "failed-to-deliver": 0,
      canceled: 0,
    };

    orders.data.forEach((order: any) => {
      const status = order.status?.toLowerCase() || "";

      if (status === "pending") {
        counts.pending++;
      } else if (status === "processing") {
        // Processing orders count for confirmed, packaging, and out-for-delivery
        counts.confirmed++;
        counts.packaging++;
        counts["out-for-delivery"]++;
      } else if (status === "delivered") {
        counts.delivered++;
      } else if (status === "returned") {
        counts.returned++;
      } else if (status === "exchanged") {
        counts.returned++;
      } else if (status === "cancel" || status === "canceled") {
        counts.canceled++;
        counts["failed-to-deliver"]++;
      }
    });

    return counts;
  }, [orders?.data]);

  // Get badge color - consistent for all statuses
  const getBadgeColor = (): string => {
    return "bg-blue-100 text-blue-600";
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && (orders?.data?.length || 0) === 0) {
    content = <ErrorMsg msg="No Orders Found" />;
  }

  if (!isLoading && !isError && orders?.success) {
    content = (
      <>
        <table className="w-[1500px] 2xl:w-full text-base text-left text-gray-500">
          <thead className="bg-white">
            <tr className="border-b border-gray6 text-tiny">
              <th
                scope="col"
                className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold w-[170px]"
              >
                INVOICE NO
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                QTY
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[14%] text-end"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[4%] text-end"
              >
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr
                key={item._id}
                className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
              >
                <td className="px-3 py-3 font-normal text-[#55585B]">
                  #{item.invoice}
                </td>
                <td className="pr-8 py-5 whitespace-nowrap">
                  <a
                    href="#"
                    className="flex items-center space-x-5 text-hover-primary text-heading"
                  >
                    {item.user?.imageURL && (
                      <Image
                        className="w-[50px] h-[50px] rounded-full"
                        src={item.user.imageURL}
                        alt="user-img"
                        width={50}
                        height={50}
                      />
                    )}
                    <span className="font-medium">{item?.user?.name}</span>
                  </a>
                </td>

                <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                  {item.cart.reduce(
                    (acc, curr) => acc + curr.orderQuantity,
                    0
                  )}
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                  ₹
                  {item.cart
                    .reduce((acc, curr) => acc + curr.price, 0)
                    .toFixed(2)}
                </td>
                <td className="px-3 py-3 text-end">
                  <span
                    className={`text-[11px] ${item.status === "pending"
                      ? "text-warning bg-warning/10"
                      : item.status === "delivered"
                        ? "text-success bg-success/10"
                        : item.status === "processing"
                          ? "text-indigo-500 bg-indigo-100"
                          : item.status === "cancel"
                            ? "text-danger bg-danger/10"
                            : ""
                      } px-3 py-1 rounded-md leading-none font-medium text-end`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                  {dayjs(item.createdAt).format("MMM D, YYYY")}
                </td>

                <td className="px-9 py-3 text-end">
                  <div className="flex items-center justify-end space-x-2">
                    <OrderStatusChange 
                      id={item._id} 
                      currentStatus={item.status}
                    />
                  </div>
                </td>
                {/* order actions */}
                <OrderActions id={item._id} />
                {/* order actions */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* pagination start */}
        <div className="flex justify-between items-center flex-wrap">
          <p className="mb-0 text-tiny">
            Showing 1-
            {currentItems.length} of {filteredOrders.length}
          </p>
          <div className="pagination py-3 flex justify-end items-center sm:mx-8 pagination">
            <Pagination
              handlePageClick={handlePageClick}
              pageCount={pageCount}
            />
          </div>
        </div>
        {/* pagination end */}
      </>
    );
  }

  // handle change input 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
  };

  // handle status selection
  const handleStatusSelect = (status: string) => {
    setSelectVal(status);
    setIsDropdownOpen(false);
    // Update URL to sync with sidebar
    if (status === "all" || !status) {
      router.push("/orders");
    } else {
      router.push(`/orders?status=${status}`);
    }
  };

  // Get current status label
  const getCurrentStatusLabel = (): string => {
    if (!selectVal || selectVal === "all") return "All";
    const labels: Record<string, string> = {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "packaging": "Packaging",
      "out-for-delivery": "Out for delivery",
      "delivered": "Delivered",
      "returned": "Returned",
      "failed-to-deliver": "Failed to Deliver",
      "canceled": "Canceled",
    };
    return labels[selectVal] || "All";
  };

  const statusOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "packaging", label: "Packaging" },
    { key: "out-for-delivery", label: "Out for delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "returned", label: "Returned" },
    { key: "failed-to-deliver", label: "Failed to Deliver" },
    { key: "canceled", label: "Canceled" },
  ];

  return (
    <>
      <div className="tp-search-box flex items-center justify-between px-8 py-8 flex-wrap">
        <div className="search-input relative">
          <input
            className="input h-[44px] w-full pl-14"
            type="text"
            placeholder="Search by invoice no"
            onChange={handleSearchChange}
          />
          <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
            <Search />
          </button>
        </div>
        <div className="flex justify-end space-x-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[200px] justify-between"
            >
              <div className="flex items-center space-x-2">
                <Orders />
                <span className="text-sm font-medium">{getCurrentStatusLabel()}</span>
              </div>
              {/* <DownArrow className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} /> */}
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-lg shadow-lg z-20 overflow-hidden border border-gray6">
                  <div className="px-4 py-3 border-b border-gray6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Orders />
                      <span className="text-heading font-semibold">Orders</span>
                    </div>
                    <button
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-textBody hover:text-heading"
                    >
                      {/* <DownArrow className="rotate-180" /> */}
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {statusOptions.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => handleStatusSelect(option.key)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray transition-colors flex items-center justify-between ${(selectVal === option.key || (!selectVal && option.key === "all")) ? "bg-themeLight" : ""
                          }`}
                      >
                        <span className="text-heading text-sm">{option.label}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor()}`}>
                          {statusCounts[option.key as keyof typeof statusCounts] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto mx-8">{content}</div>
    </>
  );
};

export default OrderTable;
