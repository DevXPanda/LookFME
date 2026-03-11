"use client";
import Link from "next/link";
import React from "react";
import ComboTableHead from "./combo-table-head";
import ComboTableItem from "./combo-table-item";
import ErrorMsg from "../common/error-msg";
import { useGetComboProductsQuery } from "@/redux/comboProduct/comboProductApi";

const ComboListArea = () => {
  const { data, isError, isLoading } = useGetComboProductsQuery();

  let content = null;
  if (isLoading) content = <h2>Loading....</h2>;
  if (!isLoading && isError) content = <ErrorMsg msg="There was an error" />;
  if (!isLoading && !isError && (!data?.data || data.data.length === 0)) {
    content = (
      <div className="mx-8">
        <ErrorMsg msg="No combo products found. Add your first combo product." />
        <Link href="/add-combo-product" className="tp-btn px-5 py-2 mt-4 inline-block">
          Add Combo Product
        </Link>
      </div>
    );
  }

  if (!isLoading && !isError && data?.success && data.data.length > 0) {
    const combos = [...data.data].reverse();
    content = (
      <>
        <div className="relative overflow-x-auto mx-8">
          <table className="w-full text-base text-left text-gray-500">
            <ComboTableHead />
            <tbody>
              {combos.map((combo) => (
                <ComboTableItem key={combo._id} combo={combo} />
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return <>{content}</>;
};

export default ComboListArea;
