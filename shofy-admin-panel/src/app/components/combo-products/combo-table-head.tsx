import React from "react";

const ComboTableHead = () => {
  return (
    <thead className="bg-white">
      <tr className="border-b border-gray6 text-tiny">
        <th scope="col" className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">
          Combo
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-end">
          SKU
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[100px] text-end">
          Pick Count
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[120px] text-end">
          Price
        </th>
        <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase font-semibold w-[12%] text-end">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default ComboTableHead;
