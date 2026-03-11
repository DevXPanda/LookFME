"use client";
import { useParams } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import ComboForm from "../../components/combo-products/combo-form";
import ErrorMsg from "../../components/common/error-msg";

const EditComboProductPage = () => {
  const params = useParams();
  const id = params?.id as string;

  if (!id) {
    return (
      <Wrapper>
        <div className="body-content px-8 py-8 bg-slate-100">
          <ErrorMsg msg="Invalid combo ID" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Edit Combo Product" subtitle="Edit Combo Product" />
        <div className="grid grid-cols-12">
          <div className="col-span-12 2xl:col-span-10">
            <ComboForm comboId={id} isEdit />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default EditComboProductPage;
