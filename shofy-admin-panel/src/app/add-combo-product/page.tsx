"use client";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import ComboForm from "../components/combo-products/combo-form";

const AddComboProductPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Add Combo Product" subtitle="Add Combo Product" />
        <div className="grid grid-cols-12">
          <div className="col-span-12 2xl:col-span-10">
            <ComboForm />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default AddComboProductPage;
