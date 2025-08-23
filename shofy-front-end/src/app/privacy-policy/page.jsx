import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import React from 'react';
export default function PrivacyPolicy() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: August 23, 2025</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2"> Information We Collect</h2>
        <p>
          When you use LookFame, we may collect:
          <ul className="list-disc ml-6 mt-2">
            <li>Google OAuth Data (name, email, profile picture)</li>
            <li>Account Information you provide</li>
            <li>Usage Data (pages visited, interactions, cookies)</li>
          </ul>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-l font-semibold mb-2">How We Use Information</h2>
        <p>
          We use your information to authenticate via Google OAuth, improve our
          services, personalize your experience, and communicate with you. We
          never sell or rent your data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2"> Sharing of Information</h2>
        <p>
          We only share your information with Google APIs (for login), service
          providers under confidentiality, or when required by law.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-weight:400 mb-2"> Data Security</h2>
        <p>
          We use technical and organizational measures to protect your data, but
          no method is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-weight:400 mb-2"> Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your data at any
          time. Contact us at{" "}
          <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
            support@lookfamef.com
          </a>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-weight:400 mb-2"> Cookies & Tracking</h2>
        <p>
          We use cookies to maintain login sessions and improve performance.
          Disabling cookies may affect functionality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-weight:400 mb-2"> Third-Party Services</h2>
        <p>
          LookFame integrates with Google OAuth and other services. These
          providers may collect limited data under their own privacy policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-weight:400 mb-2"> Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Updates will be posted
          here with a new date.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-weight:400 mb-2"> Contact Us</h2>
        <p>
          For questions, reach us at{" "}
          <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
            support@lookfamef.com
          </a>.
        </p>
      </section>
    </div>
      <Footer />
    </Wrapper>
    // <div className="max-w-3xl mx-auto px-6 py-10">
    //   <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
    //   <p className="text-sm text-gray-500 mb-8">Last Updated: August 23, 2025</p>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
    //     <p>
    //       When you use LookFame, we may collect:
    //       <ul className="list-disc ml-6 mt-2">
    //         <li>Google OAuth Data (name, email, profile picture)</li>
    //         <li>Account Information you provide</li>
    //         <li>Usage Data (pages visited, interactions, cookies)</li>
    //       </ul>
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">2. How We Use Information</h2>
    //     <p>
    //       We use your information to authenticate via Google OAuth, improve our
    //       services, personalize your experience, and communicate with you. We
    //       never sell or rent your data.
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">3. Sharing of Information</h2>
    //     <p>
    //       We only share your information with Google APIs (for login), service
    //       providers under confidentiality, or when required by law.
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
    //     <p>
    //       We use technical and organizational measures to protect your data, but
    //       no method is 100% secure.
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
    //     <p>
    //       You may request access, correction, or deletion of your data at any
    //       time. Contact us at{" "}
    //       <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
    //         support@lookfamef.com
    //       </a>.
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">6. Cookies & Tracking</h2>
    //     <p>
    //       We use cookies to maintain login sessions and improve performance.
    //       Disabling cookies may affect functionality.
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">7. Third-Party Services</h2>
    //     <p>
    //       LookFame integrates with Google OAuth and other services. These
    //       providers may collect limited data under their own privacy policies.
    //     </p>
    //   </section>

    //   <section className="mb-6">
    //     <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
    //     <p>
    //       We may update this policy from time to time. Updates will be posted
    //       here with a new date.
    //     </p>
    //   </section>

    //   <section>
    //     <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
    //     <p>
    //       For questions, reach us at{" "}
    //       <a href="mailto:support@lookfamef.com" className="text-blue-600 underline">
    //         support@lookfamef.com
    //       </a>.
    //     </p>
    //   </section>
    // </div>
  );
}

