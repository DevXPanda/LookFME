"use client";
import React, { useState, useMemo } from "react";
import { useGetAllProductsQuery } from "@/redux/product/productApi";
import ErrorMsg from "../../common/error-msg";
import ProductGridItem from "./product-grid-item";
import { Search } from "@/svg";
import Link from "next/link";

const ProductGridArea = () => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");

  const filteredProducts = useMemo(() => {
    if (!products?.data) return [];
    let list = [...products.data];

    // search field
    if (searchValue) {
      const searchLower = searchValue.toLowerCase().replace(/^#/, "").trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(searchLower) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
        (p.variations && p.variations.some((v: any) => v.sku && v.sku.toLowerCase().includes(searchLower)))
      );
    }

    if (selectValue) {
      list = list.filter((p) => p.productType === selectValue);
    }

    return list;
  }, [products?.data, searchValue, selectValue]);

  // search field
  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle select input
  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.success && filteredProducts.length === 0) {
    content = <ErrorMsg msg="No Products Found" />;
  }

  if (!isLoading && !isError && products?.success && filteredProducts.length > 0) {
    let productItems = [...filteredProducts].reverse();

    content = (
      <>
        <div className="relative mx-8 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
            {productItems.map((prd) => (
              <ProductGridItem key={prd._id} product={prd} />
            ))}
          </div>
        </div>

        {/* bottom  */}
        <div className="flex justify-between items-center flex-wrap mx-8">
          <p className="mb-0 text-tiny">
            Showing all {filteredProducts.length} of{" "}
            {products?.data.length || 0} Products
          </p>
        </div>
      </>
    );
  }
  return (
    <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
      <div className="tp-search-box flex items-center justify-between px-8 py-8 flex-wrap">
        <div className="search-input relative">
          <input
            onChange={handleSearchProduct}
            className="input h-[44px] w-full pl-14"
            type="text"
            placeholder="Search by product name"
          />
          <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
            <Search />
          </button>
        </div>
        <div className="flex sm:justify-end sm:space-x-6 flex-wrap">
          <div className="search-select mr-3 flex items-center space-x-3 ">
            <span className="text-tiny inline-block leading-none -translate-y-[2px]">
              Categories :{" "}
            </span>
            <select onChange={handleSelectField}>
              <option value="">Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">beauty</option>
              <option value="jewelry">jewelry</option>
            </select>
          </div>
          <div className="product-add-btn flex ">
            <Link href="/add-product" className="tp-btn">
              Add Product
            </Link>
          </div>
        </div>
      </div>
      {content}
    </div>
  );
};

export default ProductGridArea;
