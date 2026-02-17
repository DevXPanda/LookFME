"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BannerImageUpload from "./banner-image-upload";
import { useAddBannerMutation, useUpdateBannerMutation } from "@/redux/banners/bannerApi";
import { IBanner } from "@/types/banner-type";
import { notifySuccess, notifyError } from "@/utils/toast";

const BANNER_TYPES = [
  { value: "homepage_hero", label: "Homepage Hero" },
  { value: "homepage_secondary", label: "Homepage Secondary" },
  { value: "fashion_banner", label: "Fashion Banner" },
  { value: "ads_banner", label: "Ads Banner" },
  { value: "autoslider_banner", label: "Autoslider Banner" },
  { value: "junior_banner", label: "Junior Banner" },
  { value: "other", label: "Other" },
];

const DESKTOP_RECOMMENDED = "1200 x 400 px (3:1 ratio)";
const MOBILE_RECOMMENDED = "800 x 1000 px (4:5 ratio)";

type Props = {
  banner?: IBanner | null;
  mode: "add" | "edit";
};

const BannerForm = ({ banner, mode }: Props) => {
  const router = useRouter();
  const [addBanner, { isLoading: isAdding }] = useAddBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [redirectLink, setRedirectLink] = useState("/shop");
  const [image, setImage] = useState("");
  const [imageMobile, setImageMobile] = useState("");
  const [bannerType, setBannerType] = useState<IBanner["bannerType"]>("homepage_hero");
  const [order, setOrder] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title || "");
      setSubtitle(banner.subtitle || "");
      setButtonText(banner.buttonText || "");
      setRedirectLink(banner.redirectLink || "/shop");
      setImage(banner.image || "");
      setImageMobile(banner.imageMobile || "");
      setBannerType(banner.bannerType || "homepage_hero");
      setOrder(banner.order ?? 0);
      setIsEnabled(banner.isEnabled ?? true);
    }
  }, [banner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim()) {
      notifyError("Desktop image is required");
      return;
    }
    const payload = {
      title,
      subtitle,
      buttonText,
      redirectLink: redirectLink || "/shop",
      image,
      imageMobile: imageMobile || image,
      bannerType,
      order: Number(order) || 0,
      isEnabled,
    };
    try {
      if (mode === "add") {
        await addBanner(payload).unwrap();
        notifySuccess("Banner added");
      } else if (banner?._id) {
        await updateBanner({ id: banner._id, data: payload }).unwrap();
        notifySuccess("Banner updated");
      }
      router.push("/cms/homepage-banners");
    } catch {
      notifyError(mode === "add" ? "Failed to add banner" : "Failed to update banner");
    }
  };

  const isSubmitting = isAdding || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme/20 focus:border-theme"
          placeholder="Banner title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme/20 focus:border-theme"
          placeholder="Banner subtitle"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button text</label>
        <input
          type="text"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme/20 focus:border-theme"
          placeholder="e.g. Shop Now"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Redirect link *</label>
        <input
          type="text"
          value={redirectLink}
          onChange={(e) => setRedirectLink(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme/20 focus:border-theme"
          placeholder="/shop or /shop?category=men"
          required
        />
      </div>

      <BannerImageUpload
        label="Desktop image *"
        recommendedSize={DESKTOP_RECOMMENDED}
        inputId="banner-desktop-img"
        image={image}
        setImage={setImage}
      />
      <BannerImageUpload
        label="Mobile image (optional)"
        recommendedSize={MOBILE_RECOMMENDED}
        inputId="banner-mobile-img"
        image={imageMobile}
        setImage={setImageMobile}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Banner type</label>
        <select
          value={bannerType}
          onChange={(e) => setBannerType(e.target.value as IBanner["bannerType"])}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme/20 focus:border-theme"
        >
          {BANNER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
        <input
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value) || 0)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme/20 focus:border-theme"
        />
        <p className="text-xs text-gray-500 mt-1">Lower number appears first.</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="banner-enabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="rounded border-gray-300 text-theme focus:ring-theme"
        />
        <label htmlFor="banner-enabled" className="text-sm font-medium text-gray-700">Enable banner</label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-theme text-white rounded-lg hover:bg-theme/90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : mode === "add" ? "Add Banner" : "Update Banner"}
        </button>
        <Link
          href="/cms/homepage-banners"
          className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
};

export default BannerForm;
