import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { apiRequest } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
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
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Forgot password?</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Enter the email address on your account and we’ll send you a password reset link.</p>

        {sent ? (
          <div role="status" className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800">
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your inbox and spam folder.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-xs font-bold text-slate-700">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-50" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Sending link…" : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
