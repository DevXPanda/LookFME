import React from 'react';

type ProductTableHeadProps = {
  allSelected?: boolean;
  onToggleAll?: () => void;
  showCheckbox?: boolean;
};

const ProductTableHead = ({ allSelected, onToggleAll, showCheckbox }: ProductTableHeadProps) => {
  return (
    <thead className="bg-white">
      <tr className="border-b border-gray6 text-tiny">
        {showCheckbox && (
          <th scope="col" className="pr-2 py-3 text-tiny text-text2 uppercase font-semibold w-10">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onToggleAll}
              className="w-4 h-4 text-theme bg-gray-100 border-gray-300 rounded focus:ring-theme cursor-pointer"
              aria-label="Select all products"
            />
          </th>
        )}
        <th scope="col" className="pr-8 py-3 text-tiny text-text2 uppercase font-semibold">
          Product
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
          SKU
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
          QTY
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
          Price
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
          Rating
        </th>
        <th scope="col" className="px-3 py-3 text-tiny text-text2 uppercase font-semibold w-[170px] text-end">
          Status
        </th>
        <th scope="col" className="px-9 py-3 text-tiny text-text2 uppercase  font-semibold w-[12%] text-end">
          Action
        </th>
      </tr>
    </thead>
  );
};

export default ProductTableHead;