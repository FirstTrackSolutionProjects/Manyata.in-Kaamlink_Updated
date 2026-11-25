import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, BriefcaseBusiness, Building2, CalendarDays, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, ContactRound, Eye,
  Hash, LayoutGrid, List as ListIcon, Loader2, Mail, MapPin, Pencil, Phone, RotateCcw, Save, Search, ShieldCheck, SlidersHorizontal, Trash2, User, UserRound, X,
} from "lucide-react";
import { apiRequest, getSession } from "../../lib/api";
import AdminPageFrame from "./AdminPageFrame";
import { Badge, EmptyState, StatStrip, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const ROLE = { customer: "Customer", partner: "Partner", employee: "Employee", admin: "Owner" };
const ROLE_TONE = { customer: "violet", partner: "sky", employee: "amber", admin: "emerald" };
const DEFAULT_FILTERS = { name: "", email: "", phone: "", city: "", pincode: "", status: "all", photo: "all", joined: "any", sort: "newest" };

const PAGE_SIZES = [6, 9, 12, 24].map((n) => ({ value: n, label: `${n} per page` }));
const JOINED_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "month", label: "This month" },
  { value: "d30", label: "Last 30 days" },
  { value: "d90", label: "Last 90 days" },
];
const PHOTO_OPTIONS = [["all", "All"], ["with", "With photo"], ["without", "No photo"]];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];
const SORTERS = {
  newest: (a, b) => new Date(b.created_at) - new Date(a.created_at),
  oldest: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  name_asc: (a, b) => String(a.full_name).localeCompare(String(b.full_name)),
  name_desc: (a, b) => String(b.full_name).localeCompare(String(a.full_name)),
};

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const digits = (v) => String(v || "").replace(/\D/g, "");
const contains = (value, term) => !term.trim() || String(value || "").toLowerCase().includes(term.trim().toLowerCase());
const cap = (s) => String(s || "").replace(/^\w/, (c) => c.toUpperCase());
const statusTone = (s) => (s === "active" ? "emerald" : s === "suspended" ? "amber" : "rose");
const statusDot = (s) => (s === "active" ? "bg-emerald-500" : s === "suspended" ? "bg-amber-500" : "bg-rose-500");

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";
const cancelBtn = "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50";
const selectBase = "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 text-left text-sm text-slate-900 outline-none transition hover:border-violet-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";
const pgBtn = "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border px-2.5 text-sm font-bold transition";
const pgIdle = "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600";
const pgOn = "border-slate-900 bg-slate-900 text-white shadow-md";
const ADMIN_PERMISSION_OPTIONS = [
  ["overview", "Overview"], ["bookings", "Bookings"], ["services", "Services & categories"],
  ["professionals", "Partners"], ["service-areas", "Service areas"], ["customers", "Customers"],
  ["contact", "Contact inbox"], ["tickets", "Support tickets"], ["newsletter", "Newsletter"],
];

async function compressPhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
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

function pageList(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, cur - 1, cur, cur + 1]);
  if (cur <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (cur >= total - 2) [total - 1, total - 2, total - 3].forEach((n) => keep.add(n));
  const nums = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}

function Labeled({ label, children, className = "" }) {
  return (
    <div className={className}>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

function ProfileAvatar({ profile, token, size = "h-12 w-12 text-base" }) {
  const host = useRef(null);
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    if (!profile.profile_photo_available || !host.current) return undefined;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      apiRequest(`/admin/profiles/${profile.id}/photo`, { token })
        .then((result) => { if (active) setPhoto(result.profile_photo); })
        .catch(() => {});
    }, { rootMargin: "120px" });
    observer.observe(host.current);
    return () => { active = false; observer.disconnect(); };
  }, [profile.id, profile.profile_photo_available, token]);

  return (
    <span ref={host} className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-extrabold text-white shadow-md ring-2 ring-white ${size}`}>
      {photo ? <img src={photo} alt={`${profile.full_name} profile`} className="h-full w-full object-cover" /> : (profile.full_name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge tone={statusTone(status)}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusDot(status)}`} />
      {cap(status)}
    </Badge>
  );
}

/* Custom dropdown: never clipped, flips upward near the screen bottom */
function Select({ value, onChange, options, placeholder = "Select…", compact = false }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));

  const openMenu = () => {
    const r = btnRef.current.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const up = below < 240 && above > below;
    const room = up ? above : below;
    setPos({
      left: r.left,
      width: r.width,
      top: up ? undefined : r.bottom + 6,
      bottom: up ? window.innerHeight - r.top + 6 : undefined,
      maxHeight: Math.max(160, Math.min(320, room - 6)),
    });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!btnRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    const onScroll = (e) => {
      if (!popRef.current?.contains(e.target)) setOpen(false);
    };
    const onResize = () => setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const pick = (o) => {
    onChange(o.value);
    setOpen(false);
    btnRef.current?.focus();
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`${selectBase} ${compact ? "px-3 py-2" : "px-3.5 py-2.5"} ${open ? "border-violet-500 bg-white ring-4 ring-violet-500/10" : ""}`}
      >
        <span className={`truncate ${selected ? "font-semibold text-slate-900" : "text-slate-400"}`}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && pos && createPortal(
        <div
          ref={popRef}
          style={{ position: "fixed", left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxHeight }}
          className="z-[120] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
        >
          <div role="listbox" className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {options.map((o) => {
              const on = String(o.value) === String(value);
              return (
                <button
                  key={String(o.value)}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => pick(o)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${on ? "bg-violet-50 font-bold text-violet-700" : "font-medium text-slate-700 hover:bg-slate-50"}`}
                >
                  <span className="truncate">{o.label}</span>
                  {on && <Check size={15} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function Overlay({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
        {children}
      </div>
    </div>,
    document.body
  );
}

function ProfileModal({ profile, photo, onClose, onEdit, onRemove, onRestore }) {
  const tiles = [
    ["Email", profile.email, Mail],
    ["Phone", profile.phone || "Not added", Phone],
    ["City", profile.city || "Not added", Building2],
    ["PIN code", profile.pincode || "Not added", Hash],
    ["Address", profile.address_line || "Not added", MapPin, true],
  ];
  const pro = profile.professional;

  return (
    <Overlay onClose={onClose}>
      <div className="relative h-28 overflow-hidden rounded-t-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900">
        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <p className="absolute left-6 top-5 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-100 sm:left-8">{ROLE[profile.role] || profile.role} profile · ID {profile.id}</p>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white backdrop-blur transition hover:bg-white/25"><X size={18} /></button>
      </div>

      <div className="relative z-10 px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-wrap items-start gap-4">
          <span className="-mt-12 grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-extrabold text-white shadow-lg ring-4 ring-white">
            {photo ? <img src={photo} alt="Profile" className="h-full w-full object-cover" /> : (profile.full_name || "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 pt-3">
            <h2 className="truncate text-2xl font-extrabold text-slate-900">{profile.full_name}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Badge tone={ROLE_TONE[profile.role]}>{ROLE[profile.role] || profile.role}</Badge>
              <StatusBadge status={profile.account_status} />
              <span className="inline-flex items-center gap-1"><CalendarDays size={13} />Joined {fmt(profile.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {tiles.map(([label, value, Icon, full]) => (
            <div key={label} className={`rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 ${full ? "sm:col-span-2" : ""}`}>
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500"><Icon size={13} className="text-violet-600" />{label}</span>
              <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">{value}</p>
            </div>
          ))}
        </div>

        {pro && (
          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
            <b className="flex items-center gap-2 text-sm text-violet-900"><BriefcaseBusiness size={15} /> Partner details</b>
            <div className="mt-3 flex flex-wrap gap-2">
              {pro.city?.name && <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-violet-100"><MapPin size={12} />{pro.city.name}{pro.city.state ? `, ${pro.city.state}` : ""}</span>}
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-violet-100">{pro.experience_years} years experience</span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold capitalize text-slate-700 ring-1 ring-violet-100">{pro.verification_status}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${pro.is_available ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-white text-slate-500 ring-violet-100"}`}>{pro.is_available ? "Available" : "Unavailable"}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{pro.bio || "No bio added."}</p>
          </div>
        )}

        {profile.role === "employee" && (
          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <b className="flex items-center gap-2 text-sm text-amber-900"><ShieldCheck size={15} /> Owner-granted access</b>
            <div className="mt-3 flex flex-wrap gap-2">
              {(profile.admin_permissions || []).length
                ? profile.admin_permissions.map((p) => <Badge key={p} tone="amber">{p}</Badge>)
                : <span className="text-sm text-slate-600">No console sections assigned</span>}
            </div>
          </div>
        )}

        {profile.profile_photo_available && <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400"><Camera size={13} /> This account has a profile photo.</p>}
        {profile.account_status === "deleted" ? (
          profile.role !== "admin" && <div className="mt-6 flex justify-end border-t border-slate-100 pt-4"><button onClick={() => onRestore(profile)} className={btn.ghost}><RotateCcw size={14} /> Restore account</button></div>
        ) : (
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
            <button onClick={() => onEdit(profile)} className={btn.ghost}><Pencil size={14} /> Edit profile</button>
            {profile.role !== "admin" && <button onClick={() => onRemove(profile)} className={btn.danger}><Trash2 size={14} /> Remove</button>}
          </div>
        )}
      </div>
    </Overlay>
  );
}

function EditProfileModal({ profile, photo, cities, categories, onClose, onSave, onPhotoUpload, onPhotoRemove, busy, photoBusy, error, photoError }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address_line: profile.address_line || "",
    city: profile.city || "",
    pincode: profile.pincode || "",
    is_active: Boolean(profile.is_active),
    is_verified: Boolean(profile.is_verified),
    city_id: String(profile.professional?.city_id || ""),
    bio: profile.professional?.bio || "",
    experience_years: String(profile.professional?.experience_years ?? 0),
    category_ids: (profile.professional?.categories || []).map((item) => Number(item.id)),
    verification_status: profile.professional?.verification_status || "pending",
    is_available: Boolean(profile.professional?.is_available),
    permissions: profile.admin_permissions || [],
    password: "",
  });
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const employee = profile.role === "employee";
  const partner = profile.role === "partner";
  const owner = profile.role === "admin";
  const fields = [
    ["full_name", "Full name", "text", true],
    ["email", "Email", "email", true],
    ["phone", "Phone", "tel", false],
    ...(!employee ? [["address_line", "Address", "text", false], ["city", "City", "text", false], ["pincode", "PIN code", "text", false]] : []),
  ];

  return (
    <Overlay onClose={() => !busy && onClose()}>
      <form onSubmit={(event) => { event.preventDefault(); onSave(form); }}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">{ROLE[profile.role]} · ID {profile.id}</p><h2 className="mt-1 text-xl font-extrabold text-slate-900">Edit profile</h2></div>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <div className="sm:col-span-2 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-extrabold text-white ring-4 ring-white">
              {photo ? <img src={photo} alt={`${profile.full_name} profile`} className="h-full w-full object-cover" /> : (form.full_name || "?").charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <b className="block text-sm text-slate-800">Profile photo</b>
              <p className="mt-1 text-xs text-slate-500">JPEG, PNG or WebP · compressed before upload · max 900 KB</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) onPhotoUpload(file); }} />
                <button type="button" disabled={photoBusy} onClick={() => fileRef.current?.click()} className={btn.ghost}><Camera size={14} />{photoBusy ? "Uploading…" : photo ? "Change photo" : "Upload photo"}</button>
                {photo && <button type="button" disabled={photoBusy} onClick={onPhotoRemove} className={btn.danger}><Trash2 size={14} />Remove photo</button>}
              </div>
              {photoError && <p role="alert" className="mt-2 text-xs font-semibold text-rose-600">{photoError}</p>}
            </div>
          </div>
          {fields.map(([key, label, type, required]) => (
            <label key={key} className={`${labelCls} ${key === "address_line" ? "sm:col-span-2" : ""}`}>
              {label}
              <input type={type} required={required} maxLength={key === "full_name" ? 120 : key === "address_line" ? 255 : undefined}
                pattern={key === "pincode" ? "[0-9]{6}" : undefined} inputMode={key === "phone" || key === "pincode" ? "tel" : undefined}
                value={form[key]} onChange={(event) => set(key, event.target.value)} className={`${inputCls} mt-1.5`} />
            </label>
          ))}
          {partner && <>
            <label className={labelCls}>Partner city
              <select value={form.city_id} onChange={(event) => set("city_id", event.target.value)} className={`${inputCls} mt-1.5`}>
                <option value="">No city assigned</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}{city.state ? `, ${city.state}` : ""}</option>)}
              </select>
            </label>
            <label className={labelCls}>Years of experience
              <input type="number" min="0" max="80" value={form.experience_years} onChange={(event) => set("experience_years", event.target.value)} className={`${inputCls} mt-1.5`} />
            </label>
            <label className={`${labelCls} sm:col-span-2`}>Partner bio
              <textarea rows="4" maxLength="10000" value={form.bio} onChange={(event) => set("bio", event.target.value)} className={`${inputCls} mt-1.5`} />
            </label>
            <div className="sm:col-span-2">
              <span className={labelCls}>Services / skills</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((category) => {
                  const checked = form.category_ids.includes(Number(category.id));
                  return <button key={category.id} type="button" onClick={() => set("category_ids", checked ? form.category_ids.filter((id) => id !== Number(category.id)) : [...form.category_ids, Number(category.id)])} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"}`}>{checked ? "✓ " : ""}{category.name}</button>;
                })}
                {!categories.length && <p className="text-xs text-slate-500">No active service categories available.</p>}
              </div>
            </div>
            <label className={labelCls}>Verification status
              <select value={form.verification_status} onChange={(event) => { set("verification_status", event.target.value); if (event.target.value !== "verified") set("is_available", false); }} className={`${inputCls} mt-1.5`}>
                <option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option>
              </select>
            </label>
            <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <input type="checkbox" checked={form.is_available} disabled={form.verification_status !== "verified" || !form.is_active} onChange={(event) => set("is_available", event.target.checked)} className="h-4 w-4 accent-violet-600" />
              <span><b className="block text-sm text-slate-800">Available for jobs</b><small className="text-xs text-slate-500">Requires verified and active account.</small></span>
            </label>
          </>}
          {employee && <div className="sm:col-span-2">
            <span className={labelCls}>Console access · {form.permissions.length} selected</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {ADMIN_PERMISSION_OPTIONS.map(([key, label]) => {
                const checked = form.permissions.includes(key);
                return <button key={key} type="button" onClick={() => set("permissions", checked ? form.permissions.filter((item) => item !== key) : [...form.permissions, key])} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${checked ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"}`}>{checked ? "✓ " : ""}{label}</button>;
              })}
            </div>
          </div>}
          <label className={`${labelCls} sm:col-span-2`}>Set a new password <span className="normal-case tracking-normal text-slate-400">(optional; leave blank to keep current password)</span>
            <input type="password" autoComplete="new-password" minLength="12" maxLength="128" value={form.password} onChange={(event) => set("password", event.target.value)} className={`${inputCls} mt-1.5`} placeholder="At least 12 characters" />
          </label>
          <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <input type="checkbox" checked={form.is_active} disabled={owner} onChange={(event) => { set("is_active", event.target.checked); if (!event.target.checked) set("is_available", false); }} className="h-4 w-4 accent-violet-600" />
            <span><b className="block text-sm text-slate-800">Account active</b><small className="text-xs font-medium normal-case tracking-normal text-slate-500">Inactive accounts cannot access their account.</small></span>
          </label>
          <label className="sm:col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <input type="checkbox" checked={form.is_verified} onChange={(event) => set("is_verified", event.target.checked)} className="h-4 w-4 accent-violet-600" />
            <span><b className="block text-sm text-slate-800">Email verified</b><small className="text-xs font-medium normal-case tracking-normal text-slate-500">Controls the account’s verified status.</small></span>
          </label>
          {error && <p role="alert" className="sm:col-span-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:px-8">
          <button type="button" onClick={onClose} disabled={busy} className={cancelBtn}>Cancel</button>
          <button type="submit" disabled={busy || photoBusy} className={btn.primary}>{busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save changes</button>
        </div>
      </form>
    </Overlay>
  );
}

export default function AdminProfilesPage() {
  const { token } = getSession();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState("");
  const [editing, setEditing] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editOptions, setEditOptions] = useState({ cities: [], categories: [] });
  const [editLoading, setEditLoading] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [mutating, setMutating] = useState(false);
  const [mutationError, setMutationError] = useState("");

  const [roleTab, setRoleTab] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const resultsRef = useRef(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiRequest("/admin/profiles", { token });
      setProfiles(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  useEffect(() => { setPage(1); }, [roleTab, query, filters, pageSize]);

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const openProfile = async (item) => {
    setSelected(item); setPhoto("");
    if (item.profile_photo_available) {
      try { const data = await apiRequest(`/admin/profiles/${item.id}/photo`, { token }); setPhoto(data.profile_photo || ""); }
      catch { /* profile details remain available if photo storage is unavailable */ }
    }
  };

  const editProfile = async (item) => {
    setSelected(null);
    setMutationError(""); setPhotoError(""); setEditingPhoto(null); setEditLoading(true);
    try {
      const [photoResult, partnerOptions] = await Promise.all([
        apiRequest(`/admin/profiles/${item.id}/photo`, { token }).catch(() => ({ profile_photo: null })),
        item.role === "partner" ? apiRequest("/admin/professionals", { token }) : Promise.resolve(null),
      ]);
      let fullProfile = item;
      if (item.role === "partner" && partnerOptions) {
        const record = (partnerOptions.professionals || []).find((row) => String(row.id) === String(item.professional?.id));
        if (record) fullProfile = { ...item, professional: { ...item.professional, ...record, city: record.city || item.professional?.city } };
        const cities = [...(partnerOptions.cities || [])];
        const currentCity = fullProfile.professional?.city;
        if (currentCity && !cities.some((city) => String(city.id) === String(currentCity.id))) cities.push(currentCity);
        const categories = [...(partnerOptions.categories || [])];
        for (const category of fullProfile.professional?.categories || []) {
          if (!categories.some((item) => String(item.id) === String(category.id))) categories.push(category);
        }
        setEditOptions({ cities, categories });
      } else setEditOptions({ cities: [], categories: [] });
      setEditing(fullProfile);
      setEditingPhoto(photoResult.profile_photo || null);
    } catch (e) { setMutationError(e.message || "Could not load profile details."); }
    finally { setEditLoading(false); }
  };

  const saveProfile = async (form) => {
    if (!editing) return;
    setMutating(true); setMutationError("");
    const body = {
      full_name: form.full_name, email: form.email, phone: form.phone || null,
      address_line: form.address_line || null, city: form.city || null, pincode: form.pincode || null,
      is_active: form.is_active, is_verified: form.is_verified,
      ...(form.password ? { password: form.password } : {}),
      ...(editing.role === "partner" ? {
        city_id: form.city_id || null, bio: form.bio || null, experience_years: Number(form.experience_years || 0),
        category_ids: form.category_ids, verification_status: form.verification_status, is_available: form.is_available,
      } : {}),
      ...(editing.role === "employee" ? { permissions: form.permissions } : {}),
    };
    try {
      await apiRequest(`/admin/profiles/${editing.id}`, { token, method: "PATCH", body: JSON.stringify(body) });
      setEditing(null); setSelected(null); await load();
    } catch (e) { setMutationError(e.message || "Could not save profile changes."); }
    finally { setMutating(false); }
  };

  const removeProfile = async () => {
    if (!confirmRemove) return;
    const item = confirmRemove;
    setMutating(true); setMutationError("");
    const path = item.role === "employee"
      ? `/admin/team/${item.id}`
      : item.role === "partner"
        ? `/admin/professionals/${item.professional?.id}`
        : `/admin/customers/${item.id}`;
    try {
      if (item.role === "partner" && !item.professional?.id) throw new Error("Partner record is missing, so this profile cannot be removed here.");
      await apiRequest(path, { token, method: "DELETE" });
      setConfirmRemove(null); setSelected(null); await load();
    } catch (e) { setMutationError(e.message || "Could not remove this profile."); }
    finally { setMutating(false); }
  };

  const restoreProfile = async (item) => {
    setMutating(true); setMutationError("");
    const path = item.role === "employee"
      ? `/admin/team/${item.id}/restore`
      : item.role === "partner"
        ? `/admin/professionals/${item.professional?.id}/restore`
        : `/admin/customers/${item.id}/restore`;
    try {
      if (item.role === "partner" && !item.professional?.id) throw new Error("Partner record is missing, so this profile cannot be restored here.");
      await apiRequest(path, { token, method: "POST" });
      setSelected(null); await load();
    } catch (e) { setMutationError(e.message || "Could not restore this profile."); }
    finally { setMutating(false); }
  };

  const uploadProfilePhoto = async (file) => {
    if (!editing) return;
    setPhotoBusy(true); setPhotoError("");
    try {
      const image = await compressPhoto(file);
      const result = await apiRequest(`/admin/profiles/${editing.id}/photo`, { token, method: "PUT", body: JSON.stringify({ photo: image }) });
      setEditingPhoto(result.profile_photo || image);
      await load();
    } catch (e) { setPhotoError(e.message || "Could not upload this photo."); }
    finally { setPhotoBusy(false); }
  };

  const removeProfilePhoto = async () => {
    if (!editing) return;
    setPhotoBusy(true); setPhotoError("");
    try {
      await apiRequest(`/admin/profiles/${editing.id}/photo`, { token, method: "DELETE" });
      setEditingPhoto(null); await load();
    } catch (e) { setPhotoError(e.message || "Could not remove this photo."); }
    finally { setPhotoBusy(false); }
  };

  const profileActions = (item) => item.role === "admin" ? (
    <div className="flex items-center gap-1.5"><button onClick={() => editProfile(item)} disabled={editLoading || mutating} className={btn.ghost} title="Edit owner profile"><Pencil size={14} /><span className="hidden sm:inline">Edit</span></button></div>
  ) : (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {item.account_status === "deleted" ? (
        <button onClick={() => restoreProfile(item)} disabled={mutating} className={btn.ghost} title="Restore account"><RotateCcw size={14} /><span className="hidden sm:inline">Restore</span></button>
      ) : (
        <>
          <button onClick={() => editProfile(item)} disabled={editLoading || mutating} className={btn.ghost} title="Edit profile"><Pencil size={14} /><span className="hidden sm:inline">Edit</span></button>
          <button onClick={() => { setMutationError(""); setConfirmRemove(item); }} disabled={mutating} className={btn.danger} title="Remove profile"><Trash2 size={14} /><span className="hidden sm:inline">Remove</span></button>
        </>
      )}
    </div>
  );

  /* ---------- counts ---------- */
  const count = (role) => profiles.filter((p) => p.role === role).length;
  const tabs = [["all", "All", profiles.length], ...Object.entries(ROLE).map(([key, label]) => [key, label, count(key)])];
  const statusOptions = [{ value: "all", label: "Any status" }, ...[...new Set(profiles.map((p) => p.account_status).filter(Boolean))].map((s) => ({ value: s, label: cap(s) }))];

  /* ---------- filtering, sorting, pagination ---------- */
  const q = query.trim().toLowerCase();
  const qDigits = digits(q);
  const phoneFilterDigits = digits(filters.phone);

  const matched = useMemo(() => profiles.filter((item) => {
    if (roleTab !== "all" && item.role !== roleTab) return false;
    if (!contains(item.full_name, filters.name) || !contains(item.email, filters.email) || !contains(item.city, filters.city) || !contains(item.pincode, filters.pincode)) return false;
    if (filters.phone.trim() && (!phoneFilterDigits || !digits(item.phone).includes(phoneFilterDigits))) return false;
    if (filters.status !== "all" && item.account_status !== filters.status) return false;
    if (filters.photo === "with" && !item.profile_photo_available) return false;
    if (filters.photo === "without" && item.profile_photo_available) return false;
    if (filters.joined !== "any") {
      const d = new Date(item.created_at);
      if (filters.joined === "month") {
        const n = new Date();
        if (d.getMonth() !== n.getMonth() || d.getFullYear() !== n.getFullYear()) return false;
      } else if (Date.now() - d.getTime() > (filters.joined === "d30" ? 30 : 90) * 86400000) return false;
    }
    if (!q) return true;
    const text = [item.full_name, item.email, item.phone, item.city, item.pincode, ROLE[item.role], item.id].join(" ").toLowerCase();
    return text.includes(q) || (qDigits.length > 0 && digits(item.phone).includes(qDigits));
  }), [profiles, roleTab, filters, q, qDigits, phoneFilterDigits]);

  const sorted = [...matched].sort(SORTERS[filters.sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, totalPages);
  const startIdx = (current - 1) * pageSize;
  const visible = sorted.slice(startIdx, startIdx + pageSize);
  const from = sorted.length ? startIdx + 1 : 0;
  const to = startIdx + visible.length;

  const goTo = (n) => {
    setPage(Math.min(Math.max(1, n), totalPages));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- active filter pills ---------- */
  const pills = [];
  if (filters.name.trim()) pills.push({ key: "name", label: `Name: ${filters.name.trim()}`, clear: { name: "" } });
  if (filters.email.trim()) pills.push({ key: "email", label: `Email: ${filters.email.trim()}`, clear: { email: "" } });
  if (filters.phone.trim()) pills.push({ key: "phone", label: `Mobile: ${filters.phone.trim()}`, clear: { phone: "" } });
  if (filters.city.trim()) pills.push({ key: "city", label: `City: ${filters.city.trim()}`, clear: { city: "" } });
  if (filters.pincode.trim()) pills.push({ key: "pincode", label: `PIN: ${filters.pincode.trim()}`, clear: { pincode: "" } });
  if (filters.status !== "all") pills.push({ key: "status", label: `Status: ${cap(filters.status)}`, clear: { status: "all" } });
  if (filters.photo !== "all") pills.push({ key: "photo", label: filters.photo === "with" ? "With photo" : "Without photo", clear: { photo: "all" } });
  if (filters.joined !== "any") pills.push({ key: "joined", label: `Joined: ${JOINED_OPTIONS.find((o) => o.value === filters.joined)?.label}`, clear: { joined: "any" } });
  if (filters.sort !== "newest") pills.push({ key: "sort", label: `Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}`, clear: { sort: "newest" } });

  const textFilters = [
    ["name", "Name", User, "Search by name"],
    ["email", "Email", Mail, "Search by email"],
    ["phone", "Mobile number", Phone, "Search by mobile number"],
    ["city", "City", Building2, "Search by city"],
    ["pincode", "PIN code", Hash, "Search by PIN code"],
  ];

  return (
    <AdminPageFrame eyebrow="People directory" title="All profiles" description="Owner view of customer, partner, team member, and owner accounts." onRefresh={load}>
      <div className="space-y-5">
        <StatStrip items={[
          { label: "All accounts", value: profiles.length, Icon: ContactRound, tone: "violet" },
          { label: "Customers", value: count("customer"), Icon: UserRound, tone: "sky" },
          { label: "Partners", value: count("partner"), Icon: BriefcaseBusiness, tone: "emerald" },
          { label: "Team members", value: count("employee"), Icon: ShieldCheck, tone: "amber" },
        ]} />

        {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}

        {/* Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone, city or ID" className={`${inputCls} pl-9`} />
            </div>

            <button
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${filtersOpen || pills.length ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"}`}
            >
              <SlidersHorizontal size={16} /> Filters
              {pills.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">{pills.length}</span>}
            </button>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              {[["grid", LayoutGrid], ["list", ListIcon]].map(([key, Icon]) => (
                <button key={key} onClick={() => setView(key)} aria-label={`${key} view`} className={`grid h-8 w-9 place-items-center rounded-lg transition ${view === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}><Icon size={16} /></button>
              ))}
            </div>
          </div>

          <div className="admin-nav-scroll -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            {tabs.map(([key, label, n]) => (
              <button key={key} onClick={() => setRoleTab(key)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${roleTab === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${roleTab === key ? "bg-white/20" : "bg-white"}`}>{n}</span>
              </button>
            ))}
          </div>

          {filtersOpen && (
            <div className="mt-3 border-t border-slate-100 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {textFilters.map(([key, label, Icon, placeholder]) => (
                  <Labeled key={key} label={label}>
                    <span className="relative block">
                      <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={filters[key]}
                        onChange={(e) => setF({ [key]: e.target.value })}
                        placeholder={placeholder}
                        inputMode={key === "phone" ? "tel" : undefined}
                        autoComplete="off"
                        className={`${inputCls} pl-10 ${filters[key] ? "pr-10" : ""}`}
                      />
                      {filters[key] && (
                        <button type="button" onClick={() => setF({ [key]: "" })} aria-label={`Clear ${label}`} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  </Labeled>
                ))}

                <Labeled label="Account status">
                  <Select value={filters.status} onChange={(v) => setF({ status: v })} options={statusOptions} />
                </Labeled>

                <Labeled label="Profile photo">
                  <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                    {PHOTO_OPTIONS.map(([key, label]) => (
                      <button key={key} type="button" onClick={() => setF({ photo: key })} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition ${filters.photo === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
                    ))}
                  </div>
                </Labeled>

                <Labeled label="Joined">
                  <Select value={filters.joined} onChange={(v) => setF({ joined: v })} options={JOINED_OPTIONS} />
                </Labeled>

                <Labeled label="Sort by">
                  <Select value={filters.sort} onChange={(v) => setF({ sort: v })} options={SORT_OPTIONS} />
                </Labeled>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500"><b className="text-slate-900">{sorted.length}</b> profiles match</p>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} disabled={!pills.length} className={`${btn.ghost} disabled:cursor-not-allowed disabled:opacity-40`}>Reset filters</button>
              </div>
            </div>
          )}

          {pills.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active</span>
              {pills.map((p) => (
                <button key={p.key} onClick={() => setF(p.clear)} className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 ring-1 ring-inset ring-violet-200 transition hover:bg-violet-100">
                  {p.label}<X size={12} />
                </button>
              ))}
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="ml-1 text-xs font-bold text-slate-500 underline-offset-2 hover:text-violet-700 hover:underline">Clear all</button>
            </div>
          )}
        </div>

        <div ref={resultsRef} className="scroll-mt-4" />

        {/* Results */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-200/60" />)}</div>
        ) : !sorted.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <EmptyState icon={ContactRound} title={profiles.length ? "No matching profiles" : "No profiles yet"} text={profiles.length ? "Try a different search, role tab or filters." : "Accounts will appear here as people sign up."} />
            {profiles.length > 0 && (query || pills.length > 0 || roleTab !== "all") && (
              <div className="-mt-3 pb-6 text-center">
                <button onClick={() => { setQuery(""); setFilters(DEFAULT_FILTERS); setRoleTab("all"); }} className={btn.ghost}>Clear search and filters</button>
              </div>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <article key={item.id} className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10 ${item.account_status === "active" ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"}`}>
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-start gap-3">
                  <ProfileAvatar profile={item} token={token} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-extrabold text-slate-900">{item.full_name}</h3>
                    <p className="truncate text-xs text-slate-400">ID {item.id}</p>
                  </div>
                  <StatusBadge status={item.account_status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge tone={ROLE_TONE[item.role]}>{ROLE[item.role] || item.role}</Badge>
                  {item.professional?.verification_status && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-600">{item.professional.verification_status}</span>}
                  {item.role === "employee" && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{(item.admin_permissions || []).length} sections</span>}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-slate-700"><Mail size={14} className="shrink-0 text-slate-400" /><span className="truncate">{item.email}</span></p>
                  <p className="flex items-center gap-2 text-slate-600"><Phone size={14} className="shrink-0 text-slate-400" />{item.phone || "No phone"}</p>
                  {item.city && <p className="flex items-center gap-2 text-slate-600"><MapPin size={14} className="shrink-0 text-slate-400" />{item.city}</p>}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><CalendarDays size={13} />Joined {fmt(item.created_at)}</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => openProfile(item)} className={btn.ghost}><Eye size={14} /> View</button>
                    {profileActions(item)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr><th className="px-5 py-3">Person</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Joined</th><th className="px-5 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((item) => (
                    <tr key={item.id} className={`transition hover:bg-violet-50/40 ${item.account_status === "active" ? "" : "bg-slate-50/70"}`}>
                      <td className="px-5 py-3.5">
                        <button onClick={() => openProfile(item)} className="flex items-center gap-3 text-left">
                          <ProfileAvatar profile={item} token={token} size="h-10 w-10 text-sm" />
                          <span><b className="block text-slate-900">{item.full_name}</b><small className="text-slate-400">ID {item.id}</small></span>
                        </button>
                      </td>
                      <td className="px-3 py-3.5"><Badge tone={ROLE_TONE[item.role]}>{ROLE[item.role] || item.role}</Badge></td>
                      <td className="px-3 py-3.5">
                        <p className="flex items-center gap-1.5 text-slate-700"><Mail size={13} className="text-slate-400" />{item.email}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone size={13} className="text-slate-400" />{item.phone || "No phone"}</p>
                      </td>
                      <td className="px-3 py-3.5"><StatusBadge status={item.account_status} /></td>
                      <td className="px-3 py-3.5 text-slate-600">{fmt(item.created_at)}</td>
                      <td className="px-5 py-3.5 text-right"><div className="flex flex-wrap justify-end gap-1.5"><button onClick={() => openProfile(item)} className={btn.ghost}><Eye size={14} /> View</button>{profileActions(item)}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && sorted.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-500">
              Showing <b className="text-slate-900">{from}–{to}</b> of <b className="text-slate-900">{sorted.length}</b> profiles
              {sorted.length !== profiles.length && <span className="text-slate-400"> (filtered from {profiles.length})</span>}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-40"><Select compact value={pageSize} onChange={setPageSize} options={PAGE_SIZES} /></div>
              <nav className="flex items-center gap-1.5" aria-label="Pagination">
                <button onClick={() => goTo(current - 1)} disabled={current === 1} className={`${pgBtn} ${pgIdle} px-3`}><ChevronLeft size={16} />Prev</button>
                <span className="px-2 text-sm font-semibold text-slate-500 sm:hidden">{current} / {totalPages}</span>
                <div className="hidden items-center gap-1.5 sm:flex">
                  {pageList(current, totalPages).map((n, i) =>
                    n === "…" ? (
                      <span key={`gap-${i}`} className="px-1 text-slate-400">…</span>
                    ) : (
                      <button key={n} onClick={() => goTo(n)} aria-current={n === current ? "page" : undefined} className={`${pgBtn} ${n === current ? pgOn : pgIdle}`}>{n}</button>
                    )
                  )}
                </div>
                <button
                  onClick={() => goTo(current + 1)}
                  disabled={current === totalPages}
                  className={`${pgBtn} px-3 ${current === totalPages ? "border-slate-200 bg-slate-100 text-slate-400 disabled:cursor-not-allowed" : "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/25 hover:-translate-y-0.5"}`}
                >
                  Next<ChevronRight size={16} />
                </button>
              </nav>
            </div>
          </div>
        )}

        {selected && <ProfileModal profile={selected} photo={photo} onClose={() => setSelected(null)} onEdit={editProfile} onRemove={(item) => { setMutationError(""); setConfirmRemove(item); }} onRestore={restoreProfile} />}
        {editing && <EditProfileModal profile={editing} photo={editingPhoto} cities={editOptions.cities} categories={editOptions.categories} onClose={() => { if (!mutating && !photoBusy) { setEditing(null); setMutationError(""); setPhotoError(""); } }} onSave={saveProfile} onPhotoUpload={uploadProfilePhoto} onPhotoRemove={removeProfilePhoto} busy={mutating} photoBusy={photoBusy} error={mutationError} photoError={photoError} />}
        {confirmRemove && (
          <Overlay onClose={() => { if (!mutating) { setConfirmRemove(null); setMutationError(""); } }}>
            <div className="p-6 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={22} /></span>
              <h2 className="mt-4 text-xl font-extrabold text-slate-900">Remove this {ROLE[confirmRemove.role]?.toLowerCase()}?</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600"><b>{confirmRemove.full_name}</b> will be deactivated and moved to Removed profiles. Related records stay available, and you can restore this account later.</p>
              {mutationError && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{mutationError}</p>}
              <div className="mt-6 flex justify-end gap-2">
                <button onClick={() => { setConfirmRemove(null); setMutationError(""); }} disabled={mutating} className={cancelBtn}>Cancel</button>
                <button onClick={removeProfile} disabled={mutating} className={btn.danger}>{mutating ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Remove profile</button>
              </div>
            </div>
          </Overlay>
        )}
      </div>
    </AdminPageFrame>
  );
}
