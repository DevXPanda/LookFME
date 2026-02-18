import { Suspense } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import RefundTable from "../components/refund-requests/refund-table";

const RefundRequestsPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Refund Requests" subtitle="Refund List" />
        <Suspense fallback={<div className="p-8">Loading refund requests...</div>}>
          <RefundTable />
        </Suspense>
      </div>
    </Wrapper>
  );
};

export default RefundRequestsPage;
