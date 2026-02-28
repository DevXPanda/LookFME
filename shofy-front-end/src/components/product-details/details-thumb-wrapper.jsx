'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import PopupVideo from "../common/popup-video";

const formatImageUrl = (url) => {
  if (!url || typeof url !== "string") return "https://placehold.co/200x200?text=No+Image";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) {
    return `http://localhost:7000${url}`;
  }
  return url;
};

const DetailsThumbWrapper = ({
  imageURLs: variations = [],
  img = "",
  supportingImages = [],
  handleImageActive,
  activeImg,
  imgWidth = 416,
  imgHeight = 480,
  videoId = false,
  status
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Combine all images
  const allThumbnails = [];

  // 1. Main image
  if (img) {
    allThumbnails.push({ img: img });
  }

  // 2. Variations
  if (variations && variations.length > 0) {
    variations.forEach(v => {
      if (v.img) allThumbnails.push({ img: v.img });
    });
  }

  // 3. Supporting images
  if (supportingImages && supportingImages.length > 0) {
    supportingImages.forEach(sImg => {
      if (sImg) allThumbnails.push({ img: sImg });
    });
  }

  // Create a unique array of thumbnails based on URL
  const uniqueThumbnails = Array.from(new Map(allThumbnails.map(item => [item.img, item])).values());

  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {uniqueThumbnails.map((item, i) => (
              <button
                key={i}
                className={`nav-link ${formatImageUrl(item.img) === activeImg ? "active" : ""}`}
                onClick={() => handleImageActive(item)}
              >
                <Image
                  src={formatImageUrl(item.img)}
                  alt="image"
                  width={78}
                  height={100}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              <Image
                src={activeImg}
                alt="product img"
                width={imgWidth}
                height={imgHeight}
              />
              <div className="tp-product-badge">
                {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
              </div>
              {videoId && (
                <div
                  onClick={() => setIsVideoOpen(true)}
                  className="tp-product-details-thumb-video"
                >
                  <a className="tp-product-details-thumb-video-btn cursor-pointer popup-video">
                    <i className="fas fa-play"></i>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal popup start */}
      {videoId && (
        <PopupVideo
          isVideoOpen={isVideoOpen}
          setIsVideoOpen={setIsVideoOpen}
          videoId={videoId}
        />
      )}
      {/* modal popup end */}
    </>
  );
};

export default DetailsThumbWrapper;
