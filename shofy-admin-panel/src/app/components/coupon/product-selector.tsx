"use client";
import React, { useEffect } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import ReactSelect from "react-select";
import { useGetAllProductsQuery } from "@/redux/product/productApi";
import ErrorMsg from "../common/error-msg";

type IPropType = {
  control: Control;
  errors: FieldErrors<any>;
  selectedProducts: string[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<string[]>>;
  default_value?: string[];
};

const ProductSelector = ({
  control,
  errors,
  selectedProducts,
  setSelectedProducts,
  default_value,
}: IPropType) => {
  const { data: products, isLoading } = useGetAllProductsQuery();

  // Convert products to options format
  const productOptions = products?.data?.map((product: any) => ({
    value: product._id,
    label: product.title,
  })) || [];

  // Set default value
  useEffect(() => {
    if (default_value && default_value.length > 0) {
      setSelectedProducts(default_value);
    }
  }, [default_value, setSelectedProducts]);

  const handleSelectProducts = (selectedOptions: any) => {
    const values = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
    setSelectedProducts(values);
  };

  return (
    <>
      <Controller
        name="productIds"
        control={control}
        render={({ field }) => (
          <ReactSelect
            {...field}
            isMulti
            isLoading={isLoading}
            value={productOptions.filter((option: any) =>
              selectedProducts.includes(option.value)
            )}
            onChange={(selectedOptions) => {
              field.onChange(selectedOptions);
              handleSelectProducts(selectedOptions);
            }}
            options={productOptions}
            placeholder="Select products..."
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "44px",
                borderColor: "#E5E7EB",
              }),
            }}
          />
        )}
      />
      <ErrorMsg msg={errors?.productIds?.message as string} />
      {selectedProducts.length > 0 && (
        <p className="text-tiny text-gray-600 mt-1">
          {selectedProducts.length} product(s) selected
        </p>
      )}
    </>
  );
};

export default ProductSelector;
