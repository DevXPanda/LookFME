"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { CompareTwo } from "@/svg";
import Wishlist from "@/svg/wishlist";
import RelatedComboProduct from "./RelatedComboProduct";
import ColorDropdown from "./Colordropdown";
// import { useSearchParams } from "next/navigation";

const ComboDetailsPage = ({ mainImage, thumbnails = [] }) => {
  const [selectedColor1, setSelectedColor1] = useState("");
  const [selectedSize1, setSelectedSize1] = useState("");
  const [selectedColor2, setSelectedColor2] = useState("");
  const [selectedSize2, setSelectedSize2] = useState("");
  const [selectedColor3, setSelectedColor3] = useState("");
  const [selectedSize3, setSelectedSize3] = useState("");

  const [quantity, setQuantity ] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const [mainImageState, setMainImageState] = useState(mainImage);

  const tabStyle = (tab) =>
    `px-6 py-3 text-xl font-medium cursor-pointer 
   ${
     activeTab === tab
       ? "border-pink-500 text-pink-600"
       : "border-transparent text-gray-500 hover:text-gray-700"
   }`;

  useEffect(() => {
    setMainImageState(mainImage);
  }, [mainImage]);

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

const handleIncrement = (e) => {
   e.preventDefault()
   setQuantity(prev => prev + 1 )
};

const handleDecrement = (e) => {
  e.preventDefault()
  setQuantity(prev => (prev > 1 ? prev - 1 : 1))
};


  const sizes = ["S", "M", "L", "XL", "XXL"];

  return (
    <div>
      <div className="min-h-screen  p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
              {/* Main Image */}
              <div className="bg-white rounded-2xl overflow-hidden relative shadow-xl group">
                <img
                  src={mainImageState || "/placeholder.jpg"}
                  alt="T-shirts collection"
                  className="w-full max-w-[1000px] h-auto max-h-[1200px] object-cover mx-auto 
             transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Thumbnails Section */}
              <div className="mt-4">
                {/* Desktop & Tablet Grid */}
                <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 gap-3">
                  {thumbnails.length > 0 ? (
                    thumbnails.map((thumb, idx) => (
                      <div
                        key={idx}
                        onClick={() => setMainImageState(thumb)}
                        className="bg-white rounded-xl overflow-hidden 
          border-2 border-gray-200 cursor-pointer 
          hover:border-yellow-400 hover:shadow-lg 
          transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <img src={thumb} className="w-full h-24 object-cover" />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No thumbnails available</p>
                  )}
                </div>

                {/* Mobile Scrollable Row */}
                <div className="sm:hidden flex gap-3 overflow-x-auto mt-2 pb-2">
                  {thumbnails.map((thumb, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMainImageState(thumb)}
                      className="min-w-[80px] h-20 bg-white rounded-xl overflow-hidden 
        border-2 border-gray-200 cursor-pointer 
        hover:border-yellow-400 hover:shadow-lg 
        transition-all duration-300"
                    >
                      <img src={thumb} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
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
                  <span className="text-xl font-black text-gray-900">
                    ₹1,099
                  </span>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Color 1
                    </label>

                    <ColorDropdown
                      colors={colors}
                      selectedColor={selectedColor1}
                      setSelectedColor={setSelectedColor1}
                    />
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
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option
                          key={size}
                          className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#F875AA] transition-colors"
                          value={size}
                        >
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Combo 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Color 2
                    </label>
                    <ColorDropdown
                      colors={colors}
                      selectedColor={selectedColor2}
                      setSelectedColor={setSelectedColor2}
                    />
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
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Combo 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Color 3
                    </label>
                    <ColorDropdown
                      colors={colors}
                      selectedColor={selectedColor3}
                      setSelectedColor={setSelectedColor3}
                    />
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
                      <option value="">Select Size</option>
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
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 w-32 select-none">
                    
                    <button 
                    className="text-gray-500 font-bold text-xl"
                    onClick={handleDecrement}
                    >
                      -
                    </button>
                    <span className="text-gray-700 font-semibold">{quantity}</span>
                    <button 
                    className="text-gray-500 font-bold text-xl"
                    onClick={handleIncrement}
                    >
                      +
                    </button>

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

              {/* compare  wishlist and ask question*/}
              <div className="flex items-center gap-6 text-gray-600 text-sm mt-3">
                <button className="flex items-center gap-1 hover:text-gray-800">
                  <CompareTwo />
                  <span>Compare</span>
                </button>

                <button className="flex items-center gap-1 hover:text-gray-800">
                  <Wishlist />
                  <span>Add Wishlist</span>
                </button>

                <button className="flex items-center gap-1 hover:text-gray-800">
                  <span className="text-base">?</span>
                  <span>Ask a question</span>
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

        {/* active tabs */}

        <div className="max-w-7xl mx-auto mt-[10rem] font-[var(--tp-ff-roboto)]">
          {/* tabs */}
          <div className="flex overflow-x-auto whitespace-nowrap gap-4 ml-0 sm:ml-0 md:ml-[10rem] lg:ml-[25rem]">
            <button
              className={tabStyle("description")}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>

            <button
              className={tabStyle("additional")}
              onClick={() => setActiveTab("additional")}
            >
              Additional Information
            </button>

            <button
              className={tabStyle("reviews")}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews (1)
            </button>
          </div>

          <hr />

          {/* description tab */}
          <div className="py-8 text-gray-700 text-[15px]">
            {activeTab === "description" && (
              <p>
                <strong>Starlight Aluminum Case with Braided Solo Loop</strong>{" "}
                — The aluminum case is lightweight and made from 100% recycled
                aerospace-grade alloy. The Braided Solo Loop is made from
                recycled yarn and silicone threads for an ultra-comfortable,
                stretchable design with no clasps or buckles.
              </p>
            )}

            {/* Additional Information */}
            {activeTab === "additional" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Additional Information
                </h3>
                <ul className="list-disc ml-6">
                  <li>Material: Aerospace-grade aluminum</li>
                  <li>Band: Recycled yarn braided solo loop</li>
                  <li>Water Resistance: Yes</li>
                  <li>Warranty: 1 year</li>
                </ul>
              </div>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Review</h3>
                <p>⭐️⭐️⭐️⭐️⭐️ — Great quality and very comfortable!</p>
              </div>
            )}

            <div />
          </div>
        </div>
      </div>

      <hr className="mt-[6rem]" />
      <RelatedComboProduct />
    </div>
  );
};

export default ComboDetailsPage;
