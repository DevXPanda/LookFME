"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BulkOrderDetailArea from "@/app/components/bulk-orders/bulk-order-detail-area";

const BulkOrderDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Bulk Order Details" subtitle="Bulk Orders" />
        <BulkOrderDetailArea id={params.id} />
      </div>
    </Wrapper>
  );
};

export default BulkOrderDetailPage;
