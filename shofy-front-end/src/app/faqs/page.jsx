"use client";
import React, { useState } from "react";

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order from the Track Order page by entering your Order ID and registered email/phone number.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Credit/Debit Cards, UPI, Net Banking, and Wallet payments.",
  },
  {
    question: "Can I return or exchange my order?",
    answer: "Yes, we offer returns and exchanges within 7 days of delivery. Please refer to our Return Policy for details.",
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes, free shipping is available on orders above ₹999 across India.",
  },
  {
    question: "How can I contact Lookfame support?",
    answer: "You can reach us via the Contact Us page or email us at support@lookfame.com.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg p-4 cursor-pointer transition hover:shadow"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{faq.question}</h3>
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && (
              <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
