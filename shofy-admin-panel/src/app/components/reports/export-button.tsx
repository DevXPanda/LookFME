"use client";
import React from "react";
import * as XLSX from "xlsx";
import { useLazyExportReportDataQuery } from "@/redux/report/reportApi";
import { notifyError, notifySuccess } from "@/utils/toast";

interface ExportButtonProps {
  reportType: "transaction" | "sales" | "profit" | "product" | "order" | "vat";
  month?: number;
  year?: number;
  reportName: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  reportType,
  month,
  year,
  reportName,
}) => {
  const [exportData, { isLoading }] = useLazyExportReportDataQuery();

  const handleExport = async () => {
    try {
      const result = await exportData({
        reportType,
        month,
        year,
      }).unwrap();

      if (!result.success || !result.data) {
        notifyError("Failed to export data");
        return;
      }

      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet([result.data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, reportName);

      // Generate filename
      let filename = `${reportName}_Report`;
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
      notifySuccess("Report exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      notifyError("Failed to export report");
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className="tp-btn px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Exporting..." : "Export to Excel"}
    </button>
  );
};

export default ExportButton;
