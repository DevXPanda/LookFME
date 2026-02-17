"use client";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import CustomerTable from "@/app/components/user-management/customer-table";

const CustomersPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Customers" subtitle="User Management" />
        <div className="mb-6">
          {/* <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage customer accounts</p> */}
        </div>
        <CustomerTable />
      </div>
    </Wrapper>
  );
};

export default CustomersPage;
