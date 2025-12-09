// import Wrapper from "@/layout/wrapper";
// import HeaderTwo from "@/layout/headers/header-2";
// // import ComboDetailsArea from "@/components/combo-details/ComboDetailArea.jsx";
// import ComboDetailsArea from "../../../components/combo-details/ComboDetailPage";
// import Footer from "@/layout/footers/footer";

// export const metadata = {
//   title: "Shofy - Product Details Page",
// };

// export default function ComboDetailById({ params }) {
//   const { id } = params;

//   const imagePath = `/assets/img/combos/${id}.jpg`;

//   return (
//     <Wrapper>
//       <HeaderTwo style_2={true} />
//       <ComboDetailsArea mainImage={imagePath} />
//       <Footer primary_style={true} />
//     </Wrapper>
//   );
// }




import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ComboDetailsArea from "@/components/combo-details/ComboDetailPage";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Shofy - Product Details Page",
};

export default function ComboDetailById({ params }) {
  const { id } = params;

  const imagePath = `/assets/img/combos/${id}.jpg`;

  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ComboDetailsArea mainImage={imagePath} thumbnails={[]} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
