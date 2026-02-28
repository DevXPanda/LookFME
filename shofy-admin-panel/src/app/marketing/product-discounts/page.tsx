"use client";

import React, { useState, useMemo } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import { useGetAllProductsQuery, useEditProductMutation } from "@/redux/product/productApi";
import { notifySuccess, notifyError } from "@/utils/toast";
import ReactSelect from "react-select";
import Datepicker from "react-tailwindcss-datepicker";
import Image from "next/image";

const ProductDiscountsPage = () => {
    const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery();
    const [editProduct, { isLoading: isUpdating }] = useEditProductMutation();

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [offerDate, setOfferDate] = useState<{
        startDate: string | null;
        endDate: string | null;
    }>({
        startDate: null,
        endDate: null,
    });

    // Product options for select
    const productOptions = useMemo(() => {
        return productsData?.data?.map((p: any) => ({
            value: p._id,
            label: p.title,
            product: p
        })) || [];
    }, [productsData]);

    // Handle product selection
    const handleProductChange = (option: any) => {
        setSelectedProduct(option?.product || null);
        if (option?.product) {
            setDiscountPercent(option.product.discount || 0);
            setOfferDate({
                startDate: option.product.offerDate?.startDate?.split('T')[0] || null,
                endDate: option.product.offerDate?.endDate?.split('T')[0] || null,
            });
        } else {
            setDiscountPercent(0);
            setOfferDate({ startDate: null, endDate: null });
        }
    };

    const handleUpdateDiscount = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) {
            return notifyError("Please select a product first");
        }

        try {
            const res = await editProduct({
                id: selectedProduct._id,
                data: {
                    discount: discountPercent,
                    offerDate: {
                        startDate: offerDate.startDate,
                        endDate: offerDate.endDate,
                    }
                }
            });

            if ("error" in res) {
                notifyError("Failed to update discount");
            } else {
                notifySuccess("Product discount updated successfully");
                // Update local state to reflect changes in the UI
                setSelectedProduct({
                    ...selectedProduct,
                    discount: discountPercent,
                    offerDate: {
                        startDate: offerDate.startDate,
                        endDate: offerDate.endDate,
                    }
                });
            }
        } catch (err) {
            notifyError("Something went wrong");
        }
    };

    // Products with active offers
    const discountedProducts = useMemo(() => {
        return productsData?.data?.filter((p: any) => p.discount > 0) || [];
    }, [productsData]);

    return (
        <Wrapper>
            <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
                <Breadcrumb title="Product Discounts" subtitle="Marketing" />

                <div className="grid grid-cols-12 gap-6 mt-6">
                    {/* Form Section */}
                    <div className="col-span-12 lg:col-span-5">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h4 className="text-lg font-semibold mb-4">Set Product Discount</h4>
                            <form onSubmit={handleUpdateDiscount} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                                    <ReactSelect
                                        options={productOptions}
                                        isLoading={productsLoading}
                                        onChange={handleProductChange}
                                        placeholder="Search product..."
                                        isClearable
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>

                                {selectedProduct && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image
                                                src={selectedProduct.img}
                                                alt={selectedProduct.title}
                                                fill
                                                className="object-cover rounded"
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-medium text-gray-900 truncate">{selectedProduct.title}</p>
                                            <p className="text-xs text-gray-500">Base Price: ₹{selectedProduct.price}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                        className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                                        placeholder="Enter discount %"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 text-capitalize">Start and End Date</label>
                                    <Datepicker
                                        useRange={true}
                                        inputClassName="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
                                        value={offerDate}
                                        onChange={(newValue: any) => setOfferDate(newValue)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isUpdating || !selectedProduct}
                                    className="tp-btn px-7 py-2 w-full mt-4"
                                >
                                    {isUpdating ? "Updating..." : "Update Discount"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* List Section */}
                    <div className="col-span-12 lg:col-span-7">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h4 className="text-lg font-semibold mb-4">Products with Offers</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">Product</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Discount</th>
                                            <th className="px-4 py-3">Offer Period</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {discountedProducts.length > 0 ? (
                                            discountedProducts.map((p: any) => (
                                                <tr key={p._id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 flex items-center gap-3">
                                                        <div className="relative w-10 h-10 flex-shrink-0">
                                                            <Image src={p.img} alt={p.title} fill className="object-cover rounded" />
                                                        </div>
                                                        <span className="font-medium text-gray-900 truncate max-w-[150px]">{p.title}</span>
                                                    </td>
                                                    <td className="px-4 py-3">₹{p.price}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="bg-themeLight text-theme px-2 py-0.5 rounded font-bold">
                                                            {p.discount}%
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-xs">
                                                        {p.offerDate?.startDate ? (
                                                            <>
                                                                <div>{new Date(p.offerDate.startDate).toLocaleDateString()}</div>
                                                                <div className="text-gray-400">to</div>
                                                                <div>{new Date(p.offerDate.endDate).toLocaleDateString()}</div>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400 italic">No dates set</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic">
                                                    No products with active discounts found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default ProductDiscountsPage;
