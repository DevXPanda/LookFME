"use client";
import React, { useState, useEffect } from "react";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { HomeTwoNewPrdPrdLoader } from "@/components/loader";

// Normalize category/subcategory names for consistent comparison (handles case, hyphens, spaces, & symbols)
// Removes all spaces and hyphens to match variations like "T-shirt" vs "Tshirt" vs "T Shirt"
const normalizeCategoryName = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[-\s]+/g, '')  // Remove all hyphens and spaces
    .trim();
};

/* ------------------ Base Categories ------------------ */
const baseCategories = [
  "View All",
  "Shirts",
  "Trousers",
  "T-shirts",
  "Polo T-shirts",
];

/* ------------------ Category Limits ------------------ */
const categoryLimits = {
  Shirts: 4,
  Trousers: 3,
  "T-shirts": 4,
  "Polo T-shirts": 3,
};

/* ------------------ Component ------------------ */
const TrendingProducts = () => {
  const {
    data: products,
    isError,
    isLoading,
  } = useGetProductTypeQuery({
    type: "fashion",
    query: "new=true",
  });

  const [activeCat, setActiveCat] = useState("View All");
  const [categories, setCategories] = useState(baseCategories);

  /* --------- Build categories dynamically - keep all base categories visible --------- */
  useEffect(() => {
    if (!products?.data) return;

    const dynamicSet = new Set(baseCategories); // Keep all base categories

    // Also add any additional categories found in product data
    products.data.forEach((item) => {
      if (typeof item.category === "string" && item.category.trim()) {
        const catName = item.category.trim();
        if (!baseCategories.includes(catName)) {
          dynamicSet.add(catName);
        }
      }
    });

    setCategories(Array.from(dynamicSet));
  }, [products?.data]);

  let content = null;

  if (isLoading) {
    content = <HomeTwoNewPrdPrdLoader loading={isLoading} />;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }

  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }

  if (!isLoading && !isError && products?.data?.length > 0) {
    const getItemsForCategory = (cat) => {
      if (cat === "View All") return products.data;

      // Normalize filter category and check all product category fields
      const normalizedFilterCategory = normalizeCategoryName(cat);
      const matches = products.data.filter((p) => {
        // Check all category fields with normalized comparison
        const normalizedProductCategory = normalizeCategoryName(p.category?.name);
        const normalizedProductParent = normalizeCategoryName(p.parent);
        const normalizedProductChildren = normalizeCategoryName(p.children);
        // Also check if p.category is a string (legacy support)
        const normalizedCategoryString = typeof p.category === 'string' ? normalizeCategoryName(p.category) : '';

        return normalizedProductCategory === normalizedFilterCategory ||
          normalizedProductParent === normalizedFilterCategory ||
          normalizedProductChildren === normalizedFilterCategory ||
          normalizedCategoryString === normalizedFilterCategory;
      });

      // Return empty array if no matches (don't fall back to all products)
      // This allows us to show "No products found" message
      if (matches.length === 0) return [];

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

        {filteredItems.length > 0 ? (
          <div className="tp-trending-grid">
            {filteredItems.map((item) => (
              <div key={item._id} className="tp-trending-item">
                <ProductItem product={item} style_2 />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: '40px', padding: '40px 0' }}>
            <ErrorMsg msg={`No products found in "${activeCat}" category. Please check back later!`} />
          </div>
        )}
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

        <p className="text-gray-500 mt-3">
          Get them before everyone else does
        </p>

        <style>{`
          .filter-pills {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
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
            transition: all 200ms ease;
            white-space: nowrap;
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

            .filter-pills::-webkit-scrollbar {
              display: none;
            }
          }
        `}</style>

        <div className="filter-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`filter-btn ${activeCat === cat ? "filter-btn--active" : ""
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="tp-trending-slider">{content}</div>
      </div>
    </section>
  );
};

export default TrendingProducts;
