import React from "react";
import MarketingHeader from "../../../components/MarketingHeader";
import MarketingFooter from "../../../components/MarketingFooter";

export default function Terms() {
  return (
    <>
      <MarketingHeader />
      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 prose prose-indigo">
          <h1>Terms of Service</h1>
          <p>
            Welcome to <strong>OneTechly</strong>. By accessing or using our
            services, you agree to comply with and be bound by the following
            terms and conditions. Please review them carefully before using the
            website.
          </p>
          <h2>1. Use of Service</h2>
          <p>
            You may use OneTechly’s products and tools only for lawful purposes
            and in accordance with these terms. You agree not to attempt to
            damage, disable, or impair the functionality of our platform.
          </p>
          <h2>2. Intellectual Property</h2>
          <p>
            All content, trademarks, and software on this site are owned by
            OneTechly. You may not reproduce or redistribute any part of it
            without permission.
          </p>
          <h2>3. Disclaimer</h2>
          <p>
            Our services are provided “as is” without warranties of any kind. We
            make no guarantees about uptime or error-free operation.
          </p>
          <h2>4. Limitation of Liability</h2>
          <p>
            In no event shall OneTechly be liable for indirect, incidental, or
            consequential damages resulting from the use of our products.
          </p>
          <h2>5. Changes</h2>
          <p>
            We may revise these terms at any time. Updates will be posted here
            and effective immediately upon posting.
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
