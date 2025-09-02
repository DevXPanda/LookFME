'use client';
import { TextShapeLine } from "@/svg";
import React from "react";
import { useEffect, useState, useRef } from "react";

const CouponBanner = () => {
  const [textPosition, setTextPosition] = useState(0);
  const animationRef = useRef(null);

  // Slow left-to-right floating animation
  useEffect(() => {
    const animate = () => {
      setTextPosition((prev) => {
        const newPos = prev + 0.3; // Slow movement from left to right
        if (newPos >= 100) {
          return -100; // Reset to start when reaching end
        }
        return newPos;
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Coupon data
  const coupons = [
    {
      id: 1,
      logo: "PayTm",
      logoColor: "bg-pink",
      title: "Get Cashback Up To",
      amount: "₹600",
      subtitle: "On Bajaj Pay Wallet",
      minAmount: "Minimum Shopping of ₹600"
    },
    {
      id: 2,
      logo: "M",
      logoColor: "bg-pink",
      title: "Get Cashback Up To",
      amount: "₹250",
      subtitle: "On Mobikwik Wallet",
      minAmount: "Minimum Shopping of ₹749"
    },
    {
      id: 3,
      logo: "M",
      logoColor: "bg-pink",
      title: "Get Cashback Up To",
      amount: "₹300",
      subtitle: "On Mobikwik Wallet",
      minAmount: "Minimum Shopping of ₹999"
    },
    {
      id: 4,
      logo: "PayTm",
      logoColor: "bg-pink",
      title: "Get Cashback Up To",
      amount: "₹500",
      subtitle: "On Bajaj Pay Wallet",
      minAmount: "Minimum Shopping of ₹800"
    }
  ];

  return (
    <>
      {/* Special Coupon Corner Banner - Static */}
      <section className="tp-coupon-banner-area py-4 bg-white">
        <div className="container">
          {/* Banner Header */}
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2">
                  Coupon
                  <TextShapeLine/>
                </span>
                <h3 className="tp-section-title-2">
                  Special Coupon
                </h3>
              </div>
            </div>
          </div>

          {/* Static Coupons Container */}
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex-shrink-0">
                    <div className="bg-gray-400 text-white p-3 rounded shadow-lg border border-light-pink coupon-card" style={{ minWidth: '280px' }}>
                      {/* Left Logo Section */}
                      <div className="d-flex align-items-start gap-3">
                        <div className={`${coupon.logoColor} rounded d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '68px', height: '38px' }}>
                          <span className="text-white fw-bold fs-5">{coupon.logo}</span>
                        </div>
                        
                        {/* Coupon Content */}
                        <div className="flex-grow-1">
                          <p className="text-white-75 small mb-1">{coupon.title}</p>
                          <p className="fs-2 fw-bold mb-1">{coupon.amount}</p>
                          <p className="text-white-75 small mb-2">{coupon.subtitle}</p>
                          
                          {/* Minimum Amount Box */}
                          <div className="bg-light-pink text-dark small px-2 py-1 rounded d-inline-block">
                            {coupon.minAmount}
                          </div>
                        </div>
                      </div>
                      
                      {/* Dashed Line on Left */}
                      <div className="position-absolute start-0 top-0 h-100" style={{ width: '4px' }}>
                        <div className="h-100 border-start border-2 border-dashed border-light-pink"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Making Global Fashion Accessible - Floating Animation */}
      {/* Right-to-Left Looping Animated Text Banner */}
      <div style={{
        width: '100%',
        margin: '0 auto',
        overflow: 'hidden',
        background: 'whitesmoke',
        // borderTop: '1px solid #eee',
        marginTop: '32px',
        position: 'relative',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1
      }}>
        <div className="global-fashion-marquee" style={{
          whiteSpace: 'nowrap',
          display: 'inline-block',
          position: 'absolute',
          right: 0,
          animation: 'marquee-right-left 12s linear infinite'
        }}>
          <span style={{ fontWeight: 700, fontSize: '3.1rem', color: '#222' }}>
          <h3 className="tp-section-title-2">
          Making Global Fashion Accessible
                </h3>
           
          </span>
        </div>
        <style>{`
          @keyframes marquee-right-left {
            0% { right: -100%; }
            100% { right: 100%; }
          }
        `}</style>
      </div>
    </>
   
  );
};

export default CouponBanner;
