"use client";
import { useState } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import ProductSubmit from "../components/products/add-product/product-submit";
import ProductAddToggle from "../components/products/add-product/product-add-toggle";
import BulkProductUpload from "../components/products/add-product/bulk-product-upload";

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Add Product" subtitle="Add Product" />
        {/* breadcrumb end */}

        {/* add a product start */}
        <div className="grid grid-cols-12">
          <div className="col-span-12 2xl:col-span-10">
            <ProductAddToggle activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === "single" ? <ProductSubmit /> : <BulkProductUpload />}
          </div>
        </div>
        {/* add a product end */}
      </div>
    </Wrapper>
  );
};

export default AddProduct;
