'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const JuniorBanner = () => {
  return (
    <section className="junior-banner-area">
      <Link
        href="/junior"
        className="banner-image-container cursor-pointer"
      >
        {/* Desktop Image */}
        <Image
          src="/assets/img/juniorBanner/junior.jpg"
          alt="Junior Banner"
          fill
          priority
          sizes="(max-width: 768px) 0vw, 100vw"
          className="hidden md:block"
        />

        {/* Mobile Image */}
        <Image
          src="/assets/img/juniorBanner/junior.jpg"
          alt="Junior Banner Mobile"
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
