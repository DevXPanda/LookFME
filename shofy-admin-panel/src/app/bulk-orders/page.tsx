import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BulkOrderTable from "@/app/components/bulk-orders/bulk-order-table";

const BulkOrdersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Bulk Orders" subtitle="Bulk Order Requests" />
        <div className="mb-6" />
        <BulkOrderTable />
      </div>
    </Wrapper>
  );
};

export default BulkOrdersPage;
