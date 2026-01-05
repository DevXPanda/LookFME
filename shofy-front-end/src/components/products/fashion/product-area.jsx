'use client';
import React, { useState, useMemo } from 'react';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { useGetProductTypeCategoryQuery } from '@/redux/features/categoryApi';
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel } from "swiper/modules";
import { TextShapeLine } from '@/svg';
import ProductItem from './product-item';
import { HomeTwoPrdLoader } from '@/components/loader';
import 'swiper/css';
import 'swiper/css/scrollbar';

// Normalize category/subcategory names for consistent comparison (handles case, hyphens, spaces, & symbols)
// Removes all spaces and hyphens to match variations like "T-shirt" vs "Tshirt" vs "T Shirt"
const normalizeCategoryName = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[-\s]+/g, '')  // Remove all hyphens and spaces
    .trim();
};

const ProductArea = () => {
  // Fetch categories from backend
  const { data: categoriesData } = useGetProductTypeCategoryQuery('fashion');
  const { data: products, isError, isLoading } = useGetProductTypeQuery({ type: 'fashion' });

  // Build tabs dynamically from backend categories: "All Collection" + category names
  const tabs = useMemo(() => {
    const categoryTabs = ["All Collection"];
    if (categoriesData?.result?.length > 0) {
      categoriesData.result.forEach(cat => {
        if (cat.parent && !categoryTabs.includes(cat.parent)) {
          categoryTabs.push(cat.parent);
        }
      });
    }
    return categoryTabs;
  }, [categoriesData]);

  const [activeTab, setActiveTab] = useState(tabs[0] || "All Collection");

  const handleActiveTab = (tab) => setActiveTab(tab);

  // Slider settings with horizontal mouse wheel support
  const slider_setting = {
    slidesPerView: 5,
    spaceBetween: 20,
    loop: false,
    centeredSlides: false,
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
      releaseOnEdges: false,
    },
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
      0: { slidesPerView: 2 },
    },
  };

  // Decide what to render
  let content = null;
  let display_items = [];

  if (isLoading) content = <HomeTwoPrdLoader loading={isLoading} />;
  else if (!isLoading && isError) content = <ErrorMsg msg="There was an error" />;
  else if (!isLoading && !isError && products?.data?.length === 0)
    content = <ErrorMsg msg="No Products found!" />;
  else if (!isLoading && !isError && products?.data?.length > 0) {
    let product_items = products.data;

    // Filter products based on active tab using backend category data (with normalized comparison)
    if (activeTab !== 'All Collection') {
      // Normalize filter value and all product category fields for consistent matching
      const normalizedFilterCategory = normalizeCategoryName(activeTab);
      product_items = products.data.filter(p => {
        const normalizedProductCategory = normalizeCategoryName(p.category?.name);
        const normalizedProductParent = normalizeCategoryName(p.parent);
        const normalizedProductChildren = normalizeCategoryName(p.children);
        return normalizedProductCategory === normalizedFilterCategory || 
               normalizedProductParent === normalizedFilterCategory ||
               normalizedProductChildren === normalizedFilterCategory;
      });
    }

    // Duplicate products for "All Collection" if less than 5
    if (activeTab === 'All Collection' && product_items.length > 0 && product_items.length < 5) {
      const times = Math.ceil(5 / product_items.length);
      display_items = Array(times).fill(product_items).flat().slice(0, 5);
    } else {
      display_items = product_items;
    }

    // Calculate product count for each tab
    const getProductCount = (tabName) => {
      if (tabName === 'All Collection') {
        return products.data.length;
      }
      return products.data.filter(p => p.category?.name === tabName).length;
    };

    // Tabs navigation
    content = (
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
                    <span className="tp-product-tab-tooltip">{getProductCount(tab)}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="tp-product-area pb-50 bg-white">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 text-center mb-30">
              <span className="tp-section-title-pre-2 pt-40">
                All Product Shop
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Customer Favorite Style Product</h3>
            </div>
          </div>
        </div>

        {content}

        {/* Swiper only if products exist */}
        {display_items.length > 0 && (
          <>
            <style>{`
              /* Adjust slides on mobile for proper spacing */
              @media (max-width: 768px) {
                .popular-product-slide {
                  padding: 0 6px;
                }
                .tp-category-slider-active-2 {
                  padding: 0 4px;
                }
              }
            `}</style>

            <Swiper
              {...slider_setting}
              modules={[Scrollbar, Mousewheel]}
              className="tp-category-slider-active-2 swiper-container mb-50"
            >
              {display_items.map((prd) => (
                <SwiperSlide key={prd._id}>
                  <div className="popular-product-slide">
                    <ProductItem product={prd} />
                  </div>
                </SwiperSlide>
              ))}
              <div className="swiper-scrollbar tp-swiper-scrollbar tp-swiper-scrollbar-drag"></div>
            </Swiper>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductArea;