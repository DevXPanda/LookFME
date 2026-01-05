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
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AdBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopImg = "/assets/img/ad/ad.jpeg";
  const mobileImg = "/assets/img/ad/ad.jpeg";

  return (
    <section
      className="ad-banner-area"
      style={{
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Link
        href="/ad"
        className="relative block w-full cursor-pointer"
        style={{
          height: isMobile ? "320px" : "700px",
        }}
      >
        <Image
          src={isMobile ? mobileImg : desktopImg}
          alt="Ad Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </Link>
    </section>
  );
};

export default AdBanner;
