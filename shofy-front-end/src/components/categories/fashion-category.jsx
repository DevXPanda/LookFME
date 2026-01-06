"use client";
import React, { useRef, useState, useEffect } from "react";
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
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // Drag handlers (same as Super Saving Combos)
  const beginDrag = (clientX, currentScroll) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(currentScroll);
    setHasMoved(false);
  };

  const dragMove = (clientX) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const delta = clientX - startX;
    if (Math.abs(delta) > 4 && !hasMoved) {
      setHasMoved(true);
    }
    const walk = delta * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  // Handle wheel event for mouse wheel scrolling
  const handleWheel = (e) => {
    if (!scrollContainerRef.current) return;
    // Convert vertical wheel scrolling to horizontal
    if (e.deltaY !== 0) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
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
        onClick={() => handleCategoryRoute(item.parent)}
        style={{
          flexShrink: 0,
          width: "240px",
          height: "340px",
          margin: "0 8px",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
          position: "relative",
          backgroundImage: `url(${item.img})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "none",
            padding: "18px 12px 16px 12px",
            boxSizing: "border-box",
            borderBottomLeftRadius: "18px",
            borderBottomRightRadius: "18px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: "18px",
              color: "#222",
              margin: 0,
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              background: "none",
              display: "block",
              padding: 0,
            }}
          >
            <a
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryRoute(item.parent);
              }}
              style={{
                textDecoration: "none",
                color: "#222",
                background: "none",
                padding: 0,
              }}
            >
              {item.parent}
            </a>
          </h3>
          <a
            className="tp-btn tp-btn-border"
            onClick={(e) => {
              e.stopPropagation();
              handleCategoryRoute(item.parent);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
              paddingLeft: "22px",
              paddingRight: "22px",
              marginTop: "10px",
            }}
          >
            Shop Now{" "}
            <span style={{ marginLeft: 6 }}>
              <ArrowRightLong />
            </span>
          </a>
        </div>
      </div>
    ));
  }
  return (
    <>
      <section className="tp-category-area pb-95 pt-45">
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
                  onClick={() => handleScroll("left")}
                  style={{
                    position: "absolute",
                    left: "20px",
                    top: "130px",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#BE5985",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  <PrevLongArr />
                </button>

                {/* Right Navigation Arrow - Overlaid */}
                <button
                  className="tp-category-slider-button-next-overlay"
                  onClick={() => handleScroll("right")}
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "130px",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    color: "#BE5985",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 1)";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  <NextLongArr />
                </button>

                {/* Scrollable Categories Container */}
                <div
                  ref={scrollContainerRef}
                  className="categories-scroll-container"
                  onMouseDown={(e) =>
                    beginDrag(e.clientX, scrollContainerRef.current.scrollLeft)
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
                    beginDrag(e.touches[0].clientX, scrollContainerRef.current.scrollLeft)
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
                    padding: "0 15px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                  }}
                >
                  <div
                    className="categories-scroll-wrapper"
                    style={{
                      display: "inline-flex",
                      gap: "12px",
                      padding: "0 12px",
                      minWidth: "100%",
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

            /* Hide navigation arrows on mobile screens */
          @media (max-width: 767px) {
            .tp-category-slider-button-prev-overlay,
            .tp-category-slider-button-next-overlay {
            display: none !important;
           }
         }
        `}</style>
      </section>
    </>
  );
};

export default FashionCategory;
