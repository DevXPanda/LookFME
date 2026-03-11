"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import ReactSelect from "react-select";
import { useGetAllProductsQuery } from "@/redux/product/productApi";

type ProductOption = { value: string; label: string; img?: string };

type IPropType = {
  selectedProductIds: string[];
  setSelectedProductIds: React.Dispatch<React.SetStateAction<string[]>>;
  defaultIds?: string[];
};

const ComboProductSelector = ({
  selectedProductIds,
  setSelectedProductIds,
  defaultIds,
}: IPropType) => {
  const { data: productsData } = useGetAllProductsQuery();
  const products = productsData?.data ?? [];

  useEffect(() => {
    if (defaultIds && defaultIds.length > 0) {
      setSelectedProductIds(defaultIds);
    }
  }, [defaultIds, setSelectedProductIds]);

  const productOptions: ProductOption[] = products.map((p: any) => ({
    value: p._id,
    label: p.title,
    img: p.img,
  }));

  const selectedOptions = productOptions.filter((opt) =>
    selectedProductIds.includes(opt.value)
  );

  const handleChange = (selected: ProductOption[] | null) => {
    const ids = selected ? selected.map((s) => s.value) : [];
    setSelectedProductIds(ids);
  };

  const selectedProducts = products.filter((p: any) =>
    selectedProductIds.includes(p._id)
  );

  return (
    <div className="mb-6">
      <p className="mb-2 text-base text-black">Select products for this combo</p>
      <p className="text-tiny text-gray-600 mb-3">
        Customer will choose color and size for each item on the combo detail page.
      </p>
      <ReactSelect
        isMulti
        value={selectedOptions}
        onChange={handleChange}
        options={productOptions}
        placeholder="Search and select products..."
        className="react-select-container mb-4"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "44px",
            borderColor: "#E5E7EB",
          }),
        }}
      />
      {selectedProducts.length > 0 && (
        <div className="border border-gray6 rounded-md p-4 bg-slate-50">
          <p className="text-tiny font-medium text-black mb-3">
            Selected products ({selectedProducts.length}) — image preview
          </p>
          <div className="flex flex-wrap gap-4">
            {selectedProducts.map((p: any) => (
              <div
                key={p._id}
                className="flex flex-col items-center w-24 text-center"
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  width={80}
                  height={80}
                  className="rounded-md object-cover border border-gray6"
                />
                <span className="text-tiny mt-1 line-clamp-2">{p.title}</span>
                {(p.variations?.length > 0 || p.imageURLs?.length > 0) && (
                  <span className="text-[10px] text-gray-500">Colors & sizes from product</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboProductSelector;
