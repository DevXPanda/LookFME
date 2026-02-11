"use client";
import React, { useState } from "react";
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
  const paginationData = usePagination(reviewsData?.data || [], 10);
  const { currentItems, handlePageClick, pageCount } = paginationData;

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
  if (!isLoading && !isError && reviewsData?.data?.length === 0) {
    content = <ErrorMsg msg="No Reviews Found" />;
  }

  if (!isError && reviewsData?.success) {
    let review_items = [...currentItems];
    
    // search field - search by customer name, product name, or comment
    if (searchValue) {
      review_items = review_items.filter((review: any) => {
        const customerName = review.userId?.name?.toLowerCase() || "";
        const productName = review.productId?.title?.toLowerCase() || "";
        const comment = review.comment?.toLowerCase() || "";
        const searchLower = searchValue.toLowerCase();
        return (
          customerName.includes(searchLower) ||
          productName.includes(searchLower) ||
          comment.includes(searchLower)
        );
      });
    }
    
    // filter by rating
    if (selectValue) {
      review_items = review_items.filter(
        (review: any) => review.rating === parseInt(selectValue)
      );
    }

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

        {pageCount > 1 && (
          <div className="flex justify-between items-center flex-wrap mx-8">
            <p className="mb-0 text-tiny mr-3">
              Showing 1-{currentItems.length} of {reviewsData?.data?.length || 0}
            </p>
            <div className="pagination py-3 flex justify-end items-center mr-8 pagination">
              <Pagination
                handlePageClick={handlePageClick}
                pageCount={pageCount}
              />
            </div>
          </div>
        )}
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
