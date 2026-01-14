'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Desktop images
const slider_img_1 = '/assets/img/slider/2/1.jpg';
const slider_img_2 = '/assets/img/slider/2/2.jpg';
const slider_img_3 = '/assets/img/slider/2/3.jpg';
const slider_img_4 = '/assets/img/slider/2/4.jpg';
const slider_img_5 = '/assets/img/slider/2/5.jpg';

// Mobile images
const mobile_img_1 = '/assets/img/slider/2/slider 1.jpeg';
const mobile_img_2 = '/assets/img/slider/2/slider-2.png';
const mobile_img_3 = '/assets/img/slider/2/slider-3.png';
const mobile_img_4 = '/assets/img/slider/2/slider 4.jpg';
const mobile_img_5 = '/assets/img/slider/2/slider 5.jpg';

const sliderData = [
  { id: 1, desktop: slider_img_1, mobile: mobile_img_1, category: "Men's" },
  { id: 2, desktop: slider_img_2, mobile: mobile_img_2, category: "Women's" },
  { id: 3, desktop: slider_img_3, mobile: mobile_img_3, category: "Baby" },
  { id: 4, desktop: slider_img_4, mobile: mobile_img_4, category: 'Bags' },
  { id: 5, desktop: slider_img_5, mobile: mobile_img_5, category: 'Cosmetic' },
];

const sliderSettings = {
  slidesPerView: 1,
  loop: true,
  effect: 'fade',
  speed: 1000,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.tp-slider-2-dot',
    clickable: true,
  },
};

export default function FashionBanner() {
  const router = useRouter();

  const handleBannerClick = (category) => {
    const slug = category
      .toLowerCase()
      .replace("&", "")
      .split(" ")
      .join("-");
    router.push(`/shop?category=${slug}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .tp-slider-area {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .tp-slider-active-2 {
          width: 100%;
          position: relative;
        }
        
        .tp-slider-active-2 .swiper-wrapper {
          width: 100%;
          display: flex;
        }
        
        .tp-slider-active-2 .swiper-slide {
          width: 100%;
          height: auto;
          flex-shrink: 0;
        }
        
        .tp-slider-item-2 {
          position: relative;
          width: 100%;
          overflow: hidden;
          display: block;
        }
        
        .banner-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: block;
        }
        
        .banner-image-container > span {
          position: absolute !important;
          inset: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        .banner-image-container img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
        }
        
        @media (max-width: 768px) {
          .tp-slider-item-2 {
            aspect-ratio: 4 / 5 !important;
            min-height: 0 !important;
          }
        }
        
        @media (min-width: 769px) {
          .tp-slider-item-2 {
            aspect-ratio: 3 / 1 !important;
            min-height: 0 !important;
          }
        }
      `}} />
      <section className="tp-slider-area">
        <Swiper
          {...sliderSettings}
          modules={[Pagination, EffectFade, Autoplay]}
          className="tp-slider-active-2"
        >
          {sliderData.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className="tp-slider-item-2 banner-image-container banner-clickable"
                onClick={() => handleBannerClick(item.category)}
              >
                {/* Desktop Image */}
                <Image
                  src={item.desktop}
                  alt="banner"
                  fill
                  priority
                  sizes="100vw"
                  className="hidden md:block"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />

                {/* Mobile Image */}
                <Image
                  src={item.mobile}
                  alt="banner"
                  fill
                  priority
                  sizes="100vw"
                  className="block md:hidden"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </SwiperSlide>
          ))}

          <div className="tp-slider-2-dot tp-swiper-dot" />
        </Swiper>
      </section>
    </>
  );
}
