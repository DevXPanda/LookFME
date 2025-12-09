"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";

const AutoSlider = () => {
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Memoized image list
  const images = useMemo(
    () => [
      "/assets/img/autoslider/360_F_120368458_jM1rSc1O5k58W6KM4aaexJnVpTaD768g.jpg",
      "/assets/img/autoslider/Mens_collection-D_6efd9307-7897-4732-818a-bf75ee012da1.webp",
      "/assets/img/autoslider/Types_of_Fashion_Styles_2_1920x.webp",
    ],
    []
  );

  // ✅ Auto slide
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // ✅ Scroll to active image
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      left: currentIndex * container.offsetWidth,
      behavior: "smooth",
    });
  }, [currentIndex]);

  // ✅ Detect manual scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const newIndex = Math.round(
        container.scrollLeft / container.offsetWidth
      );
      if (newIndex !== currentIndex) setCurrentIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  // ✅ Keep alignment on resize
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleResize = () => {
      container.scrollTo({
        left: currentIndex * container.offsetWidth,
        behavior: "auto",
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex]);

  return (
    <section
      className="tp-category-area"
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {/* Slider container */}
      <div
        ref={scrollContainerRef}
        className="categories-scroll-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          width: "100%",
          height: "420px",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="category-scroll-item"
            style={{
              flexShrink: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              scrollSnapAlign: "start",
            }}
          />
        ))}
      </div>

      {/* Indicators */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 15,
        }}
      >
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            style={{
              width: currentIndex === index ? "28px" : "14px",
              height: "14px",
              borderRadius: "999px",
              border: "none",
              backgroundColor:
                currentIndex === index
                  ? "rgba(255, 255, 255, 0.95)"
                  : "rgba(255, 255, 255, 0.5)",
              boxShadow:
                currentIndex === index
                  ? "0 0 12px rgba(0,0,0,0.2)"
                  : "0 0 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 767px) {
          .categories-scroll-container {
            height: 240px;
          }
        }
        .categories-scroll-container {
          scrollbar-width: none;
        }
        .categories-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AutoSlider;