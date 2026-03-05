'use client';
import React from "react";
import Image from "next/image";
import payment_option_img from '@assets/img/product/icons/payment-option.png';

const DetailsBottomInfo = ({ sku, category, tag }) => {
  return (
    <>
      {/* product-details-query */}
      <div className="tp-product-details-query">
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>SKU: </span>
          <p>{sku}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Category: </span>
          <p>{category}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Tag: </span>
          <p>{tag}</p>
        </div>
      </div>

      {/*  product-details-social*/}

      <div className="tp-product-details-social">
        <span>Share: </span>
        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-facebook-f"></i>
        </a>
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}`}
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
        {/* Instagram */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fa-brands fa-instagram"></i>
        </a>
        {/* Generic Share / Copy Link */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Check out this product!',
                url: window.location.href,
              }).catch(console.error);
            } else {
              // Fallback: Copy to Clipboard
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '0',
            marginLeft: '10px',
            cursor: 'pointer',
            color: '#55585b',
            fontSize: '16px'
          }}
          title="Share Link"
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>

      {/* product-details-msg */}

      <div className="tp-product-details-msg mb-15">
        <ul>
          <li>2 days easy returns</li>
          <li>Order yours before 2.30pm for same day dispatch</li>
        </ul>
      </div>
      {/* product-details-payment */}
      <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
        <p>
          Guaranteed safe <br /> & secure checkout
        </p>
        <Image src={payment_option_img} alt="payment_option_img" />
      </div>
    </>
  );
};

export default DetailsBottomInfo;
