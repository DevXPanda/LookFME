

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
        href="/shop?category=cosmetic"
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
