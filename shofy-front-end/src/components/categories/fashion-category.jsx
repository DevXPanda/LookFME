// 'use client';
// import React, { useRef } from "react";
// import { useRouter } from "next/navigation";
// // internal
// import ErrorMsg from "../common/error-msg";
// import { ArrowRightLong, TextShapeLine, NextLongArr, PrevLongArr } from "@/svg";
// import { HomeTwoCateLoader } from "../loader";
// import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";

// const FashionCategory = () => {
//   const {
//     data: categories,
//     isLoading,
//     isError,
//   } = useGetProductTypeCategoryQuery("fashion");
//   const router = useRouter();
//   const scrollContainerRef = useRef(null);

//   // handle category route
//   const handleCategoryRoute = (title) => {
//     router.push(
//       `/shop?category=${title
//         .toLowerCase()
//         .replace("&", "")
//         .split(" ")
//         .join("-")}`
//     );
//   };

//   // handle scroll navigation
//   const handleScroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const scrollAmount = 300; // Scroll by 300px each time
      
//       if (direction === 'left') {
//         container.scrollLeft -= scrollAmount;
//       } else {
//         container.scrollLeft += scrollAmount;
//       }
//     }
//   };

//   // decide what to render
//   let content = null;

//   if (isLoading) {
//     content = <HomeTwoCateLoader loading={isLoading} />;
//   }
//   if (!isLoading && isError) {
//     content = <ErrorMsg msg="There was an error" />;
//   }
//   if (!isLoading && !isError && categories?.result?.length === 0) {
//     content = <ErrorMsg msg="No Category found!" />;
//   }
//   if (!isLoading && !isError && categories?.result?.length > 0) {
//     const category_items = categories.result;
//     content = category_items.map((item) => (
//       <div 
//         key={item._id} 
//         className="category-scroll-item"
//         style={{ 
//           flexShrink: 0,
//           width: '224px',
//           margin: '0 10px'
//         }}
//       >
//         <div 
//           className="tp-banner-item-2 p-relative z-index-1 grey-bg-2 mb-20 fix"
//           style={{
//             borderRadius: '8px',
//             overflow: 'hidden',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//             height: '100%',
//             backgroundColor: '#fff'
//           }}
//         >
//           <div
//             className="tp-banner-thumb-2 include-bg transition-3"
//             style={{ 
//               backgroundImage: `url(${item.img})`,
//               height: '200px',
//               backgroundSize: 'cover',
//               backgroundPosition: 'center',
//               borderRadius: '8px 8px 0 0'
//             }}
//           ></div>
//           <div style={{ padding: '15px' }}>
//             <h3 className="tp-banner-title-2" style={{ marginBottom: '15px' }}>
//             <a
//                 className="cursor-pointer text-sm font-medium text-center block text-dark"
//               onClick={() => handleCategoryRoute(item.parent)}
//                 style={{ fontSize: '16px', fontWeight: '500' }}
//             >
//               {item.parent}
//             </a>
//           </h3>
//             <div className="tp-banner-btn-2">
//             <a
//               onClick={() => handleCategoryRoute(item.parent)}
//               className="cursor-pointer tp-btn tp-btn-border tp-btn-border-sm text-xs px-3 py-2 font-medium"
//                 style={{
//                   backgroundColor: '#BE5985',
//                   color: 'white',
//                   border: '1px solid #BE5985',
//                   borderRadius: '4px',
//                   fontSize: '12px',
//                   fontWeight: '500',
//                   display: 'inline-block',
//                   textDecoration: 'none'
//                 }}
//             >
//               Shop Now <ArrowRightLong />
//             </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     ));
//   }
//   return (
//     <>
//       <section className="tp-category-area pb-95 pt-95">
//         <div className="container">
//      <div className="row">
//               <div className="col-xl-12">
//               <div className="tp-section-title-wrapper-2 text-center mb-50">
//                 <span className="tp-section-title-pre-2 mb-5 ">
//                     Shop by Categories
//                   <TextShapeLine />
//                   </span>
//                 <h3 className="tp-section-title-2">
//                   LookFame Edition
//                 </h3>
//               </div>
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-xl-12">
//               <div className="tp-category-slider-2 p-relative">
//                 {/* Left Navigation Arrow - Overlaid */}
//                 <button 
//                   className="tp-category-slider-button-prev-overlay"
//                   onClick={() => handleScroll('left')}
//                   style={{
//                     position: 'absolute',
//                     left: '10px',
//                     top: '130px', // Center on the category cards (260px height / 2)
//                     width: '50px',
//                     height: '50px',
//                     borderRadius: '50%',
//                     border: 'none',
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     color: '#BE5985',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     zIndex: 10,
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     e.target.style.transform = 'scale(1.1)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
//                     e.target.style.transform = 'scale(1)';
//                   }}
//                 >
//                   <PrevLongArr />
//                 </button>

//                 {/* Right Navigation Arrow - Overlaid */}
//                 <button 
//                   className="tp-category-slider-button-next-overlay"
//                   onClick={() => handleScroll('right')}
//                   style={{
//                     position: 'absolute',
//                     right: '10px',
//                     top: '130px', // Center on the category cards (260px height / 2)
//                     width: '50px',
//                     height: '50px',
//                     borderRadius: '50%',
//                     border: 'none',
//                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//                     color: '#BE5985',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     cursor: 'pointer',
//                     transition: 'all 0.3s ease',
//                     zIndex: 10,
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
//                     e.target.style.transform = 'scale(1.1)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
//                     e.target.style.transform = 'scale(1)';
//                   }}
//                 >
//                   <NextLongArr />
//                 </button>

//                 {/* Scrollable Categories Container */}
//                 <div 
//                   ref={scrollContainerRef}
//                   className="categories-scroll-container" 
//                   style={{
//                     overflowX: 'auto',
//                     overflowY: 'hidden',
//                     whiteSpace: 'nowrap',
//                     padding: '0 60px', // Add padding for arrow space
//                     scrollbarWidth: 'none', // Hide scrollbar for Firefox
//                     msOverflowStyle: 'none' // Hide scrollbar for IE/Edge
//                   }}
//                 >
//                   <div className="categories-scroll-wrapper" style={{
//                     display: 'inline-flex',
//                     gap: '20px',
//                     padding: '0 20px',
//                     minWidth: '100%'
//                   }}>
//                     {content}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Hide scrollbar for webkit browsers */}
//         <style jsx>{`
//           .categories-scroll-container::-webkit-scrollbar {
//             display: none;
//           }
//           .category-scroll-item:hover {
//             transform: scale(1.02);
//             transition: transform 0.3s ease;
//           }
//         `}</style>
//       </section>
//       {/* Highlight images row */}
        
//     </>
//   );
// };

// export default FashionCategory;


'use client';
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
// internal
import ErrorMsg from "../common/error-msg";
import { ArrowRightLong, TextShapeLine, NextLongArr, PrevLongArr } from "@/svg";
import { HomeTwoCateLoader } from "../loader";
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";

const FashionCategory = () => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useGetProductTypeCategoryQuery("fashion");
  const router = useRouter();
  const scrollContainerRef = useRef(null);

  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(
      `/shop?category=${title
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
  };

  // handle scroll navigation
  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 300; // Scroll by 300px each time
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    }
  };

  // decide what to render
  let content = null;
  if (isLoading) {
    content = <HomeTwoCateLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    content = category_items.map((item) => (
      <div
        key={item._id}
        className="category-scroll-item"
        style={{
          flexShrink: 0,
          width: '240px',
          height: '340px',
          margin: '0 8px',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          position: 'relative',
          backgroundImage: `url(${item.img})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: '100%',
            background: 'none',
            padding: '18px 12px 16px 12px',
            boxSizing: 'border-box',
            borderBottomLeftRadius: '18px',
            borderBottomRightRadius: '18px',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: '18px',
              color: '#222',
              margin: 0,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              background: 'none',
              display: 'block',
              padding: 0,
            }}
          >
            <a
              className="cursor-pointer"
              onClick={() => handleCategoryRoute(item.parent)}
              style={{
                textDecoration: 'none',
                color: '#222',
                background: 'none',
                padding: 0,
              }}
            >
              {item.parent}
            </a>
          </h3>
          <a
            className="tp-btn tp-btn-border"
            onClick={() => handleCategoryRoute(item.parent)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'auto',
              paddingLeft: '22px',
              paddingRight: '22px',
              marginTop: '10px',
            }}
          >
            Shop Now <span style={{marginLeft: 6}}><ArrowRightLong /></span>
          </a>
        </div>
      </div>
    ));
  }
  return (
    <>
      <section className="tp-category-area pb-95 pt-95">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2 mb-5 ">
                  Shop by Categories
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">LookFame Edition</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-category-slider-2 p-relative">
                {/* Left Navigation Arrow - Overlaid */}
                <button
                  className="tp-category-slider-button-prev-overlay"
                  onClick={() => handleScroll('left')}
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '130px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#BE5985',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <PrevLongArr />
                </button>

                {/* Right Navigation Arrow - Overlaid */}
                <button
                  className="tp-category-slider-button-next-overlay"
                  onClick={() => handleScroll('right')}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '130px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#BE5985',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <NextLongArr />
                </button>

                {/* Scrollable Categories Container */}
                <div
                  ref={scrollContainerRef}
                  className="categories-scroll-container"
                  style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    padding: '0 15px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div
                    className="categories-scroll-wrapper"
                    style={{
                      display: 'inline-flex',
                      gap: '12px',
                      padding: '0 12px',
                      minWidth: '100%',
                    }}
                  >
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style jsx>{`
          .categories-scroll-container::-webkit-scrollbar {
            display: none;
          }
          .category-scroll-item:hover {
            transform: scale(1.02);
            transition: transform 0.3s ease;
          }
        `}</style>
      </section>
    </>
  );
};

export default FashionCategory;
