'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 🖼️ Desktop images
import slider_img_1 from '@assets/img/slider/2/Winter_Baner_deskt_banner_web_22_sept_4eb878df25.jpg';
import slider_img_2 from '@assets/img/slider/2/Pyjama_banner_desktop_view_1_b250082960.jpg';
import slider_img_3 from '@assets/img/slider/2/korean_desktop_21_c341d1f338.jpg';
import slider_img_4 from '@assets/img/slider/2/FLANNEL_DESKTOP_min_25_OCT_5a7778a8da.jpg';

// 🖼️ Mobile images
import mobile_img_1 from '@assets/img/slider/2/slider 1.jpg';
import mobile_img_2 from '@assets/img/slider/2/slider 2.jpg';
import mobile_img_3 from '@assets/img/slider/2/slider 3.jpg';
import mobile_img_4 from '@assets/img/slider/2/slider 4.jpg';

// Slider data with desktop + mobile versions
const slider_data = [
  { id: 1, imgDesktop: slider_img_1, imgMobile: mobile_img_1, link: '/category/winter' },
  { id: 2, imgDesktop: slider_img_2, imgMobile: mobile_img_2, link: '/category/pyjamas' },
  { id: 3, imgDesktop: slider_img_3, imgMobile: mobile_img_3, link: '/category/korean' },
  { id: 4, imgDesktop: slider_img_4, imgMobile: mobile_img_4, link: '/category/flannel' },
];

const slider_setting = {
  slidesPerView: 1,
  spaceBetween: 0,
  effect: 'fade',
  loop: true,
  pagination: {
    el: '.tp-slider-2-dot',
    clickable: true,
  },
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  speed: 1000,
};

const FashionBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect viewport size
  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth <= 768);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  return (
    <section className="tp-slider-area relative z-[1] overflow-hidden">
      <Swiper
        {...slider_setting}
        modules={[Pagination, EffectFade, Autoplay]}
        className="tp-slider-active-2 swiper-container relative"
      >
        {slider_data.map((item) => (
          <SwiperSlide key={item.id}>
            {/* ✅ Clickable Full Image via Link */}
            <Link href={item.link} className="block w-full h-full relative">
              <div className="tp-slider-item-2 tp-slider-height-2 relative w-full h-[600px] md:h-[750px] flex items-center justify-center bg-gray-50">
                <Image
                  src={isMobile ? item.imgMobile : item.imgDesktop}
                  alt={`slide-${item.id}`}
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}

        {/* Pagination Dots */}
        <div className="tp-swiper-dot tp-slider-2-dot absolute bottom-6 left-1/2 -translate-x-1/2 z-[50] flex justify-center"></div>
      </Swiper>
    </section>
  );
};

export default FashionBanner;