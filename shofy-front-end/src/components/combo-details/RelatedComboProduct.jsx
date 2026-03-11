"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TextShapeLine } from "@/svg";
import { useGetComboProductsQuery } from "@/redux/features/comboProductApi";
import { Rating } from "react-simple-star-rating";
import { HomeTwoBestSellPrdPrdLoader } from "@/components/loader";
import ErrorMsg from "@/components/common/error-msg";
import "@/styles/rating-fix.css";

const RelatedComboProduct = () => {
  const router = useRouter();
  const { data: combosData, isLoading, isError } = useGetComboProductsQuery();
  const allCombos = combosData?.data ?? [];
  const combos = allCombos.slice(0, 8);

  const handleComboClick = (combo) => {
    if (combo?._id) router.push(`/combo-details/${combo._id}`);
  };

  let content = null;
  if (isLoading) {
    content = <HomeTwoBestSellPrdPrdLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="Failed to load combos" />;
  }
  if (!isLoading && !isError && combos.length === 0) {
    content = <ErrorMsg msg="No combos found" />;
  }
  if (!isLoading && !isError && combos.length > 0) {
    content = (
      <>
        <style>{`
          .combo-products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            text-align: left;
          }
          @media (max-width: 1200px) {
            .combo-products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 992px) {
            .combo-products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 576px) {
            .combo-products-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              padding: 0 10px;
            }
          }
          .combo-product-card {
            display: flex;
            flex-direction: column;
            height: 100%;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            background: #fff;
            transition: box-shadow 0.3s ease;
          }
          .combo-product-card:hover {
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          }
          .combo-card-image {
            position: relative;
            aspect-ratio: 4 / 5;
            width: 100%;
            background: #f8f8f8;
            overflow: hidden;
          }
          .combo-card-image img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: top;
            transition: transform 0.3s ease;
          }
          .combo-product-card:hover .combo-card-image img {
            transform: scale(1.05);
          }
          .combo-card-content {
            padding: 16px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
          }
          .combo-card-title {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            min-height: 45px;
            margin: 10px 0;
            text-decoration: none;
            transition: color 0.2s;
          }
          .combo-card-title:hover {
            color: #e53e3e;
          }
          .combo-card-price {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: auto;
          }
          .combo-current-price {
            font-size: 18px;
            font-weight: 600;
            color: #111;
          }
          .combo-old-price {
            font-size: 14px;
            color: #888;
            text-decoration: line-through;
          }
          .combo-discount-text {
            font-size: 14px;
            font-weight: 600;
            color: #38a169;
          }
        `}</style>
        <div className="combo-products-grid w-100">
          {combos.map((combo) => {
            const imgSrc = combo.banner_image || combo.img || "https://placehold.co/400x500?text=Combo";
            const price = Number(combo.price) || 0;
            const originalPrice = Number(combo.original_price) || price;
            const discount = Number(combo.discount) || 0;
            const hasDiscount = discount > 0 && originalPrice > price;

            return (
              <div
                key={combo._id}
                className="h-full"
                onClick={() => handleComboClick(combo)}
                onKeyDown={(e) => e.key === "Enter" && handleComboClick(combo)}
                role="button"
                tabIndex={0}
              >
                <div className="combo-product-card">
                  <div className="combo-card-image">
                    <Image
                      src={imgSrc}
                      alt={combo.title || "Combo"}
                      fill
                      sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, (max-width: 1200px) 25vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="combo-card-content">
                    <div className="mb-2">
                      <Rating allowFraction size={14} initialValue={5} readonly />
                    </div>
                    <Link
                      href={`/combo-details/${combo._id}`}
                      className="combo-card-title"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {combo.title}
                    </Link>
                    <div className="combo-card-price">
                      <span className="combo-current-price">₹{price.toFixed(2)}</span>
                      {hasDiscount && (
                        <>
                          <span className="combo-old-price">₹{originalPrice.toFixed(2)}</span>
                          <span className="combo-discount-text">({discount}% off)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <section className="tp-seller-area pt-60 pb-140 bg-white">
      <div className="container text-center">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 mb-50">
              <span className="tp-section-title-pre-2">
                Next Day Products
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Combo Products</h3>
            </div>
          </div>
        </div>
        <div className="row justify-center tp-gx-20">
          {content}
        </div>
      </div>
    </section>
  );
};

export default RelatedComboProduct;
