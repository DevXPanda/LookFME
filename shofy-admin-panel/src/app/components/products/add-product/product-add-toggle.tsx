"use client";
import React, { useState } from "react";

type ProductAddToggleProps = {
  activeTab: "single" | "bulk";
  onTabChange: (tab: "single" | "bulk") => void;
};

const ProductAddToggle: React.FC<ProductAddToggleProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white px-8 py-6 rounded-md mb-6">
      <div className="flex gap-4 border-b border-gray-200">
        <button
          type="button"
          onClick={() => onTabChange("single")}
          className={`px-6 py-3 text-base font-medium transition-colors ${
            activeTab === "single"
              ? "text-theme border-b-2 border-theme"
              : "text-gray-600 hover:text-theme"
          }`}
        >
          Single Product Add
        </button>
        <button
          type="button"
          onClick={() => onTabChange("bulk")}
          className={`px-6 py-3 text-base font-medium transition-colors ${
            activeTab === "bulk"
              ? "text-theme border-b-2 border-theme"
              : "text-gray-600 hover:text-theme"
          }`}
        >
          Bulk Product Upload
        </button>
      </div>
    </div>
  );
};

export default ProductAddToggle;
