
// "use client";
// import React from "react";
// import Image from "next/image";
// import Link from "next/link";

// const AdBanner = () => {
//   const desktopImg = "/assets/img/ad/ad.jpeg";
//   const mobileImg = "/assets/img/ad/ad.jpeg";

//   return (
//     <section className="ad-banner-area" style={{ width: '100%', maxWidth: '100%', overflow: 'hidden', position: 'relative', minHeight: '800px' }}>
//       <Link 
//         href="/ad" 
//         className="banner-image-container cursor-pointer block w-full h-full"
//         style={{ width: '100%', maxWidth: '100%', height: '100%', position: 'relative', display: 'block' }}
//       >
//         {/* Desktop image */}
//         <Image
//           src={desktopImg}
//           alt="Ad Banner"
//           fill
//           priority
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
//           className="object-cover hidden md:block"
//           style={{ objectFit: 'cover', objectPosition: 'center' }}
//         />
//         {/* Mobile image */}
//         <Image
//           src={mobileImg}
//           alt="Ad Banner"
//           fill
//           priority
//           sizes="(max-width: 425px) 100vw, (max-width: 768px) 100vw, 800px"
//           className="object-cover block md:hidden"
//           style={{ objectFit: 'cover', objectPosition: 'center' }}
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
    <section className="ad-banner-area">
      <Link
        href="/ad"
        className="banner-image-container cursor-pointer"
      >
        {/* Desktop Image */}
        <Image
          src={desktopImg}
          alt="Ad Banner"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src={mobileImg}
          alt="Ad Banner Mobile"
          fill
          priority
          sizes="100vw"
          className="block md:hidden"
        />
      </Link>
    </section>
  );
};

export default AdBanner;
