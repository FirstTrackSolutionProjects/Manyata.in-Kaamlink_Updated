import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiRequest, saveSession } from "../lib/api";

function getStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["bg-slate-200", "bg-red-400", "bg-orange-400", "bg-gold-400", "bg-green-500"];

export default function Signup() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = useMemo(() => getStrength(password), [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const formPassword = form.get("password");
    if (formPassword !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          full_name: form.get("full_name"),
          phone: form.get("phone"),
          email: form.get("email"),
          password: formPassword,
        }),
      });
      saveSession(data);
      navigate("/account");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
          
          {/* LEFT SIDE: Branding & Benefits (Desktop only) */}
          <div className="hidden lg:flex flex-col justify-between relative bg-slate-900 p-12 h-full min-h-[700px] overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/15 rounded-full blur-[80px]" />

            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-2 text-2xl font-display font-extrabold tracking-tight text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-gold-500 text-white text-base font-black shadow-lift">
                  M
                </span>
                Many<span className="text-brand-400">ata</span><span className="text-gold-400">.</span>
              </Link>

              <h2 className="mt-12 text-3xl font-extrabold text-white leading-tight">
                Join 50,000+ <br /> happy homeowners.
              </h2>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">
                Create your account to book background-verified professionals, track your services, and manage everything in one place.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "100% Background Verified Pros",
                  "7-Day Service Warranty",
                  "Transparent & Upfront Pricing",
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-12 flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-8 h-8 rounded-full border-2 border-slate-900" />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-gold-400">
                   {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-gold-400" />)}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">Rated 4.8/5 by our customers</p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Signup Form */}
          <div className="p-8 sm:p-12 lg:p-14">
            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden flex items-center justify-center gap-2 text-2xl font-display font-extrabold tracking-tight mb-8">
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-brand-500 to-gold-500 text-white text-sm font-black">
                M
              </span>
              <span className="text-slate-900">
                Many<span className="text-brand-600">ata</span><span className="text-gold-500">.</span>
              </span>
            </Link>

            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Book trusted home services in a few taps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="full_name"
                      required
                      placeholder="Priya Sharma"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:bg-white transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-11 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                            i < strength ? STRENGTH_COLORS[strength] : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs font-medium text-slate-500">
                      Password strength: <span className="text-slate-800 font-bold">{STRENGTH_LABELS[strength]}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Confirm password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="Re-enter your password"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-11 pr-11 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 transition-colors"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-500 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-brand-600"
                />
                <span className="leading-snug">
                  I agree to the{" "}
                  <Link to="/terms" className="text-brand-600 font-bold hover:underline">Terms of Service</Link> and{" "}
                  <Link to="/privacy" className="text-brand-600 font-bold hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-4"
              >
                {loading ? "Creating account..." : "Create account"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
