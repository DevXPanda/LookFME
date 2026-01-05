'use client';
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
// internal
import insta_1 from "@assets/img/instagram/2/insta-1.jpg";
import insta_2 from "@assets/img/instagram/2/insta-2.jpg";
import insta_3 from "@assets/img/instagram/2/insta-3.jpg";
import insta_5 from "@assets/img/instagram/2/insta-5.jpg";
import insta_icon from "@assets/img/instagram/2/insta-icon.png";

// instagram data
const instagram_data = [
  { id: 1, link: "https://www.instagram.com/lookfameofficial", img: insta_1 },
  { id: 2, link: "https://www.instagram.com/lookfameofficial", img: insta_2 },
  { id: 3, link: "https://www.instagram.com/lookfameofficial", banner: true, img: insta_icon },
  { id: 4, link: "https://www.instagram.com/lookfameofficial", img: insta_3 },
  { id: 5, link: "https://www.instagram.com/lookfameofficial", img: insta_5 },
];

const InstagramAreaTwo = () => {
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
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
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
    if (Math.abs(delta) > 4 && !hasMoved) {
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
  return (
    <>
      <section className="tp-instagram-area">
        <div className="container-fluid pl-20 pr-20">
          {/* Desktop Grid View */}
          <div className="d-none d-md-block">
            <div className="row row-cols-lg-5 row-cols-sm-2 gx-2 gy-2 gy-lg-0">
              {instagram_data.map((item) =>
                item.banner ? (
                  <div key={item.id} className="col">
                    <div className="tp-instagram-banner text-center">
                      <div className="tp-instagram-banner-icon mb-40">
                        <a href={item.link} target="_blank">
                          <Image
                            src={item.img}
                            alt="instagram img"
                          />
                        </a>
                      </div>
                      <div className="tp-instagram-banner-content">
                        <span>Follow Us on</span>
                        <a href={item.link} target="_blank">Instagram</a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={item.id} className="col">
                    <div className="tp-instagram-item-2">
                      <Image src={item.img} alt="user image" style={{ width: '100%', height: '100%' }} />
                      <div className="tp-instagram-icon-2">
                        <a href={item.link} target="_blank" className="popup-image">
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Mobile Slider View */}
          <div className="d-block d-md-none">
            <div className="instagram-scroll-wrapper p-relative">
              {/* Scrollable Container */}
              <div
                ref={scrollRef}
                className="instagram-scroll-container"
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
                  padding: "0 8px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    gap: "8px",
                    padding: "0 4px",
                    minWidth: "100%",
                  }}
                >
                  {instagram_data.map((item) =>
                    item.banner ? (
                      <div
                        key={item.id}
                        style={{
                          flexShrink: 0,
                          width: "calc(50% - 4px)",
                          minWidth: "calc(50% - 4px)",
                        }}
                      >
                        <div className="tp-instagram-banner text-center">
                          <div className="tp-instagram-banner-icon mb-40">
                            <a href={item.link} target="_blank">
                              <Image
                                src={item.img}
                                alt="instagram img"
                              />
                            </a>
                          </div>
                          <div className="tp-instagram-banner-content">
                            <span>Follow Us on</span>
                            <a href={item.link} target="_blank">Instagram</a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={item.id}
                        style={{
                          flexShrink: 0,
                          width: "calc(50% - 4px)",
                          minWidth: "calc(50% - 4px)",
                        }}
                      >
                        <div className="tp-instagram-item-2">
                          <Image src={item.img} alt="user image" style={{ width: '100%', height: '100%' }} />
                          <div className="tp-instagram-icon-2">
                            <a href={item.link} target="_blank" className="popup-image">
                              <i className="fa-brands fa-instagram"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .instagram-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default InstagramAreaTwo;
