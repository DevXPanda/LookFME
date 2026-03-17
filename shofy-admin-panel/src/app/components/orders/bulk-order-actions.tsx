import Link from "next/link";
import React, { useState } from "react";
import { View } from "@/svg";

const BulkOrderActions = ({ id, cls }: { id: string; cls?: string }) => {
  const [showView, setShowView] = useState<boolean>(false);

  return (
    <td className={cls ?? "px-8 py-6 text-end"}>
      <div className="flex items-center justify-end space-x-3">
        <div className="relative">
          <Link
            onMouseEnter={() => setShowView(true)}
            onMouseLeave={() => setShowView(false)}
            href={`/bulk-orders/${id}`}
            className="w-10 h-10 flex items-center justify-center text-gray-500 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 shadow-sm"
          >
            <View />
          </Link>
          <div
            className={`${showView ? "flex" : "hidden"} flex-col items-center z-50 absolute left-1/2 -translate-x-1/2 bottom-full mb-2`}
          >
            <span className="relative z-10 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-lg shadow-xl whitespace-nowrap">
              View Details
            </span>
            <div className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-slate-900" />
          </div>
        </div>
      </div>
    </td>
  );
};

export default BulkOrderActions;
