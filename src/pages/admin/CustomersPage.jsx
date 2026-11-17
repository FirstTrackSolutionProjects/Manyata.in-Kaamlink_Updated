import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, Building2, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock,
  Eye, Hash, IndianRupee, LayoutGrid, List as ListIcon, Loader2, Mail, MapPin, Pencil, Phone, Receipt, RotateCcw,
  Save, Search, SlidersHorizontal, Trash2, User, UserCheck, UserPlus, UserX, Users, X, XCircle,
} from "lucide-react";
import { apiRequest } from "../../lib/api";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, EmptyState, StatStrip, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const blankProfile = { full_name: "", email: "", phone: "", address_line: "", city: "", pincode: "" };
const DEFAULT_FILTERS = { name: "", email: "", phone: "", city: "", joined: "any", photo: "all", sort: "newest" };
const contains = (value, term) => !term.trim() || String(value || "").toLowerCase().includes(term.trim().toLowerCase());

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

const PROFILE_FIELDS = [
  { name: "full_name", label: "Full name", icon: User, required: true },
  { name: "email", label: "Email", icon: Mail, required: true, type: "email" },
  { name: "phone", label: "Phone", icon: Phone },
  { name: "address_line", label: "Address", icon: MapPin, full: true },
  { name: "city", label: "City", icon: Building2 },
  { name: "pincode", label: "PIN code", icon: Hash },
];

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const stateOf = (r) => (r.deleted_at ? "deleted" : r.is_active ? "active" : "suspended");
const STATE_LABEL = { deleted: "Deleted", active: "Active", suspended: "Suspended" };
const STATE_TONE = { deleted: "rose", active: "emerald", suspended: "amber" };
const STATE_DOT = { deleted: "bg-rose-500", active: "bg-emerald-500", suspended: "bg-amber-500" };

const statusKey = (b) => String(b.status || "").toLowerCase();
const isCancelled = (b) => statusKey(b).includes("cancel");
const isDone = (b) => statusKey(b).includes("complet");
function bookingStyle(b) {
  if (isDone(b)) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (isCancelled(b)) return "bg-rose-50 text-rose-700 ring-rose-200";
  if (statusKey(b).includes("pend") || statusKey(b).includes("request")) return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-violet-50 text-violet-700 ring-violet-200";
}

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";
const selectBase = "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 text-left text-sm text-slate-900 outline-none transition hover:border-violet-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";
const pgBtn = "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border px-2.5 text-sm font-bold transition";
const pgIdle = "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600";
const pgOn = "border-slate-900 bg-slate-900 text-white shadow-md";
const profileInput = "w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 read-only:border-transparent read-only:bg-slate-50 read-only:text-slate-700 read-only:focus:ring-0";

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

function CustomerAvatar({ customer, size = "h-10 w-10 text-sm" }) {
  const host = useRef(null);
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    if (!customer.has_photo || !host.current) return undefined;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      apiRequest(`/admin/customers/${customer.id}/photo`)
        .then((result) => { if (active) setPhoto(result.profile_photo); })
        .catch(() => {});
    }, { rootMargin: "120px" });
    observer.observe(host.current);
    return () => { active = false; observer.disconnect(); };
  }, [customer.id, customer.has_photo]);

  return (
    <span ref={host} className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-extrabold text-white shadow-md ring-2 ring-white ${size}`}>
      {photo ? <img src={photo} alt={`${customer.full_name} profile`} className="h-full w-full object-cover" /> : (customer.full_name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function StateBadge({ row }) {
  const s = stateOf(row);
  return (
    <Badge tone={STATE_TONE[s]}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATE_DOT[s]}`} />
      {STATE_LABEL[s]}
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

function Overlay({ onClose, maxW = "sm:max-w-xl", children }) {
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
      <div role="dialog" aria-modal="true" className={`relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${maxW}`}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function ConfirmDelete({ customer, busy, onCancel, onConfirm }) {
  return (
    <Overlay onClose={busy ? () => {} : onCancel} maxW="sm:max-w-md">
      <div className="p-6 sm:p-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={26} /></span>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">Delete {customer.full_name}?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">Their account will be soft-deleted. All bookings are preserved and you can restore this customer anytime from the Deleted tab.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 disabled:opacity-60">
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} {busy ? "Deleting..." : "Delete customer"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function CustomerProfileModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({ ...blankProfile, ...customer });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("details");

  const set = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const bookings = customer.bookings || [];
  const spent = bookings.filter((b) => !isCancelled(b)).reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const updated = await apiRequest(`/admin/customers/${customer.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setForm((current) => ({ ...current, ...updated }));
      setEditing(false);
      onSaved();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const cancelEdit = () => { setForm({ ...blankProfile, ...customer }); setEditing(false); setError(""); };

  return (
    <Overlay onClose={onClose} maxW="sm:max-w-2xl">
      <div className="relative h-28 overflow-hidden rounded-t-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900">
        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <p className="absolute left-6 top-5 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-100 sm:left-8">Customer record · #{customer.id}</p>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white backdrop-blur transition hover:bg-white/25"><X size={18} /></button>
      </div>

      <div className="relative z-10 px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-wrap items-start gap-4">
          {form.profile_photo ? (
            <img src={form.profile_photo} alt="Customer profile" className="-mt-12 h-24 w-24 shrink-0 rounded-full object-cover shadow-lg ring-4 ring-white" />
          ) : (
            <div className="-mt-12 grid h-24 w-24 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-extrabold text-white shadow-lg ring-4 ring-white">{form.full_name?.[0]?.toUpperCase() || "?"}</div>
          )}
          <div className="min-w-0 pt-3">
            <h2 className="truncate text-2xl font-extrabold text-slate-900">{form.full_name || "Customer"}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <StateBadge row={form} />
              <span>Joined {fmt(form.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            ["Bookings", bookings.length, CalendarDays],
            ["Total spent", `₹${spent.toLocaleString("en-IN")}`, IndianRupee],
            ["Member since", new Date(form.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }), UserCheck],
          ].map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
              <Icon size={16} className="text-violet-600" />
              <p className="mt-2 truncate text-lg font-black text-slate-900">{value}</p>
              <p className="text-[11px] font-semibold text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
          {[["details", "Details", User, null], ["bookings", "Bookings", Receipt, bookings.length]].map(([key, label, Icon, badge]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${tab === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}>
              <Icon size={15} /> {label}
              {badge !== null && <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === key ? "bg-violet-100" : "bg-white"}`}>{badge}</span>}
            </button>
          ))}
        </div>

        {tab === "details" && (
          <form onSubmit={save} className="mt-5">
            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {PROFILE_FIELDS.map(({ name, label, icon: Icon, required, type, full }) => (
                <label key={name} className={full ? "sm:col-span-2" : ""}>
                  <span className={labelCls}>{label}</span>
                  <span className="relative block">
                    <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name={name} type={type || "text"} value={form[name] || ""} onChange={set} readOnly={!editing} required={required} placeholder={editing ? label : "Not provided"} className={profileInput} />
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
              {editing ? (
                <>
                  <button disabled={saving} className={btn.primary}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Saving..." : "Save changes"}</button>
                  <button type="button" onClick={cancelEdit} className={btn.ghost}>Cancel</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setEditing(true)} className={btn.primary}><Pencil size={15} /> Edit profile</button>
                  <a href={`mailto:${form.email}`} className={btn.ghost}><Mail size={14} /> Email</a>
                  {form.phone && <a href={`tel:${form.phone}`} className={btn.ghost}><Phone size={14} /> Call</a>}
                </>
              )}
            </div>
          </form>
        )}

        {tab === "bookings" && (
          <div className="mt-5">
            {bookings.length ? (
              <div className="max-h-72 space-y-2.5 overflow-y-auto pr-1">
                {bookings.map((booking) => {
                  const d = new Date(booking.created_at);
                  return (
                    <article key={booking.id} className="flex items-center gap-3.5 rounded-2xl border border-slate-200 p-3.5 transition hover:border-violet-200 hover:bg-violet-50/30">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 text-center ring-1 ring-violet-100">
                        <div>
                          <p className="text-lg font-black leading-none text-violet-700">{d.getDate()}</p>
                          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-500">{d.toLocaleDateString("en-IN", { month: "short" })}</p>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-900">{booking.service?.name || "Home service"}</p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500"><MapPin size={11} className="shrink-0" />{booking.address_line || "Address not provided"}{booking.pincode ? `, ${booking.pincode}` : ""}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-black text-slate-900">₹{Number(booking.amount || 0).toLocaleString("en-IN")}</p>
                        <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ring-1 ring-inset ${bookingStyle(booking)}`}>
                          {isDone(booking) ? <CheckCircle2 size={11} /> : isCancelled(booking) ? <XCircle size={11} /> : <Clock size={11} />}
                          {booking.status?.replaceAll("_", " ")}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-600 shadow-sm"><CalendarDays size={22} /></span>
                <p className="text-sm font-extrabold text-slate-800">No bookings yet</p>
                <p className="text-xs text-slate-500">Bookings made by this customer will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Overlay>
  );
}

function CustomersView({ all, mutate, reload }) {
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [now] = useState(() => Date.now());
  const resultsRef = useRef(null);

  const setF = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const changeTab = (nextTab) => {
    setTab(nextTab);
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const run = async (path, method, body) => {
    setActionError("");
    try { await mutate(path, method, body); }
    catch (err) { setActionError(err.message); }
  };

  const openProfile = async (row) => {
    setActionError("");
    try { setSelected(await apiRequest(`/admin/customers/${row.id}`)); }
    catch (err) { setActionError(err.message); }
  };

  const doDelete = async () => {
    setDeleting(true);
    await run(`/admin/customers/${confirm.id}`, "DELETE");
    setDeleting(false);
    setConfirm(null);
  };

  /* ---------- counts ---------- */
  const deleted = all.filter((r) => r.deleted_at).length;
  const active = all.filter((r) => r.is_active && !r.deleted_at).length;
  const suspended = all.filter((r) => !r.is_active && !r.deleted_at).length;
  const thisMonth = all.filter((r) => {
    const d = new Date(r.created_at);
    const n = new Date(now);
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).length;
  const tabs = [["all", "All", all.length - deleted], ["active", "Active", active], ["suspended", "Suspended", suspended], ["deleted", "Deleted", deleted]];

  /* ---------- filtering, sorting, pagination ---------- */
  const q = query.trim().toLowerCase();
  const matched = all.filter((r) => {
    const s = stateOf(r);
    if (tab === "all" ? s === "deleted" : s !== tab) return false;
    if (filters.photo === "with" && !r.has_photo) return false;
    if (filters.photo === "without" && r.has_photo) return false;
    if (filters.joined !== "any") {
      const d = new Date(r.created_at);
      if (filters.joined === "month") {
        const n = new Date(now);
        if (d.getMonth() !== n.getMonth() || d.getFullYear() !== n.getFullYear()) return false;
      } else if (now - d.getTime() > (filters.joined === "d30" ? 30 : 90) * 86400000) return false;
    }
        if (!contains(r.full_name, filters.name) || !contains(r.email, filters.email) || !contains(r.city, filters.city)) return false;
    const phoneDigits = filters.phone.replace(/\D/g, "");
    if (filters.phone.trim() && (!phoneDigits || !String(r.phone || "").replace(/\D/g, "").includes(phoneDigits))) return false;
    return !q || `${r.full_name || ""} ${r.email || ""} ${r.phone || ""} ${r.city || ""}`.toLowerCase().includes(q);
  });
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
  if (filters.joined !== "any") pills.push({ key: "joined", label: `Joined: ${JOINED_OPTIONS.find((o) => o.value === filters.joined)?.label}`, clear: { joined: "any" } });
  if (filters.photo !== "all") pills.push({ key: "photo", label: filters.photo === "with" ? "With photo" : "Without photo", clear: { photo: "all" } });
    if (filters.name.trim()) pills.push({ key: "name", label: `Name: ${filters.name.trim()}`, clear: { name: "" } });
  if (filters.email.trim()) pills.push({ key: "email", label: `Email: ${filters.email.trim()}`, clear: { email: "" } });
  if (filters.phone.trim()) pills.push({ key: "phone", label: `Mobile: ${filters.phone.trim()}`, clear: { phone: "" } });
  if (filters.city.trim()) pills.push({ key: "city", label: `City: ${filters.city.trim()}`, clear: { city: "" } });
  if (filters.sort !== "newest") pills.push({ key: "sort", label: `Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}`, clear: { sort: "newest" } });

  const actions = (row) => (
    <>
      <button onClick={() => openProfile(row)} className={btn.ghost}><Eye size={14} /> View</button>
      {row.deleted_at ? (
        <button onClick={() => run(`/admin/customers/${row.id}/restore`, "POST", {})} className={btn.success}><RotateCcw size={14} /> Restore</button>
      ) : (
        <>
          <button onClick={() => run(`/admin/customers/${row.id}`, "PATCH", { is_active: !row.is_active })} className={row.is_active ? btn.ghost : btn.success}>{row.is_active ? "Suspend" : "Activate"}</button>
          <button title="Delete customer" onClick={() => setConfirm(row)} className={btn.danger}><Trash2 size={14} /><span className="sr-only">Delete</span></button>
        </>
      )}
    </>
  );

  return (
    <div className="space-y-5">
      <StatStrip items={[
        { label: "Total customers", value: all.length - deleted, Icon: Users, tone: "violet" },
        { label: "Active accounts", value: active, Icon: UserCheck, tone: "emerald" },
        { label: "Suspended", value: suspended, Icon: UserX, tone: "rose" },
        { label: "Joined this month", value: thisMonth, Icon: UserPlus, tone: "sky" },
      ]} />

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search by name, email, phone or city" className={`${inputCls} pl-9`} />
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
            <button key={key} onClick={() => changeTab(key)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${tab === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === key ? "bg-white/20" : "bg-white"}`}>{n}</span>
            </button>
          ))}
        </div>

        {filtersOpen && (
                    <div className="mt-3 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ["name", "Name", User, "Search by name"],
              ["email", "Email", Mail, "Search by email"],
              ["phone", "Mobile number", Phone, "Search by mobile number"],
              ["city", "City", MapPin, "Search by city"],
            ].map(([key, label, Icon, placeholder]) => (
              <Labeled key={key} label={label}>
                <span className="relative block">
                  <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={filters[key]}
                    onChange={(e) => setF({ [key]: e.target.value })}
                    placeholder={placeholder}
                    inputMode={key === "phone" ? "tel" : undefined}
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

            <Labeled label="Joined">
              <Select value={filters.joined} onChange={(v) => setF({ joined: v })} options={JOINED_OPTIONS} />
            </Labeled>

            <Labeled label="Profile photo">
              <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                {PHOTO_OPTIONS.map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setF({ photo: key })} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition ${filters.photo === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
                ))}
              </div>
            </Labeled>

            <Labeled label="Sort by">
              <Select value={filters.sort} onChange={(v) => setF({ sort: v })} options={SORT_OPTIONS} />
            </Labeled>

            <div className="flex items-center justify-between gap-3 sm:col-span-2 xl:col-span-3">
              <p className="text-xs text-slate-500"><b className="text-slate-900">{sorted.length}</b> customers match</p>
              <button onClick={resetFilters} disabled={!pills.length} className={`${btn.ghost} disabled:cursor-not-allowed disabled:opacity-40`}>Reset filters</button>
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
            <button onClick={resetFilters} className="ml-1 text-xs font-bold text-slate-500 underline-offset-2 hover:text-violet-700 hover:underline">Clear all</button>
          </div>
        )}
      </div>

      {actionError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">{actionError}</p>}

      <div ref={resultsRef} className="scroll-mt-4" />

      {/* Results */}
      {!sorted.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={Users} title={tab === "deleted" ? "No deleted customers" : all.length ? "No matching customers" : "No customers yet"} text={all.length ? "Try a different search, tab or filters." : "Customers will appear here once they sign up."} />
          {all.length > 0 && (query || pills.length > 0) && (
            <div className="-mt-3 pb-6 text-center">
              <button onClick={() => { setQuery(""); resetFilters(); }} className={btn.ghost}>Clear search and filters</button>
            </div>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const s = stateOf(row);
            return (
              <article key={row.id} className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10 ${s === "active" ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"}`}>
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-start gap-3">
                  <CustomerAvatar customer={row} size="h-12 w-12 text-base" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-extrabold text-slate-900">{row.full_name}</h3>
                    <p className="truncate text-xs text-slate-400">Customer #{row.id}</p>
                  </div>
                  <StateBadge row={row} />
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2 truncate text-slate-700"><Mail size={14} className="shrink-0 text-slate-400" /><span className="truncate">{row.email}</span></p>
                  <p className="flex items-center gap-2 text-slate-600"><Phone size={14} className="shrink-0 text-slate-400" />{row.phone || "—"}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {row.city && <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"><MapPin size={12} />{row.city}</span>}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"><CalendarDays size={12} />Joined {fmt(row.created_at)}</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">{actions(row)}</div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3">Access</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((row) => (
                  <tr key={row.id} className={`transition hover:bg-violet-50/40 ${row.deleted_at || !row.is_active ? "bg-slate-50/70" : ""}`}>
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><CustomerAvatar customer={row} /><p className="truncate font-bold text-slate-900">{row.full_name}</p></div></td>
                    <td className="px-3 py-3.5">
                      <p className="flex items-center gap-1.5 text-slate-700"><Mail size={13} className="text-slate-400" />{row.email}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone size={13} className="text-slate-400" />{row.phone || "—"}</p>
                    </td>
                    <td className="px-3 py-3.5 text-slate-600">{fmt(row.created_at)}</td>
                    <td className="px-3 py-3.5"><StateBadge row={row} /></td>
                    <td className="px-5 py-3.5"><div className="flex justify-end gap-2">{actions(row)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Showing <b className="text-slate-900">{from}–{to}</b> of <b className="text-slate-900">{sorted.length}</b> customers
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-40"><Select compact value={pageSize} onChange={(size) => { setPageSize(size); setPage(1); }} options={PAGE_SIZES} /></div>
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

      {selected && <CustomerProfileModal customer={selected} onClose={() => setSelected(null)} onSaved={() => { void reload(); }} />}
      {confirm && <ConfirmDelete customer={confirm} busy={deleting} onCancel={() => setConfirm(null)} onConfirm={doDelete} />}
    </div>
  );
}

export default function CustomersPage() {
  const resource = useAdminSection("/admin/customers");
  const all = Array.isArray(resource.data) ? resource.data : [];
  return <AdminPageFrame title="Customers" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <CustomersView all={all} mutate={resource.mutate} reload={resource.load} />
  </AdminPageFrame>;
}
