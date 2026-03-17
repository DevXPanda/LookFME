import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import BulkOrderBreadcrumb from "@/components/breadcrumb/bulk-order-breadcrumb";
import BulkOrderArea from "@/components/bulk-order/bulk-order-area";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Bulk Order - LookFame",
  description: "Submit your bulk order request",
};

export default function BulkOrderPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <BulkOrderBreadcrumb />
      <BulkOrderArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
