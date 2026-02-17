"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "../../common/loading";
import { useUploadImageMultipleMutation } from "@/redux/cloudinary/cloudinaryApi";
import { notifyError } from "@/utils/toast";
import DefaultUploadImg from "./default-upload-img";
import SmClose from "@/svg/sm-close";

type IPropType = {
  supportingImages: string[];
  setSupportingImages: React.Dispatch<React.SetStateAction<string[]>>;
  isSubmitted: boolean;
};

const ProductMultipleImgUpload = ({
  supportingImages,
  setSupportingImages,
  isSubmitted,
}: IPropType) => {
  const [uploadImageMultiple, { data: uploadData, isError, isLoading, error }] =
    useUploadImageMultipleMutation();
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(new Set());

  const MAX_IMAGES = 10;

  useEffect(() => {
    if (uploadData && !isError && uploadData.data && uploadData.data.length > 0) {
      const newUrls = uploadData.data.map((item) => item.url);
      setSupportingImages((prev) => {
        const updated = [...prev];
        // Ensure array has MAX_IMAGES slots
        while (updated.length < MAX_IMAGES) {
          updated.push("");
        }
        // Fill empty slots with new URLs
        let urlIndex = 0;
        for (let i = 0; i < updated.length && urlIndex < newUrls.length; i++) {
          if (!updated[i]) {
            updated[i] = newUrls[urlIndex];
            urlIndex++;
          }
        }
        return updated.slice(0, MAX_IMAGES);
      });
      setUploadingIndexes(new Set());
    }
    if (isError || error) {
      notifyError("Failed to upload images. Please try again.");
      setUploadingIndexes(new Set());
    }
  }, [uploadData, isError, error, setSupportingImages]);

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - supportingImages.filter((img) => img).length;
      
      if (files.length > remainingSlots) {
        notifyError(`You can only upload ${remainingSlots} more image(s). Maximum ${MAX_IMAGES} images allowed.`);
        return;
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const currentLength = supportingImages.filter((img) => img).length;
      const indexesToUpload = Array.from({ length: files.length }, (_, i) => currentLength + i);
      setUploadingIndexes(new Set(indexesToUpload));
      
      uploadImageMultiple(formData);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSupportingImages((prev) => {
      const updated = [...prev];
      updated[index] = "";
      // Remove empty strings and maintain array length
      return updated.filter((img, idx) => img || idx < MAX_IMAGES);
    });
  };

  // Initialize array with empty strings up to MAX_IMAGES
  useEffect(() => {
    if (supportingImages.length < MAX_IMAGES) {
      setSupportingImages((prev) => {
        const updated = [...prev];
        while (updated.length < MAX_IMAGES) {
          updated.push("");
        }
        return updated;
      });
    }
  }, [supportingImages.length, setSupportingImages]);

  const filledImages = supportingImages.filter((img) => img).length;
  const canUploadMore = filledImages < MAX_IMAGES;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <p className="text-base text-black mb-4">
        Supporting Images ({filledImages}/{MAX_IMAGES})
      </p>
      <p className="text-tiny text-gray-600 mb-4">
        Upload up to {MAX_IMAGES} supporting images for this product
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        {Array.from({ length: MAX_IMAGES }).map((_, index) => {
          const imageUrl = supportingImages[index] || "";
          const isUploading = uploadingIndexes.has(index);

          return (
            <div key={index} className="relative">
              {isSubmitted ? (
                <DefaultUploadImg wh={100} />
              ) : isUploading ? (
                <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                  <Loading loading={true} spinner="fade" />
                </div>
              ) : imageUrl ? (
                <div className="relative w-full h-24 border border-gray-300 rounded-md overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Supporting image ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <SmClose />
                  </button>
                </div>
              ) : (
                <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                  <span className="text-gray-400 text-xs">Empty</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {canUploadMore && !isSubmitted && (
        <div>
          <input
            onChange={handleMultipleImageUpload}
            type="file"
            name="images"
            id="supporting_images"
            className="hidden"
            multiple
            accept="image/*"
          />
          <label
            htmlFor="supporting_images"
            className="text-tiny w-full inline-block py-2 px-4 rounded-md border border-gray6 text-center hover:cursor-pointer hover:bg-theme hover:text-white hover:border-theme transition"
          >
            {isLoading ? "Uploading..." : `Upload Images (${MAX_IMAGES - filledImages} slots remaining)`}
          </label>
        </div>
      )}

      {!canUploadMore && (
        <p className="text-tiny text-gray-500 mt-2">
          Maximum {MAX_IMAGES} images reached. Remove an image to upload more.
        </p>
      )}
    </div>
  );
};

export default ProductMultipleImgUpload;
