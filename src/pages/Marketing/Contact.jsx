import React from "react";
import MarketingHeader from "../../components/MarketingHeader";
import MarketingFooter from "../../components/MarketingFooter";

export default function Contact() {
  return (
    <>
      <MarketingHeader />

      <main className="py-14 sm:py-20">
        <div className="mx-auto max-w-screen-md px-4 sm:px-6">
          {/* OneTechly logo above the title */}
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
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={6}
                  className="mt-1 w-full resize-y rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="How can we help?"
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

/////////////////////////////////////////////////////////////
// import React, { useState } from "react";
// import { api } from "../../lib/api";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";

// export default function Contact() {
//   const [form, setForm] = useState({ name: "", email: "", message: "" });
//   const [status, setStatus] = useState(null);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("loading");
//     try {
//       // Optional backend endpoint for contact form — safe to keep placeholder
//       await api.post("/contact", form);
//       setStatus("success");
//       setForm({ name: "", email: "", message: "" });
//     } catch (err) {
//       setStatus("error");
//     }
//   };

//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
//             Contact Us
//           </h1>
//           <p className="mt-4 text-gray-600">
//             Have a question or feedback? We’d love to hear from you.
//           </p>

//           <form
//             onSubmit={handleSubmit}
//             className="mt-10 bg-white/70 backdrop-blur rounded-2xl border shadow-sm p-8 text-left"
//           >
//             <div className="grid gap-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Message
//                 </label>
//                 <textarea
//                   name="message"
//                   rows="5"
//                   value={form.message}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="inline-flex items-center justify-center h-11 rounded-xl px-6 font-semibold text-white
//                            bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
//                 disabled={status === "loading"}
//               >
//                 {status === "loading" ? "Sending..." : "Send Message"}
//               </button>

//               {status === "success" && (
//                 <p className="text-green-600 text-sm">✅ Message sent successfully!</p>
//               )}
//               {status === "error" && (
//                 <p className="text-red-600 text-sm">
//                   ❌ Something went wrong. Please try again later.
//                 </p>
//               )}
//             </div>
//           </form>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }
