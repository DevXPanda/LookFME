// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// // 🖼️ Desktop images
// import slider_img_1 from '@assets/img/slider/2/1.jpg';
// import slider_img_2 from '@assets/img/slider/2/2.jpg';
// import slider_img_3 from '@assets/img/slider/2/3.jpg';
// import slider_img_4 from '@assets/img/slider/2/4.jpg';
// import slider_img_5 from '@assets/img/slider/2/5.jpg';

// // 🖼️ Mobile images
// import mobile_img_1 from '@assets/img/slider/2/slider-1.png';
// import mobile_img_2 from '@assets/img/slider/2/slider-2.png';
// import mobile_img_3 from '@assets/img/slider/2/slider-3.png';
// // Files with spaces in names must use string paths
// const mobile_img_4 = '/assets/img/slider/2/slider 4.jpg';
// const mobile_img_5 = '/assets/img/slider/2/slider 5.jpg';

// // Slider data with category filters for shop grid
// // Banner 1: Men, Banner 2: Women, Banner 3: Junior, Banner 4: Accessories, Banner 5: Cosmetic
// const slider_data = [
//   { id: 1, imgDesktop: slider_img_1, imgMobile: mobile_img_1, category: 'Men' },
//   { id: 2, imgDesktop: slider_img_2, imgMobile: mobile_img_2, category: 'Women' },
//   { id: 3, imgDesktop: slider_img_3, imgMobile: mobile_img_3, category: 'Junior' },
//   { id: 4, imgDesktop: slider_img_4, imgMobile: mobile_img_4, category: 'Accessories' },
//   { id: 5, imgDesktop: slider_img_5, imgMobile: mobile_img_5, category: 'Cosmetic' },
// ];

// const slider_setting = {
//   slidesPerView: 1,
//   spaceBetween: 0,
//   effect: 'fade',
//   loop: true,
//   pagination: {
//     el: '.tp-slider-2-dot',
//     clickable: true,
//   },
//   autoplay: {
//     delay: 3500,
//     disableOnInteraction: false,
//   },
//   speed: 1000,
// };

// const FashionBanner = () => {
//   const [isMobile, setIsMobile] = useState(false);
//   const router = useRouter();

//   // ✅ Detect viewport size
//   useEffect(() => {
//     const checkViewport = () => setIsMobile(window.innerWidth <= 768);
//     checkViewport();
//     window.addEventListener('resize', checkViewport);
//     return () => window.removeEventListener('resize', checkViewport);
//   }, []);

//   // Handle banner click - navigate to shop grid with category filter
//   const handleBannerClick = (category) => {
//     const normalizedCategory = category
//       .toLowerCase()
//       .replace("&", "")
//       .split(" ")
//       .join("-");
//     router.push(`/shop?category=${normalizedCategory}`);
//   };

//   return (
//     <section className="tp-slider-area relative z-[1] overflow-hidden" style={{ minHeight: isMobile ? '400px' : '600px' }}>
//       <Swiper
//         {...slider_setting}
//         modules={[Pagination, EffectFade, Autoplay]}
//         className="tp-slider-active-2 swiper-container relative"
//         style={{ height: isMobile ? '400px' : '600px' }}
//       >
//         {slider_data.map((item) => (
//           <SwiperSlide key={item.id} style={{ height: isMobile ? '400px' : '600px' }}>
//             {/* Clickable banner - navigates to shop grid with category filter */}
//             <div
//               onClick={() => handleBannerClick(item.category)}
//               className="block w-full h-full relative cursor-pointer"
//             >
//               <div className="tp-slider-item-2 tp-slider-height-2 relative w-full h-full">
//                 <Image
//                   src={isMobile ? item.imgMobile : item.imgDesktop}
//                   alt={`slide-${item.id}`}
//                   fill
//                   className="object-cover"
//                   priority
//                   sizes="100vw"
//                 />
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}

//         {/* Pagination Dots */}
//         <div className="tp-swiper-dot tp-slider-2-dot absolute bottom-6 left-1/2 -translate-x-1/2 z-[50] flex justify-center"></div>
//       </Swiper>
//     </section>
//   );
// };

// export default FashionBanner;
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Desktop images - using absolute paths for Vercel compatibility
const slider_img_1 = '/assets/img/slider/2/1.jpg';
const slider_img_2 = '/assets/img/slider/2/2.jpg';
const slider_img_3 = '/assets/img/slider/2/3.jpg';
const slider_img_4 = '/assets/img/slider/2/4.jpg';
const slider_img_5 = '/assets/img/slider/2/5.jpg';

// Mobile images - using absolute paths for Vercel compatibility
const mobile_img_1 = '/assets/img/slider/2/slider 1.jpeg';
const mobile_img_2 = '/assets/img/slider/2/slider-2.png';
const mobile_img_3 = '/assets/img/slider/2/slider-3.png';
const mobile_img_4 = '/assets/img/slider/2/slider 4.jpg';
const mobile_img_5 = '/assets/img/slider/2/slider 5.jpg';

const slider_data = [
  { id: 1, imgDesktop: slider_img_1, imgMobile: mobile_img_1, category: 'Men' },
  { id: 2, imgDesktop: slider_img_2, imgMobile: mobile_img_2, category: 'Women' },
  { id: 3, imgDesktop: slider_img_3, imgMobile: mobile_img_3, category: 'Junior' },
  { id: 4, imgDesktop: slider_img_4, imgMobile: mobile_img_4, category: 'Accessories' },
  { id: 5, imgDesktop: slider_img_5, imgMobile: mobile_img_5, category: 'Cosmetic' },
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
  // Ensure proper initialization on Vercel
  observer: true,
  observeParents: true,
};

const FashionBanner = () => {
  const router = useRouter();

  const handleBannerClick = (category) => {
    const normalized = category.toLowerCase().replace('&', '').split(' ').join('-');
    router.push(`/shop?category=${normalized}`);
  };

  return (
    <section className="tp-slider-area" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
      <Swiper
        {...slider_setting}
        modules={[Pagination, EffectFade, Autoplay]}
        className="tp-slider-active-2"
        style={{ width: '100%', maxWidth: '100%', height: '100%' }}
      >
        {slider_data.map((item) => (
          <SwiperSlide key={item.id} style={{ width: '100%', maxWidth: '100%', height: '100%' }}>
            <div
              onClick={() => handleBannerClick(item.category)}
              className="tp-slider-item-2 banner-image-container cursor-pointer"
              style={{ width: '100%', maxWidth: '100%', height: '100%', position: 'relative' }}
            >
              {/* Desktop image */}
              <Image
                src={item.imgDesktop}
                alt={`banner-${item.id}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
                className="object-cover hidden md:block"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {/* Mobile image */}
              <Image
                src={item.imgMobile}
                alt={`banner-${item.id}`}
                fill
                priority
                sizes="(max-width: 425px) 100vw, (max-width: 768px) 100vw, 800px"
                className="object-cover block md:hidden"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </SwiperSlide>
        ))}

        <div className="tp-swiper-dot tp-slider-2-dot absolute bottom-6 left-1/2 -translate-x-1/2 z-[50]" />
      </Swiper>
    </section>
  );
};

export default FashionBanner;
