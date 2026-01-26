// 'use client';
// import React from "react";
// import { TextShapeLine } from "@/svg";

// const CouponBanner = () => {

//   const coupons = [
//     {
//       id: 1,
//       logo: "PayTm",
//       logoColor: "bg-pink",
//       title: "Get Cashback Up To",
//       amount: "₹600",
//       subtitle: "On Bajaj Pay Wallet",
//       minAmount: "Minimum Shopping of ₹600"
//     },
//     {
//       id: 2,
//       logo: "M",
//       logoColor: "bg-pink",
//       title: "Get Cashback Up To",
//       amount: "₹250",
//       subtitle: "On Mobikwik Wallet",
//       minAmount: "Minimum Shopping of ₹749"
//     },
//     {
//       id: 3,
//       logo: "M",
//       logoColor: "bg-pink",
//       title: "Get Cashback Up To",
//       amount: "₹300",
//       subtitle: "On Mobikwik Wallet",
//       minAmount: "Minimum Shopping of ₹999"
//     },
//     {
//       id: 4,
//       logo: "PayTm",
//       logoColor: "bg-pink",
//       title: "Get Cashback Up To",
//       amount: "₹500",
//       subtitle: "On Bajaj Pay Wallet",
//       minAmount: "Minimum Shopping of ₹800"
//     }
//   ];

//   return (
//     <>
//       {/* Coupon Section */}
//       <section className="tp-coupon-banner-area py-4 bg-white">
//         <div className="container">

//           {/* Heading */}
//           <div className="row">
//             <div className="col-12">
//               <div className="tp-section-title-wrapper-2 text-center mb-50">
//                 <span className="tp-section-title-pre-2">
//                   Coupon <TextShapeLine />
//                 </span>
//                 <h3 className="tp-section-title-2">Special Coupon</h3>
//               </div>
//             </div>
//           </div>

//           {/* Sliding Coupons */}
//           <div className="coupon-slider">
//             <div className="coupon-track">
//               {[...coupons, ...coupons].map((coupon, index) => (
//                 <div key={index} className="coupon-item">
//                   <div
//                     className="bg-gray-400 text-white p-3 rounded shadow-lg position-relative"
//                     style={{ minWidth: "280px" }}
//                   >
//                     <div className="d-flex gap-3">
//                       <div
//                         className={`${coupon.logoColor} d-flex align-items-center justify-content-center rounded`}
//                         style={{ width: "68px", height: "38px" }}
//                       >
//                         <span className="fw-bold text-white">{coupon.logo}</span>
//                       </div>

//                       <div>
//                         <p className="small mb-1">{coupon.title}</p>
//                         <p className="fs-2 fw-bold mb-1">{coupon.amount}</p>
//                         <p className="small mb-2">{coupon.subtitle}</p>
//                         <span className="bg-light-pink text-dark small px-2 py-1 rounded">
//                           {coupon.minAmount}
//                         </span>
//                       </div>
//                     </div>

//                     {/* dashed line */}
//                     <span className="position-absolute top-0 start-0 h-100 border-start border-2 border-dashed border-light-pink"></span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* Bottom Marquee Text */}
//       <div className="fashion-marquee">
//         <div className="fashion-text">
//           <h3 className="tp-section-title-2 mb-0">
//             <span>Making Global Fashion Accessible</span>
//             <span>Making Global Fashion Accessible</span>
//             <span>Making Global Fashion Accessible</span>
//           </h3>
//         </div>
//       </div>

//       {/* Styles */}
//       <style jsx>{`
//         .coupon-slider {
//           width: 100%;
//           overflow: hidden;
//         }

//         .coupon-track {
//           display: flex;
//           gap: 24px;
//           width: max-content;
//           animation: couponMove 18s linear infinite;
//         }

//         @keyframes couponMove {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .coupon-track:hover {
//           animation-play-state: paused;
//         }

//         .fashion-marquee {
//           width: 100%;
//           overflow: hidden;
//           background: whitesmoke;
//           margin-top: 32px;
//           height: 80px;
//           display: flex;
//           align-items: center;
//           position: relative;
//           margin-bottom: 20px;
//         }

//         .fashion-text {
//           position: absolute;
//           white-space: nowrap;
//           animation: textMove 12s linear infinite;
//         }

//         @keyframes textMove {
//           from {
//             right: -100%;
//           }
//           to {
//             right: 100%;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default CouponBanner;


'use client';
import React from "react";
import { TextShapeLine } from "@/svg";

const CouponBanner = () => {

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
      {/* Coupon Section */}
      <section className="tp-coupon-banner-area py-4 bg-white">
        <div className="container">

          {/* Heading */}
          <div className="row">
            <div className="col-12">
              <div className="tp-section-title-wrapper-2 text-center mb-50">
                <span className="tp-section-title-pre-2">
                  Coupon <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">Special Coupon</h3>
              </div>
            </div>
          </div>

          {/* Sliding Coupons */}
          <div className="coupon-slider">
            <div className="coupon-track">
              {[...coupons, ...coupons].map((coupon, index) => (
                <div key={index} className="coupon-item">
                  <div
                    className="bg-gray-400 text-white p-3 rounded shadow-lg position-relative"
                    style={{ minWidth: "280px" }}
                  >
                    <div className="d-flex gap-3">
                      <div
                        className={`${coupon.logoColor} d-flex align-items-center justify-content-center rounded`}
                        style={{ width: "68px", height: "38px" }}
                      >
                        <span className="fw-bold text-white">{coupon.logo}</span>
                      </div>

                      <div>
                        <p className="small mb-1">{coupon.title}</p>
                        <p className="fs-2 fw-bold mb-1">{coupon.amount}</p>
                        <p className="small mb-2">{coupon.subtitle}</p>
                        <span className="bg-light-pink text-dark small px-2 py-1 rounded">
                          {coupon.minAmount}
                        </span>
                      </div>
                    </div>

                    {/* dashed line */}
                    <span className="position-absolute top-0 start-0 h-100 border-start border-2 border-dashed border-light-pink"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Smooth Infinite Loop Marquee */}
      <div className="fashion-marquee">
        <div className="fashion-track">
          <span>Connecting You to Global Fashion Trends</span>
          <span>Connecting You to Global Fashion Trends</span>
          <span>Connecting You to Global Fashion Trends</span>

          <span>Connecting You to Global Fashion Trends</span>
          <span>Connecting You to Global Fashion Trends</span>
          <span>Connecting You to Global Fashion Trends</span>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .coupon-slider {
          width: 100%;
          overflow: hidden;
        }

        .coupon-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: couponMove 18s linear infinite;
        }

        @keyframes couponMove {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .coupon-track:hover {
          animation-play-state: paused;
        }

        /* Smooth Continuous Marquee */
        .fashion-marquee {
          width: 100%;
          overflow: hidden;
          background: whitesmoke;
          padding: 20px 0;
          white-space: nowrap;
          margin-top: 30px;
          margin-bottom: 20px;
        }

        .fashion-track {
          display: inline-flex;
          gap: 60px;
          animation: smoothMarquee 15s linear infinite;
        }

        .fashion-track span {
          font-size: 32px;
          font-weight: 600;
          padding-right: 40px;
        }

        @keyframes smoothMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
};

export default CouponBanner;
