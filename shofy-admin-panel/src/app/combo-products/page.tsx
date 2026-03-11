"use client";
import Link from "next/link";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import ComboListArea from "../components/combo-products/combo-list-area";

const ComboProductsPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Combo Products" subtitle="Combo Products" />
        <div className="mb-6 flex justify-end">
          <Link href="/add-combo-product" className="tp-btn px-5 py-2">
            Add Combo Product
          </Link>
        </div>
        <div className="bg-white rounded-md">
          <ComboListArea />
        </div>
      </div>
    </Wrapper>
  );
};

export default ComboProductsPage;
