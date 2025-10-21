import React, { useState } from "react";
import toast from "react-hot-toast";
import { apiPostJson } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email");
    setLoading(true);
    try {
      await apiPostJson("/auth/forgot-password", { email });
      toast.success("If your email exists, we sent a reset link.");
    } catch (e) {
      toast.error(e?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Forgot your password?</h1>
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
