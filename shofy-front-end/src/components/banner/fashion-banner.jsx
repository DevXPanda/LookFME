'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import { useGetBannersQuery } from '@/redux/features/bannerApi';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
  const { data, isLoading } = useGetBannersQuery();
  const banners = data?.data ?? [];

  const handleBannerClick = (redirectLink) => {
    if (redirectLink) router.push(redirectLink);
  };

  if (isLoading || banners.length === 0) {
    return null;
  }

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
          {banners.map((item) => (
            <SwiperSlide key={item._id}>
              <div
                className="tp-slider-item-2 banner-image-container banner-clickable"
                onClick={() => handleBannerClick(item.redirectLink)}
              >
                {/* Desktop Image */}
                <Image
                  src={item.image || '/assets/img/slider/2/1.jpg'}
                  alt={item.title || 'banner'}
                  fill
                  priority
                  sizes="100vw"
                  className="hidden md:block"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />

                {/* Mobile Image */}
                <Image
                  src={item.imageMobile || item.image || '/assets/img/slider/2/1.jpg'}
                  alt={item.title || 'banner'}
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
