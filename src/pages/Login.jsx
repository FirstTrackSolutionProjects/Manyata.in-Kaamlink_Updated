import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, CalendarCheck, Clock, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Star } from "lucide-react";
import { apiRequest, saveSession } from "../lib/api";
import GoogleSignInButton from "../components/GoogleSignInButton";

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";

const BENEFITS = [
  { icon: ShieldCheck, tone: "bg-emerald-400/15 text-emerald-300", text: "100% background verified professionals" },
  { icon: Star, tone: "bg-amber-400/15 text-amber-300", text: "4.8/5 average rating from 50k+ homes" },
  { icon: Clock, tone: "bg-sky-400/15 text-sky-300", text: "Book a service in under 2 minutes" },
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      saveSession(data);
      navigate(data.user?.role === "admin" ? "/admin" : "/account");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/google", { method: "POST", body: JSON.stringify({ credential }) });
      saveSession(data);
      navigate(data.user?.role === "admin" ? "/admin" : "/account");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const checkCaps = (e) => setCapsOn(e.getModifierState?.("CapsLock") ?? false);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-8 lg:py-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-violet-900/10 lg:grid-cols-[1.05fr_1fr]">

          {/* LEFT: branding (desktop only) */}
          <div className="relative hidden min-h-[640px] flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900 p-10 lg:flex">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-lg font-black ring-1 ring-white/25 backdrop-blur">M</span>
                Many<span className="text-violet-200">ata</span>
              </Link>

              <h2 className="mt-12 text-4xl font-extrabold leading-tight tracking-tight text-white">
                Welcome back to<br />premium home services.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-violet-100/80">
                Log in to manage your bookings, track professionals and unlock member-only offers.
              </p>
            </div>

            {/* Decorative preview card */}
            <div className="relative z-10 my-8 max-w-sm rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-400/20 text-emerald-300"><CalendarCheck size={20} /></span>
                <div>
                  <p className="text-sm font-bold text-white">Booking confirmed</p>
                  <p className="text-xs text-violet-100/70">Deep Cleaning · Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-300 to-sky-300" /></div>
              <p className="mt-2 text-[11px] font-semibold text-violet-100/70">Your professional is on the way</p>
            </div>

            <div className="relative z-10 space-y-3">
              {BENEFITS.map(({ icon: Icon, tone, text }) => (
                <div key={text} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-medium text-slate-200 backdrop-blur-sm">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}><Icon size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: form */}
          <div className="flex flex-col justify-center p-7 sm:p-12">
            <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-600/30">M</span>
              Many<span className="text-violet-600">ata</span>
            </Link>

            <div className="mb-8 text-center lg:text-left">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">Welcome back</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Login to your account</h1>
              <p className="mt-2 text-sm text-slate-500">Enter your details to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />{error}
                </p>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Email address</span>
                <span className="relative block">
                  <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Password</span>
                <span className="relative block">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    onKeyUp={checkCaps}
                    onKeyDown={checkCaps}
                    onBlur={() => setCapsOn(false)}
                    className={`${inputCls} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
                {capsOn && <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-600"><AlertCircle size={13} /> Caps Lock is on</span>}
              </label>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-violet-600" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="font-bold text-violet-600 transition-colors hover:text-violet-700">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 size={17} className="animate-spin" /> : null}
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />or continue with<span className="h-px flex-1 bg-slate-200" />
            </div>
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={loading} />

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link to="/signup" className="font-bold text-violet-600 transition-colors hover:text-violet-700">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}