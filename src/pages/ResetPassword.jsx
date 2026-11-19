import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setDone(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] px-6 py-12">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-soft sm:p-10">
        <Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Set a new password</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Choose a password with at least 8 characters.</p>

        {done ? (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
            Your password has been changed. You can now <Link to="/login" className="font-bold underline">log in</Link> with it.
          </div>
        ) : !token ? (
          <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">This reset link is missing or invalid. Request a new one from the login page.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <div>
              <label htmlFor="new-password" className="mb-1.5 block text-xs font-bold text-slate-700">New password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-50" />
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-bold text-slate-700">Confirm new password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="confirm-password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-50" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Updating password…" : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
