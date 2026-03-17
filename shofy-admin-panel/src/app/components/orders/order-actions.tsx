import Link from "next/link";
import React, { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetSingleOrderQuery, useDownloadSingleShippingLabelMutation } from "@/redux/order/orderApi";
import { View } from "@/svg";
import { notifyError, notifySuccess } from "@/utils/toast";
import ShippingLabelPrint from "./shipping-label-print";

const OrderActions = ({ id, cls }: { id: string, cls?: string }) => {
  const [showView, setShowView] = useState<boolean>(false);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [showShipPrint, setShowShipPrint] = useState<boolean>(false);
  const printRefThree = useRef<HTMLDivElement | null>(null);
  const { data: orderData, isLoading, isError } = useGetSingleOrderQuery(id);
  const [downloadLabel, { isLoading: isDownloadingLabel }] = useDownloadSingleShippingLabelMutation();

  const handlePrintShippingLabel = useReactToPrint({
    content: () => printRefThree?.current,
    documentTitle: "Shipping-Label",
  });

  const handlePrintLabelUI = async () => {
    try {
      handlePrintShippingLabel();
    } catch (err) {
      console.log("print label error", err);
      notifyError("Failed to print label");
    }
  };

  const handleDownloadLabel = async () => {
    try {
      const result = await downloadLabel({ orderId: id });

      if ('data' in result && result.data instanceof Blob) {
        const blob = result.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shipping-label-${orderData?.invoice || id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        notifySuccess("Shipping label downloaded successfully");
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error("Label download error:", error);
      notifyError(error?.data?.message || error?.message || "Failed to download shipping label");
    }
  };

  return (
    <>
      <td style={{ display: "none" }}>
        {orderData && (
          <div ref={printRefThree}>
            <ShippingLabelPrint orderData={orderData} />
          </div>
        )}
      </td>

      <td className={`${cls ? cls : 'px-8 py-6 text-end'}`}>
        <div className="flex items-center justify-end space-x-3">
          <div className="relative">
            <Link
              onMouseEnter={() => setShowView(true)}
              onMouseLeave={() => setShowView(false)}
              href={`/orders/${id}`}
              className="w-10 h-10 flex items-center justify-center text-gray-500 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 shadow-sm"
            >
              <View />
            </Link>
            <div
              className={`${showView ? "flex" : "hidden"
                } flex-col items-center z-50 absolute left-1/2 -translate-x-1/2 bottom-full mb-2`}
            >
              <span className="relative z-10 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-lg shadow-xl whitespace-nowrap">
                View Details
              </span>
              <div className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-slate-900"></div>
            </div>
          </div>
          <div className="relative">
            <button
              onMouseEnter={() => setShowLabel(true)}
              onMouseLeave={() => setShowLabel(false)}
              onClick={handleDownloadLabel}
              disabled={isDownloadingLabel}
              className="w-10 h-10 flex items-center justify-center text-gray-500 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-lg">📦</span>
            </button>
            <div
              className={`${showLabel ? "flex" : "hidden"
                } flex-col items-center z-50 absolute left-1/2 -translate-x-1/2 bottom-full mb-2`}
            >
              <span className="relative z-10 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-lg shadow-xl whitespace-nowrap">
                {isDownloadingLabel ? "Downloading..." : "Ship Label"}
              </span>
              <div className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-slate-900"></div>
            </div>
          </div>
          <div className="relative">
            <button
              onMouseEnter={() => setShowShipPrint(true)}
              onMouseLeave={() => setShowShipPrint(false)}
              onClick={handlePrintLabelUI}
              className="w-auto px-4 h-10 flex items-center justify-center text-[11px] font-bold uppercase tracking-wider text-gray-600 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 shadow-sm"
            >
              Label
            </button>
            <div
              className={`${showShipPrint ? "flex" : "hidden"
                } flex-col items-center z-50 absolute left-1/2 -translate-x-1/2 bottom-full mb-2`}
            >
              <span className="relative z-10 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-lg shadow-xl whitespace-nowrap">
                Print Label
              </span>
              <div className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-slate-900"></div>
            </div>
          </div>
        </div>
      </td>
    </>
  );
};

export default OrderActions;
