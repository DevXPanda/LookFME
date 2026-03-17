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
import { useGetAllOrdersQuery, useDownloadBulkShippingLabelsMutation, useBulkUpdateStatusMutation } from "@/redux/order/orderApi";
import usePagination from "@/hooks/use-pagination";
import { notifyError, notifySuccess } from "@/utils/toast";
import Swal from "sweetalert2";


const OrderTable = () => {
  const { data: orders, isError, isLoading, error } = useGetAllOrdersQuery();
  const [downloadBulkLabels, { isLoading: isDownloading }] = useDownloadBulkShippingLabelsMutation();
  const [bulkUpdateStatus, { isLoading: isBulkUpdating }] = useBulkUpdateStatusMutation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlStatus = searchParams.get("status") || "";
  const urlSearch = searchParams.get("search") ?? "";
  const [searchVal, setSearchVal] = useState<string>(urlSearch);
  const [selectVal, setSelectVal] = useState<string>(urlStatus);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatImageUrl = (url: any) => {
    if (!url || typeof url !== "string") return "https://placehold.co/200x200?text=No+Image";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:7000";
      return `${baseUrl}${url}`;
    }
    return url;
  };

  // Update selectVal when URL status changes
  useEffect(() => {
    if (urlStatus) {
      setSelectVal(urlStatus);
    } else {
      setSelectVal("");
    }
  }, [urlStatus]);

  // Sync search from URL (e.g. when main header search navigates to /orders?search=...)
  useEffect(() => {
    setSearchVal(urlSearch);
  }, [urlSearch]);

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
    if (searchVal.trim()) {
      const lowerSearch = searchVal.toLowerCase().trim();
      const searchValForMatch = lowerSearch.startsWith("#") ? lowerSearch.slice(1) : lowerSearch;

      filtered = filtered.filter((v: any) => {
        // Search by Invoice (numeric) - safe when invoice is missing
        const invoiceStr = v.invoice != null ? String(v.invoice) : "";
        const invoiceMatch = invoiceStr.toLowerCase().includes(searchValForMatch);

        // Search by backend orderId (single short ID used in both panels)
        const orderIdMatch = v.orderId && String(v.orderId).toLowerCase().includes(searchValForMatch);
        // Search by Order _id (fallback for legacy)
        const idMatch = v._id && String(v._id).toLowerCase().includes(searchValForMatch);

        // Search by customer name or email
        const customerName = (v.user?.name || "").toLowerCase();
        const customerEmail = (v.user?.email || "").toLowerCase();
        const customerMatch = customerName.includes(searchValForMatch) || customerEmail.includes(searchValForMatch);

        // Search by SKU in cart items
        const skuMatch = v.cart?.some((item: any) => {
          const sku = item.selectedVariation?.sku || item.sku;
          return sku && String(sku).toLowerCase().includes(searchValForMatch);
        });

        return invoiceMatch || orderIdMatch || idMatch || customerMatch || skuMatch;
      });
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

  // handle change input — update state and URL so main header search can sync
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchVal(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("search", value.trim());
    else params.delete("search");
    const query = params.toString();
    router.replace("/orders" + (query ? "?" + query : ""), { scroll: false });
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
        <table className="w-[1500px] 2xl:w-full text-sm text-left text-gray-500 border-separate border-spacing-0">
          <thead className="bg-[#f8fafa]">
            <tr className="text-xs text-[#8e959c] uppercase tracking-wider font-bold">
              <th
                scope="col"
                className="pl-8 pr-4 py-4 w-[50px] border-b border-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(new Set(filteredOrders.map((item: any) => item._id)));
                    } else {
                      setSelectedOrders(new Set());
                    }
                  }}
                  className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme"
                />
              </th>
              <th
                scope="col"
                className="pr-8 py-4 w-[170px] border-b border-gray-100"
              >
                INVOICE NO
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[120px] border-b border-gray-100"
              >
                Product Image
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[150px] border-b border-gray-100"
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-4 py-4 border-b border-gray-100"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[150px] text-end border-b border-gray-100"
              >
                Size
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[170px] text-end border-b border-gray-100"
              >
                QTY
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[170px] text-end border-b border-gray-100"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[170px] text-end border-b border-gray-100"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-4 py-4 w-[170px] text-end border-b border-gray-100"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-8 py-4 w-[14%] text-end border-b border-gray-100"
              >
                Action
              </th>
              <th
                scope="col"
                className="px-8 py-4 w-[4%] text-end border-b border-gray-100"
              >
                Invoice
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((item) => (
              <tr
                key={item._id}
                className="bg-white border-b border-gray-50 hover:bg-[#fcfdfe] transition-colors group"
              >
                <td className="pl-8 pr-4 py-6">
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(item._id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedOrders);
                      if (e.target.checked) {
                        newSelected.add(item._id);
                      } else {
                        newSelected.delete(item._id);
                      }
                      setSelectedOrders(newSelected);
                    }}
                    className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme"
                  />
                </td>
                <td className="pr-4 py-6 font-semibold text-[#1a1c1d]">
                  <span className="block">{item.invoice}</span>
                  {item.orderId && (
                    <span className="text-xs text-slate-500 font-normal block">ID {String(item.orderId).replace(/-/g, '')}</span>
                  )}
                </td>
                <td className="px-4 py-6">
                  <div className="flex flex-col items-center">
                    {item.cart && item.cart[0] && (
                      <div className="w-[44px] h-[48px] relative rounded-lg overflow-hidden border border-gray-100 shadow-sm group-hover:border-theme/20 transition-colors bg-white">
                        <Image
                          src={formatImageUrl(item.cart[0].img || item.cart[0].imageURLs?.[0]?.img)}
                          alt="product"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {item.cart.length > 1 && (
                      <button
                        onClick={() => {
                          const images = item.cart.map((c: any) => formatImageUrl(c.img || c.imageURLs?.[0]?.img));
                          setPreviewImages(images);
                          setIsPreviewOpen(true);
                        }}
                        className="text-[10px] text-theme hover:underline mt-1 font-medium"
                      >
                        +{item.cart.length - 1} more
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-6 font-medium text-[#4a5056] text-sm group-hover:text-theme transition-colors">
                  {(() => {
                    // Extract SKUs from cart items
                    const skus = item.cart
                      .map((cartItem: any) => {
                        // Check for variation SKU first (if product has variations)
                        if (cartItem.selectedVariation?.sku) {
                          return cartItem.selectedVariation.sku;
                        }
                        // Fall back to product SKU
                        if (cartItem.sku) {
                          return cartItem.sku;
                        }
                        // If no SKU found, return null
                        return null;
                      })
                      .filter((sku: string | null) => sku !== null);

                    // Return comma-separated SKUs or "N/A" if none found
                    return skus.length > 0 ? skus.join(", ") : "N/A";
                  })()}
                </td>
                <td className="pr-4 py-6 whitespace-nowrap">
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
                    <span className="font-semibold text-[#1a1c1d]">{item?.user?.name}</span>
                  </a>
                </td>

                <td className="px-4 py-6 font-medium text-[#55585B] text-end">
                  {(() => {
                    const sizes = item.cart
                      .map((cartItem: any) => cartItem.selectedSize)
                      .filter((size: any) => size)
                    return sizes.length > 0 ? Array.from(new Set(sizes)).join(", ") : "-";
                  })()}
                </td>
                <td className="px-4 py-6 font-medium text-[#55585B] text-end">
                  {item.cart.reduce(
                    (acc, curr) => acc + curr.orderQuantity,
                    0
                  )}
                </td>
                <td className="px-4 py-6 font-bold text-[#1a1c1d] text-end text-[15px]">
                  ₹
                  {item.cart
                    .reduce((acc, curr) => acc + curr.price, 0)
                    .toFixed(2)}
                </td>
                <td className="px-4 py-6 text-end">
                  <span
                    className={`text-[11px] uppercase tracking-wide inline-flex items-center justify-center min-w-[100px] h-[28px] ${item.status === "pending"
                      ? "text-amber-700 bg-amber-50/80 border border-amber-100"
                      : item.status === "delivered"
                        ? "text-emerald-700 bg-emerald-50/80 border border-emerald-100"
                        : item.status === "processing"
                          ? "text-blue-700 bg-blue-50/80 border border-blue-100"
                          : item.status === "cancel" || item.status === "canceled"
                            ? "text-rose-700 bg-rose-50/80 border border-rose-100"
                            : "text-slate-700 bg-slate-50/80 border border-slate-100"
                      } px-3 py-1 rounded-full leading-none font-bold`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-6 font-medium text-[#8e959c] text-end text-sm">
                  {dayjs(item.createdAt).format("MMM D, YYYY")}
                </td>

                <td className="px-8 py-6 text-end">
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

        {/* bottom info */}
        <div className="flex justify-between items-center flex-wrap mt-4">
          <p className="mb-0 text-tiny">
            Showing all {filteredOrders.length} of {orders?.data?.length || 0} Orders
          </p>
        </div>
      </>
    );
  }

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

  const handleBulkDownload = async () => {
    if (selectedOrders.size === 0) {
      notifyError("Please select at least one order");
      return;
    }

    try {
      const orderIds = Array.from(selectedOrders);
      const result = await downloadBulkLabels({ orderIds });

      // Handle blob response
      if ('data' in result && result.data instanceof Blob) {
        const blob = result.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Determine file extension based on blob type
        const isZip = blob.type === 'application/zip' || blob.type === 'application/x-zip-compressed';
        link.download = `shipping-labels-${Date.now()}.${isZip ? 'zip' : 'pdf'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        notifySuccess(`Successfully downloaded ${orderIds.length} shipping label(s)`);
        setSelectedOrders(new Set());
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error("Bulk download error:", error);
      notifyError(error?.data?.message || error?.message || "Failed to download shipping labels");
    }
  };

  return (
    <>
      <div className="tp-search-box flex items-center justify-between px-10 py-10 flex-wrap bg-white rounded-t-2xl shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-5">
          <div className="search-input relative group">
            <input
              className="input h-[48px] w-[320px] pl-14 pr-6 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] focus:bg-white focus:ring-2 focus:ring-theme/20 focus:border-theme transition-all duration-300 text-sm placeholder:text-gray-400"
              type="text"
              placeholder="Search by invoice, order ID, customer or SKU..."
              value={searchVal}
              onChange={handleSearchChange}
            />
            <button className="absolute top-1/2 left-6 translate-y-[-50%] text-gray-400 group-focus-within:text-theme transition-colors">
              <Search />
            </button>
          </div>

          {selectedOrders.size > 0 ? (
            <div className="flex items-center space-x-3 transition-all duration-300 transform scale-100">
              <button
                onClick={handleBulkDownload}
                disabled={isDownloading}
                className="px-4 py-2 bg-theme text-white rounded-md hover:bg-theme/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 h-[44px]"
              >
                {isDownloading ? (
                  <span>Downloading...</span>
                ) : (
                  <span>Download Labels ({selectedOrders.size})</span>
                )}
              </button>
              
              <div className="relative">
                <select
                  onChange={async (e) => {
                    const status = e.target.value;
                    if (!status) return;
                    
                    Swal.fire({
                      title: 'Change Orders Status?',
                      text: `Are you sure you want to change status to "${status}" for ${selectedOrders.size} selected orders?`,
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, update now!',
                      background: '#fff',
                      customClass: {
                        title: 'text-heading font-bold',
                        htmlContainer: 'text-textBody',
                        confirmButton: 'bg-theme text-white border-0 shadow-none px-6 py-2 rounded-md',
                        cancelButton: 'bg-rose-500 text-white border-0 shadow-none px-6 py-2 rounded-md'
                      }
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        try {
                          const res = await bulkUpdateStatus({
                            orderIds: Array.from(selectedOrders),
                            status: status
                          }).unwrap();
                          notifySuccess(res.message || "Statuses updated successfully");
                          setSelectedOrders(new Set());
                        } catch (err: any) {
                          notifyError(err?.data?.message || "Failed to update statuses");
                        }
                      }
                    });
                    e.target.value = ""; // Reset select
                  }}
                  disabled={isBulkUpdating}
                  className="input h-[48px] px-6 pr-12 rounded-xl border border-[#e2e8f0] bg-white text-sm font-semibold text-[#1a1c1d] focus:ring-4 focus:ring-theme/10 focus:border-theme disabled:opacity-50 cursor-pointer hover:border-theme transition-all shadow-sm appearance-none min-w-[240px]"
                >
                  <option value="">Bulk Status Action</option>
                  <option value="pending">Mark as Pending</option>
                  <option value="processing">Mark as Processing</option>
                  <option value="delivered">Mark as Delivered</option>
                  <option value="cancel">Mark as Canceled</option>
                  <option value="returned">Mark as Returned</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <DownArrow />
                </div>
              </div>

              <button 
                onClick={() => setSelectedOrders(new Set())}
                className="text-sm text-theme hover:underline px-2 font-medium"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 px-6 py-2 bg-white border border-[#e2e8f0] rounded-xl hover:border-theme/40 hover:bg-gray-50 min-w-[180px] h-[48px] justify-between shadow-sm transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-gray-400 group-hover:text-theme transition-colors">
                    <Orders />
                  </div>
                  <span className="text-sm font-semibold text-[#1a1c1d]">{getCurrentStatusLabel()}</span>
                </div>
                <div className="text-gray-400">
                  <DownArrow />
                </div>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-[280px] bg-white rounded-lg shadow-xl z-20 overflow-hidden border border-gray6">
                    <div className="px-4 py-3 border-b border-gray6 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center space-x-2">
                        <Orders />
                        <span className="text-heading font-semibold">Filter by Status</span>
                      </div>
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
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getBadgeColor()}`}>
                            {statusCounts[option.key as keyof typeof statusCounts] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-x-auto mx-8">{content}</div>

      {/* Image Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray6 flex items-center justify-between bg-white sticky top-0">
              <h3 className="text-lg font-bold text-heading uppercase tracking-wider">Order Items Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-heading transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {previewImages.map((img, idx) => (
                  <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray6 bg-gray-50 shadow-sm hover:shadow-md transition-shadow">
                    <Image
                      src={img}
                      alt={`preview-${idx}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray6 bg-gray-50 text-right">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-6 py-2 bg-theme text-white rounded-lg hover:bg-theme/90 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderTable;
