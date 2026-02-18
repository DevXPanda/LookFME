"use client";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import InboxTable from "@/app/components/help-support/inbox-table";

const InboxPage = () => {
  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Inbox" subtitle="Help & Support" />
        <div className="mb-6" />
        <InboxTable />
      </div>
    </Wrapper>
  );
};

export default InboxPage;
