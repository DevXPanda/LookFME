'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rating } from 'react-simple-star-rating';

import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { TextShapeLine } from '@/svg';
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoFeaturedPrdLoader } from '@/components/loader';
import { getProductPrice } from '@/utils/price-utils';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const WeeksFeatured = () => {
  const { data, isLoading, isError } =
    useGetProductTypeQuery({ type: 'fashion', query: 'designer_embroidery=true' });



  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slider_setting = {
    slidesPerView: 4,
    spaceBetween: 24,
    loop: false,
    mousewheel: {
      forceToAxis: true,
      sensitivity: 1,
    },
    navigation: {
      nextEl: ".featured-next",
      prevEl: ".featured-prev",
    },
    breakpoints: {
      1200: { slidesPerView: 4 },
      992: { slidesPerView: 3 },
      768: { slidesPerView: 2 },
      576: { slidesPerView: 2 },
      0: { slidesPerView: 1 },
    },
  };

  if (isLoading) return <HomeTwoFeaturedPrdLoader loading />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;
  if (!isLoading && !isError && data?.data?.length === 0) return <ErrorMsg msg="No Products found!" />;

  return (
    <section className="featured-area pb-50 bg-white">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-50">
          <span className="tp-section-title-pre-2 pt-40">
            Shop by Featured <TextShapeLine />
          </span>
          <h3 className="tp-section-title-2">Designer Embroidery T-Shirts</h3>
        </div>

        <div className="featured-wrapper">
          <style>{`
            .featured-wrapper {
              position: relative;
              width: 100%;
            }
            .featured-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              padding: 0 10px;
            }
            .featured-prev,
            .featured-next {
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
            .featured-prev:hover,
            .featured-next:hover {
              background-color: rgb(190, 89, 133);
              border-color: rgb(190, 89, 133);
              box-shadow: 0px 6px 16px rgba(190, 89, 133, 0.3);
              color: #ffffff;
            }
            .featured-prev { left: -25px; }
            .featured-next { right: -25px; }

            @media (max-width: 768px) {
              .featured-prev,
              .featured-next {
                display: none;
              }
            }
            @media (max-width: 480px) {
              .featured-grid {
                gap: 16px;
              }
            }
          `}</style>

          {isMobile ? (
            <div className="featured-grid mb-50">
              {data?.data?.map((prd, index) => (
                <div key={`${prd._id}-${index}`} className="featured-item">
                  <ProductItem product={prd} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-relative">
              <button className="featured-prev">←</button>
              <Swiper
                {...slider_setting}
                modules={[Navigation, Mousewheel]}
                className="featured-slider-active swiper-container mb-50"
              >
                {data?.data?.map((prd, index) => (
                  <SwiperSlide key={`${prd._id}-${index}`}>
                    <div className="h-full px-2">
                      <ProductItem product={prd} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="featured-next">→</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WeeksFeatured;
