'use client';
import React, { useState } from 'react';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import { TextShapeLine } from '@/svg';
import ProductItem from './product-item';
import { HomeTwoPrdLoader } from '@/components/loader';
import 'swiper/css';
import 'swiper/css/scrollbar';

// Tabs
const tabs = ["All Collection", "Tshirts", "OverSized Tshirts", "Trousers"];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data: products, isError, isLoading } = useGetProductTypeQuery({ type: 'fashion' });

  const handleActiveTab = (tab) => setActiveTab(tab);

  // Slider settings
  const slider_setting = {
    slidesPerView: 5,
    spaceBetween: 20,
    loop: false,
    centeredSlides: false,
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true,
      dragClass: "tp-swiper-scrollbar-drag",
      snapOnRelease: true,
    },
    breakpoints: {
      1200: { slidesPerView: 5 },
      992: { slidesPerView: 4 },
      768: { slidesPerView: 3 },
      576: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    },
  };

  // Decide what to render
  let content = null;
  let display_items = [];

  if (isLoading) content = <HomeTwoPrdLoader loading={isLoading} />;
  else if (!isLoading && isError) content = <ErrorMsg msg="There was an error" />;
  else if (!isLoading && !isError && products?.data?.length === 0) content = <ErrorMsg msg="No Products found!" />;
  else if (!isLoading && !isError && products?.data?.length > 0) {
    let product_items = products.data;

    // Filter products based on active tab
    if (activeTab === 'Tshirts') product_items = products.data.filter(p => p.category.name === 'Tshirts');
    else if (activeTab === 'OverSized Tshirts') product_items = products.data.filter(p => p.category.name === 'OverSized Tshirts');
    else if (activeTab === 'Trousers') product_items = products.data.filter(p => p.category.name === 'Trousers');

    // Duplicate products for "All Collection" if less than 5
    if (activeTab === 'All Collection' && product_items.length > 0 && product_items.length < 5) {
      const times = Math.ceil(5 / product_items.length);
      display_items = Array(times).fill(product_items).flat().slice(0, 5);
    } else {
      display_items = product_items;
    }

    // Tabs navigation
    content = (
      <>
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
      </>
    );
  }

  return (
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

        {/* Render Swiper only if display_items has products */}
        {display_items.length > 0 && (
          <Swiper {...slider_setting} modules={[Scrollbar]} className="tp-category-slider-active-2 swiper-container mb-50">
            {display_items.map((prd) => (
              <SwiperSlide key={prd._id}>
                <div className="popular-product-slide">
                  <ProductItem product={prd} />
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-scrollbar tp-swiper-scrollbar tp-swiper-scrollbar-drag"></div>
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default ProductArea;
