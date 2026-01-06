
// 'use client';
// import React, { useRef, useState, useEffect } from "react";
// import Image from "next/image";

// // internal
// import insta_1 from "@assets/img/instagram/2/insta-1.jpg";
// import insta_2 from "@assets/img/instagram/2/insta-2.jpg";
// import insta_3 from "@assets/img/instagram/2/insta-3.jpg";
// import insta_5 from "@assets/img/instagram/2/insta-5.jpg";
// import insta_icon from "@assets/img/instagram/2/insta-icon.png";

// // instagram data
// const instagram_data = [
//   { id: 1, link: "https://www.instagram.com/lookfameofficial", img: insta_1 },
//   { id: 2, link: "https://www.instagram.com/lookfameofficial", img: insta_2 },
//   { id: 3, link: "https://www.instagram.com/lookfameofficial", banner: true, img: insta_icon },
//   { id: 4, link: "https://www.instagram.com/lookfameofficial", img: insta_3 },
//   { id: 5, link: "https://www.instagram.com/lookfameofficial", img: insta_5 },
// ];

// const BANNER_INDEX = instagram_data.findIndex(i => i.banner);

// const InstagramAreaTwo = () => {
//   const scrollRef = useRef(null);
//   const autoBackTimer = useRef(null);

//   /* 👇 Mobile: auto scroll back to Instagram banner */
//   const scrollToBanner = () => {
//     if (!scrollRef.current) return;
//     const container = scrollRef.current;
//     const itemWidth = container.offsetWidth / 2;
//     container.scrollTo({
//       left: BANNER_INDEX * itemWidth,
//       behavior: "smooth",
//     });
//   };

//   /* 👇 On mount → banner center me */
//   useEffect(() => {
//     if (window.innerWidth < 768) {
//       setTimeout(scrollToBanner, 300);
//     }
//   }, []);

//   /* 👇 User scroll ke baad auto return */
//   const handleUserScroll = () => {
//     if (autoBackTimer.current) clearTimeout(autoBackTimer.current);
//     autoBackTimer.current = setTimeout(scrollToBanner, 2500);
//   };

//   return (
//     <section className="tp-instagram-area">
//       <div className="container-fluid pl-20 pr-20">

//         {/* ================= DESKTOP (UNCHANGED) ================= */}
//         <div className="d-none d-md-block">
//           <div className="row row-cols-lg-5 row-cols-sm-2 gx-2 gy-2 gy-lg-0">
//             {instagram_data.map((item) =>
//               item.banner ? (
//                 <div key={item.id} className="col">
//                   <div className="tp-instagram-banner text-center">
//                     <div className="tp-instagram-banner-icon mb-40">
//                       <a href={item.link} target="_blank">
//                         <Image src={item.img} alt="instagram" />
//                       </a>
//                     </div>
//                     <div className="tp-instagram-banner-content">
//                       <span>Follow Us on</span>
//                       <a href={item.link} target="_blank">Instagram</a>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div key={item.id} className="col">
//                   <div className="tp-instagram-item-2">
//                     <Image src={item.img} alt="insta" fill />
//                   </div>
//                 </div>
//               )
//             )}
//           </div>
//         </div>

//         {/* ================= MOBILE (UPDATED) ================= */}
//         <div className="d-block d-md-none">
//           <div
//             ref={scrollRef}
//             onScroll={handleUserScroll}
//             className="instagram-scroll-container"
//             style={{
//               display: "flex",
//               overflowX: "auto",
//               scrollSnapType: "x mandatory",
//               gap: "8px",
//               padding: "0 8px",
//             }}
//           >
//             {instagram_data.map((item) => (
//               <div
//                 key={item.id}
//                 style={{
//                   flex: "0 0 50%",
//                   scrollSnapAlign: "center",
//                   aspectRatio: "1 / 1",   // ✅ SAME SIZE
//                   position: "relative",
//                 }}
//               >
//                 {item.banner ? (
//                   <div className="tp-instagram-banner text-center h-100">
//                     <div className="tp-instagram-banner-icon">
//                       <Image src={item.img} alt="instagram" />
//                     </div>
//                     <div className="tp-instagram-banner-content">
//                       <span>Follow Us on</span>
//                       <a href={item.link} target="_blank">Instagram</a>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="tp-instagram-item-2 h-100">
//                     <Image src={item.img} alt="insta" fill />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .instagram-scroll-container::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default InstagramAreaTwo;

'use client';
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

// assets
import insta_1 from "@assets/img/instagram/2/insta-1.jpg";
import insta_2 from "@assets/img/instagram/2/insta-2.jpg";
import insta_3 from "@assets/img/instagram/2/insta-3.jpg";
import insta_5 from "@assets/img/instagram/2/insta-5.jpg";
import insta_icon from "@assets/img/instagram/2/insta-icon.png";

// data
const instagram_data = [
  { id: 1, link: "https://www.instagram.com/lookfameofficial", img: insta_1 },
  { id: 2, link: "https://www.instagram.com/lookfameofficial", img: insta_2 },
  { id: 3, link: "https://www.instagram.com/lookfameofficial", banner: true, img: insta_icon },
  { id: 4, link: "https://www.instagram.com/lookfameofficial", img: insta_3 },
  { id: 5, link: "https://www.instagram.com/lookfameofficial", img: insta_5 },
];

const BANNER_INDEX = instagram_data.findIndex((i) => i.banner);

const InstagramAreaTwo = () => {
  const scrollRef = useRef(null);
  const autoBackTimer = useRef(null);

  /* ================= MOBILE LOGIC ONLY ================= */

  const scrollToBanner = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = container.offsetWidth / 2;
    container.scrollTo({
      left: BANNER_INDEX * itemWidth,
      behavior: "smooth",
    });
  };

  // On mobile load → Instagram banner center
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setTimeout(scrollToBanner, 300);
    }
  }, []);

  // After user scroll → auto return
  const handleUserScroll = () => {
    if (autoBackTimer.current) clearTimeout(autoBackTimer.current);
    autoBackTimer.current = setTimeout(scrollToBanner, 2500);
  };

  return (
    <section className="tp-instagram-area">
      <div className="container-fluid pl-20 pr-20">

        {/* ================= DESKTOP (ORIGINAL – UNTOUCHED) ================= */}
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
                          alt="instagram"
                          width={80}
                          height={80}
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
                    <Image
                      src={item.img}
                      alt="instagram"
                      width={300}
                      height={300}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <div className="tp-instagram-icon-2">
                      <a href={item.link} target="_blank">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================= MOBILE (CUSTOM SLIDER) ================= */}
        <div className="d-block d-md-none">
          <div
            ref={scrollRef}
            onScroll={handleUserScroll}
            className="instagram-scroll-container"
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              gap: "8px",
              padding: "0 8px",
              scrollbarWidth: "none",
            }}
          >
            {instagram_data.map((item) => (
              <div
                key={item.id}
                style={{
                  flex: "0 0 50%",
                  scrollSnapAlign: "center",
                  aspectRatio: "1 / 1",
                  position: "relative",
                }}
              >
                {item.banner ? (
                  <div className="tp-instagram-banner text-center h-100">
                    <div className="tp-instagram-banner-icon">
                      <Image
                        src={item.img}
                        alt="instagram"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="tp-instagram-banner-content">
                      <span>Follow Us on</span>
                      <a href={item.link} target="_blank">Instagram</a>
                    </div>
                  </div>
                ) : (
                  <div className="tp-instagram-item-2 h-100">
                    <Image
                      src={item.img}
                      alt="instagram"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        .instagram-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default InstagramAreaTwo;
