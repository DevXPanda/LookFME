"use client";
import React from "react";
import useCategorySubmit from "@/hooks/useCategorySubmit";
import ProductType from "../products/add-product/product-type";
import CategoryTables from "./category-tables";
import CategoryImgUpload from "./global-img-upload";
import CategoryChildren from "./category-children";
import ErrorMsg from "../common/error-msg";
import { useGetCategoryQuery } from "@/redux/category/categoryApi";
import CategoryParent from "./category-parent";
import CategoryDescription from "./category-description";

const EditCategory = ({ id }: { id: string }) => {
  const { data: categoryData, isError, isLoading } = useGetCategoryQuery(id);
  const {
    selectProductType,
    setSelectProductType,
    errors,
    control,
    register,
    handleSubmit,
    setCategoryImg,
    categoryImg,
    featuredForCustomerSection,
    setFeaturedForCustomerSection,
    error,
    isSubmitted,
    handleSubmitEditCategory,
    categoryChildren,
    setCategoryChildren,
  } = useCategorySubmit();

  React.useEffect(() => {
    if (categoryData) {
      setCategoryImg(categoryData.img || "");
      setCategoryChildren(categoryData.children || []);
      setFeaturedForCustomerSection(categoryData.featuredForCustomerSection || false);
    }
  }, [categoryData, setCategoryImg, setCategoryChildren, setFeaturedForCustomerSection]);
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4">
        {categoryData && (
          <form
            onSubmit={handleSubmit((data) =>
              handleSubmitEditCategory(data, id)
            )}
          >
            <div className="mb-6 bg-white px-8 py-8 rounded-md">
              {/* category image upload */}
              <CategoryImgUpload
                isSubmitted={isSubmitted}
                setImage={setCategoryImg}
                default_img={categoryData.img}
                image={categoryImg}
              />
              {/* category image upload */}

              {/* category parent */}
              <CategoryParent
                register={register}
                errors={errors}
                default_value={categoryData.parent}
              />
              {/* category parent */}

              <CategoryChildren
                categoryChildren={categoryChildren}
                setCategoryChildren={setCategoryChildren}
                error={error}
                default_value={categoryData.children}
              />

              {/* Product Type */}
              <div className="mb-6">
                <p className="mb-0 text-base text-black">Product Type</p>
                <div className="category-add-select select-bordered">
                  <ProductType
                    setSelectProductType={setSelectProductType}
                    control={control}
                    errors={errors}
                    default_value={categoryData.productType}
                  />
                </div>
              </div>
              {/* Product Type */}

              {/* Category Description */}
              <CategoryDescription
                register={register}
                default_value={categoryData.description}
              />
              {/* Category Description */}

              {/* Featured for Customer Section */}
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="featuredForCustomerSection"
                  className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme"
                  checked={featuredForCustomerSection}
                  onChange={(e) => setFeaturedForCustomerSection(e.target.checked)}
                />
                <label
                  htmlFor="featuredForCustomerSection"
                  className="ml-2 text-sm font-medium text-black cursor-pointer"
                >
                  Featured for Customer Section
                </label>
              </div>
              {/* Featured for Customer Section */}

              <button className="tp-btn px-7 py-2">Edit Category</button>
            </div>
          </form>
        )}
      </div>
      <div className="col-span-12 lg:col-span-8">
        <CategoryTables />
      </div>
    </div>
  );
};

export default EditCategory;
