"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ProductImgUpload from "../products/add-product/product-img-upload";
import ProductCategory from "../category/product-category";
import ComboProductSelector from "./combo-product-selector";
import FormField from "../products/form-field";
import ErrorMsg from "../common/error-msg";
import { useAddComboProductMutation, useUpdateComboProductMutation, useGetComboProductQuery } from "@/redux/comboProduct/comboProductApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import { IComboProduct } from "@/types/combo-product-type";

type ComboFormProps = {
  comboId?: string;
  isEdit?: boolean;
};

const ComboForm = ({ comboId, isEdit = false }: ComboFormProps) => {
  const router = useRouter();
  const [img, setImg] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [category, setCategory] = useState<{ name: string; id: string }>({ name: "", id: "" });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const [addCombo, { isLoading: addLoading }] = useAddComboProductMutation();
  const [updateCombo, { isLoading: updateLoading }] = useUpdateComboProductMutation();
  const { data: comboData } = useGetComboProductQuery(comboId!, { skip: !isEdit || !comboId });

  useEffect(() => {
    if (isEdit && comboData?.data) {
      const c = comboData.data;
      setImg(c.img);
      setBannerImage(c.banner_image || "");
      setCategory({ name: c.category?.name || "", id: (c.category as any)?.id || "" });
      setSelectedProductIds(c.products?.map((p: any) => p.productId?._id || p.productId) || []);
      setValue("title", c.title);
      setValue("description", c.description || "");
      setValue("price", c.price);
      setValue("original_price", c.original_price ?? "");
      setValue("discount", c.discount ?? "");
      setValue("sku", c.sku || "");
      setValue("combo_count", c.combo_count ?? 3);
    }
  }, [isEdit, comboData, setValue]);

  const onSubmit = async (formData: any) => {
    if (!img.trim()) {
      notifyError("Main combo image is required");
      return;
    }
    if (selectedProductIds.length === 0) {
      notifyError("Select at least one product for this combo");
      return;
    }
    const payload = {
      title: formData.title,
      description: formData.description || "",
      img,
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : undefined,
      discount: formData.discount ? Number(formData.discount) : 0,
      sku: formData.sku || undefined,
      category: category.id ? { name: category.name, id: category.id } : undefined,
      combo_count: Number(formData.combo_count) || 3,
      products: selectedProductIds.map((productId) => ({ productId })),
      banner_image: bannerImage || undefined,
    };

    try {
      if (isEdit && comboId) {
        const res = await updateCombo({ id: comboId, data: payload }).unwrap();
        notifySuccess("Combo product updated successfully");
        router.push("/combo-products");
      } else {
        await addCombo(payload).unwrap();
        notifySuccess("Combo product created successfully");
        router.push("/combo-products");
      }
    } catch (err: any) {
      notifyError(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="col-span-12 xl:col-span-8 2xl:col-span-9">
          <div className="mb-6 bg-white px-8 py-8 rounded-md">
            <h4 className="text-[22px] mb-4">General</h4>
            <FormField
              title="title"
              isRequired={true}
              placeHolder="Combo Title (e.g. Pick Any 3 T-Shirts)"
              register={register}
              errors={errors}
            />
            <div className="mb-5">
              <p className="mb-0 text-base text-black">Description</p>
              <textarea
                {...register("description")}
                placeholder="Combo description"
                className="input h-[120px] resize-none w-full py-3 text-base rounded-md border border-gray6 px-6"
              />
            </div>
          </div>

          <div className="bg-white px-8 py-8 rounded-md mb-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
              <FormField
                title="price"
                isRequired={true}
                placeHolder="Combo price"
                type="number"
                register={register}
                errors={errors}
              />
              <FormField
                title="original_price"
                isRequired={false}
                placeHolder="Original price"
                type="number"
                register={register}
                errors={errors}
              />
              <FormField
                title="discount"
                isRequired={false}
                placeHolder="Discount amount"
                type="number"
                register={register}
                errors={errors}
              />
              <FormField
                title="sku"
                isRequired={false}
                placeHolder="SKU"
                register={register}
                errors={errors}
              />
              <div className="mb-5">
                <p className="mb-0 text-base text-black">
                  Number of items in combo <span className="text-red">*</span>
                </p>
                <input
                  {...register("combo_count", { required: "Required", min: { value: 1, message: "Min 1" } })}
                  type="number"
                  min={1}
                  placeholder="e.g. 3"
                  className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                />
                <ErrorMsg msg={(errors?.combo_count?.message as string) || ""} />
                <span className="text-tiny leading-4">e.g. Pick Any 3, Pick Any 5</span>
              </div>
            </div>
          </div>

          <div className="bg-white px-8 py-8 rounded-md mb-6">
            <ComboProductSelector
              selectedProductIds={selectedProductIds}
              setSelectedProductIds={setSelectedProductIds}
              defaultIds={isEdit && comboData?.data ? (comboData.data.products?.map((p: any) => p.productId?._id || p.productId) || []) : undefined}
            />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 2xl:col-span-3">
          <ProductImgUpload
            imgUrl={img}
            setImgUrl={setImg}
            isSubmitted={isSubmitted}
            default_img={isEdit ? comboData?.data?.img : undefined}
          />
          <div className="bg-white px-8 py-8 rounded-md mb-6 text-center">
            <p className="text-base text-black mb-4">Combo Banner Image (homepage)</p>
            <ProductImgUpload
              imgUrl={bannerImage}
              setImgUrl={setBannerImage}
              isSubmitted={isSubmitted}
              default_img={isEdit && comboData?.data?.banner_image ? comboData.data.banner_image : undefined}
            />
          </div>
          <div className="bg-white px-8 py-8 rounded-md mb-6">
            <p className="mb-5 text-base text-black">Category</p>
            <ProductCategory
              setCategory={setCategory}
              setParent={(name) => setCategory((prev) => ({ ...prev, name }))}
              setChildren={(child) => setCategory((prev) => ({ ...prev, name: child }))}
              default_value={isEdit && category?.name ? { parent: category.name, id: category.id, children: category.name } : undefined}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="tp-btn px-5 py-2 mt-5"
        disabled={addLoading || updateLoading}
      >
        {addLoading || updateLoading ? "Saving..." : isEdit ? "Update Combo" : "Create Combo"}
      </button>
    </form>
  );
};

export default ComboForm;
