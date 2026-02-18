"use client";

import React, { useState, useEffect } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import { useGetWelcomeOfferAdminQuery, useUpdateWelcomeOfferMutation } from "@/redux/welcomeOffer/welcomeOfferApi";
import { notifySuccess, notifyError } from "@/utils/toast";

const WelcomeOfferPage = () => {
  const { data, isLoading } = useGetWelcomeOfferAdminQuery();
  const [updateOffer, { isLoading: isSaving }] = useUpdateWelcomeOfferMutation();
  const [title, setTitle] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [bannerText, setBannerText] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setTitle(data.data.title ?? "");
      setDiscountPercent(data.data.discountPercent ?? 10);
      setBannerText(data.data.bannerText ?? "");
      setIsActive(data.data.isActive ?? false);
    }
  }, [data?.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateOffer({ title, discountPercent, isActive, bannerText });
      if ("error" in res) {
        const err = res.error as { data?: { message?: string } };
        notifyError(err?.data?.message || "Failed to save");
      } else {
        notifySuccess(res.data?.message || "Saved");
      }
    } catch {
      notifyError("Failed to save");
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Welcome Offer" subtitle="Marketing" />
        <div className="mb-6" />
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
                placeholder="e.g. Welcome Offer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount percent</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner text</label>
              <input
                type="text"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
                placeholder="e.g. Get 10% off on your first order"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-gray-300 text-theme focus:ring-theme"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (apply globally for first order)
              </label>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2.5 text-sm font-medium text-white bg-theme rounded-lg hover:bg-theme/90 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default WelcomeOfferPage;
