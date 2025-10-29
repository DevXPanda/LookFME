// import Wrapper from "@/layout/wrapper";
// import Header from "@/layout/headers/header";
// import HomeHeroSlider from "@/components/hero-banner/home-hero-slider";
// import BannerArea from "@/components/banner/banner-area";
// import BlogArea from "@/components/blog/electronic/blog-area";
// import ElectronicCategory from "@/components/categories/electronic-category";
// import CtaArea from "@/components/cta/cta-area";
// import FeatureArea from "@/components/features/feature-area";
// import InstagramArea from "@/components/instagram/instagram-area";
// import NewArrivals from "@/components/products/electronics/new-arrivals";
// import OfferProducts from "@/components/products/electronics/offer-products";
// import ProductArea from "@/components/products/electronics/product-area";
// import ProductBanner from "@/components/products/electronics/product-banner";
// import ProductGadgetArea from "@/components/products/electronics/product-gadget-area";
// import ProductSmArea from "@/components/products/electronics/product-sm-area";
// import Footer from "@/layout/footers/footer";


// export default function HomePage() {
//   return (
//     <Wrapper>
//       <Header/>
//       <HomeHeroSlider/>
//       <ElectronicCategory/>
//       <FeatureArea/>
//       <ProductArea/>
//       <BannerArea/>
//       <OfferProducts/>
//       <ProductGadgetArea/>
//       <ProductBanner/>
//        <NewArrivals/>
//       <ProductSmArea/>
//       <BlogArea/>
//       <InstagramArea/>
//       <CtaArea/>
//       <Footer/>
//     </Wrapper>
//   )
// }


import Wrapper from "@/layout/wrapper";
import HeaderTwo from '@/layout/headers/header-2';
import FashionBanner from '@/components/banner/fashion-banner';
// import BeyoungCategories from '@/components/categories/beyoung-categories';
import PopularProducts from '@/components/products/fashion/popular-products';
import CouponBanner from '@/components/coupon/coupon-banner';
import ProductArea from '@/components/products/fashion/product-area';
import WeeksFeatured from '@/components/products/fashion/weeks-featured';
import TrendingProducts from '@/components/products/fashion/trending-products';
import BestSellerProducts from '@/components/products/fashion/best-seller-products';
import FashionTestimonial from '@/components/testimonial/fashion-testimonial';
// import BlogArea from '@/components/blog/fashion/blog-area';
import FeatureAreaTwo from '@/components/features/feature-area-2';
import InstagramAreaTwo from '@/components/instagram/instagram-area-2';
import Footer from '@/layout/footers/footer';
import FashionCategory from "@/components/categories/fashion-category";
import JuniorBanner from "@/components/banner/JuniorBanner";

export const metadata = {
  title: 'LookFame',
  description: 'LookFame – Discover, shop, and stay in style with the latest fashion trends online.',
}

export default function HomePageTwo() {
  return (
    <Wrapper>
      <HeaderTwo/>
      <FashionBanner/>
      <FashionCategory/>
      {/* <BeyoungCategories/> */}
      <PopularProducts/>
      <CouponBanner/>
      <ProductArea/>
      <WeeksFeatured/>
      <TrendingProducts/>
       <JuniorBanner /> 
      <BestSellerProducts/>
      {/* <FashionTestimonial/> */}
      {/* <BlogArea/> */}
      <FeatureAreaTwo/>
      <InstagramAreaTwo/>
      <Footer style_2={true} />
    </Wrapper>
  )
}
