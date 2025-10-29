"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const JuniorBanner = () => {
  return (
    <section className="junior-banner-area">
      <div className="container">
        <Link
          href="/junior"
          className="d-block position-relative rounded-4 overflow-hidden shadow-sm"
          style={{ cursor: "pointer" }}
        >
          <Image
            src="/assets/img/juniorBanner/Kids_Banner_Home.webp"
            alt="Junior Banner"
            width={1500}
            height={500}
            className="w-100 rounded-4"
            priority
          />
        </Link>
      </div>
    </section>
  );
};

export default JuniorBanner;