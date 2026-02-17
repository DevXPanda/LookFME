"use client";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { useForm } from "react-hook-form";
import {useRouter} from 'next/navigation';
import { useAddProductMutation, useEditProductMutation } from "@/redux/product/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";

// ImageURL type
export interface ImageURL {
  color: {
    name?: string;
    clrCode?: string;
  };
  img: string;
  sizes?: string[];
}

// ProductVariation type
export interface ProductVariation {
  attributeType: string;
  attributeValue: string;
  colorName: string;
  colorCode: string;
  sku: string;
  stock: number;
  price: number | null;
  image: string;
}
type IBrand = {
  name: string;
  id: string;
};
type ICategory = {
  name: string;
  id: string;
};

type status = "in-stock" | "out-of-stock" | "discontinued";

const useProductSubmit = () => {
  const [sku, setSku] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);
  const [supportingImages, setSupportingImages] = useState<string[]>([]);
  const [parent, setParent] = useState<string>("");
  const [children, setChildren] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [brand, setBrand] = useState<IBrand>({ name: "", id: "" });
  const [category, setCategory] = useState<ICategory>({ name: "", id: "" });
  const [status, setStatus] = useState<status>("in-stock");
  const [productType, setProductType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [offerDate, setOfferDate] = useState<{
    startDate: null;
    endDate: null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [additionalInformation, setAdditionalInformation] = useState<
    {
      key: string;
      value: string;
    }[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  const router = useRouter();


  // useAddProductMutation
  const [addProduct, { data: addProductData, isError, isLoading }] =
    useAddProductMutation();
  // useAddProductMutation
  const [editProduct, { data: editProductData, isError: editErr, isLoading: editLoading }] =
    useEditProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm();
  // resetForm
  const resetForm = () => {
    setSku("");
    setImg("");
    setTitle("");
    setSlug("");
    setUnit("");
    setImageURLs([]);
    setSupportingImages([]);
    setParent("");
    setChildren("");
    setPrice(0);
    setDiscount(0);
    setQuantity(0);
    setBrand({ name: "", id: "" });
    setCategory({ name: "", id: "" });
    setStatus("in-stock");
    setProductType("");
    setDescription("");
    setVideoId("");
    setOfferDate({
      startDate: null,
      endDate: null,
    });
    setAdditionalInformation([]);
    setTags([]);
    setSizes([]);
    setVariations([]);
    reset();
  };

  // handle submit product
  const handleSubmitProduct = async (data: any) => {
    // Validate variations if they exist
    if (variations.length > 0) {
      // Check for duplicate SKUs
      const skus = variations.map((v) => v.sku).filter((sku) => sku.trim() !== "");
      const uniqueSkus = new Set(skus);
      if (skus.length !== uniqueSkus.size) {
        return notifyError("Duplicate SKUs found in variations. Each variation must have a unique SKU.");
      }

      // Check all variations have SKU and stock
      const invalidVariations = variations.filter(
        (v) => !v.sku.trim() || v.stock < 0
      );
      if (invalidVariations.length > 0) {
        return notifyError("All variations must have a valid SKU and non-negative stock.");
      }
    }

    // product data
    const productData: any = {
      sku: variations.length > 0 ? "" : data.SKU, // Empty SKU if variations exist
      img: img,
      title: data.title,
      slug: slugify(data.title, { replacement: "-", lower: true }),
      unit: data.unit,
      imageURLs: imageURLs,
      supportingImages: supportingImages.filter((img) => img), // Filter out empty strings
      parent: parent,
      children: children,
      price: data.price,
      discount: data.discount_percentage,
      quantity: variations.length > 0 ? 0 : data.quantity, // Zero quantity if variations exist
      brand: brand,
      category: category,
      status: status,
      offerDate: {
        startDate: offerDate.startDate,
        endDate: offerDate.endDate,
      },
      productType: productType,
      description: data.description,
      videoId: data.youtube_video_Id,
      additionalInformation: additionalInformation,
      tags: tags,
      variations: variations.length > 0 ? variations : undefined,
      attributeType: variations.length > 0 ? variations[0]?.attributeType : undefined,
    };

    console.log('productData-------------------..>',productData)


    if (!img) {
      return notifyError("Product image is required");
    }
    if (!category.name) {
      return notifyError("Category is required");
    }
    if (Number(data.discount) > Number(data.price)) {
      return notifyError("Product price must be gether than discount");
    }
    
    // Validate SKU/Quantity if no variations
    if (variations.length === 0) {
      if (!data.SKU) {
        return notifyError("SKU is required when no variations are added");
      }
      if (!data.quantity || data.quantity < 0) {
        return notifyError("Quantity is required and must be non-negative");
      }
    }

    const res = await addProduct(productData);
    if ("error" in res) {
      if ("data" in res.error) {
        const errorData = res.error.data as { message?: string };
        if (typeof errorData.message === "string") {
          return notifyError(errorData.message);
        }
      }
    } else {
      notifySuccess("Product created successFully");
      setIsSubmitted(true);
      resetForm();
      router.push('/product-grid')
    }
  };
  // handle edit product
  const handleEditProduct = async (data: any, id: string) => {
    // Validate variations if they exist
    if (variations.length > 0) {
      // Check for duplicate SKUs
      const skus = variations.map((v) => v.sku).filter((sku) => sku.trim() !== "");
      const uniqueSkus = new Set(skus);
      if (skus.length !== uniqueSkus.size) {
        return notifyError("Duplicate SKUs found in variations. Each variation must have a unique SKU.");
      }

      // Check all variations have SKU and stock
      const invalidVariations = variations.filter(
        (v) => !v.sku.trim() || v.stock < 0
      );
      if (invalidVariations.length > 0) {
        return notifyError("All variations must have a valid SKU and non-negative stock.");
      }
    }

    // product data
    const productData: any = {
      sku: variations.length > 0 ? "" : data.SKU,
      img: img,
      title: data.title,
      slug: slugify(data.title, { replacement: "-", lower: true }),
      unit: data.unit,
      imageURLs: imageURLs,
      supportingImages: supportingImages.filter((img) => img), // Filter out empty strings
      parent: parent,
      children: children,
      price: data.price,
      discount: data.discount_percentage,
      quantity: variations.length > 0 ? 0 : data.quantity,
      brand: brand,
      category: category,
      status: status,
      offerDate: {
        startDate: offerDate.startDate,
        endDate: offerDate.endDate,
      },
      productType: productType,
      description: data.description,
      videoId: data.youtube_video_Id,
      additionalInformation: additionalInformation,
      tags: tags,
      variations: variations.length > 0 ? variations : undefined,
      attributeType: variations.length > 0 ? variations[0]?.attributeType : undefined,
    };
    console.log('edit productData---->',productData)
    const res = await editProduct({ id: id, data: productData });
    if ("error" in res) {
      if ("data" in res.error) {
        const errorData = res.error.data as { message?: string };
        if (typeof errorData.message === "string") {
          return notifyError(errorData.message);
        }
      }
    } else {
      notifySuccess("Product edit successFully");
      setIsSubmitted(true);
      router.push('/product-grid')
      resetForm();
    }
  };

  return {
    sku,
    setSku,
    img,
    setImg,
    title,
    setTitle,
    slug,
    setSlug,
    unit,
    setUnit,
    imageURLs,
    setImageURLs,
    supportingImages,
    setSupportingImages,
    parent,
    setParent,
    children,
    setChildren,
    price,
    setPrice,
    discount,
    setDiscount,
    quantity,
    setQuantity,
    brand,
    setBrand,
    category,
    setCategory,
    status,
    setStatus,
    productType,
    setProductType,
    description,
    setDescription,
    videoId,
    setVideoId,
    additionalInformation,
    setAdditionalInformation,
    tags,
    setTags,
    sizes,
    setSizes,
    handleSubmitProduct,
    handleEditProduct,
    register,
    handleSubmit,
    errors,
    control,
    offerDate,
    setOfferDate,
    setIsSubmitted,
    isSubmitted,
    variations,
    setVariations,
  };
};

export default useProductSubmit;
