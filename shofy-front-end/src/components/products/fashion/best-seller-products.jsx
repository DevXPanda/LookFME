'use client';
import React from 'react';
import Link from 'next/link';
// internal
import { TextShapeLine } from '@/svg';
import ProductItem from './product-item';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { HomeTwoBestSellPrdPrdLoader } from '@/components/loader';

const BestSellerProducts = () => {
  const { data: products, isError, isLoading } =
    useGetProductTypeQuery({ type: 'fashion', query: `topSellers=true` });
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeTwoBestSellPrdPrdLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    let product_items = products.data;

    // Adjusting to 8 items to fit a 4-column grid appropriately 
    let display_items = product_items.slice(0, 8);

    content = (
      <>
        <style>{`
          .custom-grid-layout {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            text-align: left;
          }
          @media (max-width: 1200px) {
            .custom-grid-layout {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          @media (max-width: 992px) {
            .custom-grid-layout {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 576px) {
            .custom-grid-layout {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
          }
        `}</style>
        <div className="custom-grid-layout w-100">
          {display_items.map((prd, index) => (
            <div key={`${prd._id}-${index}`} className="h-full">
              <ProductItem product={prd} />
            </div>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <section className="tp-seller-area pt-60 pb-140 bg-white">
        <div className="container text-center">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 mb-50">
                <span className="tp-section-title-pre-2 ">
                  Lookfame In Focus
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2 ">Highlights of the {"Week's"}</h3>
              </div>
            </div>
          </div>
          <div className="row justify-center tp-gx-20">
            {content}
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-seller-more text-center mt-10">
                <Link href="/shop" className="tp-btn tp-btn-border tp-btn-border-sm">Shop All Product</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BestSellerProducts;