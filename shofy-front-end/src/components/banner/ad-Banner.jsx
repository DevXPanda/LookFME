"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const AdBanner = () => {
  return (
    <section
      className="junior-banner-area"
      style={{
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        width: "100vw",
      }}
    >
      <Link
        href="/junior"
        className="d-block position-relative rounded-4 overflow-hidden shadow-sm"
        style={{ cursor: "pointer" }}
      >
        <Image
          src="/assets/img/ad/maxresdefault.jpg"
          alt="Junior Banner"
          width={1500}
          height={500}
          className="w-100 rounded-4"
          priority
        />
      </Link>
    </section>
  );
};

export default AdBanner;