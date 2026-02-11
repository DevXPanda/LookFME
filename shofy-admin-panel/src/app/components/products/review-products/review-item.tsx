import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";
import {
  useToggleReviewVisibilityMutation,
  useBlockCustomerReviewsMutation,
} from "@/redux/review/reviewApi";
import { notifySuccess, notifyError } from "@/utils/toast";

type Review = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    imageURL?: string;
    reviewBlocked?: boolean;
  };
  productId: {
    _id: string;
    title: string;
    img: string;
  };
  rating: number;
  comment: string;
  visible: boolean;
  isHiddenByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

const ReviewItem = ({ review }: { review: Review }) => {
  const [toggleVisibility, { isLoading: isToggling }] =
    useToggleReviewVisibilityMutation();
  const [blockCustomer, { isLoading: isBlocking }] =
    useBlockCustomerReviewsMutation();

  const handleToggleVisibility = async () => {
    try {
      const res = await toggleVisibility({
        reviewId: review._id,
        visible: !review.visible,
      });
      if ("error" in res) {
        notifyError("Failed to update review visibility");
      } else {
        notifySuccess(
          `Review ${!review.visible ? "shown" : "hidden"} successfully`
        );
      }
    } catch (error) {
      notifyError("Failed to update review visibility");
    }
  };

  const handleBlockCustomer = async () => {
    if (!review.userId?._id) {
      notifyError("Customer information not available");
      return;
    }
    try {
      const isBlocked = review.userId.reviewBlocked || false;
      const res = await blockCustomer({
        userId: review.userId._id,
        reviewBlocked: !isBlocked,
      });
      if ("error" in res) {
        notifyError("Failed to update customer review status");
      } else {
        notifySuccess(
          `Customer reviews ${!isBlocked ? "blocked" : "unblocked"} successfully`
        );
      }
    } catch (error) {
      notifyError("Failed to update customer review status");
    }
  };

  return (
    <tr className="bg-white border-b border-gray6 last:border-0 text-start">
      <td className="pr-8 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {review.userId?.imageURL && (
            <Image
              className="w-[40px] h-[40px] rounded-full"
              src={review.userId.imageURL}
              alt="user-img"
              width={40}
              height={40}
            />
          )}
          <div>
            <span className="font-medium text-heading block">
              {review.userId?.name || "Unknown"}
            </span>
            <span className="text-tiny text-text3">
              {review.userId?.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center space-x-3">
          {review.productId?.img && (
            <Image
              className="w-[50px] h-[50px] rounded-md"
              src={review.productId.img}
              alt="product-img"
              width={50}
              height={50}
            />
          )}
          <span className="font-medium text-heading text-sm">
            {review.productId?.title || "Unknown Product"}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 text-end">
        <div className="flex justify-end items-center space-x-1">
          <Rating
            allowFraction
            size={18}
            initialValue={review.rating}
            readonly={true}
          />
          <span className="text-heading font-medium">{review.rating}</span>
        </div>
      </td>
      <td className="px-3 py-3">
        <p className="text-sm text-textBody line-clamp-2 max-w-[300px]">
          {review.comment || "No comment"}
        </p>
      </td>
      <td className="px-3 py-3 text-end">
        {review.visible ? (
          <span className="text-[11px] text-success bg-success/10 px-3 py-1 rounded-md leading-none font-medium">
            Visible
          </span>
        ) : (
          <span className="text-[11px] text-danger bg-danger/10 px-3 py-1 rounded-md leading-none font-medium">
            Hidden
          </span>
        )}
      </td>
      <td className="px-9 py-3 text-end">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleToggleVisibility}
            disabled={isToggling}
            className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
              review.visible
                ? "bg-danger/10 text-danger hover:bg-danger/20"
                : "bg-success/10 text-success hover:bg-success/20"
            } ${isToggling ? "opacity-50 cursor-not-allowed" : ""}`}
            title={review.visible ? "Hide Review" : "Show Review"}
          >
            {review.visible ? "Hide" : "Show"}
          </button>
          <button
            onClick={handleBlockCustomer}
            disabled={isBlocking || !review.userId?._id}
            className={`text-xs px-3 py-1 rounded-md font-medium transition-colors ${
              review.userId?.reviewBlocked
                ? "bg-success/10 text-success hover:bg-success/20"
                : "bg-warning/10 text-warning hover:bg-warning/20"
            } ${isBlocking || !review.userId?._id ? "opacity-50 cursor-not-allowed" : ""}`}
            title={
              review.userId?.reviewBlocked
                ? "Unblock Customer Reviews"
                : "Block Customer Reviews"
            }
          >
            {review.userId?.reviewBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReviewItem;
