import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h2 className="text-3xl font-bold mb-6">Shipping Policy</h2>
        <p className="text-sm text-gray-500 mb-8">Last Updated: August 23, 2025</p>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2">Processing Time</h6>
          <p>
            All orders are processed within <strong>2–3 business days</strong> (excluding weekends and holidays).
            You will receive a confirmation email once your order has been shipped.
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Shipping Rates & Delivery Estimates</h6>
          <p>
            Shipping charges will be calculated and displayed at checkout.
            Estimated delivery times:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li><strong>Domestic (India):</strong> 5–7 business days</li>
            <li><strong>International:</strong> 10–15 business days (varies by location)</li>
          </ul>
          <p className="mt-2 text-gray-600">
            *Delays may occur due to unforeseen circumstances (e.g., customs, courier delays, natural disasters).*
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Shipment Confirmation & Tracking</h6>
          <p>
            Once your order is shipped, you will receive a <strong>tracking number</strong> via email.
            Tracking information may take <strong>24–48 hours</strong> to update.
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> International Shipping</h6>
          <p>
            LookFame ships internationally. Import duties, taxes, and customs fees are the responsibility of the customer.
            We are not responsible for delays caused by customs.
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Damaged or Lost Packages</h6>
          <p>
            LookFame is not liable for products damaged or lost during shipping.
            If your package is damaged, please contact the shipping carrier directly.
            For lost packages, contact us at{" "}
            <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
              support@lookfamef.com
            </a>{" "}
            with your order ID.
          </p>
        </section>

        <section className="mb-6">
          <h6 className="text-xl font-semibold mb-2"> Returns & Exchanges</h6>
          <p>
            Please refer to our <a href="/return-policy" className="text-blue-600 underline">Return Policy</a> 
            for details on returning or exchanging items.
          </p>
        </section>

        <section>
          <h6 className="text-xl font-semibold mb-2"> Contact Us</h6>
          <p>
            If you have any questions about this Shipping Policy, reach us at{" "}
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
