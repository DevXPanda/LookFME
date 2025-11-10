// 'use client';
// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, EffectFade, Navigation, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/effect-fade';

// // internal assets
// import slider_img_1 from '@assets/img/slider/2/slider-1.png';
// import slider_img_2 from '@assets/img/slider/2/slider-2.png';
// import slider_img_3 from '@assets/img/slider/2/slider-3.png';
// import slider_shape from '@assets/img/slider/2/shape/shape-1.png';
// import thumb_shape_1 from '@assets/img/slider/2/shape/shape-2.png';
// import thumb_shape_2 from '@assets/img/slider/2/shape/shape-3.png';

// // slider data
// const slider_data = [
//   { 
//     id: 1,
//     subtitle: 'New Arrivals 2025',
//     title: 'The Clothing Collection',
//     img: slider_img_1,
//     link: '/category/men',
//     btnText: "Shop Men's Collection"
//   },
//   { 
//     id: 2,
//     subtitle: 'Best Selling 2025',
//     title: 'Kids Collection',
//     img: slider_img_2,
//     link: '/category/kids',
//     btnText: "Shop Kids Collection"
//   },
//   { 
//     id: 3,
//     subtitle: 'Designs That Stand Out',
//     title: 'Amazing New Designs',
//     img: slider_img_3,
//     link: '/category/trending',
//     btnText: "Shop Trending Styles"
//   },
//   { 
//     id: 4,
//     subtitle: 'Trendy Styles 2025',
//     title: "Women's Fashion",
//     img: slider_img_1,
//     link: '/category/women',
//     btnText: "Shop Women's Fashion"
//   },
//   { 
//     id: 5,
//     subtitle: 'Top Picks 2025',
//     title: 'Accessories & Bags',
//     img: slider_img_2,
//     link: '/category/accessories',
//     btnText: "Shop Accessories"
//   },
//   { 
//     id: 6,
//     subtitle: 'Beauty & Skincare',
//     title: 'Cosmetics Collection',
//     img: slider_img_3,
//     link: '/category/cosmetics',
//     btnText: "Shop Cosmetics"
//   },
// ];

// // swiper settings
// const slider_setting = {
//   slidesPerView: 1,
//   spaceBetween: 30,
//   effect: 'fade',
//   loop: true,
//   navigation: {
//     nextEl: ".tp-slider-2-button-next",
//     prevEl: ".tp-slider-2-button-prev",
//   },
//   pagination: {
//     el: ".tp-slider-2-dot",
//     clickable: true,
//   },
//   autoplay: {
//     delay: 3000,
//     disableOnInteraction: false,
//   },
//   speed: 1000,
// };

// const FashionBanner = () => {
//   return (
//     <section className="tp-slider-area relative z-[1]">
//       <Swiper
//         {...slider_setting}
//         modules={[Pagination, Navigation, EffectFade, Autoplay]}
//         className="tp-slider-active-2 swiper-container relative"
//       >
//         {slider_data.map((item) => (
//           <SwiperSlide key={item.id}>
//             <div className="tp-slider-item-2 tp-slider-height-2 relative grey-bg-5 flex items-end">
//               <div className="tp-slider-2-shape">
//                 <Image className="tp-slider-2-shape-1" src={slider_shape} alt="slider_shape" />
//               </div>

//               <div className="container">
//                 <div className="row align-items-center">
//                   <div className="col-xl-6 col-lg-6 col-md-6">
//                     <div className="tp-slider-content-2">
//                       <span>{item.subtitle}</span>
//                       <h3 className="tp-slider-title-2">{item.title}</h3>
//                       <div className="tp-slider-btn-2">
//                         {/* ✅ Only one Link, not nested */}
//                         <Link href={item.link} className="tp-btn tp-btn-border">
//                           {item.btnText}
//                         </Link>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-xl-6 col-lg-6 col-md-6">
//                     <Link href={item.link}>
//                       <div className="tp-slider-thumb-2-wrapper relative cursor-pointer">
//                         <div className="tp-slider-thumb-2-shape">
//                           <Image className="tp-slider-thumb-2-shape-1" src={thumb_shape_1} alt="shape" />
//                           <Image className="tp-slider-thumb-2-shape-2" src={thumb_shape_2} alt="shape" />
//                         </div>
//                         <div className="tp-slider-thumb-2 text-end">
//                           <span className="tp-slider-thumb-2-gradient"></span>
//                           <Image src={item.img} alt={`slide-${item.id}`} priority />
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}

//         {/* dots centered bottom */}
//         <div className="tp-swiper-dot tp-slider-2-dot absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center"></div>
//       </Swiper>
//     </section>
//   );
// };

// export default FashionBanner;




'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// internal assets
// import slider_img_1 from '/assets/img/slider/2/Winter_Baner_deskt_banner_web_22_sept_4eb878df25.jpg';
// import slider_img_2 from '@assets/img/slider/2/Pyjama_banner_desktop_view_1_b250082960.jpg';
// import slider_img_3 from '@assets/img/slider/2/korean_desktop_21_c341d1f338.jpg';
// import slider_img_4 from '@assets/img/slider/2/FLANNEL_DESKTOP_min_25_OCT_5a7778a8da.jpg';

import slider_img_1 from '@assets/img/slider/2/Winter_Baner_deskt_banner_web_22_sept_4eb878df25.jpeg';
import slider_img_2 from '@assets/img/slider/2/Pyjama_banner_desktop_view_1_b250082960.jpeg';
import slider_img_3 from '@assets/img/slider/2/korean_desktop_21_c341d1f338.jpeg';
import slider_img_4 from '@assets/img/slider/2/FLANNEL_DESKTOP_min_25_OCT_5a7778a8da.jpeg';

// slider data with links
const slider_data = [
  { id: 1, img: slider_img_1, link: '/category/winter' },
  { id: 2, img: slider_img_2, link: '/category/pyjamas' },
  { id: 3, img: slider_img_3, link: '/category/korean' },
  { id: 4, img: slider_img_4, link: '/category/flannel' },
  { id: 5, img: slider_img_3, link: '/category/trending' },
  { id: 6, img: slider_img_3, link: '/category/men' },
];

// Swiper settings
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
                  src={item.img}
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
