"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const JuniorBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect device width on mount and resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="junior-banner-area"
      style={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Link
        href="/junior"
        className="block relative"
        style={{
          cursor: "pointer",
          display: "block",
          width: "100%",
          height: "auto",
        }}
      >
        {/* ✅ Conditional rendering: only one image visible */}
        {isMobile ? (
          <Image
            src="/assets/img/juniorBanner/banner.jpg"
            alt="Junior Banner Mobile"
            width={800}
            height={300}
            priority
            className="junior-banner-img"
            style={{
              width: "100%",
              height: "160px", // 🔧 mobile height adjustable
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        ) : (
          <Image
            src="/assets/img/juniorBanner/juniorbanner.png"
            alt="Junior Banner Desktop"
            width={1920}
            height={540}
            priority
            className="junior-banner-img"
            style={{
              width: "100%",
              height: "500px", 
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        )}
      </Link>
    </section>
  );
};

export default JuniorBanner;