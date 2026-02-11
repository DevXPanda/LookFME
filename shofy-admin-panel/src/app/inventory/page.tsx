import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../components/breadcrumb/breadcrumb";
import InventoryCategoryStock from "../components/inventory/category-stock";
import InventoryLowStock from "../components/inventory/low-stock";
import InventoryStockValuation from "../components/inventory/stock-valuation";
import InventorySalesVsStock from "../components/inventory/sales-vs-stock";

export default function InventoryPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        {/* breadcrumb start */}
        <Breadcrumb title="Inventory" subtitle="Inventory Overview" />
        {/* breadcrumb end */}

        {/* inventory sections start */}
        <div className="space-y-6">
          <InventoryCategoryStock />
          <InventoryLowStock />
          <InventoryStockValuation />
          <InventorySalesVsStock />
        </div>
        {/* inventory sections end */}
      </div>
    </Wrapper>
  );
}
