import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import InventoryStockValuation from "../../components/inventory/stock-valuation";

export default function StockValuationPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Inventory" subtitle="Stock Valuation Report" />
        <InventoryStockValuation />
      </div>
    </Wrapper>
  );
}
