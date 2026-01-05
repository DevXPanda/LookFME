// "use client";
// import React, { useRef, useEffect, useState, useMemo } from "react";

// const AutoSlider = () => {
//   const scrollContainerRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // ✅ Memoized image list
//   const images = useMemo(
//     () => [
//       "/assets/img/autoslider/1.jpg",
//       "/assets/img/autoslider/2.jpg",
//       "/assets/img/autoslider/3.jpg",
//     ],
//     []
//   );

//   // ✅ Auto slide
//   useEffect(() => {
//     if (isHovered) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [isHovered, images.length]);

//   // ✅ Scroll to active image
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     container.scrollTo({
//       left: currentIndex * container.offsetWidth,
//       behavior: "smooth",
//     });
//   }, [currentIndex]);

//   // ✅ Detect manual scroll
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       const newIndex = Math.round(
//         container.scrollLeft / container.offsetWidth
//       );
//       if (newIndex !== currentIndex) setCurrentIndex(newIndex);
//     };

//     container.addEventListener("scroll", handleScroll);
//     return () => container.removeEventListener("scroll", handleScroll);
//   }, [currentIndex]);

//   // ✅ Keep alignment on resize
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const handleResize = () => {
//       container.scrollTo({
//         left: currentIndex * container.offsetWidth,
//         behavior: "auto",
//       });
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, [currentIndex]);

//   return (
//     <section
//       className="tp-category-area"
//       style={{
//         position: "relative",
//         overflow: "hidden",
//         width: "100%",
//         margin: "0 auto",
//       }}
//     >
//       {/* Slider container */}
//       <div
//         ref={scrollContainerRef}
//         className="categories-scroll-container"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{
//           display: "flex",
//           overflowX: "auto",
//           scrollSnapType: "x mandatory",
//           width: "100%",
//           minHeight: "420px",
//           height: "420px",
//         }}
//       >
//         {images.map((src, i) => (
//           <div
//             key={i}
//             className="category-scroll-item"
//             style={{
//               flexShrink: 0,
//               width: "100%",
//               minWidth: "100%",
//               height: "100%",
//               minHeight: "420px",
//               backgroundImage: `url(${src})`,
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               backgroundRepeat: "no-repeat",
//               scrollSnapAlign: "start",
//             }}
//           />
//         ))}
//       </div>

//       {/* Indicators */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "16px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           display: "flex",
//           gap: "10px",
//           zIndex: 15,
//         }}
//       >
//         {images.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             aria-label={`Go to slide ${index + 1}`}
//             style={{
//               width: currentIndex === index ? "28px" : "14px",
//               height: "14px",
//               borderRadius: "999px",
//               border: "none",
//               backgroundColor:
//                 currentIndex === index
//                   ? "rgba(255, 255, 255, 0.95)"
//                   : "rgba(255, 255, 255, 0.5)",
//               boxShadow:
//                 currentIndex === index
//                   ? "0 0 12px rgba(0,0,0,0.2)"
//                   : "0 0 6px rgba(0,0,0,0.1)",
//               cursor: "pointer",
//               transition: "all 0.3s ease",
//             }}
//           />
//         ))}
//       </div>

//       <style jsx>{`
//         @media (max-width: 767px) {
//           .categories-scroll-container {
//             min-height: 240px;
//             height: 240px;
//           }
//           .category-scroll-item {
//             min-height: 240px !important;
//           }
//         }
//         .categories-scroll-container {
//           scrollbar-width: none;
//         }
//         .categories-scroll-container::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default AutoSlider;
"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";

const AutoSlider = () => {
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(
    () => [
      "/assets/img/autoslider/1.jpg",
      "/assets/img/autoslider/2.jpg",
      "/assets/img/autoslider/3.jpg",
    ],
    []
  );

  // Auto slide
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // Scroll sync
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      left: currentIndex * container.offsetWidth,
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <section
      className="tp-category-area relative overflow-hidden"
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Slider */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          overflowX: "hidden",
          scrollSnapType: "x mandatory",
          width: "100%",
          minHeight: "520px",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: "100%",
              minWidth: "100%",
              minHeight: "520px",
              position: "relative",
              scrollSnapAlign: "start",
            }}
          >
            <img
              src={src}
              alt={`slide-${i}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 20,
        }}
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: currentIndex === index ? "26px" : "12px",
              height: "12px",
              borderRadius: "999px",
              border: "none",
              background:
                currentIndex === index
                  ? "rgba(255,255,255,0.95)"
                  : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .tp-category-area div[style*="min-height"] {
            min-height: 260px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AutoSlider;
