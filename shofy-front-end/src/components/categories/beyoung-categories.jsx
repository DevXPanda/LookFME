// "use client";
// import React, { useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { TextShapeLine } from "@/svg";

// const BeyoungCategories = () => {
//   const router = useRouter();
//   const scrollRef = useRef(null);

//   // Enable mouse drag scrolling
//   //  useEffect(() => {
//   //   const el = scrollRef.current;
//   //   if (!el) return;

//   //   const onWheel = (e) => {
//   //     // Scroll horizontally instead of vertical
//   //     if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//   //       el.scrollLeft += e.deltaY;
//   //       e.preventDefault();
//   //     }
//   //   };

//   //   el.addEventListener("wheel", onWheel, { passive: false });

//   //   return () => el.removeEventListener("wheel", onWheel);
//   // }, []);

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     /** Universal horizontal scroll (desktop + laptop) */
//     const onWheel = (e) => {
//       // Convert vertical scroll to horizontal
//       el.scrollLeft += e.deltaY;

//       // Support native horizontal wheel
//       el.scrollLeft += e.deltaX;

//       e.preventDefault();
//     };
//     el.addEventListener("wheel", onWheel, { passive: false });

//     /** Pointer-based dragging */
//     let isDown = false;
//     let startX = 0;
//     let scrollLeft = 0;

//     const onPointerDown = (e) => {
//       isDown = true;
//       el.setPointerCapture(e.pointerId);
//       el.classList.add("dragging");
//       startX = e.clientX;
//       scrollLeft = el.scrollLeft;
//     };

//     const onPointerMove = (e) => {
//       if (!isDown) return;
//       e.preventDefault();
//       el.scrollLeft = scrollLeft - (e.clientX - startX);
//     };

//     const onPointerUp = (e) => {
//       isDown = false;
//       el.releasePointerCapture(e.pointerId);
//       el.classList.remove("dragging");
//     };

//     el.addEventListener("pointerdown", onPointerDown);
//     el.addEventListener("pointermove", onPointerMove);
//     el.addEventListener("pointerup", onPointerUp);
//     el.addEventListener("pointercancel", onPointerUp);

//     return () => {
//       el.removeEventListener("wheel", onWheel);
//       el.removeEventListener("pointerdown", onPointerDown);
//       el.removeEventListener("pointermove", onPointerMove);
//       el.removeEventListener("pointerup", onPointerUp);
//       el.removeEventListener("pointercancel", onPointerUp);
//     };
//   }, []);

//   // categories
//   const categories = [
//     { id: 1, name: "SHIRTS", description: "SHIRTS" },
//     { id: 2, name: "TROUSERS", description: "TROUSERS" },
//     { id: 3, name: "OVERSIZED T-SHIRTS", description: "OVERSIZED T-SHIRTS" },
//     { id: 4, name: "CARGOS", description: "CARGOS" },
//     { id: 5, name: "POLOS", description: "POLOS" },
//     { id: 6, name: "JEANS", description: "JEANS" },
//     { id: 7, name: "PRINTED T-SHIRTS", description: "PRINTED T-SHIRTS" },
//     { id: 8, name: "JOGGERS", description: "JOGGERS" },
//     { id: 9, name: "PLAIN T-SHIRTS", description: "PLAIN T-SHIRTS" },
//     { id: 10, name: "BOXERS", description: "BOXERS" },
//   ];

//   const handleCategoryRoute = (categoryName) => {
//     router.push(
//       `/shop?category=${categoryName
//         .toLowerCase()
//         .replace("&", "")
//         .split(" ")
//         .join("-")}`
//     );
//   };

//   return (
//     <section className="tp-beyoung-categories-area py-5 mb-5">
//       <div className="container">
//         <div className="row">
//           <div className="col-xl-12">
//             <div className="tp-section-title-wrapper-2 text-center mb-50">
//               <span className="tp-section-title-pre-2">
//                 Shop by Category
//                 <TextShapeLine />
//               </span>
//               <h3 className="tp-section-title-2">Lookfame Editions.</h3>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Categories Container */}
//         <div
//           // ref={scrollRef}
//           className="categories-scroll-container"
//           style={{
//             overflowX: "auto",
//             overflowY: "hidden",
//             whiteSpace: "nowrap",
//             padding: "20px 0",
//             scrollbarWidth: "thin",
//             scrollbarColor: "#BE5985 #f0f0f0",
//             cursor: "grab",
//           }}
//         >
//           <div
//             ref={scrollRef}
//             className="categories-scroll-wrapper"
//             // className="categories-scroll-wrapper"
//             style={{
//               display: "inline-flex",
//               gap: "20px",
//               padding: "0 20px",
//               // minWidth: "100%",
//               minWidth: "max-content",
//               cursor: "grab",
//             }}
//           >
//             {categories.map((category) => (
//               <div
//                 key={category.id}
//                 className="category-scroll-item"
//                 onClick={() => handleCategoryRoute(category.name)}
//                 style={{
//                   cursor: "pointer",
//                   flexShrink: 0,
//                   minWidth: "200px",
//                   maxWidth: "250px",
//                 }}
//               >
//                 <div
//                   className="position-relative"
//                   style={{
//                     aspectRatio: "1/1",
//                     border: "1px solid black",
//                     backgroundColor: "#f8f9fa",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   <div className="text-center p-3">
//                     <h3
//                       className="h6 fw-semibold mb-0 text-dark"
//                       style={{
//                         fontFamily: "var(--tp-ff-poppins)",
//                         fontSize: "14px",
//                         lineHeight: "1.2",
//                         whiteSpace: "normal",
//                       }}
//                     >
//                       {category.description}
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <style jsx>{`
//           .categories-scroll-container::-webkit-scrollbar {
//             height: 8px;
//           }
//           .categories-scroll-container::-webkit-scrollbar-track {
//             background: #f0f0f0;
//             border-radius: 4px;
//           }

//           // new
//           .categories-scroll-container {
//             cursor: grab !important;
//             user-select: none !important;
//           }

//           .categories-scroll-container.dragging {
//             cursor: grabbing !important;
//           }
//           // end new

//           // second new
//           .categories-scroll-container {
//             cursor: grab !important;
//             user-select: none !important;
//           }

//           .categories-scroll-container.dragging {
//             cursor: grabbing !important;
//           }
//           // end of second new

//           .categories-scroll-container::-webkit-scrollbar-thumb {
//             background: #be5985;
//             border-radius: 4px;
//           }
//           .categories-scroll-container::-webkit-scrollbar-thumb:hover {
//             background: #a04a6f;
//           }
//           .category-scroll-item:hover {
//             transform: scale(1.05);
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//           }
//         `}</style>
//       </div>
//     </section>
//   );
// };

// export default BeyoungCategories;




"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TextShapeLine } from "@/svg";

const BeyoungCategories = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [dragged, setDragged] = useState(false);

  const categories = [
    { id: 1, name: "SHIRTS", description: "SHIRTS" },
    { id: 2, name: "TROUSERS", description: "TROUSERS" },
    { id: 3, name: "OVERSIZED T-SHIRTS", description: "OVERSIZED T-SHIRTS" },
    { id: 4, name: "CARGOS", description: "CARGOS" },
    { id: 5, name: "POLOS", description: "POLOS" },
    { id: 6, name: "JEANS", description: "JEANS" },
    { id: 7, name: "PRINTED T-SHIRTS", description: "PRINTED T-SHIRTS" },
    { id: 8, name: "JOGGERS", description: "JOGGERS" },
    { id: 9, name: "PLAIN T-SHIRTS", description: "PLAIN T-SHIRTS" },
    { id: 10, name: "BOXERS", description: "BOXERS" },
  ];

  const handleCategoryClick = (name) => {
    if (dragged) return;
    router.push(
      `/shop?category=${name.toLowerCase().replace("&", "").split(" ").join("-")}`
    );
  };

  const dragThreshold = 2;

  const startDrag = (pageX) => {
    isDragging.current = true;
    startX.current = pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    setDragged(false);

    // Disable text selection on the scroll container and its children
    scrollRef.current.style.userSelect = "none";
    scrollRef.current.style.webkitUserSelect = "none";
    scrollRef.current.style.msUserSelect = "none";
    scrollRef.current.style.cursor = "grabbing";
  };

  const dragMove = (pageX) => {
    if (!isDragging.current) return;
    const walk = pageX - startX.current;
    if (Math.abs(walk) > dragThreshold) setDragged(true);
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const endDrag = () => {
    isDragging.current = false;
    scrollRef.current.style.userSelect = "auto";
    scrollRef.current.style.webkitUserSelect = "auto";
    scrollRef.current.style.msUserSelect = "auto";
    scrollRef.current.style.cursor = "grab";
  };

  // Mouse handlers
  const onMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.pageX);
  };
  const onMouseMove = (e) => dragMove(e.pageX);
  const onMouseUp = () => endDrag();

  // Touch handlers
  const onTouchStart = (e) => {
    e.preventDefault();
    startDrag(e.touches[0].pageX);
  };
  const onTouchMove = (e) => dragMove(e.touches[0].pageX);
  const onTouchEnd = () => endDrag();

  return (
    <section className="tp-beyoung-categories-area py-5 mb-5">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 text-center mb-50">
              <span className="tp-section-title-pre-2">
                Shop by Category
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Lookfame Editions.</h3>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="categories-scroll-container"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            padding: "20px 0",
            cursor: "grab",
            touchAction: "pan-x",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              style={{
                flex: "0 0 200px",
                height: "200px",
                border: "1px solid black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8f9fa",
                borderRadius: "12px",
                textAlign: "center",
                cursor: "pointer",
                userSelect: "none", // prevent selection in the div itself
              }}
            >
              <h3 style={{ userSelect: "none" }}>{category.description}</h3>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .categories-scroll-container::-webkit-scrollbar {
          height: 8px;
        }
        .categories-scroll-container::-webkit-scrollbar-thumb {
          background: #be5985;
          border-radius: 4px;
        }
        .categories-scroll-container::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default BeyoungCategories;
