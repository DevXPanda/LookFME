import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Shofy - Product Details Page",
};

export default function CombotDetailsPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
