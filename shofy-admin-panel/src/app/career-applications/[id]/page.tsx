"use client";
import React, { useState } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import { useGetCareerApplicationQuery, useReplyToApplicationMutation } from "@/redux/career/careerApi";
import ErrorMsg from "@/app/components/common/error-msg";
import Link from "next/link";
import { notifySuccess, notifyError } from "@/utils/toast";

const CareerApplicationDetailPage = ({ params }: { params: { id: string } }) => {
    const id = params.id;
    const [replyText, setReplyText] = useState("");
    const { data, isError, isLoading } = useGetCareerApplicationQuery(id);
    const [replyToApplication, { isLoading: isReplyLoading }] = useReplyToApplicationMutation();
    const application = data?.data;
    const isReplied = application?.status === "replied";

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        const reply = replyText.trim();
        if (!reply || !application) {
            notifyError("Reply message is required");
            return;
        }
        try {
            const res = await replyToApplication({
                id: application._id,
                reply,
            });
            if ("error" in res) {
                const err = res.error as { status?: number; data?: { message?: string } };
                notifyError(err?.data?.message || "Failed to send reply");
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

    if (isError || !application) {
        return (
            <Wrapper>
                <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
                    <ErrorMsg msg="Application not found" />
                    <Link href="/career-applications" className="text-theme hover:underline mt-4 inline-block">
                        Back to Applications
                    </Link>
                </div>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <div className="body-content px-6 sm:px-8 py-8 bg-slate-100 min-h-screen">
                <Breadcrumb title="Application Detail" subtitle="Career Applications" />
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/career-applications" className="text-sm text-theme hover:underline">
                        ← Back to Applications
                    </Link>
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 font-semibold rounded-md text-sm border">
                        Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</dt>
                            <dd className="mt-1 text-sm font-medium text-gray-900">{application.name}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</dt>
                            <dd className="mt-1 text-sm text-gray-600">
                                <a href={`mailto:${application.email}`} className="text-theme hover:underline">
                                    {application.email}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</dt>
                            <dd className="mt-1 text-sm font-medium text-gray-900">{application.role}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Applied</dt>
                            <dd className="mt-1 text-sm text-gray-600">
                                {application.createdAt
                                    ? new Date(application.createdAt).toLocaleString("en-IN", {
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
                            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resume</dt>
                            <dd className="mt-2 text-sm text-gray-700">
                                <a
                                    href={application.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-[#F875AA] text-white px-4 py-2 rounded shadow hover:bg-[#e6669a] transition inline-block font-semibold"
                                >
                                    View / Download Resume
                                </a>
                            </dd>
                        </div>
                        {application.message && (
                            <div>
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cover Letter / Message</dt>
                                <dd className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    {application.message}
                                </dd>
                            </div>
                        )}
                        {application.adminReply && (
                            <div>
                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Reply Details</dt>
                                <dd className="mt-2 text-sm text-gray-700 whitespace-pre-wrap bg-green-50 rounded-lg p-4 border border-green-100">
                                    {application.adminReply}
                                </dd>
                            </div>
                        )}
                    </dl>

                    {!isReplied && (
                        <form onSubmit={handleSendReply} className="mt-6 pt-6 border-t border-gray-100">
                            <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                                Send an Email Response <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your response to the candidate..."
                                rows={5}
                                required
                                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F875AA]/20 focus:border-[#F875AA]"
                            />
                            <button
                                type="submit"
                                disabled={isReplyLoading || !replyText.trim()}
                                className="mt-4 px-6 py-2 text-sm font-semibold text-white bg-[#F875AA] rounded-lg hover:bg-[#e6669a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isReplyLoading ? "Sending Email..." : "Send Reply to Applicant"}
                            </button>
                        </form>
                    )}
                    {isReplied && application.adminReply && (
                        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>This applicant has already been replied to.</span>
                            <span>
                                Replied at:{" "}
                                {application.repliedAt
                                    ? new Date(application.repliedAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "—"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Wrapper>
    );
};

export default CareerApplicationDetailPage;
