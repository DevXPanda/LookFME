"use client";
import React, { useState, useMemo } from "react";
import { useGetAllReviewsQuery } from "@/redux/review/reviewApi";
import { Search } from "@/svg";
import ErrorMsg from "../../common/error-msg";
import ReviewItem from "./review-item";
import Pagination from "../../ui/Pagination";
import usePagination from "@/hooks/use-pagination";

const ReviewProductArea = () => {
  const { data: reviewsData, isError, isLoading } = useGetAllReviewsQuery();
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectValue, setSelectValue] = useState<string>("");

  const filteredReviews = useMemo(() => {
    if (!reviewsData?.data) return [];
    let list = [...reviewsData.data];

    // search field - search by customer name, product name, SKU, or comment
    if (searchValue) {
      const searchLower = searchValue.toLowerCase().replace(/^#/, "").trim();
      list = list.filter((review: any) => {
        const customerName = review.userId?.name?.toLowerCase() || "";
        const productName = review.productId?.title?.toLowerCase() || "";
        const productSku = review.productId?.sku?.toLowerCase() || "";
        const comment = review.comment?.toLowerCase() || "";

        // Check variations SKUs as well
        const variationSkus = review.productId?.variations?.some(
          (v: any) => v.sku && v.sku.toLowerCase().includes(searchLower)
        );

        return (
          customerName.includes(searchLower) ||
          productName.includes(searchLower) ||
          productSku.includes(searchLower) ||
          variationSkus ||
          comment.includes(searchLower)
        );
      });
    }

    // filter by rating
    if (selectValue) {
      list = list.filter(
        (review: any) => review.rating === parseInt(selectValue)
      );
    }

    return list;
  }, [reviewsData?.data, searchValue, selectValue]);

  // search field
  const handleSearchReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // handle select input
  const handleSelectField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
  };

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <h2 className="p-8 text-center">Loading....</h2>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && reviewsData?.success && filteredReviews.length === 0) {
    content = <ErrorMsg msg="No Reviews Found" />;
  }

  if (!isError && reviewsData?.success && filteredReviews.length > 0) {
    let review_items = [...filteredReviews];

    content = (
      <>
        <div className="tp-search-box flex items-center justify-between px-8 py-8 flex-wrap">
          <div className="search-input relative mb-5 md:mb-0 mr-3">
            <input
              onChange={handleSearchReview}
              className="input h-[44px] w-full pl-14"
              type="text"
              placeholder="Search by customer name, product, or comment"
            />
            <button className="absolute top-1/2 left-5 translate-y-[-50%] hover:text-theme">
              <Search />
            </button>
          </div>
          <div className="flex sm:justify-end sm:space-x-6 flex-wrap">
            <div className="search-select mr-3 flex items-center space-x-3 ">
              <span className="text-tiny inline-block leading-none -translate-y-[2px]">
                Rating :{" "}
              </span>
              <select onChange={handleSelectField}>
                <option value="">All Ratings</option>
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
        <div className="relative overflow-x-auto mx-8">
          <table className="w-full text-base text-left text-gray-500">
            <thead className="bg-white">
              <tr className="border-b border-gray6 text-tiny">
                <th
                  scope="col"
                  className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold"
                >
                  Customer Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold"
                >
                  Comment
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-9 py-3 text-tiny text-text2 uppercase font-semibold text-end"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {review_items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-text3">
                    No reviews found
                  </td>
                </tr>
              ) : (
                review_items.map((review: any) => (
                  <ReviewItem key={review._id} review={review} />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center flex-wrap mx-8">
          <p className="mb-0 text-tiny mr-3">
            Showing all {filteredReviews.length} of {reviewsData?.data?.length || 0} Reviews
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="bg-white rounded-t-md rounded-b-md shadow-xs py-4">
        {content}
      </div>
    </>
  );
};

export default ReviewProductArea;
