"use client";
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
    // first combo
    "plaintshirts.jpg",
    "polotshirts.jpg",
    "printedtshirts.jpg",
    "regulartshirts.jpg",
    "oversizedtshirts.jpg",
    "boxertsorts.jpg",
    "sorts.jpg",
    // second combo
    "/Shirts.jpg",
    "trousers.jpg",
    "women_plain_tshirts.jpg",
    "women_printed_tshirts.jpg",
    "women_oversized_tshirts.jpg",
    "women_polo_tshirts.jpg",
    // third combo
    "women_regular_tshirts.jpg",
    "women_shirts.jpg",
    "women_trousers.jpg",
    "women_shorts.jpg",
    "women_boxers_sorts.jpg",
  ].map((name) => `/assets/img/supersaving/${name}`);

  const comboThumbnails = {
    "/assets/img/supersaving/trousers_min_web_cards_e04b5301f2.jpg": [
      "https://peplosjeans.in/cdn/shop/files/56A1612_96f4075c-8c1b-4bd4-b089-6403482fa33f.jpg?v=1709536250&width=1080",
      "https://pluss.in/cdn/shop/products/IMG_0234_98f1fcf3-a268-4254-b1d5-8295917ccdfd.jpg?v=1756190302",
      "https://assets.sheinindia.in/medias/shein_sys_master/root/20250703/Eu21/68666bd2e590ff066e1ed88f/-473Wx593H-443328616-beige-MODEL.jpg",
      "https://media-us.landmarkshops.in/cdn-cgi/image/h=831,w=615,q=85,fit=cover/max-new/1000013705376-Beige-BEIGE-1000013705376_01-2100.jpg",
    ],

    "/assets/img/supersaving/back_2_college_min_web_cards_d5640d9806.jpg": [
      "https://freedesignfile.com/upload/2017/11/Happy-college-girl-Stock-Photo.jpg",
      "https://images.stockcake.com/public/a/d/5/ad53849e-b2bc-4fe9-aaa0-0cde6af33339_large/studying-late-night-stockcake.jpg",
      "https://i.pinimg.com/236x/13/7f/7d/137f7d9479efb8a7ff338d782239893f.jpg",
      "https://w0.peakpx.com/wallpaper/865/443/HD-wallpaper-books-reading-tea-aesthetics-thumbnail.jpg",
    ],

    "/assets/img/supersaving/Cargo_min_web_cards_cd0d845a89.jpg": [
      "https://nobero.com/cdn/shop/files/JoggersWebImages-0006.webp?v=1744108689",
      "https://saintjones.in/cdn/shop/files/HUNTER_GREEN_BAGGY_CARGO_-_St.Jones-3833127.jpg?v=1742145759",
      "https://assets.ajio.com/medias/sys_master/root/20240828/HuZi/66cf4f186f60443f313822d3/-1117Wx1400H-700259722-grey-MODEL4.png",
      "https://media.kohlsimg.com/is/image/kohls/7001940_Moonless_Night?wid=620&hei=620&op_sharpen=1",
    ],

    "/assets/img/supersaving/festive_shirts_min_web_cards_4405e2002a.jpg": [
      "https://www.beyours.in/cdn/shop/files/mocha-flatlay.jpg?v=1760292479",
      "https://m.media-amazon.com/images/I/81nJjvAuwQL._AC_UY1100_.jpg",
      "https://images-static.nykaa.com/media/catalog/product/8/b/8b57f79Heptagon-1777_Brown_3.jpg?tr=w-500",
      "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/OCTOBER/24/UXngTNmj_6f4da347c910429f90c99e38d8f053a6.jpg",
    ],

    "/assets/img/supersaving/replay_rewind_min_web_cards_3efb4c20bc.jpg": [
      "https://m.media-amazon.com/images/I/31gDeu6Rj2L._AC_UY1100_.jpg",
      "https://m.media-amazon.com/images/I/61rBpmh5hpL._AC_UY1000_.jpg",
      "https://www.trrendo.com/cdn/shop/files/PATP1084.jpg?v=1735541529&width=1080",
      "https://i.pinimg.com/736x/12/0e/02/120e02a58fb4abde72b1be9353d0b22a.jpg",
    ],

    "/assets/img/supersaving/shirts_reimagined_min_web_cards_76d02fae86.jpg": [
      "https://myraymond.com/cdn/shop/files/CMSS29971-F3-1.jpg?v=1725608419",
      "https://www.andamen.com/cdn/shop/files/01_a63d8703-846a-4fdb-b87d-be0bdf0fe994_1140x.jpg?v=1750852055",
      "https://www.creaturesofhabit.in/cdn/shop/files/DSCF8170_1080x.jpg?v=1717750138",
      "https://mrsimple.com.au/cdn/shop/files/linen-ls-natural_0004_DSCF7812_1600x.jpg?v=1762840150",
    ],
  };

  // Navigate to shop page
  // const handleCategoryRoute = () => {
  //   // router.push(`/shop?category=super-saving-combos`);
  //   router.push(`/combo-details`);
  // };

  // only for main images
  // const handleImageClick = (img) => {
  //   router.push(`/combo-details?image=${encodeURIComponent(img)}`);
  // };

  // both thumbnail and main images
  const handleImageClick = (img) => {
  const thumbs = comboThumbnails[img] || [];
  router.push(`/combo-details?image=${encodeURIComponent(img)}&thumbs=${encodeURIComponent(JSON.stringify(thumbs))}`);
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
                      src={img}
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
                      onClick={() => handleImageClick(img)}
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
