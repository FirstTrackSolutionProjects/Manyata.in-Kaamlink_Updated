import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Building2, CalendarDays, Camera, CheckCircle2, Clock, Hash, Loader2, Lock, LogOut,
  Mail, MapPin, Phone, Receipt, RotateCcw, Save, Sparkles, Trash2, User, XCircle,
} from "lucide-react";
import { apiRequest, getSession, logoutSession } from "../lib/api";

const emptyProfile = { full_name: "", email: "", phone: "", address_line: "", city: "", pincode: "", profile_photo: null, role: "customer", professional: null };
const EDITABLE = ["full_name", "phone", "address_line", "city", "pincode"];
const PARTNER_EDITABLE = ["bio", "experience_years"];
const ROLE_LABEL = { customer: "Customer", partner: "Service partner", employee: "Team member", admin: "Owner" };

const FIELDS = {
  personal: [
    { name: "full_name", label: "Full name", type: "text", icon: User, placeholder: "Your full name" },
    { name: "email", label: "Email address", type: "email", icon: Mail, readOnly: true },
    { name: "phone", label: "Phone number", type: "tel", icon: Phone, placeholder: "+91 98765 43210" },
  ],
  address: [
    { name: "address_line", label: "Address", type: "text", icon: MapPin, placeholder: "House no., street, area", full: true, maxLength: 255 },
    { name: "city", label: "City", type: "text", icon: Building2, placeholder: "Your city" },
    { name: "pincode", label: "PIN code", type: "text", icon: Hash, placeholder: "6-digit PIN code" },
  ],
};

async function compressPhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Choose a photo smaller than 12 MB.");
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

const pick = (p) => ({ ...Object.fromEntries(EDITABLE.map((k) => [k, p[k] || ""])), bio: p.professional?.bio || "", experience_years: String(p.professional?.experience_years ?? "") });
const statusKey = (b) => String(b.status || "").toLowerCase();
const isCancelled = (b) => statusKey(b).includes("cancel");
const isDone = (b) => statusKey(b).includes("complet");
const isUpcoming = (b) => !isCancelled(b) && !isDone(b) && new Date(b.slot_start) >= new Date();

function statusStyle(b) {
  if (isDone(b)) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (isCancelled(b)) return "bg-rose-50 text-rose-700 ring-rose-200";
  if (statusKey(b).includes("pend") || statusKey(b).includes("request")) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-violet-50 text-violet-700 ring-violet-200";
}

const inputBase = "w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 read-only:cursor-not-allowed read-only:bg-slate-100 read-only:text-slate-500 read-only:hover:border-slate-200 read-only:focus:border-slate-200 read-only:focus:ring-0";

export default function Account() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(emptyProfile);
  const [savedSnapshot, setSavedSnapshot] = useState(pick(emptyProfile));
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [tab, setTab] = useState("profile");
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const session = getSession();

  useEffect(() => {
    if (!session.token) { navigate("/login", { replace: true }); return; }
    Promise.all([
      apiRequest("/auth/me", { token: session.token }),
      session.user?.role === "customer" ? apiRequest("/bookings/me", { token: session.token }) : Promise.resolve([]),
    ]).then(([me, items]) => {
      const next = { ...emptyProfile, ...me.user };
      setProfile(next);
      setSavedSnapshot(pick(next));
      setBookings(Array.isArray(items) ? items : []);
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [navigate, session.token]);

  useEffect(() => {
    if (!justSaved) return undefined;
    const t = setTimeout(() => setJustSaved(false), 3500);
    return () => clearTimeout(t);
  }, [justSaved]);

  const logout = () => { logoutSession(); navigate("/"); };
  const setField = (event) => { setJustSaved(false); setProfile((current) => ({ ...current, [event.target.name]: event.target.value })); };
  const dirty = [...EDITABLE.map((k) => [k, profile[k] || ""]), ...PARTNER_EDITABLE.map((k) => [k, k === "bio" ? (profile.professional?.bio || "") : String(profile.professional?.experience_years ?? "")])].some(([key, value]) => value !== savedSnapshot[key]);
  const resetForm = () => { setProfile((current) => ({ ...current, ...Object.fromEntries(EDITABLE.map((key) => [key, savedSnapshot[key]])), professional: current.role === "partner" ? { ...current.professional, bio: savedSnapshot.bio, experience_years: savedSnapshot.experience_years } : current.professional })); setProfileError(""); };

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true); setProfileError(""); setJustSaved(false);
    try {
      const result = await apiRequest("/auth/me", { token: session.token, method: "PATCH", body: JSON.stringify({ ...profile, bio: profile.professional?.bio, experience_years: profile.professional?.experience_years }) });
      const next = { ...profile, ...result.user };
      setProfile(next);
      setSavedSnapshot(pick(next));
      setJustSaved(true);
    } catch (requestError) { setProfileError(requestError.message); }
    finally { setSaving(false); }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoBusy(true); setProfileError("");
    try {
      const photo = await compressPhoto(file);
      const result = await apiRequest("/auth/me/photo", { token: session.token, method: "PUT", body: JSON.stringify({ photo }) });
      setProfile((current) => ({ ...current, profile_photo: result.profile_photo }));
    } catch (requestError) { setProfileError(requestError.message); setTab("profile"); }
    finally { setPhotoBusy(false); }
  };

  const removePhoto = async () => {
    setPhotoBusy(true); setProfileError("");
    try {
      await apiRequest("/auth/me/photo", { token: session.token, method: "DELETE" });
      setProfile((current) => ({ ...current, profile_photo: null }));
    } catch (requestError) { setProfileError(requestError.message); }
    finally { setPhotoBusy(false); }
  };

  /* ---------- derived data ---------- */
  const completeness = useMemo(() => {
    const checks = [profile.profile_photo, profile.full_name, profile.phone, profile.address_line, profile.city, profile.pincode];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [profile]);

  const sortedBookings = useMemo(() => [...bookings].sort((a, b) => new Date(b.slot_start) - new Date(a.slot_start)), [bookings]);
  const counts = {
    all: bookings.length,
    upcoming: bookings.filter(isUpcoming).length,
    completed: bookings.filter(isDone).length,
    cancelled: bookings.filter(isCancelled).length,
  };
  const filtered = sortedBookings.filter((b) => filter === "all" || (filter === "upcoming" && isUpcoming(b)) || (filter === "completed" && isDone(b)) || (filter === "cancelled" && isCancelled(b)));
  const visible = showAll ? filtered : filtered.slice(0, 5);

  const displayName = profile.full_name || session.user?.full_name || "Account";
  const isCustomer = profile.role === "customer";
  const isPartner = profile.role === "partner";
  const isEmployee = profile.role === "employee";
  const firstName = displayName.trim().split(" ")[0];
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  const renderField = ({ name, label, type, icon: Icon, placeholder, readOnly, full, maxLength }) => (
    <label key={name} className={full ? "sm:col-span-2" : ""}>
      <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {label}
        {readOnly && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500"><Lock size={10} /> Locked</span>}
      </span>
      <span className="relative block">
        <Icon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input name={name} type={type} value={profile[name] || ""} onChange={setField} readOnly={readOnly} required={name === "full_name"} maxLength={maxLength} placeholder={placeholder} className={inputBase} />
      </span>
    </label>
  );

  return (
    <main className="min-h-[70vh] bg-slate-50 pb-20">
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-5 px-5 pb-28 pt-12 sm:px-8">
          <div className="text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-100 ring-1 ring-white/20 backdrop-blur"><Sparkles size={13} /> Manyata account</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back, {firstName}</h1>
            <p className="mt-2 max-w-md text-sm text-violet-100/90">Manage your {ROLE_LABEL[profile.role] || "account"} profile and keep your details up to date.</p>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"><LogOut size={16} /> Log out</button>
        </div>
      </section>

      <div className="relative mx-auto -mt-20 grid max-w-6xl gap-6 px-5 sm:px-8 lg:grid-cols-[320px_1fr] lg:items-start">
        {/* Profile card */}
        <aside className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-900/5 lg:sticky lg:top-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {profile.profile_photo ? (
                <img src={profile.profile_photo} alt="Your profile" className="h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-white" />
              ) : (
                <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-4xl font-extrabold text-white shadow-lg ring-4 ring-white">{initial}</div>
              )}
              {photoBusy && <div className="absolute inset-0 grid place-items-center rounded-full bg-slate-900/55 text-white"><Loader2 size={26} className="animate-spin" /></div>}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} className="hidden" />
              <button type="button" disabled={photoBusy} onClick={() => fileRef.current?.click()} aria-label="Upload photo" className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-violet-600 text-white shadow-lg ring-4 ring-white transition hover:scale-105 hover:bg-violet-700 disabled:opacity-60"><Camera size={16} /></button>
            </div>

            <h2 className="mt-4 text-xl font-extrabold text-slate-900">{displayName}</h2>
            <p className="mt-0.5 max-w-full truncate text-sm text-slate-500">{profile.email}</p>
            <span className="mt-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{ROLE_LABEL[profile.role] || "Account"}</span>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" disabled={photoBusy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100 disabled:opacity-60"><Camera size={13} /> {photoBusy ? "Uploading..." : profile.profile_photo ? "Change photo" : "Upload photo"}</button>
              {profile.profile_photo && <button type="button" disabled={photoBusy} onClick={removePhoto} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"><Trash2 size={13} /> Remove</button>}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">JPEG, PNG or WebP. Resized before upload.</p>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-600">Profile completeness</span>
              <span className={completeness === 100 ? "text-emerald-600" : "text-violet-700"}>{completeness}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full transition-all duration-500 ${completeness === 100 ? "bg-emerald-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`} style={{ width: `${completeness}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">{completeness === 100 ? "Your profile is complete." : "Add a photo and contact details to complete your profile."}</p>
          </div>

          {isCustomer && <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[["Total", counts.all], ["Upcoming", counts.upcoming], ["Done", counts.completed]].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-white p-3">
                <p className="text-xl font-black text-slate-900">{value}</p>
                <p className="text-[11px] font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>}

          {isCustomer && <Link to="/" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:-translate-y-0.5">Book a service <ArrowRight size={16} /></Link>}
          {isEmployee && <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-violet-800">Owner-granted access</p><div className="mt-2 flex flex-wrap gap-1.5">{(profile.permissions || []).length ? profile.permissions.map((permission) => <span key={permission} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold capitalize text-violet-700">{permission.replaceAll("-", " ")}</span>) : <span className="text-xs text-slate-600">No admin sections assigned</span>}</div></div>}
        </aside>

        {/* Main panel */}
        <div className="min-w-0 space-y-5">
          <div className="inline-flex w-full rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm sm:w-auto">
            {[["profile", "Profile details", User, null], ...(isCustomer ? [["bookings", "My bookings", CalendarDays, counts.all]] : [])].map(([key, label, Icon, badge]) => (
              <button key={key} onClick={() => setTab(key)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition sm:flex-none ${tab === key ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>
                <Icon size={16} /> {label}
                {badge !== null && <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === key ? "bg-white/20" : "bg-slate-100"}`}>{badge}</span>}
              </button>
            ))}
          </div>

          {tab === "profile" && (
            <form onSubmit={saveProfile} className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="space-y-8 p-6 sm:p-8">
                {profileError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{profileError}</p>}
                {justSaved && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700"><CheckCircle2 size={18} /> Profile saved successfully.</p>}

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><User size={17} /></span>
                    <div><h3 className="font-extrabold text-slate-900">Personal info</h3><p className="text-xs text-slate-500">How we reach you about your bookings.</p></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">{FIELDS.personal.map(renderField)}</div>
                </div>

                {isPartner && <div className="border-t border-slate-100 pt-8">
                  <div className="mb-4 flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Building2 size={17} /></span><div><h3 className="font-extrabold text-slate-900">Partner profile</h3><p className="text-xs text-slate-500">Share your experience and introduction with customers.</p></div></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label><span className="mb-1.5 block text-sm font-semibold text-slate-700">Years of experience</span><input name="experience_years" type="number" min="0" max="60" value={profile.professional?.experience_years ?? 0} onChange={(event) => setProfile((current) => ({ ...current, professional: { ...current.professional, experience_years: event.target.value } }))} className={inputBase.replace("pl-11", "pl-4")} /></label>
                    <div className="rounded-xl bg-slate-50 p-3"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">Verification</span><p className="mt-2 text-sm font-bold capitalize text-slate-800">{profile.professional?.verification_status || "Pending"}</p></div>
                    <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-semibold text-slate-700">Professional bio</span><textarea name="bio" maxLength="5000" rows="5" value={profile.professional?.bio || ""} onChange={(event) => setProfile((current) => ({ ...current, professional: { ...current.professional, bio: event.target.value } }))} placeholder="Describe your services and experience" className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10" /></label>
                  </div>
                </div>}

                {(isCustomer || isPartner) && <div className="border-t border-slate-100 pt-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><MapPin size={17} /></span>
                    <div><h3 className="font-extrabold text-slate-900">Service address</h3><p className="text-xs text-slate-500">Where our professionals will visit.</p></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">{FIELDS.address.map(renderField)}</div>
                </div>}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8">
                <p className={`flex items-center gap-2 text-sm font-semibold ${dirty ? "text-amber-600" : "text-slate-400"}`}>
                  <span className={`h-2 w-2 rounded-full ${dirty ? "bg-amber-500" : "bg-slate-300"}`} />{dirty ? "You have unsaved changes" : "All changes saved"}
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={resetForm} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw size={15} /> Reset</button>
                  <button disabled={saving || loading || !dirty} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Saving profile..." : "Save profile"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {tab === "bookings" && (
            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-600/25"><Receipt size={18} /></span>
                  <div><h2 className="text-lg font-extrabold text-slate-900">My bookings</h2><p className="text-xs text-slate-500">{bookings.length} total service request{bookings.length === 1 ? "" : "s"}</p></div>
                </div>
                {bookings.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {[["all", "All"], ["upcoming", "Upcoming"], ["completed", "Completed"], ["cancelled", "Cancelled"]].map(([key, label]) => (
                      <button key={key} onClick={() => { setFilter(key); setShowAll(false); }} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${filter === key ? "bg-slate-900 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
                        {label}<span className={`rounded-full px-1.5 text-[10px] ${filter === key ? "bg-white/20" : "bg-white"}`}>{counts[key]}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 sm:px-8">
                {loading && <div className="space-y-3">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />)}</div>}
                {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

                {!loading && !error && bookings.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-violet-600 shadow-sm"><CalendarDays size={26} /></span>
                    <p className="text-base font-extrabold text-slate-800">No bookings yet</p>
                    <p className="max-w-xs text-sm text-slate-500">When you book a home service it will show up here with live status updates.</p>
                    <Link to="/" className="mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25">Browse services <ArrowRight size={16} /></Link>
                  </div>
                )}

                {!loading && !error && bookings.length > 0 && !filtered.length && <p className="rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">No bookings in this category.</p>}

                <div className="space-y-3">
                  {visible.map((booking) => {
                    const d = new Date(booking.slot_start);
                    return (
                      <article key={booking.id} className="group flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5 sm:flex-nowrap">
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 text-center ring-1 ring-violet-100">
                          <div>
                            <p className="text-xl font-black leading-none text-violet-700">{d.getDate()}</p>
                            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-violet-500">{d.toLocaleDateString("en-IN", { month: "short" })}</p>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-extrabold text-slate-900">{booking.service?.name || "Home service"}</h3>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Clock size={12} />{d.toLocaleString("en-IN", { weekday: "short", hour: "numeric", minute: "2-digit" })}</p>
                          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500"><MapPin size={12} className="shrink-0" /><span className="truncate">{booking.address_line}, {booking.pincode}</span></p>
                        </div>
                        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
                          <p className="text-lg font-black text-slate-900">₹{Number(booking.amount).toLocaleString("en-IN")}</p>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ring-inset ${statusStyle(booking)}`}>
                            {isDone(booking) ? <CheckCircle2 size={12} /> : isCancelled(booking) ? <XCircle size={12} /> : <Clock size={12} />}
                            {booking.status?.replaceAll("_", " ")}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {filtered.length > 5 && (
                  <div className="mt-5 text-center">
                    <button onClick={() => setShowAll((s) => !s)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700">
                      {showAll ? "Show less" : `Show all ${filtered.length} bookings`}
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
