"use client";
import React, { useState, useEffect } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { HomeTwoNewPrdPrdLoader } from "@/components/loader";

const baseCategories = [
  "View All",
  "Shirts",
  "Trousers",
  "T-shirts",
  "Polo T-shirts",
];

const categoryLimits = {
  Shirts: 4,
  Trousers: 3,
  "T-shirts": 4,
  "Polo T-shirts": 3,
};

const matchesCategory = (productCategory = "", target = "") => {
  const cat = productCategory.toLowerCase();
  const tar = target.toLowerCase();
  if (tar === "shirts") return cat.includes("shirt");
  if (tar === "trousers")
    return cat.includes("trouser") || cat.includes("pant");
  if (tar === "t-shirts") return cat.includes("t-shirt") || cat.includes("tee");
  if (tar === "polo t-shirts") return cat.includes("polo");
  return cat.includes(tar);
};

const TrendingProducts = () => {
  const {
    data: products,
    isError,
    isLoading,
  } = useGetProductTypeQuery({
    type: "fashion",
    query: `new=true`,
  });

  const [activeCat, setActiveCat] = useState("View All");
  const [categories, setCategories] = useState(baseCategories);

  useEffect(() => {
    if (!products?.data) return;
    const dynamicSet = new Set(baseCategories);
    products.data.forEach((item) => {
      if (
        typeof item.category === "string" &&
        item.category.trim().length > 0
      ) {
        dynamicSet.add(item.category.trim());
      }
    });
    setCategories(Array.from(dynamicSet));
  }, [products?.data]);

  let content = null;

  if (isLoading) content = <HomeTwoNewPrdPrdLoader loading={isLoading} />;
  if (!isLoading && isError) content = <ErrorMsg msg="There was an error" />;
  if (!isLoading && !isError && products?.data?.length === 0)
    content = <ErrorMsg msg="No Products found!" />;

  if (!isLoading && !isError && products?.data?.length > 0) {
    const getItemsForCategory = (cat) => {
      if (cat === "View All") return products.data;
      const matches = products.data.filter((p) =>
        matchesCategory(p.category || "", cat)
      );
      if (matches.length === 0) return products.data;
      const limit = categoryLimits[cat] ?? 4;
      return matches.slice(0, limit);
    };

    const filteredItems = getItemsForCategory(activeCat);

    content = (
      <>
        <style>{`
          .tp-trending-grid {
            display: grid;
            gap: 28px;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            margin-top: 40px;
          }

          @media (max-width: 768px) {
            .tp-trending-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              padding: 0 10px;
            }
          }

          @media (max-width: 480px) {
            .tp-trending-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
            }
          }
        `}</style>

        <div className="tp-trending-grid">
          {filteredItems.map((item) => (
            <div key={item._id} className="tp-trending-item">
              <ProductItem product={item} style_2={true} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <section
      className="tp-trending-area bg-white"
      style={{
        width: "100%",
        overflowX: "hidden",
        padding: "80px 0 100px",
      }}
    >
      <div
        className="container text-center"
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <h2
          className="text-4xl tracking-wide"
          style={{ fontFamily: "var(--tp-ff-poppins)" }}
        >
           New Arrivals
          </h2>
        <p className="text-gray-500 mt-3">Get them before everyone else does</p>

        <style>{`
          .filter-pills {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap; /* desktop: wrap */
            margin-top: 24px;
            margin-bottom: 8px;
          }
          .filter-btn {
            padding: 12px 22px;
            border-radius: 9999px;
            border: 1px solid #d1d5db;
            background: #ffffff;
            color: #374151;
            font-weight: 600;
            font-size: 16px;
            line-height: 1;
            transition: all 200ms ease;
            white-space: nowrap;
            flex-shrink: 0;
          }
          .filter-btn--active {
            background: #FF8FB7;
            color: white;
            border-color: #FF8FB7;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }

          @media (max-width: 768px) {
            .filter-pills {
              overflow-x: auto;
              flex-wrap: nowrap; 
              justify-content: flex-start;
              padding: 0 16px;
              -webkit-overflow-scrolling: touch;
            }
            /* Optional: hide scroll bar */
            .filter-pills::-webkit-scrollbar {
              display: none;
            }
          }
        `}</style>

        <div className="filter-pills">
          {categories.map((cat) => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`filter-btn ${isActive ? "filter-btn--active" : ""}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="tp-trending-slider">{content}</div>
      </div>
    </section>
  );
};

export default TrendingProducts;
