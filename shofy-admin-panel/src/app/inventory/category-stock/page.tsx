import Wrapper from "@/layout/wrapper";
import Breadcrumb from "../../components/breadcrumb/breadcrumb";
import InventoryCategoryStock from "../../components/inventory/category-stock";

export default function CategoryStockPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Inventory" subtitle="Category Stock Details" />
        <InventoryCategoryStock />
      </div>
    </Wrapper>
  );
}
