"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import { useGetCustomerReviewsQuery, useDeleteReviewMutation, useToggleReviewVisibilityMutation } from "@/redux/user-management/userManagementApi";
import ErrorMsg from "@/app/components/common/error-msg";
import { notifySuccess, notifyError } from "@/utils/toast";
import Swal from "sweetalert2";

interface CustomerReviewsProps {
  customerId: string;
}

const CustomerReviews = ({ customerId }: CustomerReviewsProps) => {
  const { data: reviewsData, isLoading, isError } = useGetCustomerReviewsQuery(customerId);
  const [deleteReview] = useDeleteReviewMutation();
  const [toggleVisibility] = useToggleReviewVisibilityMutation();

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  if (isError) {
    return <ErrorMsg msg="Failed to load reviews" />;
  }

  const reviews = reviewsData?.data || [];

  if (reviews.length === 0) {
    return <div className="text-center py-8 text-gray-500">No reviews found</div>;
  }

  const handleDelete = async (reviewId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the review",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteReview(reviewId);
          if ("error" in res) {
            notifyError("Failed to delete review");
          } else {
            notifySuccess("Review deleted successfully");
          }
        } catch (error) {
          notifyError("Failed to delete review");
        }
      }
    });
  };

  const handleToggleVisibility = async (reviewId: string, currentVisible: boolean) => {
    try {
      const res = await toggleVisibility({
        reviewId,
        data: { visible: !currentVisible },
      });
      if ("error" in res) {
        notifyError("Failed to update review visibility");
      } else {
        notifySuccess(`Review ${!currentVisible ? "shown" : "hidden"} successfully`);
      }
    } catch (error) {
      notifyError("Failed to update review visibility");
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                {review.productId?.img && (
                  <Image
                    src={review.productId.img}
                    alt={review.productId?.title || "Product"}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                )}
                <div>
                  {review.productId?._id ? (
                    <Link
                      href={`/products/${review.productId._id}`}
                      className="font-semibold text-theme hover:underline"
                    >
                      {review.productId?.title || "Product"}
                    </Link>
                  ) : (
                    <span className="font-semibold">{review.productId?.title || "Product"}</span>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    <Rating
                      readonly
                      initialValue={review.rating}
                      size={16}
                      allowFraction
                    />
                    <span className="text-sm text-gray-600">{review.rating}/5</span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 mb-2">{review.comment}</p>
              )}
              <p className="text-sm text-gray-500">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  review.visible !== false
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {review.visible !== false ? "Visible" : "Hidden"}
              </span>
              <button
                onClick={() => handleToggleVisibility(review._id, review.visible !== false)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                {review.visible !== false ? "Hide" : "Show"}
              </button>
              <button
                onClick={() => handleDelete(review._id)}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerReviews;
