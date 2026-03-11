"use client"
import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import ErrorMsg from '../common/error-msg';
import CategoryEditDelete from './edit-delete-category';
import {
  useGetAllCategoriesQuery,
  useBulkDeleteCategoriesMutation,
  useBulkUpdateCategoryStatusMutation,
} from '@/redux/category/categoryApi';
import Swal from 'sweetalert2';
import { notifyError, notifySuccess } from '@/utils/toast';
import { ICategoryItem } from '@/types/category-type';

const CategoryTables = () => {
  const { data: categories, isError, isLoading } = useGetAllCategoriesQuery();
  const [bulkDelete, { isLoading: isBulkDeleting }] = useBulkDeleteCategoriesMutation();
  const [bulkUpdateStatus, { isLoading: isBulkUpdating }] = useBulkUpdateCategoryStatusMutation();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allCategories: ICategoryItem[] = categories?.success && categories?.result?.length
    ? [...categories.result].reverse()
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
    if (selectedIds.size === allCategories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allCategories.map((c) => c._id)));
    }
  }, [allCategories, selectedIds.size]);

  const handleBulkDelete = () => {
    const ids = Array.from(selectedIds);
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${ids.length} categor${ids.length === 1 ? 'y' : 'ies'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await bulkDelete(ids);
          if ('error' in res) {
            const err = res.error as { data?: { message?: string } };
            notifyError(err.data?.message || 'Failed to delete categories');
            return;
          }
          notifySuccess(`${ids.length} categor${ids.length === 1 ? 'y' : 'ies'} deleted.`);
          setSelectedIds(new Set());
        } catch {
          notifyError('Failed to delete categories');
        }
      }
    });
  };

  const handleBulkStatus = (status: 'Show' | 'Hide') => {
    const ids = Array.from(selectedIds);
    Swal.fire({
      title: status === 'Hide' ? 'Hide categories?' : 'Show categories?',
      text: `${status} ${ids.length} categor${ids.length === 1 ? 'y' : 'ies'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await bulkUpdateStatus({ ids, status });
          if ('error' in res) {
            const err = res.error as { data?: { message?: string } };
            notifyError(err.data?.message || `Failed to ${status.toLowerCase()} categories`);
            return;
          }
          notifySuccess(`Categor${ids.length === 1 ? 'y' : 'ies'} ${status === 'Hide' ? 'hidden' : 'shown'}.`);
          setSelectedIds(new Set());
        } catch {
          notifyError(`Failed to ${status.toLowerCase()} categories`);
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
  if (!isLoading && !isError && (!categories?.result || categories?.result.length === 0)) {
    content = <ErrorMsg msg="No Category Found" />;
  }

  if (!isLoading && !isError && categories?.success && categories?.result && categories.result.length > 0) {
    const allSelected = allCategories.length > 0 && selectedIds.size === allCategories.length;
    const someSelected = selectedIds.size > 0;
    const bulkDisabled = isBulkDeleting || isBulkUpdating;

    content = (
      <>
        {someSelected && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-slate-100 rounded-md">
            <span className="text-tiny font-medium text-heading">
              {selectedIds.size} selected
            </span>
            <button
              type="button"
              onClick={() => handleBulkStatus('Hide')}
              disabled={bulkDisabled}
              className="tp-btn px-3 py-1.5 text-tiny bg-warning text-white rounded hover:bg-amber-600 disabled:opacity-50"
            >
              Hide
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus('Show')}
              disabled={bulkDisabled}
              className="tp-btn px-3 py-1.5 text-tiny bg-success text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Show
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
                      aria-label="Select all categories"
                    />
                  </th>
                  <th scope="col" className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">
                    ID
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px]">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end">
                    Product type
                  </th>
                  <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[150px] text-end">
                    Items
                  </th>
                  <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCategories.map((item) => (
                  <tr key={item._id} className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
                    <td className="px-3 py-3 pl-0">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item._id)}
                        onChange={() => toggleOne(item._id)}
                        className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme cursor-pointer"
                        aria-label={`Select ${item.parent}`}
                      />
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B]">
                      #{item._id.slice(2, 10)}
                    </td>
                    <td className="pr-8 py-5 whitespace-nowrap">
                      <a href="#" className="flex items-center space-x-5">
                        {item.img && (
                          <Image
                            className="w-10 h-10 rounded-full shrink-0 object-cover"
                            src={item.img}
                            alt=""
                            width={40}
                            height={40}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium text-heading text-hover-primary transition">
                            {item.parent}
                          </span>
                          {item.featuredForCustomerSection && (
                            <span className="text-[10px] bg-themeLight text-theme px-1.5 py-0.5 rounded font-semibold w-fit mt-1">
                              Featured
                            </span>
                          )}
                          {item.status === 'Hide' && (
                            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-semibold w-fit mt-1">
                              Hidden
                            </span>
                          )}
                        </div>
                      </a>
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      /{item.productType}
                    </td>
                    <td className="px-3 py-3 font-normal text-[#55585B] text-end">
                      {item.products?.length}
                    </td>
                    <td className="px-9 py-3 text-end">
                      <div className="flex items-center justify-end space-x-2">
                        <CategoryEditDelete id={item._id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center flex-wrap">
          <p className="mb-0 text-tiny">Showing all {categories?.result.length} Categories</p>
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

export default CategoryTables;