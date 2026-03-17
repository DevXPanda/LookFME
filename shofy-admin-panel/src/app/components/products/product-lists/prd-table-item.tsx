import Image from "next/image";
import React from "react";
import { IProduct } from "@/types/product-type";
import { Rating } from "react-simple-star-rating";
import EditDeleteBtn from "../../button/edit-delete-btn";

type ProductTableItemProps = {
  product: IProduct;
  selected?: boolean;
  onToggle?: () => void;
};

const ProductTableItem = ({ product, selected, onToggle }: ProductTableItemProps) => {
  const { _id, img, title, sku, price, reviews, status, quantity } = product || {};
  const averageRating =
    reviews && reviews?.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  return (
    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
      {onToggle !== undefined && (
        <td className="px-3 py-3 pl-0">
          <input
            type="checkbox"
            checked={!!selected}
            onChange={onToggle}
            className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme cursor-pointer"
            aria-label={`Select ${title}`}
          />
        </td>
      )}
      <td className="pr-8 py-5 whitespace-nowrap">
        <a href="#" className="flex items-center space-x-5">
          <Image
            className="w-[60px] h-[60px] rounded-md object-cover bg-[#F2F3F5]"
            src={product.img}
            width={60}
            height={60}
            alt="product img"
          />
          <span className="font-medium text-heading text-hover-primary transition">
            {title}
          </span>
        </a>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">{sku}</td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        {quantity}
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">
        ₹{price.toFixed(2)}
      </td>
      <td className="px-3 py-3 font-normal text-heading text-end">
        <div className="flex justify-end items-center space-x-1 text-tiny">
          <span className="text-yellow flex items-center space-x-1">
            <Rating
              allowFraction
              size={18}
              initialValue={averageRating}
              readonly={true}
            />
          </span>
        </div>
      </td>
      <td className="px-3 py-3 text-end">
        <span
          className={`text-[11px] px-3 py-1 rounded-md leading-none font-medium text-end ${
            status === "in-stock"
              ? "text-success bg-success/10"
              : status === "discontinued"
                ? "text-gray-600 bg-gray-200"
                : "text-danger bg-danger/10"
          }`}
        >
          {status === "discontinued" ? "Hidden" : status}
        </span>
      </td>
      <td className="px-9 py-3 text-end">
        <div className="flex items-center justify-end space-x-2">
          <EditDeleteBtn id={_id}/>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableItem;
