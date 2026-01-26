import React from "react";
import { InventoryCategoryStock, InventoryLowStock, InventoryStockValuation, InventorySalesVsStock } from "./inventory-mock-data";

export default function InventoryPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Inventory Overview</h1>
      <div className="mb-12"><InventoryCategoryStock /></div>
      <div className="mb-12"><InventoryLowStock /></div>
      <div className="mb-12"><InventoryStockValuation /></div>
      <div className="mb-12"><InventorySalesVsStock /></div>
    </div>
  );
}
