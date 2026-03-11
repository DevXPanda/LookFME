'use client';
import Image from "next/image";
import { useState, useMemo } from "react";
import PopupVideo from "../common/popup-video";
import { getYoutubeVideoId } from "@/utils/youtube";

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
  videoId: videoIdProp = false,
  status
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoId = useMemo(() => {
    if (!videoIdProp) return false;
    const id = getYoutubeVideoId(videoIdProp);
    return id || false;
  }, [videoIdProp]);

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

  // Add video thumbnail if videoId exists
  if (videoId) {
    uniqueThumbnails.push({ img: "video", isVideo: true });
  }

  return (
    <>
      <div className="tp-product-details-thumb-wrapper tp-tab d-sm-flex">
        <nav>
          <div className="nav nav-tabs flex-sm-column">
            {uniqueThumbnails.map((item, i) => (
              <button
                key={i}
                className={`nav-link ${item.img === "video" ? (activeImg === "video" ? "active" : "") : (formatImageUrl(item.img) === activeImg ? "active" : "")}`}
                onClick={() => {
                  if (item.img === "video") {
                    handleImageActive({ img: "video" });
                  } else {
                    handleImageActive(item);
                  }
                }}
              >
                {item.img === "video" ? (
                  <div className="video-thumb-placeholder flex items-center justify-center bg-gray-100 w-full h-full">
                    <i className="fas fa-play"></i>
                  </div>
                ) : (
                  <Image
                    src={formatImageUrl(item.img)}
                    alt="image"
                    width={78}
                    height={100}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>
        <div className="tab-content m-img">
          <div className="tab-pane fade show active">
            <div className="tp-product-details-nav-main-thumb p-relative">
              {videoId && activeImg === "video" ? (
                <div className="tp-product-details-video-iframe">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <>
                  <Image
                    src={activeImg}
                    alt="product img"
                    width={imgWidth}
                    height={imgHeight}
                  />
                  <div className="tp-product-badge">
                    {status === 'out-of-stock' && <span className="product-hot">out-stock</span>}
                  </div>
                </>
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
