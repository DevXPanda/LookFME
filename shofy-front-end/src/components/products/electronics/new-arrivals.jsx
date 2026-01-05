'use client';
import React, { useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
// internal
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { useGetProductTypeCategoryQuery } from '@/redux/features/categoryApi';
import { NextArr, PrevArr, ShapeLine } from '@/svg';
import ErrorMsg from '@/components/common/error-msg';
import ProductItem from './product-item';
import HomeNewArrivalPrdLoader from '@/components/loader/home/home-newArrival-prd-loader';

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

// slider setting with horizontal mouse wheel support
const slider_setting = {
    slidesPerView: 4,
		spaceBetween: 30,
		mousewheel: {
			forceToAxis: true,
			sensitivity: 1,
			releaseOnEdges: false,
		},
		pagination: {
			el: ".tp-arrival-slider-dot",
			clickable: true,
		},
		navigation: {
			nextEl: ".tp-arrival-slider-button-next",
			prevEl: ".tp-arrival-slider-button-prev",
		},
		breakpoints: {
			'1200': {
				slidesPerView: 4,
			},
			'992': {
				slidesPerView: 3,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		}
}

const NewArrivals = () => {
  // Fetch categories from backend
  const { data: categoriesData } = useGetProductTypeCategoryQuery('electronics');
  const { data: products, isError, isLoading } = useGetProductTypeQuery({type:'electronics',query:'new=true'});
  
  // Build tabs dynamically from backend categories: "All" + category names
  const tabs = useMemo(() => {
    const categoryTabs = ["All"];
    if (categoriesData?.result?.length > 0) {
      categoriesData.result.forEach(cat => {
        if (cat.parent && !categoryTabs.includes(cat.parent)) {
          categoryTabs.push(cat.parent);
        }
      });
    }
    return categoryTabs;
  }, [categoriesData]);

  const [activeTab, setActiveTab] = useState(tabs[0] || "All");

  const handleActiveTab = (tab) => setActiveTab(tab);

  // Filter products based on selected category (with normalized comparison)
  const filteredProducts = useMemo(() => {
    if (!products?.data) return [];
    if (activeTab === 'All') return products.data;
    // Normalize filter value and all product category fields for consistent matching
    const normalizedFilterCategory = normalizeCategoryName(activeTab);
    return products.data.filter(p => {
      const normalizedProductCategory = normalizeCategoryName(p.category?.name);
      const normalizedProductParent = normalizeCategoryName(p.parent);
      const normalizedProductChildren = normalizeCategoryName(p.children);
      return normalizedProductCategory === normalizedFilterCategory || 
             normalizedProductParent === normalizedFilterCategory ||
             normalizedProductChildren === normalizedFilterCategory;
    });
  }, [products?.data, activeTab]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeNewArrivalPrdLoader loading={isLoading}/>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && filteredProducts.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && filteredProducts.length > 0) {
    content = (
      <>
        {/* Category filter tabs */}
        {tabs.length > 1 && (
          <div className="row mb-30">
            <div className="col-xl-12">
              <div className="tp-product-tab-2 tp-tab text-center">
                <nav>
                  <div className="nav nav-tabs justify-content-center">
                    {tabs.map((tab, i) => (
                      <button
                        key={i}
                        onClick={() => handleActiveTab(tab)}
                        className={`nav-link text-capitalize ${activeTab === tab ? "active" : ""}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}
        <Swiper {...slider_setting} modules={[Navigation, Pagination, Mousewheel]} className="tp-product-arrival-active swiper-container">
          {filteredProducts.map((item) => (
            <SwiperSlide key={item._id}>
              <ProductItem product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  }
  return (
    <>
      <section className="tp-product-arrival-area pb-55">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xl-5 col-sm-6">
              <div className="tp-section-title-wrapper mb-40">
                <h3 className="tp-section-title">New Arrivals
                  <ShapeLine />
                </h3>
              </div>
            </div>
            <div className="col-xl-7 col-sm-6">
              <div className="tp-product-arrival-more-wrapper d-flex justify-content-end">
                <div className="tp-product-arrival-arrow tp-swiper-arrow mb-40 text-end tp-product-arrival-border">
                  <button type="button" className="tp-arrival-slider-button-prev">
                    <PrevArr />
                  </button>
                   {" "}
                  <button type="button" className="tp-arrival-slider-button-next">
                    <NextArr />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-product-arrival-slider fix">
                {content}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewArrivals;