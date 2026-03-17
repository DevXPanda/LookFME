import Image from "next/image";
import React from "react";
import { Delete, Edit } from "@/svg";
import { IComboProduct } from "@/types/combo-product-type";
import ComboEditDeleteBtn from "../button/combo-edit-delete-btn";

const ComboTableItem = ({ combo }: { combo: IComboProduct }) => {
  const { _id, img, title, sku, price, combo_count } = combo;

  return (
    <tr className="bg-white border-b border-gray6 last:border-0 text-start mx-9">
      <td className="pr-8 py-5 whitespace-nowrap">
        <div className="flex items-center space-x-5">
          <Image
            className="w-[60px] h-[60px] rounded-md object-cover bg-[#F2F3F5]"
            src={img}
            width={60}
            height={60}
            alt="combo"
          />
          <span className="font-medium text-heading">{title}</span>
        </div>
      </td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">{sku || "-"}</td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">Pick Any {combo_count}</td>
      <td className="px-3 py-3 font-normal text-[#55585B] text-end">₹{price?.toFixed(2)}</td>
      <td className="px-9 py-3 text-end">
        <div className="flex items-center justify-end space-x-2">
          <ComboEditDeleteBtn id={_id} />
        </div>
      </td>
    </tr>
  );
};

export default ComboTableItem;
