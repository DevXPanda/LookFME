"use client";

import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BannerForm from "@/app/components/banners/banner-form";
import Link from "next/link";

const AddBannerPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Add Banner" subtitle="CMS Management" />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Homepage Banner</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/cms/homepage-banners" className="text-theme hover:underline">Homepage Banners</Link>
            {" / "}Add
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <BannerForm mode="add" />
        </div>
      </div>
    </Wrapper>
  );
};

export default AddBannerPage;
