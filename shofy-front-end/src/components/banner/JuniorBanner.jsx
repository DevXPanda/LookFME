// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const JuniorBanner = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <section
//       className="junior-banner-area"
//       style={{
//         width: "100%",
//         overflow: "hidden",
//       }}
//     >
//       <Link
//         href="/junior"
//         className="block relative"
//         style={{
//           cursor: "pointer",
//           display: "block",
//           width: "100%",
//           height: "auto",
//         }}
//       >
//         {/* Conditional rendering: only one image visible */}
//         {isMobile ? (
//           <Image
//             src="/assets/img/juniorBanner/banner.jpg"
//             alt="Junior Banner Mobile"
//             width={800}
//             height={300}
//             priority
//             className="junior-banner-img"
//             style={{
//               width: "100%",
//               height: "160px",
//               objectFit: "cover",
//               objectPosition: "center",
//             }}
//           />
//         ) : (
//           <Image
//             src="/assets/img/juniorBanner/junior.jpg"
//             alt="Junior Banner Desktop"
//             width={1920}
//             height={540}
//             priority
//             className="junior-banner-img"
//             style={{
//               width: "100%",
//               height: "500px",
//               objectFit: "cover",
//               objectPosition: "center",
//             }}
//           />
//         )}
//       </Link>
//     </section>
//   );
// };

// export default JuniorBanner;

// 'use client';
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const JuniorBanner = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <section
//       className="junior-banner-area relative overflow-hidden"
//       style={{
//         width: "100%",
//         margin: 0,
//         padding: 0,
//         minHeight: isMobile ? "520px" : "800px",
//       }}
//     >
//       <Link
//         href="/junior"
//         className="block relative w-full h-full cursor-pointer"
//         style={{
//           minHeight: isMobile ? "520px" : "800px",
//         }}
//       >
//         <Image
//           src={
//             isMobile
//               ? "/assets/img/juniorBanner/junior.jpg"
//               : "/assets/img/juniorBanner/junior.jpg"
//           }
//           alt="Junior Banner"
//           fill
//           priority
//           sizes="100vw"
//           className="object-cover"
//         />
//       </Link>
//     </section>
//   );
// };

// export default JuniorBanner;


'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";

const JuniorBanner = () => {
  return (
    <section className="junior-banner-area">
      <Link href="/junior" className="banner-image-container block w-full h-full">
        {/* Desktop image */}
        <Image
          src="/assets/img/juniorBanner/junior.jpg"
          alt="Junior Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover hidden md:block"
        />
        {/* Mobile image - ensure proper display */}
        <Image
          src="/assets/img/juniorBanner/junior.jpg"
          alt="Junior Banner Mobile"
          fill
          priority
          sizes="100vw"
          className="object-cover block md:hidden"
          style={{ objectPosition: 'top center' }}
        />
      </Link>
    </section>
  );
};

export default JuniorBanner;
