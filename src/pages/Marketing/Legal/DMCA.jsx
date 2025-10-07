import React from "react";
import MarketingHeader from "../../../components/MarketingHeader";
import MarketingFooter from "../../../components/MarketingFooter";

export default function DMCA() {
  return (
    <>
      <MarketingHeader />
      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-lg px-4 sm:px-6 lg:px-8 prose prose-indigo">
          <h1>DMCA Policy</h1>
          <p>
            OneTechly respects the intellectual property rights of others. If
            you believe your copyrighted material has been infringed upon,
            please notify us immediately.
          </p>
          <h2>1. Notification of Infringement</h2>
          <p>
            Send your claim to{" "}
            <a href="mailto:onetechly@gmail.com">onetechly@gmail.com</a> with
            details of the copyrighted work and proof of ownership.
          </p>
          <h2>2. Action</h2>
          <p>
            Upon verification, we will remove the infringing content and take
            appropriate action against repeat offenders.
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
