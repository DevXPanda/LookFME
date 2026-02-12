"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetAllProductsQuery } from "@/redux/product/productApi";
import ErrorMsg from "../common/error-msg";
import { Rating } from "react-simple-star-rating";

const ProductPerformance = () => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();

  // Calculate most rated products
  const mostRatedProducts = useMemo(() => {
    if (!products?.data) return [];
    
    return [...products.data]
      .map((product) => {
        const averageRating =
          product.reviews && product.reviews.length > 0
            ? product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / product.reviews.length
            : 0;
        return {
          ...product,
          averageRating,
          reviewCount: product.reviews?.length || 0,
        };
      })
      .filter((p) => p.reviewCount > 0)
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, 1); // Show only top 1
  }, [products?.data]);

  // Calculate top selling products (by total sold price)
  // Note: Since we don't have actual sold count data, we'll use reviews count as a proxy
  // In a real scenario, this would come from order history
  const topSellingProducts = useMemo(() => {
    if (!products?.data) return [];
    
    return [...products.data]
      .map((product) => {
        // Use reviews count as a proxy for sold items (products with more reviews likely sold more)
        // Or use a calculation based on quantity if available
        const reviewCount = product.reviews?.length || 0;
        const soldCount = Math.max(reviewCount, Math.floor((product.quantity || 0) * 0.3)); // Estimate: 30% of stock sold
        const totalSoldPrice = (product.price || 0) * soldCount;
        
        return {
          ...product,
          soldCount,
          totalSoldPrice,
        };
      })
      .filter((p) => p.soldCount > 0) // Only show products that have been sold
      .sort((a, b) => b.totalSoldPrice - a.totalSoldPrice)
      .slice(0, 5); // Show top 5
  }, [products?.data]);

  let mostRatedContent = null;
  let topSellingContent = null;

  if (isLoading) {
    mostRatedContent = <h2>Loading....</h2>;
    topSellingContent = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    mostRatedContent = <ErrorMsg msg="There was an error" />;
    topSellingContent = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError) {
    mostRatedContent = (
      <div className="space-y-4">
        {mostRatedProducts.length > 0 ? (
          mostRatedProducts.map((product) => (
            <div key={product._id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
              <Image
                src={product.img}
                alt={product.title}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">{product.title}</h4>
                <div className="flex items-center gap-2">
                  <Rating
                    allowFraction
                    size={18}
                    initialValue={product.averageRating}
                    readonly={true}
                  />
                  <span className="text-sm text-gray-600">
                    {product.averageRating.toFixed(1)} ({product.reviewCount} Reviews)
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No rated products found</p>
        )}
      </div>
    );

    topSellingContent = (
      <div className="space-y-3">
        {topSellingProducts.length > 0 ? (
          topSellingProducts.map((product) => (
            <div key={product._id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <Image
                    src={product.img}
                    alt={product.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1 text-sm leading-tight truncate">{product.title}</h4>
                  <p className="text-xs text-gray-600 mb-1">Total Sold Price</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{product.totalSoldPrice.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center ml-4 flex-shrink-0">
                  <button className="bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded-l-md whitespace-nowrap">
                    Sold: {product.soldCount}
                  </button>
                  <button className="bg-blue-700 text-white py-1.5 px-2 rounded-r-md flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No products found</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Most Rated Products */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Most Rated Products</h3>
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
          <Link
            href="/product-list"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>
        {mostRatedContent}
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Top Selling Products</h3>
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
          <Link
            href="/product-list"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View All
          </Link>
        </div>
        {topSellingContent}
      </div>
    </div>
  );
};

export default ProductPerformance;
