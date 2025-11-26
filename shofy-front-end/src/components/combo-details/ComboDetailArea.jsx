"use client";

import React, { useState } from "react";
import { Heart, ChevronRight } from "lucide-react";

const ComboDetailsArea = () => {
  const [selectedColor1, setSelectedColor1] = useState("");
  const [selectedSize1, setSelectedSize1] = useState("");
  const [selectedColor2, setSelectedColor2] = useState("");
  const [selectedSize2, setSelectedSize2] = useState("");
  const [selectedColor3, setSelectedColor3] = useState("");
  const [selectedSize3, setSelectedSize3] = useState("");

  const colors = [
    "Charcoal Grey",
    "White",
    "Black",
    "Sky Blue",
    "Sage Green",
    "Bottle Green",
    "Emerald Green",
    "Brown",
    "Maroon",
    "Baby Pink",
    "Red",
    "Navy Blue",
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <div className="bg-white rounded-2xl overflow-hidden relative shadow-xl group">
              <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-300 z-10">
                <Heart className="w-5 h-5 hover:fill-red-500 hover:text-red-500 transition-colors" />
              </button>

              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop"
                alt="T-shirts collection"
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-yellow-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <img
                    src={`https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop&q=${i}`}
                    alt={`Thumbnail ${i}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <h1 className="text-xl md:text-4xl  text-gray-900 leading-tight font-[var(--tp-ff-roboto)]">
              Pick Any 3 - Plain T-shirt Combo 3.0
            </h1>
            <p>
              This is comabo tshirt, in this combo you can choose any three
              color of tshirt with diffrent color and diffrent size.
            </p>

            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-xl font-black text-gray-900">₹1,099</span>
                <span className="text-xl text-gray-400 line-through">
                  ₹1,516
                </span>
                <span className="bg-[#F875AA] text-white px-4 py-2 rounded-lg font-bold shadow-md">
                  SAVE ₹417
                </span>
              </div>
              <div className="text-lg text-gray-600 mt-2 font-medium">
                ₹274.75/T-shirt
              </div>
            </div>

            {/* Select Combo */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-gray-900">
                  Select Your Combo
                </h3>
                <button className="text-[#F875AA] flex items-center gap-1 text-sm hover:underline font-semibold hover:gap-2 transition-all">
                  Size Guide <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Combo 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Color 1
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                    }}
                    value={selectedColor1}
                    onChange={(e) => setSelectedColor1(e.target.value)}
                  >
                    <option value="">Select</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Size 1
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                    }}
                    value={selectedSize1}
                    onChange={(e) => setSelectedSize1(e.target.value)}
                  >
                    <option value="">Select</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Combo 2 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Color 2
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                    }}
                    value={selectedColor2}
                    onChange={(e) => setSelectedColor2(e.target.value)}
                  >
                    <option value="">Select</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Size 2
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                    }}
                    value={selectedSize2}
                    onChange={(e) => setSelectedSize2(e.target.value)}
                  >
                    <option value="">Select</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Combo 3 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Color 3
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                    }}
                    value={selectedColor3}
                    onChange={(e) => setSelectedColor3(e.target.value)}
                  >
                    <option value="">Select</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Size 3
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundPosition: "right 1rem center",
                    }}
                    value={selectedSize3}
                    onChange={(e) => setSelectedSize3(e.target.value)}
                  >
                    <option value="">Select</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* product-details-query */}
            <div className="tp-product-details-query">
              <div className="tp-product-details-query-item d-flex align-items-center">
                <span>SKU: 4786 </span>
              </div>
              <div className="tp-product-details-query-item d-flex align-items-center">
                <span>Category: Plain T-shirt </span>
              </div>
              <div className="tp-product-details-query-item d-flex align-items-center">
                <span>Tag: T-shirt </span>
              </div>
            </div>

            {/* social media icons for share a product */}
            <div className="tp-product-details-social">
              <span>Share: </span>
              <a href="#">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="#">
                <i className="fa-brands fa-vimeo-v"></i>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Quantity + Add to Cart row */}
              <div className="flex items-center gap-4">
                {/* Quantity Box */}
                <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 w-32 select-none">
                  <button className="text-gray-500 font-bold text-xl">-</button>
                  <span className="text-gray-700 font-semibold">1</span>
                  <button className="text-gray-500 font-bold text-xl">+</button>
                </div>

                {/* Add to Cart Button */}
                <button className="flex-1 bg-white border border-[#F875AA] text-[#F875AA] font-bold py-2 rounded-lg text-lg transition-all">
                  Add To Cart
                </button>
              </div>

              {/* Buy Now Button */}
              <button className="w-full bg-[#F875AA] text-white font-bold py-2 rounded-lg text-lg transition-all hover:bg-[#e6669a]">
                Buy Now
              </button>
            </div>

            {/* product-details-payment */}
            <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
              <p>
                Guaranteed safe <br /> & secure checkout
              </p>
              <img
                src="/assets/img/product/icons/payment-option.png"
                alt="payment_option_img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetailsArea;
