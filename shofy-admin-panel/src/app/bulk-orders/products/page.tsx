import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import BulkProductsArea from "@/app/components/bulk-orders/bulk-products-area";

const BulkProductsPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Bulk Products" subtitle="Bulk Orders" />
        <div className="mb-6" />
        <BulkProductsArea />
      </div>
    </Wrapper>
  );
};

export default BulkProductsPage;
