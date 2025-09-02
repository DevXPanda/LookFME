'use client';
// external
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
// internal
import { TextShapeLine } from "@/svg";
import ProductItem from './product-item';
import ErrorMsg from "@/components/common/error-msg";
import { useGetPopularProductByTypeQuery } from "@/redux/features/productApi";
import { HomeTwoPopularPrdLoader } from "@/components/loader";


// slider setting
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
    1200: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};

const PopularProducts = () => {
  const {data: products,isError,isLoading} = useGetPopularProductByTypeQuery("fashion");
  
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeTwoPopularPrdLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;

    content = (
      <Swiper
        {...slider_setting}
        modules={[Scrollbar]}
        className="tp-category-slider-active-2 swiper-container mb-50"
      >
        {product_items.map((prd) => (
          <SwiperSlide key={prd._id}>
            <div className="popular-product-slide">
              <ProductItem product={prd} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
  return (
    <>
      <section className="tp-category-area pb-95">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2">
                  Shop by Popular
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">
                  Popular on LookFame.
                </h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-category-slider-2 p-relative">
                {content}
                <div className="swiper-scrollbar tp-swiper-scrollbar tp-swiper-scrollbar-drag"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularProducts;
