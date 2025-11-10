"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const JuniorBanner = () => {
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
        style={{ cursor: "pointer", display: "block" }}
      >
        <div style={{ position: "relative", width: "100%", height: "auto" }}>
          <img
            src="/assets/img/juniorBanner/juniorbanner.png"
            alt="Junior Banner"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      </Link>
    </section>
  );
};

export default JuniorBanner;
