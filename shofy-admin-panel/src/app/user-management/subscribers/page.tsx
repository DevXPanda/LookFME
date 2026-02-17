"use client";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import SubscriberTable from "@/app/components/user-management/subscriber-table";

const SubscribersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Subscribers" subtitle="User Management" />
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="mt-1 text-sm text-gray-500">Newsletter and subscription list</p>
        </div>
        <SubscriberTable />
      </div>
    </Wrapper>
  );
};

export default SubscribersPage;
