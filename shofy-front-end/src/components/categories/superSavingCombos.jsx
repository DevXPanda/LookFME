'use client';
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextShapeLine, NextLongArr, PrevLongArr } from "@/svg";

const SuperSavingCombos = () => {
  const router = useRouter();
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

  // Local images
  const images = [
    "trousers_min_web_cards_e04b5301f2.jpg",
    "back_2_college_min_web_cards_d5640d9806.jpg",
    "Cargo_min_web_cards_cd0d845a89.jpg",
    "festive_shirts_min_web_cards_4405e2002a.jpg",
    "replay_rewind_min_web_cards_3efb4c20bc.jpg",
    "shirts_reimagined_min_web_cards_76d02fae86.jpg"
  ].map(name => `/assets/img/supersaving/${name}`);

  // Navigate to shop page
  const handleCategoryRoute = () => {
    // router.push(`/shop?category=super-saving-combos`);
    router.push(`/combo-details`);
  };

  // Handle button scroll
  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  // Drag handlers
  const beginDrag = (clientX, currentScroll) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(currentScroll);
    setHasMoved(false);
  };

  const dragMove = (clientX) => {
    if (!isDragging || !scrollRef.current) return;
    const delta = clientX - startX;
    if (Math.abs(delta) > 4 && !hasMoved) {
      setHasMoved(true);
    }
    const walk = delta * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <section className="tp-category-area pb-40 ">
      <div className="container">
        <div className="row">
          <div className="col-xl-12 text-center mb-50">
            <span className="tp-section-title-pre-2 mb-5">
              LookFame Exclusive <TextShapeLine />
            </span>
            <h3 className="tp-section-title-2">Super Saving Combos</h3>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="tp-category-slider-2 p-relative">
              {/* Scroll Buttons */}
              <button
                style={{ ...arrowStyle, left: "20px" }}
                onClick={() => handleScroll("left")}
              >
                <PrevLongArr />
              </button>
              <button
                style={{ ...arrowStyle, right: "20px" }}
                onClick={() => handleScroll("right")}
              >
                <NextLongArr />
              </button>

              {/* Image Carousel */}
              <div
                ref={scrollRef}
                className="categories-scroll-container"
                onMouseDown={(e) => beginDrag(e.clientX, scrollRef.current.scrollLeft)}
                onMouseMove={(e) => {
                  if (isDragging) {
                    e.preventDefault();
                    dragMove(e.clientX);
                  }
                }}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={(e) =>
                  beginDrag(
                    e.touches[0].clientX,
                    scrollRef.current.scrollLeft
                  )
                }
                onTouchMove={(e) => {
                  dragMove(e.touches[0].clientX);
                }}
                onTouchEnd={stopDragging}
                onTouchCancel={stopDragging}
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
                  style={{
                    display: "inline-flex",
                    gap: "12px",
                    padding: "0 12px",
                    minWidth: "100%",
                  }}
                >
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="category-scroll-item cursor-pointer"
                      style={{
                        flexShrink: 0,
                        width: "240px",
                        height: "340px",
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                        backgroundImage: `url(${img})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundColor: "#f0f0f0",
                        transition: "transform 0.3s ease",
                      }}
                      onClick={() => {
                        if (hasMoved) return;
                        handleCategoryRoute();
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .categories-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .category-scroll-item:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
};

const arrowStyle = {
  position: "absolute",
  width: "50px",
  height: "50px",
  top: "130px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "rgba(255,255,255,0.9)",
  color: "#BE5985",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  zIndex: 10,
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
};

export default SuperSavingCombos;