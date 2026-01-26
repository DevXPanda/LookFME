'use client';
import React from "react";


const mockLowStock = [
  { product: "Blue Denim Shirt", stock: 2 },
  { product: "Leather Wallet", stock: 1 },
  { product: "Red Lipstick", stock: 3 },
];

const mockValuation = [
  { item: "Total Inventory Value", value: 620000 },
  { item: "Stock in Hand", value: 500000 },
  { item: "Stock Sold", value: 120000 },
];

const mockSalesVsStock = [
  { product: "Blue Denim Shirt", sold: 80, stock: 2 },
  { product: "Red Lipstick", sold: 65, stock: 3 },
  { product: "Leather Wallet", sold: 30, stock: 1 },
];

import { useGetCategoryStockQuery, useGetLowStockQuery, useGetStockValuationQuery, useGetSalesVsStockQuery } from "@/redux/api/inventoryApi";

export function InventoryCategoryStock() {
  const { data, isLoading, isError } = useGetCategoryStockQuery();
  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-600">Error loading data</div>;
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Category Stock Details</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Stock</th>
            <th className="border px-4 py-2">Low Stock Alert</th>
            <th className="border px-4 py-2">Stock Value (₹)</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row: any, i: number) => (
  <tr key={i}>
    <td className="border px-6 py-3 text-left font-medium">{row.category}</td>
    <td className="border px-6 py-3 text-center">{row.stock}</td>
    <td className="border px-6 py-3 text-center text-red-600 font-semibold">{row.lowStock}</td>
    <td className="border px-6 py-3 text-right">₹{row.value?.toLocaleString()}</td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}

export function InventoryLowStock() {
  const { data, isLoading, isError } = useGetLowStockQuery();
  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-600">Error loading data</div>;
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Low Stock Alerts</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Stock Left</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row: any, i: number) => (
  <tr key={i}>
    <td className="border px-6 py-3 text-left font-medium">{row.product}</td>
    <td className="border px-6 py-3 text-center text-red-600 font-semibold">{row.stock}</td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}

export function InventoryStockValuation() {
  const { data, isLoading, isError } = useGetStockValuationQuery();
  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-600">Error loading data</div>;
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Stock Valuation Report</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Valuation (₹)</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row: any, i: number) => (
  <tr key={i}>
    <td className="border px-6 py-3 text-left font-medium">{row.product}</td>
    <td className="border px-6 py-3 text-right">₹{row.valuation?.toLocaleString()}</td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}

export function InventorySalesVsStock() {
  const { data, isLoading, isError } = useGetSalesVsStockQuery();
  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError) return <div className="p-8 text-red-600">Error loading data</div>;
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Product-wise Sales vs Stock</h2>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Sold</th>
            <th className="border px-4 py-2">Current Stock</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((row: any, i: number) => (
  <tr key={i}>
    <td className="border px-6 py-3 text-left font-medium">{row.product}</td>
    <td className="border px-6 py-3 text-center">{row.sold}</td>
    <td className="border px-6 py-3 text-center">{row.stock}</td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
}

