"use client";
import React, { useState } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import TransactionReport from "@/app/components/reports/transaction-report";
import SalesReport from "@/app/components/reports/sales-report";
import ProfitReport from "@/app/components/reports/profit-report";
import ProductReport from "@/app/components/reports/product-report";
import OrderReport from "@/app/components/reports/order-report";
import VATReport from "@/app/components/reports/vat-report";
import ExportAllButton from "@/app/components/reports/export-all-button";
import ReactSelect from "react-select";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

const monthOptions = [
  { value: undefined, label: "All months" },
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const yearOptions = Array.from({ length: 5 }, (_, i) => ({
  value: currentYear - i,
  label: String(currentYear - i),
}));

export default function ReportsAnalyticsPage() {
  const [month, setMonth] = useState<number | undefined>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const customSelectStyles = {
    control: (provided: unknown, state: { isFocused: boolean }) => ({
      ...(provided as object),
      minHeight: "38px",
      border: "1px solid #EFF2F5",
      borderRadius: "6px",
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : "none",
    }),
    menu: (provided: unknown) => ({
      ...(provided as object),
      zIndex: 9999,
    }),
  };

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Reports & Analytics" subtitle="Reports & Analytics" />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Reports & Analytics</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="w-[180px]">
              <ReactSelect
                value={monthOptions.find((o) => o.value === month)}
                onChange={(opt) => setMonth(opt?.value)}
                options={monthOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder="Month"
              />
            </div>
            <div className="w-[120px]">
              <ReactSelect
                value={yearOptions.find((o) => o.value === year)}
                onChange={(opt) => opt && setYear(opt.value)}
                options={yearOptions}
                styles={customSelectStyles}
                isSearchable={false}
                placeholder="Year"
              />
            </div>
            <ExportAllButton month={month} year={year} />
          </div>
        </div>
        <div className="space-y-6">
          <TransactionReport month={month} year={year} />
          <SalesReport month={month} year={year} />
          <ProfitReport month={month} year={year} />
          <ProductReport month={month} year={year} />
          <OrderReport month={month} year={year} />
          <VATReport month={month} year={year} />
        </div>
      </div>
    </Wrapper>
  );
}
