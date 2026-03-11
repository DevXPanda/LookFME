"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TextShapeLine, ArrowRightLong, NextLongArr, PrevLongArr } from "@/svg";
import { useGetComboProductsQuery } from "@/redux/features/comboProductApi";
import { HomeTwoBestSellPrdPrdLoader } from "@/components/loader";
import ErrorMsg from "@/components/common/error-msg";

const SuperSavingCombos = () => {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const { data: combosData, isLoading: combosLoading, isError: combosError } = useGetComboProductsQuery();
  const combos = combosData?.data ?? [];

  useEffect(() => {
    if (!isDragging && hasMoved) {
      const timeout = setTimeout(() => setHasMoved(false), 120);
      return () => clearTimeout(timeout);
    }
  }, [isDragging, hasMoved]);

  const handleComboClick = (combo) => {
    if (combo?._id) router.push(`/combo-details/${combo._id}`);
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const beginDrag = (clientX, currentScroll) => {
    setIsDragging(true);
    setStartX(clientX);
    setScrollLeft(currentScroll);
    setHasMoved(false);
  };

  const dragMove = (clientX) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const delta = clientX - startX;
    if (Math.abs(delta) > 4 && !hasMoved) setHasMoved(true);
    scrollContainerRef.current.scrollLeft = scrollLeft - (delta * 1.5);
  };

  const stopDragging = () => setIsDragging(false);

  const handleWheel = (e) => {
    if (!scrollContainerRef.current) return;
    if (e.deltaY !== 0) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const arrowBtnStyle = {
    position: "absolute",
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
  };

  let content = null;
  if (combosLoading) {
    content = <HomeTwoBestSellPrdPrdLoader loading={combosLoading} />;
  }
  if (!combosLoading && combosError) {
    content = <ErrorMsg msg="Failed to load combos" />;
  }
  if (!combosLoading && !combosError && combos.length === 0) {
    content = <ErrorMsg msg="No combos found" />;
  }
  if (!combosLoading && !combosError && combos.length > 0) {
    content = combos.map((combo) => {
      const imgSrc = combo.banner_image || combo.img || "https://placehold.co/400x500?text=Combo";
      const price = Number(combo.price) || 0;
      const originalPrice = Number(combo.original_price) || price;
      const discount = Number(combo.discount) || 0;
      const hasDiscount = discount > 0 && originalPrice > price;

      return (
        <div
          key={combo._id}
          className="combo-scroll-item"
          onClick={() => handleComboClick(combo)}
          onKeyDown={(e) => e.key === "Enter" && handleComboClick(combo)}
          role="button"
          tabIndex={0}
          style={{
            flexShrink: 0,
            width: "240px",
            height: "340px",
            margin: "0 8px",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              zIndex: 1,
            }}
          />
          <Image
            src={imgSrc}
            alt={combo.title || "Combo"}
            fill
            sizes="240px"
            className="object-cover"
            style={{ zIndex: 0 }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              padding: "18px 12px",
              textAlign: "center",
            }}
          >
            {/* <span
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.5px",
                marginBottom: "4px",
                textTransform: "uppercase",
              }}
            >
              LookFame Edition
            </span> */}
            <h3
              style={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#ffffff",
                margin: 0,
                marginBottom: "6px",
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {combo.title}
            </h3>
            <div
              style={{
                fontSize: "14px",
                color: "#fff",
                marginBottom: "8px",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <span style={{ fontWeight: 600 }}>₹{price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span style={{ marginLeft: 6, textDecoration: "line-through", opacity: 0.9 }}>
                    ₹{originalPrice.toFixed(2)}
                  </span>
                  <span style={{ marginLeft: 4, color: "#86efac", fontWeight: 600 }}>
                    ({discount}% off)
                  </span>
                </>
              )}
            </div>
            <Link
              href={`/combo-details/${combo._id}`}
              className="tp-btn tp-btn-border-white"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "24px",
                paddingRight: "24px",
                marginTop: "4px",
                borderColor: "#ffffff",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Shop Now <span style={{ marginLeft: 6 }}><ArrowRightLong /></span>
            </Link>
          </div>
        </div>
      );
    });
  }

  return (
    <section className="tp-category-area pb-95 pt-45">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 text-center mb-50">
              <span className="tp-section-title-pre-2 mb-5">
                LookFame Exclusive
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Super Saving Combos</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-category-slider-2 p-relative">
              <button
                type="button"
                className="tp-category-slider-button-prev-overlay"
                onClick={() => handleScroll("left")}
                style={{ ...arrowBtnStyle, left: "20px" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <PrevLongArr />
              </button>
              <button
                type="button"
                className="tp-category-slider-button-next-overlay"
                onClick={() => handleScroll("right")}
                style={{ ...arrowBtnStyle, right: "20px", left: "auto" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <NextLongArr />
              </button>
              <div
                ref={scrollContainerRef}
                className="combo-scroll-container"
                onMouseDown={(e) => beginDrag(e.clientX, scrollContainerRef.current?.scrollLeft ?? 0)}
                onMouseMove={(e) => { if (isDragging) { e.preventDefault(); dragMove(e.clientX); } }}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onTouchStart={(e) => beginDrag(e.touches[0].clientX, scrollContainerRef.current?.scrollLeft ?? 0)}
                onTouchMove={(e) => dragMove(e.touches[0].clientX)}
                onTouchEnd={stopDragging}
                onTouchCancel={stopDragging}
                onWheel={handleWheel}
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  padding: "0 15px",
                  cursor: isDragging ? "grabbing" : "grab",
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
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-xl-12">
            <div className="tp-seller-more text-center mt-10">
              <Link href="/shop" className="tp-btn tp-btn-border tp-btn-border-sm">
                Shop All Product
              </Link>
            </div>
          </div> */}
        </div>
      </div>
      <style jsx>{`
        .combo-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .combo-scroll-item:hover {
          transform: scale(1.02);
          transition: transform 0.3s ease;
        }
        @media (max-width: 767px) {
          .tp-category-slider-button-prev-overlay,
          .tp-category-slider-button-next-overlay {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SuperSavingCombos;
