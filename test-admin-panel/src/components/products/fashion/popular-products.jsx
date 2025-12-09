'use client';

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Mousewheel } from "swiper/modules";
import { useGetPopularProductByTypeQuery } from "@/redux/features/productApi";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { HomeTwoPopularPrdLoader } from "@/components/loader";
import { TextShapeLine } from "@/svg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

// Swiper Settings
const slider_setting = {
  slidesPerView: 5,
  spaceBetween: 20,
  loop: false,
  grabCursor: true,
  simulateTouch: true,
  followFinger: true,
  resistance: true,
  resistanceRatio: 0.85,

  freeMode: {
    enabled: true,
    momentum: true,
    momentumRatio: 1.1,
  },

  mousewheel: {
    forceToAxis: true,
    invert: false,
    sensitivity: 0.7,
    releaseOnEdges: true,
  },

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
  const { data: products, isError, isLoading } =
    useGetPopularProductByTypeQuery("fashion");

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  let content = null;

  if (isLoading) content = <HomeTwoPopularPrdLoader loading={isLoading} />;
  if (!isLoading && isError) content = <ErrorMsg msg="There was an error" />;
  if (!isLoading && !isError && products?.data?.length === 0)
    content = <ErrorMsg msg="No Products found!" />;

  if (!isLoading && !isError && products?.data?.length > 0) {
    // Mobile grid view
    if (isMobile) {
      content = (
        <>
          <style>{`
            .tp-popular-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              padding: 0 10px;
              margin-top: 20px;
            }

            @media (max-width: 480px) {
              .tp-popular-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 14px;
              }
            }
          `}</style>

          <div className="tp-popular-grid">
            {products.data.map((prd) => (
              <div key={prd._id} className="tp-popular-item">
                <ProductItem product={prd} />
              </div>
            ))}
          </div>
        </>
      );
    } else {
      // Desktop Swiper view
      content = (
        <Swiper
          {...slider_setting}
          modules={[Navigation, FreeMode, Mousewheel]}
          className="tp-popular-slider-active swiper-container"
        >
          {products.data.map((prd) => (
            <SwiperSlide key={prd._id}>
              <div className="popular-product-slide">
                <ProductItem product={prd} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }
  }

  return (
    <>
      <style jsx>{`
        .tp-popular-slider-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          overflow: visible;
        }

        .tp-popular-slider-active .swiper-wrapper {
          cursor: grab;
        }
        .tp-popular-slider-active .swiper-wrapper:active {
          cursor: grabbing;
        }

        /* navigation buttons */
        .tp-popular-slider-button-prev,
        .tp-popular-slider-button-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          font-size: 24px;
          color: rgb(190, 89, 133);
        }

        .tp-popular-slider-button-prev:hover,
        .tp-popular-slider-button-next:hover {
          background-color: rgb(190, 89, 133);
          border-color: rgb(190, 89, 133);
          box-shadow: 0px 6px 16px rgba(190, 89, 133, 0.3);
          color: #ffffff;
        }

        .tp-popular-slider-button-prev {
          left: -25px;
        }
        .tp-popular-slider-button-next {
          right: -25px;
        }

        /* hide navigation in mobile */
        @media (max-width: 768px) {
          .tp-popular-slider-button-prev,
          .tp-popular-slider-button-next {
            display: none;
          }
        }
      `}</style>

      <section className="tp-category-area pb-95 mt-40">
        <div className="container">
          <div className="tp-section-title-wrapper-2 text-center mb-50">
            <span className="tp-section-title-pre-2">
              Shop by Popular
              <TextShapeLine />
            </span>
            <h3 className="tp-section-title-2">Popular on LookFame</h3>
          </div>

          <div className="tp-popular-slider-wrapper">
            {!isMobile && (
              <button className="tp-popular-slider-button-prev">←</button>
            )}
            {content}
            {!isMobile && (
              <button className="tp-popular-slider-button-next">→</button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default PopularProducts;