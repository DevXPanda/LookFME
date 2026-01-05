// 'use client';
// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
// import { Rating } from 'react-simple-star-rating';
// import Link from 'next/link';
// // internal
// import { useGetProductTypeQuery } from '@/redux/features/productApi';
// import { ArrowRightLong, NextLongArr, PrevLongArr, TextShapeLine } from '@/svg';
// import ErrorMsg from '@/components/common/error-msg';
// import { HomeTwoFeaturedPrdLoader } from '@/components/loader';

// // slider setting 
// const slider_setting = {
//   slidesPerView: 3,
//   spaceBetween: 12,
//   navigation: {
//     nextEl: ".tp-featured-slider-button-next",
//     prevEl: ".tp-featured-slider-button-prev",
//   },
//   breakpoints: {
//     '1200': {
//       slidesPerView: 3,
//     },
//     '992': {
//       slidesPerView: 3,
//     },
//     '768': {
//       slidesPerView: 2,
//     },
//     '576': {
//       slidesPerView: 1,
//     },
//     '0': {
//       slidesPerView: 1,
//     },
//   }
// }

// const WeeksFeatured = () => {
//   const { data: products, isError, isLoading } =
//     useGetProductTypeQuery({ type: 'fashion', query: `featured=true` });
//   // decide what to render
//   let content = null;

//   if (isLoading) {
//     content = (
//       <HomeTwoFeaturedPrdLoader loading={isLoading} />
//     );
//   }
//   if (!isLoading && isError) {
//     content = <ErrorMsg msg="There was an error" />;
//   }
//   if (!isLoading && !isError && products?.data?.length === 0) {
//     content = <ErrorMsg msg="No Products found!" />;
//   }
//   if (!isLoading && !isError && products?.data?.length > 0) {
//     const product_items = products.data;
//     content = (
//       <Swiper {...slider_setting} modules={[Navigation]} className="tp-featured-slider-active swiper-container">
//         {product_items.map((item) => {
//           const { _id, img, title, price, discount, reviews } = item || {};
//           return (
//             <SwiperSlide key={item._id} className="tp-featured-item white-bg p-relative z-index-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '24px 12px' }}>
//               <div className="tp-featured-thumb include-bg" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-background="assets/img/product/slider/product-slider-1.jpg"></div>
//               <div className="tp-featured-content" style={{ padding: 0 }}>
//                 <h3 className="tp-featured-title">
//                   <Link href={`/product-details/${_id}`}>{title}</Link>
//                 </h3>
//                 <div className="tp-featured-price-wrapper">
//                   <span className="tp-featured-price new-price">₹{price}</span>
//                 </div>
//                 <div className="tp-product-rating-icon tp-product-rating-icon-2">
//                   <Rating allowFraction size={16} initialValue={reviews && reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0} readonly={true} />
//                 </div>
//                 <div className="tp-featured-btn">
//                   <Link href={`/product-details/${_id}`} className="tp-btn tp-btn-border tp-btn-border-sm">Shop Now
//                     {" "}<ArrowRightLong />
//                   </Link>
//                 </div>
//               </div>
//             </SwiperSlide>
//           )
//         })}
//       </Swiper>
//     )
//   }
//   return (
//     <section className="tp-featured-slider-area grey-bg-6 fix pt-95 pb-120">
//       <div className="container-fluid" style={{ paddingLeft: 0 }}>
//         <div className="row gx-0">
//           <div className="col-xl-12">
//             <div className="tp-section-title-wrapper-2 mb-50 text-center">
//               <span className="tp-section-title-pre-2">
//                 Shop by Featured
//                 <TextShapeLine />
//               </span>
//               <h3 className="tp-section-title-2 text-center">This {"Week's"} Featured</h3>
//             </div>
//           </div>
//         </div>
//         <div className="row gx-0">
//           <div className="col-xl-12">
//             <div className="tp-featured-slider" style={{ paddingLeft: 24, paddingRight: 0 }}>
//               {content}
//               <div className="tp-featured-slider-arrow mt-45" style={{ paddingLeft: 24 }}>
//                 <button className="tp-featured-slider-button-prev">
//                   <PrevLongArr />
//                 </button>
//                 <button className="tp-featured-slider-button-next">
//                   <NextLongArr />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WeeksFeatured;


'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Rating } from 'react-simple-star-rating';

import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { PrevLongArr, NextLongArr, ArrowRightLong, TextShapeLine } from '@/svg';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoFeaturedPrdLoader } from '@/components/loader';

const WeeksFeatured = () => {
  const { data, isLoading, isError } =
    useGetProductTypeQuery({ type: 'fashion', query: 'featured=true' });

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (!isDragging && hasMoved) {
      const timeout = setTimeout(() => setHasMoved(false), 120);
      return () => clearTimeout(timeout);
    }
  }, [isDragging, hasMoved]);

  // Handle button scroll
  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    // Calculate scroll amount based on card width + gap
    const containerWidth = scrollRef.current.offsetWidth;
    const cardWidth = containerWidth / 2 - 12; // Account for gap
    const scrollAmount = cardWidth + 24; // Card width + gap
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Drag handlers (same as Super Saving Combos)
  const beginDrag = (clientX, currentScroll) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(currentScroll);
    setHasMoved(false);
  };

  const dragMove = (clientX) => {
    if (!isDragging || !scrollRef.current) return;
    const delta = clientX - startX;
    if (Math.abs(delta) > 2 && !hasMoved) {
      setHasMoved(true);
    }
    const walk = delta * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  // Handle wheel event for mouse wheel scrolling
  const handleWheel = (e) => {
    if (!scrollRef.current) return;
    // Convert vertical wheel scrolling to horizontal
    if (e.deltaY !== 0) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  if (isLoading) return <HomeTwoFeaturedPrdLoader loading />;
  if (isError) return <ErrorMsg msg="Something went wrong" />;

  return (
    <section className="featured-area">
      <div className="container-fluid">

        {/* Heading */}
        <div className="text-center mb-50">
          <span className="tp-section-title-pre-2">
            Shop by Featured <TextShapeLine />
          </span>
          <h3 className="tp-section-title-2">This Week’s Featured</h3>
        </div>

        <div className="featured-wrapper">
          <div className="featured-scroll-container-wrapper p-relative">
            {/* Scroll Buttons */}
            <button
              className="featured-prev"
              onClick={() => handleScroll("left")}
            >
              <PrevLongArr />
            </button>
            <button
              className="featured-next"
              onClick={() => handleScroll("right")}
            >
              <NextLongArr />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              className="featured-scroll-container"
              onMouseDown={(e) =>
                beginDrag(e.clientX, scrollRef.current.scrollLeft)
              }
              onMouseMove={(e) => {
                if (isDragging) {
                  e.preventDefault();
                  dragMove(e.clientX);
                }
              }}
              onMouseUp={stopDragging}
              onMouseLeave={stopDragging}
              onTouchStart={(e) =>
                beginDrag(e.touches[0].clientX, scrollRef.current.scrollLeft)
              }
              onTouchMove={(e) => {
                dragMove(e.touches[0].clientX);
              }}
              onTouchEnd={stopDragging}
              onTouchCancel={stopDragging}
              onWheel={handleWheel}
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                whiteSpace: "nowrap",
                cursor: isDragging ? "grabbing" : "grab",
                padding: "0 20px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  gap: "24px",
                  padding: "0 12px",
                  minWidth: "100%",
                }}
              >
                {data?.data?.map((item) => (
                  <div
                    key={item._id}
                    className="featured-card"
                    style={{
                      flexShrink: 0,
                      width: "calc((100% - 48px) / 2)",
                      minWidth: "calc((100% - 48px) / 2)",
                      maxWidth: "calc((100% - 48px) / 2)",
                    }}
                  >
                    {/* IMAGE */}
                    <div className="featured-image">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        priority
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="featured-content">
                      <h3>{item.title}</h3>
                      <span className="price">₹{item.price}</span>

                      <Rating
                        allowFraction
                        size={16}
                        readonly
                        initialValue={
                          item.reviews?.length
                            ? item.reviews.reduce((a, b) => a + b.rating, 0) /
                            item.reviews.length
                            : 0
                        }
                      />

                      <Link
                        href={`/product-details/${item._id}`}
                        className="tp-btn tp-btn-border"
                      >
                        Shop Now <ArrowRightLong />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .featured-area {
          background: #f4f5f7;
          padding: 80px 0;
        }

        .featured-wrapper {
          position: relative;
          padding: 0 80px;
        }

        .featured-scroll-container-wrapper {
          position: relative;
        }

        .featured-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .featured-card {
          background: #fff;
          display: flex;
          align-items: center;
          gap: 32px;
          padding: 40px;
          height: 360px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .featured-image {
          position: relative;
          width: 55%;
          height: 100%;
        }

        .featured-image :global(img) {
          object-fit: contain;
        }

        .featured-content {
          width: 45%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-sizing: border-box;
        }

        .featured-content h3 {
          font-size: 22px;
          margin-bottom: 8px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }

        .featured-content :global(.tp-btn) {
          margin-top: auto;
          align-self: flex-start;
        }

        .featured-prev,
        .featured-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 10px 25px rgba(0,0,0,.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          border: none;
          transition: all 0.3s ease;
        }

        .featured-prev:hover,
        .featured-next:hover {
          transform: translateY(-50%) scale(1.1);
          background: rgba(255, 255, 255, 1);
        }

        .featured-prev { left: 16px; }
        .featured-next { right: 16px; }

        @media (max-width: 1199px) {
          .featured-wrapper {
            padding: 0 60px;
          }
        }

        @media (max-width: 991px) {
          .featured-wrapper {
            padding: 0 40px;
          }
          .featured-card {
            width: calc((100% - 24px) / 2) !important;
            min-width: calc((100% - 24px) / 2) !important;
            max-width: calc((100% - 24px) / 2) !important;
            padding: 32px;
            height: 340px;
          }
        }

        @media (max-width: 767px) {
          .featured-wrapper {
            padding: 0 20px;
          }
          .featured-card {
            flex-direction: column;
            height: auto;
            width: 300px !important;
            min-width: 300px !important;
            max-width: 300px !important;
            padding: 24px;
          }
          .featured-image,
          .featured-content {
            width: 100%;
          }
          .featured-image {
            height: 240px;
          }
          .featured-content {
            height: auto;
          }
          .featured-prev,
          .featured-next {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default WeeksFeatured;
