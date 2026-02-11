import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import InventoryLowStock from "../../components/inventory/low-stock";

export default function LowStockPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Inventory" subtitle="Low Stock Alerts" />
        <InventoryLowStock />
      </div>
    </Wrapper>
  );
}
