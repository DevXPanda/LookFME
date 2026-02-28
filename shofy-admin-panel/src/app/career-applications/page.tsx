"use client";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import CareerTable from "@/app/components/career/career-table";

const CareerApplicationsPage = () => {
    return (
        <Wrapper>
            <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
                <Breadcrumb title="Career Applications" subtitle="Team Building" />
                <div className="mb-6" />
                <CareerTable />
            </div>
        </Wrapper>
    );
};

export default CareerApplicationsPage;
