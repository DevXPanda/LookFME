"use client";
import React, { useState, useCallback } from "react";
import ErrorMsg from "../common/error-msg";
import Image from "next/image";
import { useGetAllBrandsQuery, useBulkDeleteBrandsMutation } from "@/redux/brand/brandApi";
import BrandEditDelete from "./brand-edit-del";
import Swal from "sweetalert2";
import { notifyError, notifySuccess } from "@/utils/toast";

const BrandTables = () => {
  const { data: brands, isError, isLoading } = useGetAllBrandsQuery();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteBrandsMutation();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allBrands = brands?.success && brands?.result?.length
    ? [...brands.result].reverse()
    : [];

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === allBrands.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allBrands.map((b: { _id: string }) => b._id)));
    }
  }, [allBrands, selectedIds.size]);

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${ids.length} brand${ids.length === 1 ? "" : "s"}?`,
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
            notifyError(err.data?.message || "Failed to delete brands");
            return;
          }
          notifySuccess(`${ids.length} brand${ids.length === 1 ? "" : "s"} deleted.`);
          setSelectedIds(new Set());
        } catch {
          notifyError("Failed to delete brands");
        }
      }
    });
  };

  let content = null;

  if (isLoading) {
    content = <h2>Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && (!brands?.result || brands?.result.length === 0)) {
    content = <ErrorMsg msg="No Brands Found" />;
  }

  if (!isLoading && !isError && brands?.success && brands?.result && brands.result.length > 0) {
    const allSelected = allBrands.length > 0 && selectedIds.size === allBrands.length;
    const someSelected = selectedIds.size > 0;

    content = (
      <>
        {someSelected && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-slate-100 rounded-md">
            <span className="text-tiny font-medium text-heading">{selectedIds.size} selected</span>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="tp-btn px-3 py-1.5 text-tiny bg-danger text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete selected
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
        <div className="overflow-scroll 2xl:overflow-visible">
          <div className="w-[975px] 2xl:w-full">
            <table className="w-full text-base text-left text-gray-500 ">
              <thead>
                <tr className="border-b border-gray6 text-tiny">
                  <th scope="col" className="pr-2 py-3 text-tiny text-text2 uppercase font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme cursor-pointer"
                      aria-label="Select all brands"
                    />
                  </th>
                  <th
                    scope="col"
                    className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px]"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end"
                  >
                    Website
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allBrands.map((item: { _id: string; logo?: string; name: string; email?: string; website?: string; location?: string }) => (
                  <tr
                    key={item._id}
                    className="bg-white border-b border-gray6 last:border-0 text-start mx-9"
                  >
                    <td className="px-3 py-3 pl-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item._id)}
                        onChange={() => toggleOne(item._id)}
                        className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme cursor-pointer"
                        aria-label={`Select ${item.name}`}
                      />
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B]">
                      #{item._id.slice(2, 10)}
                    </td>
                    <td className="pr-8 py-5 whitespace-nowrap">
                      <a href="#" className="flex items-center space-x-5">
                        {item.logo && (
                          <Image
                            className="w-10 h-10 rounded-full object-contain"
                            src={item.logo}
                            alt=""
                            width={40}
                            height={40}
                          />
                        )}
                        <span className="font-medium text-heading text-hover-primary transition">
                          {item.name}
                        </span>
                      </a>
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      {item.email}
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      {item.website}
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      {item.location}
                    </td>
                    <td className="px-9 py-3 text-end">
                      <div className="flex items-center justify-end space-x-2">
                        <BrandEditDelete id={item._id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <p className="mb-0 text-tiny">
            Showing all {brands?.result.length} Brands
          </p>
        </div>
      </>
    );
  }
  return (
    <div className="relative overflow-x-auto bg-white px-8 py-4 rounded-md">
      {content}
    </div>
  );
};

export default BrandTables;
