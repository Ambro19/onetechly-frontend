// src/pages/Marketing/Contact.jsx
import React from "react";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";

export default function Contact() {
  return (
    <>
      <MarketingHeader />

      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          {/* OneTechly logo above the title — identical styling to Pricing.jsx */}
          <img
            src="/logo_onetechly.png"
            alt="OneTechly"
            className="mx-auto mb-5 h-14 w-14 rounded-xl shadow-sm"
          />

          <h1 className="text-center text-4xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-3 text-center text-gray-600">
            Have a question or feedback? We’d love to hear from you.
          </p>

          <section className="mt-10 rounded-2xl border bg-white shadow-sm">
            <form className="space-y-4 p-6 sm:p-8">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Your full name"
                  name="name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                  name="email"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={6}
                  className="mt-1 w-full resize-y rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="How can we help?"
                  name="message"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl
                             bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
                             hover:from-indigo-700 hover:to-blue-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>

      <MarketingFooter />
    </>
  );
}
