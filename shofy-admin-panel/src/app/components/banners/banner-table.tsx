"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/components/common/loading";
import ErrorMsg from "@/app/components/common/error-msg";
import { useGetBannersAllQuery, useDeleteBannerMutation } from "@/redux/banners/bannerApi";
import { Delete, Edit } from "@/svg";
import { IBanner } from "@/types/banner-type";
import { notifySuccess, notifyError } from "@/utils/toast";

const BannerTable = () => {
  const { data, isError, isLoading } = useGetBannersAllQuery();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const banners = data?.data ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id).unwrap();
      notifySuccess("Banner deleted");
    } catch {
      notifyError("Failed to delete banner");
    }
  };

  if (isLoading) return <Loading loading={true} spinner="bar" />;
  if (isError) return <ErrorMsg msg="Failed to load banners" />;

  if (banners.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No banners yet. Add one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-base text-left text-gray-500">
        <thead className="bg-gray-50/80 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Redirect</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {banners.map((banner: IBanner) => (
            <tr key={banner._id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{banner.order}</td>
              <td className="px-6 py-4">
                <div className="relative w-24 h-14 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={banner.image || "/assets/img/icons/upload.png"}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-[180px] truncate">{banner.title || "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-[140px] truncate">{banner.redirectLink || "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{banner.bannerType || "—"}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                    banner.isEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {banner.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/cms/homepage-banners/edit/${banner._id}`}
                    className="p-2 text-gray-600 hover:text-theme hover:bg-theme/10 rounded transition"
                    title="Edit"
                  >
                    <Edit />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner._id)}
                    disabled={isDeleting}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                    title="Delete"
                  >
                    <Delete />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BannerTable;
