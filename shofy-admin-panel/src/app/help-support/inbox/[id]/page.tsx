"use client";
import React, { useState } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import { useGetSupportMessageByIdQuery, useUpdateSupportMessageStatusMutation, useReplyToSupportMessageMutation } from "@/redux/support/supportApi";
import ErrorMsg from "@/app/components/common/error-msg";
import Link from "next/link";
import ReactSelect from "react-select";
import { notifySuccess, notifyError } from "@/utils/toast";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
];

const SupportMessageDetailPage = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [replyText, setReplyText] = useState("");
  const { data, isError, isLoading } = useGetSupportMessageByIdQuery(id);
  const [updateStatus] = useUpdateSupportMessageStatusMutation();
  const [replyToMessage, { isLoading: isReplyLoading }] = useReplyToSupportMessageMutation();
  const message = data?.data;
  const isReplied = message?.status === "replied";

  const handleStatusChange = async (value: string | undefined) => {
    if (!value || !message) return;
    try {
      const res = await updateStatus({
        id: message._id,
        data: { status: value as "open" | "replied" | "closed" },
      });
      if ("error" in res) {
        const err = res.error as { data?: { message?: string } };
        notifyError(err?.data?.message || "Failed to update status");
      } else {
        notifySuccess(res.data?.message || "Status updated");
      }
    } catch {
      notifyError("Failed to update status");
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const reply = replyText.trim();
    if (!reply || !message) {
      notifyError("Reply message is required");
      return;
    }
    try {
      const res = await replyToMessage({
        id: message._id,
        data: { reply },
      });
      if ("error" in res) {
        const err = res.error as { status?: number; data?: { message?: string } };
        const msg = err?.data?.message;
        if (err?.status === 404 && msg === "Not Found") {
          notifyError("Reply endpoint not found. Restart the backend and ensure NEXT_PUBLIC_API_BASE_URL points to it.");
        } else {
          notifyError(msg || "Failed to send reply");
        }
      } else {
        notifySuccess(res.data?.message || "Reply sent successfully");
        setReplyText("");
      }
    } catch {
      notifyError("Failed to send reply");
    }
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-theme border-t-transparent" />
            <p className="mt-3 text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (isError || !message) {
    return (
      <Wrapper>
        <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
          <ErrorMsg msg="Message not found" />
          <Link href="/help-support/inbox" className="text-theme hover:underline mt-4 inline-block">
            Back to Inbox
          </Link>
        </div>
      </Wrapper>
    );
  }

  const currentStatus = statusOptions.find((o) => o.value === message.status) || statusOptions[0];
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "36px",
      height: "36px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
      "&:hover": { borderColor: "#d1d5db" },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (provided: any) => ({ ...provided, padding: "6px 8px" }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#eff6ff" : state.isFocused ? "#f9fafb" : "white",
      color: state.isSelected ? "#2563eb" : "#374151",
      padding: "8px 12px",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 9999,
    }),
    singleValue: (provided: any) => ({ ...provided, color: "#374151" }),
  };

  return (
    <Wrapper>
      <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Message detail" subtitle="Help & Support" />
        <div className="mb-6 flex items-center justify-between">
          <Link href="/help-support/inbox" className="text-sm text-theme hover:underline">
            ← Back to Inbox
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Status</span>
            <div className="w-[120px]">
              <ReactSelect
                value={currentStatus}
                onChange={(o) => handleStatusChange(o?.value)}
                options={statusOptions}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{message.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</dt>
              <dd className="mt-1 text-sm text-gray-600">
                <a href={`mailto:${message.email}`} className="text-theme hover:underline">
                  {message.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">{message.subject}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</dt>
              <dd className="mt-1 text-sm text-gray-600">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</dt>
              <dd className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                {message.message}
              </dd>
            </div>
            {message.adminReply && (
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin reply</dt>
                <dd className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {message.adminReply}
                </dd>
              </div>
            )}
          </dl>

          {!isReplied && (
            <form onSubmit={handleSendReply} className="mt-6 pt-6 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Reply <span className="text-red-500">*</span>
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme/20 focus:border-theme"
              />
              <button
                type="submit"
                disabled={isReplyLoading || !replyText.trim()}
                className="mt-3 px-4 py-2 text-sm font-medium text-white bg-theme rounded-lg hover:bg-theme/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isReplyLoading ? "Sending..." : "Send Reply"}
              </button>
            </form>
          )}
          {isReplied && message.adminReply && (
            <p className="mt-6 text-sm text-gray-500">Replied. Reply is shown above.</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default SupportMessageDetailPage;
