"use client";
import Link from "next/link";
import React, { useState, useMemo, useCallback } from "react";
import ProductTableHead from "./prd-table-head";
import ProductTableItem from "./prd-table-item";
import { Search } from "@/svg";
import ErrorMsg from "../../common/error-msg";
import {
  useGetAllProductsQuery,
  useBulkDeleteProductsMutation,
  useBulkUpdateProductStatusMutation,
} from "@/redux/product/productApi";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "@/utils/toast";

const ProductListArea = () => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteProductsMutation();
  const [bulkUpdateStatus, { isLoading: isBulkUpdating }] = useBulkUpdateProductStatusMutation();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(() => {
    if (!products?.data) return [];
    let list = [...products.data];

    if (searchValue) {
      const searchLower = searchValue.toLowerCase().replace(/^#/, "").trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(searchLower) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
        (p.variations && p.variations.some((v: any) => v.sku && v.sku.toLowerCase().includes(searchLower)))
      );
    }

    if (selectValue) {
      list = list.filter((p) => p.status === selectValue);
    }

    return list;
  }, [products?.data, searchValue, selectValue]);

  const productItems = useMemo(
    () => (filteredProducts.length > 0 ? [...filteredProducts].reverse() : []),
    [filteredProducts]
  );

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (productItems.length === 0) return;
    if (selectedIds.size === productItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(productItems.map((p) => p._id)));
    }
  }, [productItems, selectedIds.size]);

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${ids.length} product${ids.length === 1 ? "" : "s"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "swal-confirm-btn", cancelButton: "swal-cancel-btn" },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await bulkDelete(ids);
          if ("error" in res) {
            const err = res.error as { data?: { message?: string } };
            notifyError(err.data?.message || "Failed to delete products");
            return;
          }
          notifySuccess(`${ids.length} product${ids.length === 1 ? "" : "s"} deleted.`);
          setSelectedIds(new Set());
        } catch {
          notifyError("Failed to delete products");
        }
      }
    });
  };

  const handleBulkStatus = (status: "in-stock" | "out-of-stock" | "discontinued") => {
    const ids = Array.from(selectedIds);
    const action = status === "discontinued" ? "Hide" : status === "in-stock" ? "Show" : "Set out-of-stock";
    Swal.fire({
      title: `${action} products?`,
      text: `${ids.length} product${ids.length === 1 ? "" : "s"} will be ${status === "discontinued" ? "hidden" : status === "in-stock" ? "shown" : "set out-of-stock"}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "swal-confirm-btn", cancelButton: "swal-cancel-btn" },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await bulkUpdateStatus({ ids, status });
          if ("error" in res) {
            const err = res.error as { data?: { message?: string } };
            notifyError(err.data?.message || "Failed to update status");
            return;
          }
          notifySuccess(`Products ${status === "discontinued" ? "hidden" : "updated"}.`);
          setSelectedIds(new Set());
        } catch {
          notifyError("Failed to update status");
        }
      }
    });
  };

  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && products?.success && filteredProducts.length === 0) {
    content = <ErrorMsg msg="No Products Found" />;
  }

  if (!isLoading && !isError && products?.success && productItems.length > 0) {
    const allSelected = productItems.length > 0 && selectedIds.size === productItems.length;
    const someSelected = selectedIds.size > 0;
    const bulkDisabled = isBulkDeleting || isBulkUpdating;

    content = (
      <>
        {someSelected && (
          <div className="flex flex-wrap items-center gap-2 mb-4 mx-8 p-3 bg-slate-100 rounded-md">
            <span className="text-tiny font-medium text-heading">{selectedIds.size} selected</span>
            <button
              type="button"
              onClick={() => handleBulkStatus("discontinued")}
              disabled={bulkDisabled}
              className="tp-btn px-3 py-1.5 text-tiny bg-warning text-white rounded hover:bg-amber-600 disabled:opacity-50"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("in-stock")}
              disabled={bulkDisabled}
              className="tp-btn px-3 py-1.5 text-tiny bg-success text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Show
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus("out-of-stock")}
              disabled={bulkDisabled}
              className="tp-btn px-3 py-1.5 text-tiny bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Out of stock
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDisabled}
              className="tp-btn px-3 py-1.5 text-tiny bg-danger text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="tp-btn px-3 py-1.5 text-tiny bg-gray-200 text-heading rounded hover:bg-gray-300"
            >
              Clear selection
            </button>
          </div>
        )}
        <div className="relative overflow-x-auto mx-8">
          <table className="w-full text-base text-left text-gray-500">
            <ProductTableHead
              showCheckbox
              allSelected={allSelected}
              onToggleAll={toggleAll}
            />
            <tbody>
              {productItems.map((prd) => (
                <ProductTableItem
                  key={prd._id}
                  product={prd}
                  selected={selectedIds.has(prd._id)}
                  onToggle={() => toggleOne(prd._id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center flex-wrap mx-8">
          <p className="mb-0 text-tiny">
            Showing all {filteredProducts.length} of {products?.data?.length || 0} Products
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      {/* table start */}
      <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
        <div className="tp-search-box flex items-center justify-between px-8 py-8">
          <div className="search-input relative">
            <input
              onChange={handleSearchProduct}
              className="input h-[44px] w-full pl-14"
              type="text"
              placeholder="Search by product name"
            />
            <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
              <Search />
            </button>
          </div>
          <div className="flex justify-end space-x-6">
            <div className="search-select mr-3 flex items-center space-x-3 ">
              <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                Status :{" "}
              </span>
              <select onChange={handleSelectField}>
                <option value="">Status</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
                <option value="discontinued">Hidden (discontinued)</option>
              </select>
            </div>
            <div className="product-add-btn flex ">
              <Link href="/add-product" className="tp-btn">
                Add Product
              </Link>
            </div>
          </div>
        </div>
        {content}
      </div>
      {/* table end */}
    </>
  );
};

export default ProductListArea;
