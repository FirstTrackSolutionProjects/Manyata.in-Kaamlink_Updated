import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { apiRequest, getSession, saveSession } from "../../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const session = getSession();

  if (["admin", "employee"].includes(session.user?.role)) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      if (!["admin", "employee"].includes(result.user?.role)) {
        setError("This account does not have owner or team access.");
        return;
      }
      saveSession(result);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700"><ShieldCheck size={24} /></div>
        <p className="text-sm font-bold uppercase tracking-widest text-violet-700">Manyata owner console</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Use the owner account created by the secure admin setup command.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <label className="block text-sm font-semibold text-slate-700">Email<input name="email" type="email" required autoComplete="username" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500" /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<input name="password" type="password" required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500" /></label>
          <button disabled={loading} className="w-full rounded-xl bg-violet-700 px-4 py-3 font-bold text-white hover:bg-violet-800 disabled:opacity-60">{loading ? "Signing in…" : "Sign in securely"}</button>
        </form>
        <a href="/" className="mt-6 inline-block text-sm font-semibold text-slate-500 hover:text-violet-700">← Back to Manyata</a>
      </section>
    </main>
  );
}
