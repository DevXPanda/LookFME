import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";

export const metadata = {
  title: "Lookfame - Junior Collection",
};

export default function JuniorPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Junior" subtitle="Junior Collection" />
      {/* Pass category as prop */}
      <ShopArea category="junior" />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
