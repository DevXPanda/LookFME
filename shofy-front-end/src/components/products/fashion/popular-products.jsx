'use client';
// external
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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
  navigation: {
    nextEl: ".tp-popular-slider-button-next",
    prevEl: ".tp-popular-slider-button-prev",
  },
  breakpoints: {
    1200: { slidesPerView: 5 },
    992: { slidesPerView: 4 },
    768: { slidesPerView: 3 },
    576: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  },
};

const PopularProducts = () => {
  const { data: products, isError, isLoading } = useGetPopularProductByTypeQuery("fashion");

  // decide what to render
  let content = null;
  if (isLoading) {
    content = <HomeTwoPopularPrdLoader loading={isLoading} />;
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
        modules={[Navigation]}
        className="tp-popular-slider-active swiper-container"
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
      <style jsx>{`
        /* WRAPPER */
        .tp-popular-slider-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        /* BUTTON COMMON STYLE */
        .tp-popular-slider-button-prev,
        .tp-popular-slider-button-next {
          position: absolute;
          top: 130px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background-color: rgba(255, 255, 255, 0.9);
          color: rgb(190, 89, 133);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.3s;
          z-index: 10;
          box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
        }

        .tp-popular-slider-button-prev {
          left: 20px;
        }

        .tp-popular-slider-button-next {
          right: 20px;
        }

        /* ICON */
        .tp-popular-slider-button-prev svg,
        .tp-popular-slider-button-next svg {
          width: 22px;
          height: auto;
          stroke: rgb(190, 89, 133);
        }

        /* HOVER EFFECT */
        .tp-popular-slider-button-prev:hover,
        .tp-popular-slider-button-next:hover {
          transform: scale(1.1);
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        }

        /* DISABLED STATE */
        .tp-popular-slider-button-prev.swiper-button-disabled,
        .tp-popular-slider-button-next.swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .tp-popular-slider-button-prev,
          .tp-popular-slider-button-next {
            width: 42px;
            height: 42px;
            top: 110px;
          }
        }

        @media (max-width: 576px) {
          .tp-popular-slider-button-prev,
          .tp-popular-slider-button-next {
            width: 38px;
            height: 38px;
            top: 100px;
          }
        }
      `}</style>

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
              <div className="tp-popular-slider-wrapper">
                {/* Left Navigation Button (Custom SVG) */}
                <button className="tp-popular-slider-button-prev">
                  <svg width="33" height="16" viewBox="0 0 33 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.97974 7.97534L31.9797 7.97534" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.02954 1L0.999912 7.99942L8.02954 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {content}

                {/* Right Navigation Button (Custom SVG) */}
                <button className="tp-popular-slider-button-next">
                  <svg width="33" height="16" viewBox="0 0 33 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.9795 7.97534L0.979492 7.97534" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24.9297 1L31.9593 7.99942L24.9297 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularProducts;