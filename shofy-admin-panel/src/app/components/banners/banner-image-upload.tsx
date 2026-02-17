"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import useUploadImage from "@/hooks/useUploadImg";
import upload_default from "@assets/img/icons/upload.png";
import Loading from "@/app/components/common/loading";
import { SmClose } from "@/svg";

type Props = {
  label: string;
  recommendedSize: string;
  inputId: string;
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
};

const BannerImageUpload = ({ label, recommendedSize, inputId, image, setImage }: Props) => {
  const { handleImageUpload, uploadData, isError, isLoading } = useUploadImage();
  const displayUrl = image || uploadData?.data?.url;

  useEffect(() => {
    if (uploadData?.data?.url && !isError && !isLoading) {
      setImage(uploadData.data.url);
    }
  }, [uploadData, isError, isLoading, setImage]);

  return (
    <div className="mb-6">
      <p className="mb-2 text-base font-medium text-gray-900">{label}</p>
      <p className="mb-2 text-xs text-gray-500">Recommended size: {recommendedSize}</p>
      <div className="text-center border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        {isLoading ? (
          <Loading loading={true} spinner="scale" />
        ) : displayUrl ? (
          <div className="relative inline-block">
            <Image src={displayUrl} alt="Banner" width={200} height={120} className="rounded object-cover max-h-32" />
            <button
              type="button"
              onClick={() => setImage("")}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              title="Remove"
            >
              <SmClose />
            </button>
          </div>
        ) : (
          <Image src={upload_default} alt="Upload" width={100} height={91} />
        )}
      </div>
      <span className="text-tiny text-gray-500 block mt-2">PNG, JPG, JPEG, WebP</span>
      <input
        onChange={handleImageUpload}
        type="file"
        accept="image/*"
        id={inputId}
        className="hidden"
      />
      <label
        htmlFor={inputId}
        className="mt-2 inline-block py-2 px-4 rounded-lg border border-gray-200 text-sm text-center hover:bg-theme hover:text-white hover:border-theme transition cursor-pointer"
      >
        Upload Image
      </label>
    </div>
  );
};

export default BannerImageUpload;
