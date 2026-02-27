'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetBannersQuery } from '@/redux/features/bannerApi';

const JuniorBanner = () => {
  const { data, isLoading } = useGetBannersQuery();
  const banners = (data?.data ?? []).filter(b => b.bannerType === 'junior_banner');

  if (isLoading || banners.length === 0) {
    return null;
  }

  const banner = banners[0];

  return (
    <section className="junior-banner-area">
      <Link
        href={banner.redirectLink || "/junior"}
        className="banner-image-container cursor-pointer"
      >
        {/* Desktop Image */}
        <Image
          src={banner.image || "/assets/img/juniorBanner/junior.jpg"}
          alt={banner.title || "Junior Banner"}
          fill
          priority
          sizes="(max-width: 768px) 0vw, 100vw"
          className="hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src={banner.imageMobile || banner.image || "/assets/img/juniorBanner/junior.jpg"}
          alt={banner.title || "Junior Banner Mobile"}
          fill
          priority
          sizes="100vw"
          className="block md:hidden"
        />
      </Link>
    </section>
  );
};

export default JuniorBanner;
