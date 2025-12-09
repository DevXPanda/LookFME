"use client";
import React from "react";
import Link from "next/link";

const About = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      {/* Heading */}
      <h3 className="text-4xl font-bold text-center mb-8">About Lookfame</h3>

      {/* Content */}
      <div>
        <h6 className="text-2xl font-semibold mb-4">Who We Are</h6>
        <p className="text-gray-600 leading-relaxed mb-4">
          Lookfame is your ultimate destination for trendy, stylish, and
          affordable fashion. We believe fashion is more than just clothing —
          it’s about expressing your unique personality and confidence.
        </p>

        <h6 className="text-2xl font-semibold mb-4">Our Mission</h6>
        <p className="text-gray-600 leading-relaxed mb-4">
          Our mission is to bring you the latest fashion trends while ensuring
          top quality and comfort. We aim to make fashion accessible to
          everyone with affordable pricing and seamless online shopping.
        </p>

        <h6 className="text-2xl font-semibold mb-4">Why Choose Lookfame?</h6>
        <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
          <li>Wide range of clothing collections for every occasion</li>
          <li>Affordable prices with premium quality</li>
          <li>Fast shipping and easy returns</li>
          <li>Dedicated customer support</li>
        </ul>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-block px-4 py-2 bg-[#F875AA] text-white rounded shadow hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
