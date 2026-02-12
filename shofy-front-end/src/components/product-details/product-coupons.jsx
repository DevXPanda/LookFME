'use client';
import React, { useState } from "react";
import { useGetProductCouponsQuery } from "@/redux/features/coupon/couponApi";
import Image from "next/image";
import CopyToClipboard from "react-copy-to-clipboard";
import dayjs from "dayjs";
import OfferTimer from "../coupon/offer-timer";

const ProductCoupons = ({ productId }) => {
  const { data: coupons, isLoading, isError } = useGetProductCouponsQuery(productId);
  const [copiedCode, setCopiedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopied = (code) => {
    setCopiedCode(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  if (isLoading || isError || !coupons || coupons.length === 0) {
    return null;
  }

  return (
    <div className="tp-product-coupons mb-30">
      <h4 className="tp-product-coupons-title mb-20">Available Coupons</h4>
      <div className="row">
        {coupons.map((coupon) => (
          <div key={coupon._id} className="col-lg-6 mb-20">
            <div className="tp-coupon-item p-relative d-md-flex justify-content-between align-items-center">
              <span className="tp-coupon-border"></span>
              <div className="tp-coupon-item-left d-sm-flex align-items-center">
                <div className="tp-coupon-thumb">
                  <a href="#">
                    <Image 
                      src={coupon.logo} 
                      alt={coupon.title} 
                      width={120} 
                      height={120} 
                    />
                  </a>
                </div>
                <div className="tp-coupon-content">
                  <h3 className="tp-coupon-title">{coupon.title}</h3>
                  <p className="tp-coupon-offer mb-15">
                    <span>{coupon.discountPercentage}%</span>Off
                  </p>
                  <div className="tp-coupon-countdown">
                    {dayjs().isAfter(dayjs(coupon.endTime)) ? (
                      <div className="tp-coupon-countdown-inner">
                        <ul>
                          <li><span>{0}</span> Day</li>
                          <li><span>{0}</span> Hrs</li>
                          <li><span>{0}</span> Min</li>
                          <li><span>{0}</span> Sec</li>
                        </ul>
                      </div>
                    ) : (
                      <OfferTimer expiryTimestamp={new Date(coupon.endTime)} />
                    )}
                  </div>
                </div>
              </div>
              <div className="tp-coupon-item-right pl-20">
                <div className="tp-coupon-status mb-10 d-flex align-items-center">
                  <span className="tp-coupon-status-text">Min: ₹{coupon.minimumAmount}</span>
                </div>
                <CopyToClipboard
                  text={coupon.couponCode}
                  onCopy={() => handleCopied(coupon.couponCode)}
                >
                  <button className="tp-coupon-btn w-100">
                    {copied && copiedCode === coupon.couponCode ? "Copied!" : coupon.couponCode}
                  </button>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCoupons;
