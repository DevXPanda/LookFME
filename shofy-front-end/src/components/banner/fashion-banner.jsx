// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, EffectFade, Autoplay } from 'swiper/modules';

// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// // Desktop images (3:1 – 1920x640)
// const slider_img_1 = '/assets/img/slider/2/1.jpg';
// const slider_img_2 = '/assets/img/slider/2/2.jpg';
// const slider_img_3 = '/assets/img/slider/2/3.jpg';
// const slider_img_4 = '/assets/img/slider/2/4.jpg';
// const slider_img_5 = '/assets/img/slider/2/5.jpg';

// // Mobile images
// const mobile_img_1 = '/assets/img/slider/2/slider 1.jpeg';
// const mobile_img_2 = '/assets/img/slider/2/slider-2.png';
// const mobile_img_3 = '/assets/img/slider/2/slider-3.png';
// const mobile_img_4 = '/assets/img/slider/2/slider 4.jpg';
// const mobile_img_5 = '/assets/img/slider/2/slider 5.jpg';

// const sliderData = [
//   {
//     id: 1,
//     title: "MEN'S WEAR",
//     // subtitle: 'ELEVATE YOUR STYLE',
//     desktop: slider_img_1,
//     mobile: mobile_img_1,
//     category: 'Men',
//   },
//   {
//     id: 2,
//     title: "WOMEN'S WEAR",
//     // subtitle: 'DISCOVER TIMELESS ELEGANCE',
//     desktop: slider_img_2,
//     mobile: mobile_img_2,
//     category: 'Women',
//   },
//   {
//     id: 3,
//     title: "JUNIORS' WEAR",
//     // subtitle: 'ADVENTURE AWAITS',
//     desktop: slider_img_3,
//     mobile: mobile_img_3,
//     category: 'Junior',
//   },
//   {
//     id: 4,
//     title: 'ACCESSORIES',
//     // subtitle: 'COMPLETE YOUR LOOK',
//     desktop: slider_img_4,
//     mobile: mobile_img_4,
//     category: 'Accessories',
//   },
//   {
//     id: 5,
//     title: 'BEAUTY & COSMETIC',
//     // subtitle: 'DISCOVER YOUR PERFECT LOOK',
//     desktop: slider_img_5,
//     mobile: mobile_img_5,
//     category: 'Cosmetic',
//   },
// ];

// const sliderSettings = {
//   slidesPerView: 1,
//   loop: true,
//   effect: 'fade',
//   speed: 1000,
//   autoplay: {
//     delay: 3500,
//     disableOnInteraction: false,
//   },
//   pagination: {
//     el: '.tp-slider-2-dot',
//     clickable: true,
//   },
//   observer: true,
//   observeParents: true,
// };

// export default function FashionBanner() {
//   const router = useRouter();

//   const handleClick = (category) => {
//     const slug = category.toLowerCase().replace('&', '').replace(/\s+/g, '-');
//     router.push(`/shop?category=${slug}`);
//   };

//   return (
//     <section className="tp-slider-area">
//       <Swiper
//         {...sliderSettings}
//         modules={[Pagination, EffectFade, Autoplay]}
//         className="tp-slider-active-2"
//       >
//         {sliderData.map((item) => (
//           <SwiperSlide key={item.id}>
//             <div className="tp-slider-item-2 banner-image-container">
//               {/* Desktop Image */}
//               <Image
//                 src={item.desktop}
//                 alt={item.title}
//                 fill
//                 priority
//                 sizes="(max-width: 768px) 0vw, 100vw"
//                 className="hidden md:block"
//               />

//               {/* Mobile Image */}
//               <Image
//                 src={item.mobile}
//                 alt={item.title}
//                 fill
//                 priority
//                 sizes="100vw"
//                 className="block md:hidden"
//               />

//               {/* TEXT OVERLAY – FIXED & CENTERED */}
//               <div className="tp-slider-content-2">
//                 <div className="tp-slider-content-inner">
//                   <h1>{item.title}</h1>
//                   <p>{item.subtitle}</p>
//                   <button onClick={() => handleClick(item.category)}>
//                     SHOP NOW
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}

//         <div className="tp-slider-2-dot tp-swiper-dot" />
//       </Swiper>
//     </section>
//   );
// }

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
  { id: 5, desktop: slider_img_5, mobile: mobile_img_5, category: 'Discover Skincare' },
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
                sizes="(max-width: 768px) 0vw, 100vw"
                className="hidden md:block"
              />

              {/* Mobile Image */}
              <Image
                src={item.mobile}
                alt="banner"
                fill
                priority
                sizes="100vw"
                className="block md:hidden"
              />
            </div>
          </SwiperSlide>
        ))}

        <div className="tp-slider-2-dot tp-swiper-dot" />
      </Swiper>
    </section>
  );
}
