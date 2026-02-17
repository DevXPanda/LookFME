"use client";

import { useParams } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BannerForm from "@/app/components/banners/banner-form";
import Link from "next/link";
import { useGetBannerByIdQuery } from "@/redux/banners/bannerApi";
import Loading from "@/app/components/common/loading";
import ErrorMsg from "@/app/components/common/error-msg";

const EditBannerPage = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const { data, isLoading, isError } = useGetBannerByIdQuery(id, { skip: !id });

  if (!id) {
    return (
      <Wrapper>
        <div className="body-content px-6 py-8">
          <ErrorMsg msg="Invalid banner ID" />
        </div>
      </Wrapper>
    );
  }

  if (isLoading) {
    return (
      <Wrapper>
        <div className="body-content px-6 py-8 flex justify-center">
          <Loading loading={true} spinner="bar" />
        </div>
      </Wrapper>
    );
  }

  if (isError || !data?.data) {
    return (
      <Wrapper>
        <div className="body-content px-6 py-8">
          <ErrorMsg msg="Banner not found" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit Banner" subtitle="CMS Management" />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Homepage Banner</h1>
          <p className="mt-1 text-sm text-gray-500">
            <Link href="/cms/homepage-banners" className="text-theme hover:underline">Homepage Banners</Link>
            {" / "}Edit
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <BannerForm banner={data.data} mode="edit" />
        </div>
      </div>
    </Wrapper>
  );
};

export default EditBannerPage;
