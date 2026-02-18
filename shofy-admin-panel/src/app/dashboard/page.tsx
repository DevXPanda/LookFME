import Wrapper from "@/layout/wrapper";
import BusinessAnalytics from "../components/dashboard/business-analytics";
import ProductPerformance from "../components/dashboard/product-performance";
import EarningStatistics from "../components/dashboard/earning-statistics";
import WelcomeOfferCard from "../components/dashboard/welcome-offer-card";

export default function DashboardPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <div className="flex justify-between items-end flex-wrap">
          <div className="page-title mb-7">
            <h3 className="mb-0 text-4xl">Dashboard</h3>
            <p className="text-textBody m-0">Welcome to your dashboard</p>
          </div>
        </div>

        <WelcomeOfferCard />

        {/* Business Analytics start */}
        <BusinessAnalytics />
        {/* Business Analytics end */}

        {/* Product Performance start */}
        <ProductPerformance />
        {/* Product Performance end */}

        {/* Earning Statistics start */}
        <EarningStatistics />
        {/* Earning Statistics end */}
      </div>
    </Wrapper>
  );
}
