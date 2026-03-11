'use client'
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import ShopLoader from "../loader/shop/shop-loader";
import ErrorMsg from "../common/error-msg";
import ShopFilterOffCanvas from "../common/shop-filter-offcanvas";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ShopContent from "./shop-content";

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

const ShopArea = ({ shop_right = false, hidden_sidebar = false }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const subCategory = searchParams.get('subCategory') || searchParams.get('type');
  const filterColor = searchParams.get('color');
  const status = searchParams.get('status');
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);

  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
      setPriceValue,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <div className="pb-80 text-center">
      <ErrorMsg msg="There was an error" />
    </div>;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    // products
    let product_items = products.data;
    // select short filtering
    if (selectValue) {
      if (selectValue === "Default Sorting") {
        product_items = products.data;
      } else if (selectValue === "Low to High") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "High to Low") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "New Added") {
        product_items = products.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "On Sale") {
        product_items = products.data.filter((p) => p.discount > 0);
      } else {
        product_items = products.data;
      }
    }

    // status filter
    if (status) {
      if (status === "on-sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      } else if (status === "in-stock") {
        product_items = product_items.filter((p) => p.status === "in-stock");
      }
    }

    // category filter - match by parent, category.name, or children (normalized; allow prefix match e.g. men vs Men's)
    if (category) {
      const normalizedFilter = normalizeCategoryName(category);
      product_items = product_items.filter((p) => {
        const normalizedParent = normalizeCategoryName(p.parent);
        const normalizedCategoryName = normalizeCategoryName(p.category?.name);
        const normalizedChildren = normalizeCategoryName(p.children);
        const match = (a, b) => a === b || (a && b && (a.startsWith(b) || b.startsWith(a)));
        return match(normalizedParent, normalizedFilter) ||
          match(normalizedCategoryName, normalizedFilter) ||
          match(normalizedChildren, normalizedFilter);
      });
    }

    // subcategory/type filter - match by children field (normalized; allow singular/plural and hyphenated)
    if (subCategory) {
      const normalizedFilter = normalizeCategoryName(subCategory);
      product_items = product_items.filter((p) => {
        const normalizedChildren = normalizeCategoryName(p.children);
        if (normalizedChildren === normalizedFilter) return true;
        // Match when one contains the other (e.g. "plaintshirt" vs "plaintshirts", or "plain-tshirts" vs "plain-tshirt")
        if (normalizedChildren.length >= 3 && normalizedFilter.length >= 3) {
          return normalizedChildren.includes(normalizedFilter) || normalizedFilter.includes(normalizedChildren);
        }
        return false;
      });
    }

    // color filter
    if (filterColor) {
      product_items = product_items.filter((product) => {
        for (let i = 0; i < product.imageURLs.length; i++) {
          const color = product.imageURLs[i]?.color;
          if (
            color &&
            color?.name.toLowerCase().split(" ").join("-") === filterColor
          ) {
            return true; // match found, include product in result
          }
        }
        return false; // no match found, exclude product from result
      });
    }

    // brand filter
    if (brand) {
      product_items = product_items.filter(
        (p) =>
          p.brand.name.toLowerCase().split(" ").join("-").replace("&", "") ===
          brand
      );
    }

    if (minPrice && maxPrice) {
      product_items = product_items.filter((p) => Number(p.price) >= Number(minPrice) &&
        Number(p.price) <= Number(maxPrice))
    }


    content = (
      <>

        <ShopContent
          all_products={products.data}
          products={product_items}
          otherProps={otherProps}
          shop_right={shop_right}
          hidden_sidebar={hidden_sidebar}
        />

        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }






  return (
    <>
      {content}
    </>
  );
};

export default ShopArea;
