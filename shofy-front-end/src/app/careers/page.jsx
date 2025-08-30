"use client";
import React from "react";

const Career = () => {
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

          <h6 className="text-2xl font-semibold mb-4">How to Apply?</h6>
          <p className="text-gray-600 max-w-2xl">
            If you’re interested in joining Lookfame, send your resume and
            portfolio (if applicable) to{" "}
            <span className="font-semibold">careers@lookfame.com</span>.  
            We’ll get in touch with you if your profile matches an open role.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Career;
