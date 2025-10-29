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
      <HomeTwoBestSellPrdPrdLoader loading={isLoading}/>
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
    
    // Show up to 5 best seller products without duplication
    let display_items = product_items.slice(0, 5);
    
    content = display_items.map((prd, index) => (
      <div key={`${prd._id}-${index}`} className="col-xl-2-4 col-lg-4 col-md-6 col-sm-6 mb-4">
        <ProductItem product={prd} />
      </div>
    ))
  }
  return (
    <>
      <section className="tp-seller-area pt-60 pb-140 bg-white">
        <div className="container text-center">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-section-title-wrapper-2 mb-50">
                <span className="tp-section-title-pre-2">
                  Best Seller This{" Week's"}
                  <TextShapeLine />
                </span>
                <h3 className="tp-section-title-2">This {"Week's"} Featured</h3>
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