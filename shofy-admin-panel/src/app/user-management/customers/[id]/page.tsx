"use client";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import CustomerDetailArea from "@/app/components/user-management/customer-detail-area";

const CustomerDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Customer Details" subtitle="User Management" />
        <CustomerDetailArea id={params.id} />
      </div>
    </Wrapper>
  );
};

export default CustomerDetailPage;
