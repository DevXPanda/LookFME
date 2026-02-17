"use client";

import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BannerTable from "@/app/components/banners/banner-table";
import Link from "next/link";

const HomepageBannersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Homepage Banners" subtitle="CMS Management" />
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Homepage Banners</h1>
            <p className="mt-1 text-sm text-gray-500">Manage slider banners shown on the store homepage</p>
          </div>
          <Link
            href="/cms/homepage-banners/add"
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-theme rounded-lg hover:bg-theme/90"
          >
            Add Banner
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <BannerTable />
        </div>
      </div>
    </Wrapper>
  );
};

export default HomepageBannersPage;
