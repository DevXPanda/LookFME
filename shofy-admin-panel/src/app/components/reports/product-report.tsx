"use client";
import React from "react";
import { useGetProductReportQuery } from "@/redux/report/reportApi";
import Loading from "../common/loading";
import ErrorMsg from "../common/error-msg";

interface ProductReportProps {
  month?: number;
  year?: number;
}

const ProductReport: React.FC<ProductReportProps> = ({ month, year }) => {
  const { data, isLoading, isError } = useGetProductReportQuery({ month, year });

  if (isLoading) {
    return <Loading loading={isLoading} spinner="scale" />;
  }

  if (isError || !data?.success) {
    return <ErrorMsg msg="Failed to load product report" />;
  }

  const report = data.data;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h3 className="text-2xl font-semibold mb-6">Product Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">{report.totalProducts}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Products Sold</p>
          <p className="text-3xl font-bold text-green-600">{report.totalProductSold}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Total Discount Given</p>
          <p className="text-3xl font-bold text-purple-600">₹{report.totalDiscountGiven.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Product Stock</p>
          <p className="text-3xl font-bold text-orange-600">{report.productStock}</p>
        </div>
        <div className="bg-pink-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Wishlisted Count</p>
          <p className="text-3xl font-bold text-pink-600">{report.wishlistedCount}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg">
          <p className="text-gray-600 mb-2">Add to Cart Count</p>
          <p className="text-3xl font-bold text-indigo-600">{report.addToCartCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductReport;
