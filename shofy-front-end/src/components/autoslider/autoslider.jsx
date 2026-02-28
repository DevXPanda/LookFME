"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useGetBannersQuery } from "@/redux/features/bannerApi";
import { useRouter } from "next/navigation";

const AutoSlider = () => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useGetBannersQuery();

  // Log the API response in console to confirm data is coming
  useEffect(() => {
    if (data) {
      console.log("AutoSlider Banners API Response:", data);
    }
  }, [data]);

  // Filter for 'autoslider_banner' and status 'Enabled'
  const banners = (data?.data ?? []).filter(
    b => b.bannerType === 'autoslider_banner' && b.isEnabled === true
  );

  const images = useMemo(() => {
    // Return all enabled banners, no limits or slicing
    if (banners.length > 0) {
      return banners.map(b => ({
        id: b._id, // Use unique id from db
        src: b.image,
        mobileSrc: b.imageMobile || b.image,
        link: b.redirectLink || "#",
        title: b.title
      }));
    }
    return [];
  }, [banners]);

  // Auto slide
  useEffect(() => {
    if (isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // Scroll sync
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || images.length === 0) return;

    container.scrollTo({
      left: currentIndex * container.offsetWidth,
      behavior: "smooth",
    });
  }, [currentIndex, images.length]);

  if (isLoading) return null;
  if (images.length === 0) return null;

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
          overflow: "hidden",
          scrollSnapType: "x mandatory",
          width: "100%",
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => img.link !== "#" && router.push(img.link)}
            style={{
              flexShrink: 0,
              width: "100%",
              aspectRatio: "3 / 1",
              position: "relative",
              scrollSnapAlign: "start",
              overflow: "hidden",
              cursor: img.link !== "#" ? "pointer" : "default"
            }}
          >
            <picture>
              <source media="(max-width: 767px)" srcSet={img.mobileSrc} />
              <img
                src={img.src}
                alt={img.title || `slide-${img.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Indicators */}
      {images.length > 1 && (
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
          {images.map((img, index) => (
            <button
              key={img.id}
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
      )}
    </section>
  );
};

export default AutoSlider;
