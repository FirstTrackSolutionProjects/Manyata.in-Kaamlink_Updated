import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  AlertCircle, ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Eye, EyeOff, LifeBuoy, Loader2, Lock, Mail, ShieldCheck,
} from "lucide-react";
import { apiRequest, getSession, saveSession } from "../../lib/api";

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

const FEATURES = [
  { icon: CalendarDays, text: "Track and manage every booking" },
  { icon: BadgeCheck, text: "Approve professionals and customers" },
  { icon: LifeBuoy, text: "Handle support tickets and messages" },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
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

  const checkCaps = (event) => setCapsOn(event.getModifierState?.("CapsLock") ?? false);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/50 lg:grid-cols-[1fr_1.05fr]">

        {/* LEFT: branding (desktop only) */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-900 p-10 lg:flex">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />

          <div className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white shadow-lg ring-1 ring-white/25 backdrop-blur"><ShieldCheck size={28} /></span>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-violet-200">Manyata</p>
            <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white">Owner console</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-violet-100/80">Everything you need to run Manyata, in one secure place.</p>
          </div>

          <div className="relative space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-medium text-slate-100 backdrop-blur-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-violet-100"><Icon size={16} /></span>
                {text}
              </div>
            ))}
            <p className="flex items-center gap-2 pt-3 text-xs font-semibold text-violet-200/80"><Lock size={13} /> Authorized personnel only</p>
          </div>
        </aside>

        {/* RIGHT: form */}
        <section className="flex flex-col justify-center p-7 sm:p-12">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30"><ShieldCheck size={22} /></span>
            <div>
              <p className="text-base font-extrabold leading-tight text-slate-900">Manyata</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">Owner console</p>
            </div>
          </div>

          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700"><Lock size={12} /> Secure area</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Admin sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">Use the owner or team account created by the secure admin setup command.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />{error}
              </p>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
              <span className="relative block">
                <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input name="email" type="email" required autoComplete="username" placeholder="owner@example.com" className={inputCls} />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</span>
              <span className="relative block">
                <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onKeyDown={checkCaps}
                  onKeyUp={checkCaps}
                  onBlur={() => setCapsOn(false)}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {capsOn && <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-600"><AlertCircle size={13} /> Caps Lock is on</span>}
            </label>

            <button
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in securely"}
              {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <a href="/" className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-700">
            <ArrowLeft size={15} /> Back to Manyata
          </a>
        </section>
      </div>
    </main>
  );
}