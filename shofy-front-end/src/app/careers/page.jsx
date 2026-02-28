"use client";
import React, { useState } from "react";
import { useSubmitApplicationMutation, useUploadResumeMutation } from "@/redux/features/careerApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const Career = () => {
  const [formData, setFormData] = useState({ name: "", email: "", role: "", message: "" });
  const [file, setFile] = useState(null);

  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      notifyError("Please upload your resume.");
      return;
    }

    try {
      // 1. Upload resume
      const currentFile = new FormData();
      currentFile.append("file", file);

      const uploadRes = await uploadResume(currentFile).unwrap();
      if (!uploadRes.success) throw new Error("Failed to upload resume");

      // 2. Submit application
      const appData = {
        ...formData,
        resumeUrl: uploadRes.data.url,
        resumeId: uploadRes.data.id,
      };

      const submitRes = await submitApplication(appData).unwrap();
      if (submitRes.success) {
        notifySuccess("Application submitted successfully!");
        setFormData({ name: "", email: "", role: "", message: "" });
        setFile(null);
        e.target.reset(); // reset file input
      }
    } catch (err) {
      notifyError(err?.data?.message || err?.message || "Something went wrong.");
    }
  };

  return (
    <section className="py-12">
      <div className="container">
        <div className="ml-12">
          <h4 className="text-4xl font-bold mb-6">Careers at Lookfame</h4>
          <p className="text-gray-600 mb-8 max-w-2xl">
            At Lookfame, we’re always on the lookout for creative, passionate,
            and motivated individuals to join our growing team. If you’re
            excited about fashion, technology, and delivering great experiences
            to customers — you’ll feel right at home here.
          </p>

          <h6 className="text-2xl font-semibold mb-4">Why Work With Us?</h6>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-8 max-w-2xl">
            <li>Collaborative and inclusive work culture</li>
            <li>Opportunities to learn and grow</li>
            <li>Work on exciting fashion + tech projects</li>
            <li>Employee discounts on Lookfame collections</li>
          </ul>

          <h6 className="text-2xl font-semibold mb-4">Open Positions</h6>
          <div className="space-y-4 mb-8">
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <h6 className="text-xl font-semibold">Frontend Developer</h6>
              <p className="text-gray-600">Lucknow · Full-time</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <h6 className="text-xl font-semibold">UI/UX Designer</h6>
              <p className="text-gray-600">Remote · Contract</p>
            </div>
            <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <h6 className="text-xl font-semibold">Marketing Executive</h6>
              <p className="text-gray-600">Lucknow · Full-time</p>
            </div>
          </div>

          <h6 className="text-2xl font-semibold mb-4 mt-12">Apply Now</h6>
          <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input type="text" id="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#F875AA] transition-all bg-white text-gray-700" placeholder="John Doe" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input type="email" id="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#F875AA] transition-all bg-white text-gray-700" placeholder="john@example.com" />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">Role Applying For *</label>
              <select id="role" value={formData.role} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#F875AA] transition-all bg-white text-gray-700 appearance-none bg-no-repeat bg-right pr-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`, backgroundPosition: "right 1rem center" }}>
                <option value="">Select a role</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Marketing Executive">Marketing Executive</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-2">Upload Resume *</label>
              <input type="file" id="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#F875AA] transition-all bg-white text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#F875AA] file:text-white hover:file:bg-[#e6669a]" />
              <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX</p>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Cover Letter / Message</label>
              <textarea id="message" value={formData.message} onChange={handleInputChange} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#F875AA] transition-all bg-white text-gray-700" placeholder="Tell us why you'd be a great fit..."></textarea>
            </div>

            <button disabled={isSubmitting || isUploading} type="submit" className={`bg-[#F875AA] text-white font-bold py-3 px-8 rounded-lg text-lg transition-all ${(isSubmitting || isUploading) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e6669a]"}`}>
              {isSubmitting || isUploading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Career;
