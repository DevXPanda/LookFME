"use client"

import React from 'react';

const RelatedComboProduct = () => {
  const combos = [
    {
      id: 1,
      name: "Summer Combo Pack",
      price: 499.00,
      image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80"
    },
    {
      id: 2,
      name: "Classic Duo Set",
      price: 299.00,
      image: "/assets/img/supersaving/Cargo_min_web_cards_cd0d845a89 (1).jpg"
    },
    {
      id: 3,
      name: "Premium Bundle",
      price: 799.00,
      image: "/assets/img/supersaving/back_2_college_min_web_cards_d5640d9806 (1).jpg"
    },
    {
      id: 4,
      name: "Essential Pack",
      price: 399.00,
      image: "/assets/img/supersaving/replay_rewind_min_web_cards_3efb4c20bc.jpg"
    }
  ];

  return (
    <div className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 font-[var(--tp-ff-roboto)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 ">
          <p className="text-[#F875AA] text-sm sm:text-base font-medium mb-2">
            Next Day Products
          </p>
          <h2 className="text-2xl p-6 sm:text-4xl lg:text-4xl  text-gray-700">
            Combo Products
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {combos?.map((combo) => (
            <div
              key={combo.id}
              className="group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={combo.image}
                  alt={combo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl  text-gray-600 mb-2 group-hover:text-[#F875AA] transition-colors">
                  {combo.name}
                </h3>
                <p className="text-xl sm:text-2xl text-gray-600">
                  ₹{combo.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </div>
  );
};

export default RelatedComboProduct;