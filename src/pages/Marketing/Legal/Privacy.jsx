import React from "react";
import MarketingHeader from "../../../components/MarketingHeader";
import MarketingFooter from "../../../components/MarketingFooter";

export default function Privacy() {
  return (
    <>
      <MarketingHeader />
      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 prose prose-indigo">
          <h1>Privacy Policy</h1>
          <p>
            This Privacy Policy explains how <strong>OneTechly</strong> collects,
            uses, and safeguards your information.
          </p>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect basic user data such as name, email, and usage
            statistics to improve your experience.
          </p>
          <h2>2. How We Use Information</h2>
          <p>
            Data helps us improve service reliability, fix bugs, and provide
            personalized features.
          </p>
          <h2>3. Cookies</h2>
          <p>
            Our website uses cookies for essential site functions. You can
            disable cookies via your browser settings.
          </p>
          <h2>4. Data Security</h2>
          <p>
            We implement strict measures to protect your data. However, no
            online platform can guarantee absolute security.
          </p>
          <h2>5. Contact</h2>
          <p>
            For privacy concerns, contact us at{" "}
            <a href="mailto:onetechly@gmail.com">onetechly@gmail.com</a>.
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
