// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const AdBanner = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   // Detect mobile vs desktop
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const desktopImg = "/assets/img/ad/ad.jpeg";
//   const mobileImg = "/assets/img/ad/ad.jpeg";

//   // ✅ Manual dimensions
//   const desktopDimensions = { width: 1500, height: 500 };
//   const mobileDimensions = { width: 330, height: 150 };

//   return (
//     <section
//       className="ad-banner-area"
//       style={{
//         width: "100%",
//         overflow: "hidden",
//         display: "flex",
//         justifyContent: "center",
//       }}
//     >
//       <Link
//         href="/ad"
//         className="block relative rounded-4 overflow-hidden shadow-sm"
//         style={{
//           cursor: "pointer",
//           width: isMobile ? "90%" : "100%",
//           maxWidth: isMobile ? "600px" : "1500px",
//         }}
//       >
//         <Image
//           src={isMobile ? mobileImg : desktopImg}
//           alt="Ad Banner"
//           width={isMobile ? mobileDimensions.width : desktopDimensions.width}
//           height={isMobile ? mobileDimensions.height : desktopDimensions.height}
//           className="rounded-4 object-cover w-full"
//           priority
//         />
//       </Link>
//     </section>
//   );
// };

// export default AdBanner;
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AdBanner = () => {
  const desktopImg = "/assets/img/ad/ad.jpeg";
  const mobileImg = "/assets/img/ad/ad.jpeg";

  return (
    <section className="ad-banner-area" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', position: 'relative' }}>
      <Link 
        href="/ad" 
        className="banner-image-container cursor-pointer block w-full h-full"
        style={{ width: '100%', maxWidth: '100%', height: '100%', position: 'relative', display: 'block' }}
      >
        {/* Desktop image */}
        <Image
          src={desktopImg}
          alt="Ad Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
          className="object-cover hidden md:block"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Mobile image */}
        <Image
          src={mobileImg}
          alt="Ad Banner"
          fill
          priority
          sizes="(max-width: 425px) 100vw, (max-width: 768px) 100vw, 800px"
          className="object-cover block md:hidden"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </Link>
    </section>
  );
};

export default AdBanner;
