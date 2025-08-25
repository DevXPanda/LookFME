import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6">Return & Refund Policy</h2>
        <p className="text-sm text-gray-500 mb-8">Last Updated: August 23, 2025</p>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2">Eligibility for Returns</h6>
          <p>
            We accept returns within <strong>7 days</strong> of delivery, provided that the item is unused,
            unworn, and in its original packaging with all tags intact. 
            Certain items such as intimate wear, custom orders, or sale items may not be eligible.
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Non-Returnable Items</h6>
          <ul className="list-disc ml-6 mt-2">
            <li>Gift cards</li>
            <li>Final sale / clearance items</li>
            <li>Personalized or custom-made products</li>
            <li>Items marked as “non-returnable” on the product page</li>
          </ul>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Return Process</h6>
          <p>
            To initiate a return, contact us at{" "}
            <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
              support@lookfamef.com
            </a>{" "}
            with your order ID and reason for return. Our team will guide you through the steps.
          </p>
          <p className="mt-2">
            You will be responsible for paying the shipping costs for returning your item unless the
            product was defective or incorrect.
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Refunds</h6>
          <p>
            Once we receive and inspect your return, we will notify you of the approval or rejection
            of your refund. If approved, your refund will be processed to your original payment method
            within <strong>5–10 business days</strong>.
          </p>
          <p className="mt-2 text-gray-600">
            *Please note: Shipping fees are non-refundable.*
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Exchanges</h6>
          <p>
            We only replace items if they are defective or damaged. If you need an exchange for the
            same item, email us at{" "}
            <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
              support@lookfamef.com
            </a>.
          </p>
        </section>

        <section>
          <h6 className="text-xl font-semibold mb-2">Contact Us</h6>
          <p>
            For more information about our Return & Refund Policy, reach us at{" "}
            <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
              support@lookfame.com
            </a>.
          </p>
        </section>
      </div>
      <Footer />
    </Wrapper>
  );
}
