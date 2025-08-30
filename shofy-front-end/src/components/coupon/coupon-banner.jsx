'use client';
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
      logo: "B FINSERV",
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
      logo: "B FINSERV",
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
      <section className="tp-coupon-banner-area py-4 bg-dark">
        <div className="container">
          {/* Banner Header */}
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div className="d-flex align-items-center">
                  <span className="text-pink fs-1 me-2">%</span>
                  <h2 className="text-white fs-1 fw-bold mb-0">SPECIAL COUPON CORNER</h2>
                  <span className="text-pink fs-1 ms-2">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Static Coupons Container */}
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="flex-shrink-0">
                    <div className="bg-pink text-white p-3 rounded shadow-lg border border-light-pink coupon-card" style={{ minWidth: '280px' }}>
                      {/* Left Logo Section */}
                      <div className="d-flex align-items-start gap-3">
                        <div className={`${coupon.logoColor} rounded d-flex align-items-center justify-content-center flex-shrink-0`} style={{ width: '48px', height: '48px' }}>
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
      <section className="tp-slogan-area py-4 bg-pink">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="position-relative overflow-hidden">
                <div 
                  className="text-center"
                  style={{ 
                    transform: `translateX(${textPosition}%)`,
                    transition: 'transform 0.1s linear'
                  }}
                >
                  <h2 className="display-5 fw-bold text-dark mb-0">
                    Making Global Fashion Accessible
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CouponBanner;
