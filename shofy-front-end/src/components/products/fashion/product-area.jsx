'use client';
import React, { useState } from 'react';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import { TextShapeLine } from '@/svg';
import ProductItem from './product-item';
import { HomeTwoPrdLoader } from '@/components/loader';

// tabs
const tabs = ["All Collection", "Tshirts", "OverSized Tshirts", "Trousers"];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'fashion' });
  // handleActiveTab
  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeTwoPrdLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    let product_items = products.data;
    if (activeTab === 'All Collection') {
      product_items = products.data
    }
    else if (activeTab === 'Tshirts') {
      product_items = products.data.filter(p => p.category.name === 'Tshirts')
    } else if (activeTab === 'OverSized Tshirts') {
      product_items = products.data.filter(p => p.category.name === 'OverSized Tshirts')
    } else if (activeTab === 'Trousers') {
      product_items = products.data.filter(p => p.category.name === 'Trousers')
    } else {
      product_items = products.data;
    }

    let display_items = product_items;
    // Only duplicate products to fill 5 slots for "All Collection" tab
    if (activeTab === 'All Collection' && product_items.length > 0 && product_items.length < 5) {
      const times = Math.ceil(5 / product_items.length);
      display_items = Array(times).fill(product_items).flat().slice(0, 5);
    } else {
      // For filtered categories, show all available products (up to 5)
      display_items = product_items.slice(0, 5);
    }

    content = <>
      <div className="row justify-center m-50">
        <div className="col-xl-12">
          <div className="tp-product-tab-2 tp-tab mb-50 text-center">
            <nav>
              <div className="nav nav-tabs justify-content-center">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => handleActiveTab(tab)}
                    className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`}
                  >
                    {tab.split("-").join(" ")}
                    <span className="tp-product-tab-tooltip">{product_items.length}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="row justify-center tp-gx-20">
        {display_items.map((prd) => (
          <div key={prd._id} className="col-xl-2-4 col-lg-4 col-md-6 col-sm-6 mb-4">
            <ProductItem product={prd} />
          </div>
        ))}
      </div>
    </>
  }
  return (
    <>
      <section className="tp-product-area pb-50 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-30">
                <span className="tp-section-title-pre-2">
                  All Product Shop
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">Customer Favorite Style Product</h3>
              </div>
            </div>
          </div>
          {content}
          <div className="swiper-scrollbar tp-swiper-scrollbar tp-swiper-scrollbar-drag"></div>
        </div>
      </section>
    </>
  );
};

export default ProductArea;