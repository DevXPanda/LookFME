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
import AdBanner from '@/components/banner/ad-Banner';
import SuperSavingCombos from "@/components/categories/superSavingCombos";
import AutoSlider from "@/components/autoslider/autoslider";

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
      <SuperSavingCombos/>
       <AdBanner />
      {/* <BeyoungCategories/> */}
      <PopularProducts/>
      <AutoSlider/>
      {/* <CouponBanner/> */}
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
