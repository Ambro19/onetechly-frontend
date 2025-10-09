import React from "react";
import { Link } from "react-router-dom";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";

export default function Home() {
  return (
    <>
      <MarketingHeader />

      {/* Hero */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <img src="/logo_onetechly.png" alt="" className="mx-auto h-16 w-16 mb-6 rounded-xl shadow" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">OneTechly</h1>
            <p className="mt-4 text-gray-600 text-lg">
              Tech Tips and Troubleshooting — and SaaS you can rely on.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/ycd"
                className="inline-flex h-11 items-center justify-center rounded-xl
                          bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
                          hover:from-indigo-700 hover:to-blue-700"
              >
                Explore YouTube Content Downloader
              </Link>

              <Link
                to="/blog"
                className="inline-flex h-11 items-center justify-center rounded-xl
                          bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
                          hover:from-indigo-700 hover:to-blue-700"
              >
                Visit the Blog
              </Link>
            </div>
          </div>

          {/* Three cards */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Secure", "Encryption, rate limits, and strict compliance guardrails."],
              ["Scalable", "Cloud-native deployment with observability from day one."],
              ["Accessible", "WCAG-minded UI with clear flows and docs."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border shadow-sm p-6 bg-white/70 backdrop-blur">
                <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
                <p className="mt-2 text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  );
}
