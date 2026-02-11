import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import InventorySalesVsStock from "../../components/inventory/sales-vs-stock";

export default function SalesVsStockPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Inventory" subtitle="Sales vs Stock Report" />
        <InventorySalesVsStock />
      </div>
    </Wrapper>
  );
}
