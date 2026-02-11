import React, { useState, useEffect } from "react";
import { ImageURL, ProductVariation } from "@/hooks/useProductSubmit";
import { notifyError, notifySuccess } from "@/utils/toast";
import VariantImgUpload from "./variant-img-upload";
import { SmClose } from "@/svg";

// Variation type
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

// prop type
type IPropType = {
  isSubmitted: boolean;
  setImageURLs: React.Dispatch<React.SetStateAction<ImageURL[]>>;
  setVariations: React.Dispatch<React.SetStateAction<ProductVariation[]>>;
  variations: ProductVariation[];
  default_value?: ImageURL[];
};

const ProductVariants = ({
  isSubmitted,
  setImageURLs,
  setVariations,
  variations,
  default_value,
}: IPropType) => {
  const [uploadImg, setUploadImg] = useState<string>("");
  const [formData, setFormData] = useState<ImageURL[]>(
    default_value
      ? default_value
      : [{ color: { clrCode: "", name: "" }, img: "", sizes: [] }]
  );
  const [isSubmitField, setIsSubmitField] = useState<boolean>(false);
  
  // New state for attribute-based variations
  const [attributeType, setAttributeType] = useState<string>("");
  const [attributeValues, setAttributeValues] = useState<string>("");
  const [colorName, setColorName] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("");
  const [variationImage, setVariationImage] = useState<string>("");
  
  // set default value
  const [hasDefaultValues, setHasDefaultValues] = useState<boolean>(false);
  
  // default value set
  useEffect(() => {
    if (default_value && !hasDefaultValues) {
      setImageURLs(default_value);
      setHasDefaultValues(true);
    }
  }, [default_value, hasDefaultValues, setImageURLs, formData]);

  // Generate variations from attribute values
  const generateVariations = () => {
    if (!attributeType) {
      notifyError("Please select an attribute type");
      return;
    }
    if (!attributeValues.trim()) {
      notifyError("Please enter attribute values");
      return;
    }
    if (!colorName.trim()) {
      notifyError("Please enter color name");
      return;
    }
    if (!variationImage) {
      notifyError("Please upload variation image");
      return;
    }

    const values = attributeValues
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    if (values.length === 0) {
      notifyError("Please enter valid attribute values");
      return;
    }

    // Generate variations for each attribute value
    const newVariations: ProductVariation[] = values.map((value) => ({
      attributeType,
      attributeValue: value,
      colorName,
      colorCode: colorCode || "#000000",
      sku: "",
      stock: 0,
      price: null,
      image: variationImage,
    }));

    setVariations(newVariations);
    notifySuccess(`${newVariations.length} variations generated`);
  };

  // Update variation field
  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  // Remove variation
  const removeVariation = (index: number) => {
    const updated = variations.filter((_, i) => i !== index);
    setVariations(updated);
  };

  // Handle add field (legacy support)
  const handleAddField = () => {
    const allFieldsNotEmpty = formData.every((field) => field.img);
    if (allFieldsNotEmpty) {
      setFormData((prevFormData) => [
        ...prevFormData,
        { color: { clrCode: "", name: "" }, img: "", sizes: [] },
      ]);
      setImageURLs(formData);
    } else {
      notifyError("Image required");
    }
  };

  // Handle size change (legacy support)
  const handleSizeChange = (sizes: string[], index: number) => {
    const updatedFormData = [...formData];
    updatedFormData[index].sizes = sizes;
    setFormData(updatedFormData);
    setImageURLs(updatedFormData);
  };

  // Handle remove product (legacy support)
  const handleRemoveProduct = (index: number) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
    setImageURLs(updatedFormData);
  };

  const col = formData.length > 1 ? 3 : 2;

  return (
    <div className="bg-white px-8 py-8 rounded-md mb-6">
      <h4 className="text-[22px] mb-6">Product Variations</h4>

      {/* Attribute Type Selector */}
      <div className="mb-6 pb-6 border-b border-gray6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 mb-4">
          <div className="mb-5">
            <p className="mb-0 text-base text-black">Attribute Type</p>
            <select
              className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
              value={attributeType}
              onChange={(e) => setAttributeType(e.target.value)}
            >
              <option value="">Select Attribute Type</option>
              <option value="Size">Size</option>
              <option value="Pack">Pack</option>
              <option value="Dozen">Dozen</option>
              <option value="Pair">Pair</option>
            </select>
            <span className="text-tiny leading-4">
              Select the type of attribute for variations
            </span>
          </div>

          <div className="mb-5">
            <p className="mb-0 text-base text-black">Enter Values</p>
            <input
              className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
              type="text"
              placeholder="32,34,36 or 1,2,3,4"
              value={attributeValues}
              onChange={(e) => setAttributeValues(e.target.value)}
            />
            <span className="text-tiny leading-4">
              Enter comma-separated values (e.g., 32,34,36)
            </span>
          </div>

          <div className="mb-5">
            <p className="mb-0 text-base text-black">Color Name</p>
            <input
              className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
              type="text"
              placeholder="Color Name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
            />
            <span className="text-tiny leading-4">
              Set the Color name of product.
            </span>
          </div>

          <div className="mb-5">
            <p className="mb-0 text-base text-black">Color Code</p>
            <input
              className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
              type="text"
              placeholder="Hex code here ex:#3C3C3C"
              value={colorCode}
              onChange={(e) => setColorCode(e.target.value)}
            />
            <span className="text-tiny leading-4">
              Hex code here ex:#3C3C3D
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 mb-4">
          <VariantImgUpload
            setFormData={setFormData}
            setImageURLs={setImageURLs}
            index={0}
            formData={formData}
            isSubmitField={isSubmitField}
            isSubmitted={isSubmitted}
            setIsSubmitField={setIsSubmitField}
            onImageChange={setVariationImage}
          />
        </div>

        <button
          className="tp-btn px-5 py-2 mt-2"
          type="button"
          onClick={generateVariations}
        >
          Generate Variations
        </button>
      </div>

      {/* Variation Table */}
      {variations.length > 0 && (
        <div className="mb-6">
          <h5 className="text-lg font-semibold mb-4">Variation Details</h5>
          <div className="relative overflow-x-auto">
            <table className="w-full text-base text-left text-gray-500 border border-gray6">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-tiny text-text2 uppercase font-semibold border-b border-gray6">
                    Attribute Value
                  </th>
                  <th className="px-4 py-3 text-tiny text-text2 uppercase font-semibold border-b border-gray6">
                    Color
                  </th>
                  <th className="px-4 py-3 text-tiny text-text2 uppercase font-semibold border-b border-gray6">
                    SKU *
                  </th>
                  <th className="px-4 py-3 text-tiny text-text2 uppercase font-semibold border-b border-gray6">
                    Stock *
                  </th>
                  <th className="px-4 py-3 text-tiny text-text2 uppercase font-semibold border-b border-gray6">
                    Price
                  </th>
                  <th className="px-4 py-3 text-tiny text-text2 uppercase font-semibold border-b border-gray6">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {variations.map((variation, index) => (
                  <tr key={index} className="bg-white border-b border-gray6">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{variation.attributeType}:</span>
                        <span>{variation.attributeValue}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray6"
                          style={{ backgroundColor: variation.colorCode }}
                        ></div>
                        <span>{variation.colorName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="input w-full h-[38px] rounded-md border border-gray6 px-3 text-sm"
                        type="text"
                        placeholder="Enter SKU"
                        value={variation.sku}
                        onChange={(e) => updateVariation(index, "sku", e.target.value)}
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="input w-full h-[38px] rounded-md border border-gray6 px-3 text-sm"
                        type="number"
                        placeholder="Enter Stock"
                        value={variation.stock || ""}
                        onChange={(e) =>
                          updateVariation(index, "stock", parseInt(e.target.value) || 0)
                        }
                        min="0"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="input w-full h-[38px] rounded-md border border-gray6 px-3 text-sm"
                        type="number"
                        placeholder="Price (optional)"
                        value={variation.price || ""}
                        onChange={(e) =>
                          updateVariation(
                            index,
                            "price",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="h-[38px] w-[38px] rounded-md border border-gray6 hover:border-red flex items-center justify-center"
                        onClick={() => removeVariation(index)}
                      >
                        <SmClose />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legacy Variation Support (for backward compatibility) */}
      {variations.length === 0 && (
        <>
          {formData.map((field, i) => (
            <div key={i} className="mt-10 pt-10 border-t border-gray relative">
              {i !== 0 && (
                <div className="text-end">
                  <button
                    className="h-[44px] w-[44px] rounded-md border border-gray6 hover:border-red "
                    type="button"
                    onClick={() => handleRemoveProduct(i)}
                  >
                    <SmClose />
                  </button>
                </div>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-x-6">
                <div className="mb-5">
                  <p className="mb-0 text-base text-black">Color Name</p>
                  <input
                    id="clrName"
                    className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                    type="text"
                    placeholder="Color Name"
                    value={field?.color?.name}
                    onChange={(e) => {
                      const updatedFormData = [...formData];
                      updatedFormData[i] = {
                        ...updatedFormData[i],
                        color: {
                          ...updatedFormData[i].color,
                          name: e.target.value,
                        },
                      };
                      setFormData(updatedFormData);
                      setImageURLs(updatedFormData);
                    }}
                  />
                  <span className="text-tiny leading-4">
                    Set the Color name of product.
                  </span>
                </div>

                <div className="mb-5">
                  <p className="mb-0 text-base text-black">Color Code</p>
                  <input
                    id="clrCode"
                    className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                    type="text"
                    placeholder="Color Code"
                    value={field?.color?.clrCode}
                    onChange={(e) => {
                      const updatedFormData = [...formData];
                      updatedFormData[i].color.clrCode = e.target.value;
                      setFormData(updatedFormData);
                      setImageURLs(updatedFormData);
                    }}
                  />
                  <span className="text-tiny leading-4">
                    Hex code here ex:#3C3C3D
                  </span>
                </div>
              </div>

              <div
                className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-x-6`}
              >
                <VariantImgUpload
                  setFormData={setFormData}
                  setImageURLs={setImageURLs}
                  index={i}
                  formData={formData}
                  isSubmitField={isSubmitField}
                  isSubmitted={isSubmitted}
                  setIsSubmitField={setIsSubmitField}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between flex-wrap">
            <button
              className="tp-btn px-5 py-2 mt-5"
              type="button"
              onClick={handleAddField}
            >
              Add Field
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductVariants;
