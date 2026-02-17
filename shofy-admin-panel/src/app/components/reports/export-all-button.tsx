"use client";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useLazyExportReportDataQuery } from "@/redux/report/reportApi";
import { notifyError, notifySuccess } from "@/utils/toast";

interface ExportAllButtonProps {
  month?: number;
  year?: number;
}

const ExportAllButton: React.FC<ExportAllButtonProps> = ({ month, year }) => {
  const [exportData] = useLazyExportReportDataQuery();
  const [isLoading, setIsLoading] = useState(false);

  const reportTypes: Array<{
    type: "transaction" | "sales" | "profit" | "product" | "order" | "vat";
    name: string;
  }> = [
    { type: "transaction", name: "Transaction" },
    { type: "sales", name: "Sales" },
    { type: "profit", name: "Profit" },
    { type: "product", name: "Product" },
    { type: "order", name: "Order" },
    { type: "vat", name: "VAT" },
  ];

  const handleExportAll = async () => {
    setIsLoading(true);
    try {
      const workbook = XLSX.utils.book_new();

      // Export each report type
      for (const report of reportTypes) {
        try {
          const result = await exportData({
            reportType: report.type,
            month,
            year,
          }).unwrap();

          if (result.success && result.data) {
            // Convert data to worksheet
            const worksheet = XLSX.utils.json_to_sheet([result.data]);
            XLSX.utils.book_append_sheet(workbook, worksheet, report.name);
          }
        } catch (error) {
          console.error(`Error exporting ${report.name} report:`, error);
          // Continue with other reports even if one fails
        }
      }

      // Generate filename
      let filename = "All_Reports";
      if (year) filename += `_${year}`;
      if (month) {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        filename += `_${monthNames[month - 1]}`;
      }
      filename += `.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);
      notifySuccess("All reports exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      notifyError("Failed to export reports");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExportAll}
      disabled={isLoading}
      className="tp-btn px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
    >
      {isLoading ? "Exporting All Reports..." : "Export All Reports to Excel"}
    </button>
  );
};

export default ExportAllButton;
