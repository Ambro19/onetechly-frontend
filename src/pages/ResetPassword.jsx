import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiPostJson } from "../lib/api";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const navigate = useNavigate();

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Reset link is missing.");
    if (!pw1 || pw1 !== pw2) return toast.error("Passwords must match.");
    setLoading(true);
    try {
      await apiPostJson("/auth/reset-password", { token, new_password: pw1 });
      toast.success("Password updated. Please sign in.");
      navigate("/login", { replace: true });
    } catch (e1) {
      toast.error(e1?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Set a new password</h1>
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-xl border p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              value={pw1}
              onChange={(e)=>setPw1(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              value={pw2}
              onChange={(e)=>setPw2(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
            {loading ? "Saving…" : "Save new password"}
          </button>
        </form>
      </div>
    </div>
  );
}
