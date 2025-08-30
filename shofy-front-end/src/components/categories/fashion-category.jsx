'use client';
import React from "react";
import { useRouter } from "next/navigation";
// internal
import ErrorMsg from "../common/error-msg";
import { ArrowRightLong } from "@/svg";
import { HomeTwoCateLoader } from "../loader";
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";

const FashionCategory = () => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useGetProductTypeCategoryQuery("fashion");
  const router = useRouter()

  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(
      `/shop?category=${title
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeTwoCateLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result;
    content = category_items.map((item) => (
      <div key={item._id} className="col-xxl-5th col-xl-5th col-lg-4 col-md-6 col-sm-6">
        <div 
          className="tp-banner-item-2 p-relative z-index-1 grey-bg-2 mb-20 fix mx-2"
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <div
            className="tp-banner-thumb-2 include-bg transition-3"
            style={{ backgroundImage: `url(${item.img})` }}
          ></div>
          <h3 className="tp-banner-title-2">
            <a
              className="cursor-pointer text-xs font-medium text-center block"
              onClick={() => handleCategoryRoute(item.parent)}
            >
              {item.parent}
            </a>
          </h3>
          <div className="tp-banner-btn-2 mb-auto">
            <a
              onClick={() => handleCategoryRoute(item.parent)}
              className="cursor-pointer tp-btn tp-btn-border tp-btn-border-sm text-xs px-3 py-2 font-medium"
            >
              Shop Now <ArrowRightLong />
            </a>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <>
      <section className="tp-banner-area mt-20">
        <div className="w-full max-w-none px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="row tp-gx-20 justify-center">{content}</div>
        </div>
      </section>
    </>
  );
};

export default FashionCategory;
