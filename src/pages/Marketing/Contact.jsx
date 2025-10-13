// // src/pages/Marketing/Contact.jsx
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   "http://localhost:8000";

// export default function Contact() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [sending, setSending] = useState(false);
//   const [hp, setHp] = useState(""); // honeypot

//   const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

//   async function handleSubmit(e) {
//     e.preventDefault();                 // ← prevents /contact? Not Found
//     if (hp) return;                     // bot
//     if (!name.trim())  return toast.error("Please enter your name.");
//     if (!emailOK(email)) return toast.error("Please enter a valid email.");
//     if (!message.trim()) return toast.error("Please write a short message.");

//     setSending(true);
//     try {
//       // Try your backend first (recommended)
//       const res = await fetch(`${API_BASE_URL}/contact`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, message }),
//       });

//       if (res.ok) {
//         toast.success("Thanks! Your message has been sent.");
//         setName(""); setEmail(""); setMessage("");
//         return;
//       }

//       // If backend isn’t ready, fall back to mailto (opens user’s email app)
//       const mailto = `mailto:onetechly@gmail.com?subject=${encodeURIComponent(
//         `Contact form — ${name}`
//       )}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
//       window.location.href = mailto;
//       toast("Opening your email app to send the message…");
//     } catch {
//       // Last-resort fallback
//       const mailto = `mailto:onetechly@gmail.com?subject=${encodeURIComponent(
//         `Contact form — ${name}`
//       )}&body=${encodeURIComponent(`From: ${name} <${email}>\n\n${message}`)}`;
//       window.location.href = mailto;
//       toast("Opening your email app to send the message…");
//     } finally {
//       setSending(false);
//     }
//   }

//   return (
//     <>
//       <MarketingHeader />
//       <main className="py-12 sm:py-16">
//         <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
//           <header className="text-center mb-8">
//             <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Us</h1>
//             <p className="mt-2 text-gray-600">Have a question or feedback? We’d love to hear from you.</p>
//           </header>

//           <form onSubmit={handleSubmit} className="rounded-2xl border shadow-sm p-6 bg-white">
//             {/* honeypot (hidden) */}
//             <input
//               type="text"
//               value={hp}
//               onChange={(e) => setHp(e.target.value)}
//               className="hidden"
//               tabIndex={-1}
//               autoComplete="off"
//             />

//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               className="mt-1 mb-4 w-full rounded-lg border px-3 py-2"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Your full name"
//             />

//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               className="mt-1 mb-4 w-full rounded-lg border px-3 py-2"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//             />

//             <label className="block text-sm font-medium text-gray-700">Message</label>
//             <textarea
//               rows={6}
//               className="mt-1 mb-6 w-full rounded-lg border px-3 py-2"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="How can we help?"
//             />

//             <button
//               type="submit"
//               disabled={sending}
//               className="w-full h-11 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60"
//             >
//               {sending ? "Sending…" : "Send Message"}
//             </button>

//             <p className="mt-3 text-xs text-center text-gray-500">
//               Messages are delivered to <span className="font-mono">onetechly@gmail.com</span>.
//             </p>
//           </form>
//         </div>
//       </main>
//       <MarketingFooter />
//     </>
//   );
// }


////////// === UPDATED: NEED TO TEST THIS CONTACT.JSX FILE === //////////////////
//src/pages/Marketing/Contact.jsx

// import React, { useState } from "react";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";
// import toast from "react-hot-toast";

// const API_BASE =
//   process.env.REACT_APP_API_URL?.replace(/\/+$/, "") ||
//   window.location.origin; // safe fallback

// export default function Contact() {
//   // ----- ADDED: simple controlled form + validation + submit -----
//   const [form, setForm] = useState({ name: "", email: "", message: "", website: "" }); // website = honeypot
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const validate = () => {
//     const name = form.name.trim();
//     const email = form.email.trim();
//     const message = form.message.trim();

//     if (!name) return "Please enter your name.";
//     if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
//     if (!message || message.length < 10) return "Please write at least 10 characters.";
//     return null;
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const err = validate();
//     if (err) {
//       toast.error(err);
//       return;
//     }
//     // honeypot caught?
//     if (form.website) return;

//     setSubmitting(true);
//     try {
//       const res = await fetch(`${API_BASE}/contact`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: form.name.trim(),
//           email: form.email.trim(),
//           message: form.message.trim(),
//         }),
//       });

//       if (!res.ok) {
//         const text = await res.text().catch(() => "");
//         throw new Error(text || `Request failed (${res.status})`);
//       }

//       toast.success("Thanks! We received your message.");
//       setForm({ name: "", email: "", message: "", website: "" });
//     } catch (err) {
//       toast.error("Could not send message. Please try again.");
//       // Optional: console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   // ----- /ADDED -----

//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-md px-4 sm:px-6">
//           {/* OneTechly logo above the title */}
//           <img
//             src="/logo_onetechly.png"
//             alt="OneTechly"
//             className="mx-auto mb-5 h-14 w-14 rounded-xl shadow-sm"
//           />

//           <h1 className="text-center text-4xl font-extrabold tracking-tight">
//             Contact Us
//           </h1>
//           <p className="mt-3 text-center text-gray-600">
//             Have a question or feedback? We’d love to hear from you.
//           </p>

//           <section className="mt-10 rounded-2xl border bg-white shadow-sm">
//             {/* ADDED: hook up the form */}
//             <form className="space-y-4 p-6 sm:p-8" onSubmit={onSubmit} noValidate>
//               {/* honeypot field */}
//               <input
//                 type="text"
//                 name="website"
//                 value={form.website}
//                 onChange={onChange}
//                 tabIndex={-1}
//                 autoComplete="off"
//                 className="hidden"
//                 aria-hidden="true"
//               />

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   name="name"
//                   type="text"
//                   value={form.name}
//                   onChange={onChange}
//                   className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Your name"
//                   required
//                   maxLength={200}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={form.email}
//                   onChange={onChange}
//                   className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="you@example.com"
//                   required
//                   maxLength={255}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Message</label>
//                 <textarea
//                   name="message"
//                   rows={6}
//                   value={form.message}
//                   onChange={onChange}
//                   className="mt-1 w-full resize-y rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="How can we help?"
//                   required
//                   maxLength={8000}
//                 />
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="inline-flex h-12 w-full items-center justify-center rounded-xl
//                              bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
//                              hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {submitting ? "Sending…" : "Send Message"}
//                 </button>
//               </div>
//             </form>
//             {/* /ADDED */}
//           </section>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

// //// src/pages/Marketing/Contact.jsx
// import React from "react";
// import MarketingHeader from "../../components/MarketingHeader";
// import MarketingFooter from "../../components/MarketingFooter";

// export default function Contact() {
//   return (
//     <>
//       <MarketingHeader />

//       <main className="py-14 sm:py-20">
//         <div className="mx-auto max-w-screen-md px-4 sm:px-6">
//           {/* OneTechly logo above the title (restored) */}
//           <div className="flex justify-center mb-5">
//             <span className="inline-flex items-center justify-center rounded-2xl overflow-hidden ring-2 ring-blue-100 shadow-sm bg-white"
//                   style={{ width: 56, height: 56 }}>
//               <img
//                 src="/logo_onetechly.png"
//                 alt="OneTechly"
//                 className="block w-full h-full object-contain"
//               />
//             </span>
//           </div>

//           <h1 className="text-center text-4xl font-extrabold tracking-tight">
//             Contact Us
//           </h1>
//           <p className="mt-3 text-center text-gray-600">
//             Have a question or feedback? We’d love to hear from you.
//           </p>

//           <section className="mt-10 rounded-2xl border bg-white shadow-sm">
//             <form className="space-y-4 p-6 sm:p-8">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Your full name"
//                   name="name"
//                   autoComplete="name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="you@example.com"
//                   name="email"
//                   autoComplete="email"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Message</label>
//                 <textarea
//                   rows={6}
//                   className="mt-1 w-full resize-y rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="How can we help?"
//                   name="message"
//                 />
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="inline-flex h-12 w-full items-center justify-center rounded-xl
//                              bg-gradient-to-r from-indigo-600 to-blue-600 px-6 font-semibold text-white
//                              hover:from-indigo-700 hover:to-blue-700"
//                 >
//                   Send Message
//                 </button>
//               </div>
//             </form>
//           </section>
//         </div>
//       </main>

//       <MarketingFooter />
//     </>
//   );
// }
/////////////////////////////////////////////////
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
