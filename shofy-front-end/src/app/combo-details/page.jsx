import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ComboDetailsArea from "@/components/combo-details/ComboDetailPage";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Shofy - Product Details Page",
};

export default function ComboDetailsPage({ searchParams }) {
  const image = searchParams?.image;

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ComboDetailsArea mainImage={image} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
