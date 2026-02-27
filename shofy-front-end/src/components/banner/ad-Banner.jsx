"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetBannersQuery } from "@/redux/features/bannerApi";

const AdBanner = () => {
  const { data, isLoading } = useGetBannersQuery();
  const banners = (data?.data ?? []).filter(b => b.bannerType === 'ads_banner');

  if (isLoading || banners.length === 0) {
    return null;
  }

  const banner = banners[0];
  const desktopImg = banner.image || "/assets/img/ad/ad.jpeg";
  const mobileImg = banner.imageMobile || banner.image || "/assets/img/ad/ad.jpeg";

  return (
    <section className="ad-banner-area">
      <Link
        href={banner.redirectLink || "/shop?category=cosmetic"}
        className="banner-image-container cursor-pointer"
      >
        {/* Desktop Image */}
        <Image
          src={desktopImg}
          alt={banner.title || "Ad Banner"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 100vw"
          className="hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src={mobileImg}
          alt={banner.title || "Ad Banner Mobile"}
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
