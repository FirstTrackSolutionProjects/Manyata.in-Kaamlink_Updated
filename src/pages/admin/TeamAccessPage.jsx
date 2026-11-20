import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, Building2, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Copy, Eye, EyeOff, KeyRound,
  LayoutGrid, List as ListIcon, Loader2, Lock, Mail, MapPin, Pencil, Phone, Plus, RefreshCw, RotateCcw, Save, Search,
  ShieldCheck, SlidersHorizontal, Trash2, User, UserPlus, UserRound, X,
} from "lucide-react";
import { apiRequest, getSession } from "../../lib/api";
import AdminPageFrame from "./AdminPageFrame";
import { Badge, EmptyState, StatStrip, Toggle, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const blankForm = { full_name: "", email: "", phone: "", password: "", permissions: [] };
const DEFAULT_FILTERS = { name: "", email: "", phone: "", city: "", state: "", section: "all", joined: "any", sort: "newest" };

const PAGE_SIZES = [6, 9, 12, 24].map((n) => ({ value: n, label: `${n} per page` }));
const JOINED_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "month", label: "This month" },
  { value: "d30", label: "Last 30 days" },
  { value: "d90", label: "Last 90 days" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
];
const SORTERS = {
  newest: (a, b) => (new Date(b.created_at || 0) - new Date(a.created_at || 0)) || (Number(b.id) - Number(a.id)),
  oldest: (a, b) => (new Date(a.created_at || 0) - new Date(b.created_at || 0)) || (Number(a.id) - Number(b.id)),
  name_asc: (a, b) => String(a.full_name).localeCompare(String(b.full_name)),
  name_desc: (a, b) => String(b.full_name).localeCompare(String(a.full_name)),
};

const stateOf = (u) => (u.deleted_at ? "deleted" : u.is_active ? "active" : "suspended");
const STATE_LABEL = { deleted: "Removed", active: "Active", suspended: "Suspended" };
const STATE_TONE = { deleted: "rose", active: "emerald", suspended: "amber" };
const STATE_DOT = { deleted: "bg-rose-500", active: "bg-emerald-500", suspended: "bg-amber-500" };

const contains = (value, term) => !term.trim() || String(value || "").toLowerCase().includes(term.trim().toLowerCase());
const digits = (v) => String(v || "").replace(/\D/g, "");

const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";
const cancelBtn = "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50";
const selectBase = "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/60 text-left text-sm text-slate-900 outline-none transition hover:border-violet-300 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";
const pgBtn = "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-lg border px-2.5 text-sm font-bold transition";
const pgIdle = "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600";
const pgOn = "border-slate-900 bg-slate-900 text-white shadow-md";

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

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$%";
  const arr = new Uint32Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

function Labeled({ label, children, className = "" }) {
  return (
    <div className={className}>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

function Avatar({ name, size = "h-12 w-12 text-base" }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-extrabold text-white shadow-md ring-2 ring-white ${size}`}>
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function StateBadge({ user }) {
  const s = stateOf(user);
  return (
    <Badge tone={STATE_TONE[s]}>
      <span className={`h-1.5 w-1.5 rounded-full ${STATE_DOT[s]}`} />
      {STATE_LABEL[s]}
    </Badge>
  );
}

/* Custom dropdown: searchable, never clipped, flips upward near the screen bottom */
function Select({ value, onChange, options, placeholder = "Select…", searchable, compact = false }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));
  const showSearch = searchable ?? options.length > 6;

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
    setQ("");
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

  const term = q.trim().toLowerCase();
  const list = options.filter((o) => !term || String(o.label).toLowerCase().includes(term));
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
          {showSearch && (
            <div className="relative shrink-0 border-b border-slate-100 p-2">
              <Search size={15} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (list[0]) pick(list[0]);
                  }
                }}
                placeholder="Search…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-500 focus:bg-white"
              />
            </div>
          )}
          <div role="listbox" className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {list.map((o) => {
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
            {!list.length && <p className="px-3 py-6 text-center text-xs text-slate-400">No results found</p>}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function Modal({ open, onClose, icon: Icon, title, subtitle, wide, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={`relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${wide ? "sm:max-w-2xl" : "sm:max-w-xl"}`}>
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-600/25"><Icon size={18} /></span>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-base font-extrabold text-slate-900">{title}</h2>
              {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X size={18} /></button>
        </header>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function SectionChips({ sections, selected, onToggle, onAll, onClear }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className={`${labelCls} !mb-0`}>Console sections <span className="ml-1 normal-case tracking-normal text-slate-400">({selected.length} selected)</span></span>
        {sections.length > 0 && (
          <div className="flex gap-3 text-xs font-bold">
            <button type="button" onClick={onAll} className="text-violet-700 hover:underline">Select all</button>
            <button type="button" onClick={onClear} className="text-slate-500 hover:underline">Clear</button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const on = selected.includes(section.key);
          return (
            <label key={section.key} className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${on ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"}`}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(section.key)} />
              {on && <Check size={14} />}
              {section.label}
            </label>
          );
        })}
        {!sections.length && <p className="text-xs text-slate-400">No console sections available.</p>}
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, required, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <Labeled label={label}>
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={show ? "text" : "password"}
            required={required}
            minLength={12}
            autoComplete="new-password"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} pl-10 pr-11`}
          />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button type="button" onClick={() => { onChange(genPassword()); setShow(true); }} title="Generate a strong password" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
          <RefreshCw size={14} /> Generate
        </button>
      </div>
    </Labeled>
  );
}

export default function TeamAccessPage() {
  const { token } = getSession();
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [newCredential, setNewCredential] = useState(null);
  const [copied, setCopied] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);
  const [editPassword, setEditPassword] = useState("");
  const [confirm, setConfirm] = useState(null);

  const [tab, setTab] = useState("all");
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
      const data = await apiRequest("/admin/team", { token });
      setEmployees(data.employees || []);
      setSections(data.sections || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  useEffect(() => { setPage(1); }, [tab, query, filters, pageSize]);

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const sectionLabel = (key) => sections.find((s) => s.key === key)?.label || key;

  /* ---------- actions (API calls unchanged) ---------- */
  const toggleKey = (list, key) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  const allKeys = sections.map((s) => s.key);

  const openAdd = () => { setForm(blankForm); setFormError(""); setAddOpen(true); };
  const closeAdd = () => { setAddOpen(false); setFormError(""); };

  const createEmployee = async (event) => {
    event.preventDefault(); setBusy(true); setFormError(""); setError(""); setNotice(""); setNewCredential(null);
    try {
      const created = await apiRequest("/admin/team", { token, method: "POST", body: JSON.stringify(form) });
      setEmployees((current) => [created.employee, ...current]);
      setNewCredential({ email: created.employee.email, password: form.password });
      setForm(blankForm);
      setAddOpen(false);
      setNotice("Team member created. Save the temporary password and share it securely.");
    } catch (e) { setFormError(e.message); }
    finally { setBusy(false); }
  };

  const startEdit = (employee) => {
    setEditing(employee); setEditPermissions(employee.admin_permissions || []); setEditPassword("");
    setFormError(""); setError(""); setNotice("");
  };
  const closeEdit = () => { setEditing(null); setFormError(""); };

  const saveEdit = async (event) => {
    event.preventDefault(); setBusy(true); setFormError("");
    try {
      const body = { permissions: editPermissions, is_active: Boolean(editing.is_active), full_name: editing.full_name, phone: editing.phone || null };
      if (editPassword) body.password = editPassword;
      const data = await apiRequest(`/admin/team/${editing.id}`, { token, method: "PATCH", body: JSON.stringify(body) });
      setEmployees((current) => current.map((row) => (row.id === editing.id ? data.employee : row)));
      if (editPassword) setNewCredential({ email: data.employee.email, password: editPassword });
      setEditing(null);
      setNotice(editPassword ? "Access updated and password reset. Save the new password securely." : "Employee access updated.");
    } catch (e) { setFormError(e.message); }
    finally { setBusy(false); }
  };

  const suspendOrRestore = async (employee) => {
    setError(""); setNotice("");
    try {
      if (employee.deleted_at) {
        await apiRequest(`/admin/team/${employee.id}/restore`, { token, method: "POST" });
      } else {
        await apiRequest(`/admin/team/${employee.id}`, { token, method: "PATCH", body: JSON.stringify({ is_active: !employee.is_active }) });
      }
      await load();
    } catch (e) { setError(e.message); }
  };

  const doRemove = async () => {
    setBusy(true);
    try { await apiRequest(`/admin/team/${confirm.id}`, { token, method: "DELETE" }); setConfirm(null); await load(); }
    catch (e) { setError(e.message); setConfirm(null); }
    finally { setBusy(false); }
  };

  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 1800); } catch { /* clipboard blocked */ }
  };

  /* ---------- counts & data availability ---------- */
  const removed = employees.filter((e) => e.deleted_at).length;
  const active = employees.filter((e) => e.is_active && !e.deleted_at).length;
  const suspended = employees.filter((e) => !e.is_active && !e.deleted_at).length;
  const hasDates = employees.some((e) => e.created_at);
  const hasCity = employees.some((e) => e.city);
  const hasState = employees.some((e) => e.state);
  const tabs = [["all", "All", employees.length - removed], ["active", "Active", active], ["suspended", "Suspended", suspended], ["deleted", "Removed", removed]];

  /* ---------- filtering, sorting, pagination ---------- */
  const q = query.trim().toLowerCase();
  const qDigits = digits(q);
  const phoneFilterDigits = digits(filters.phone);

  const matched = useMemo(() => employees.filter((item) => {
    const s = stateOf(item);
    if (tab === "all" ? s === "deleted" : s !== tab) return false;
    if (!contains(item.full_name, filters.name) || !contains(item.email, filters.email) || !contains(item.city, filters.city) || !contains(item.state, filters.state)) return false;
    if (filters.phone.trim() && (!phoneFilterDigits || !digits(item.phone).includes(phoneFilterDigits))) return false;
    const perms = item.admin_permissions || [];
    if (filters.section === "none" && perms.length) return false;
    if (filters.section !== "all" && filters.section !== "none" && !perms.includes(filters.section)) return false;
    if (filters.joined !== "any") {
      if (!item.created_at) return false;
      const d = new Date(item.created_at);
      if (filters.joined === "month") {
        const n = new Date();
        if (d.getMonth() !== n.getMonth() || d.getFullYear() !== n.getFullYear()) return false;
      } else if (Date.now() - d.getTime() > (filters.joined === "d30" ? 30 : 90) * 86400000) return false;
    }
    if (!q) return true;
    const text = [item.full_name, item.email, item.phone, item.city, item.state, item.id].join(" ").toLowerCase();
    return text.includes(q) || (qDigits.length > 0 && digits(item.phone).includes(qDigits));
  }), [employees, tab, filters, q, qDigits, phoneFilterDigits]);

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
  if (filters.state.trim()) pills.push({ key: "state", label: `State: ${filters.state.trim()}`, clear: { state: "" } });
  if (filters.section !== "all") pills.push({ key: "section", label: filters.section === "none" ? "No sections assigned" : `Access: ${sectionLabel(filters.section)}`, clear: { section: "all" } });
  if (filters.joined !== "any") pills.push({ key: "joined", label: `Joined: ${JOINED_OPTIONS.find((o) => o.value === filters.joined)?.label}`, clear: { joined: "any" } });
  if (filters.sort !== "newest") pills.push({ key: "sort", label: `Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}`, clear: { sort: "newest" } });

  const sectionOptions = [
    { value: "all", label: "Any section" },
    { value: "none", label: "No sections assigned" },
    ...sections.map((s) => ({ value: s.key, label: s.label })),
  ];

  const textFilters = [
    ["name", "Name", User, "Search by name"],
    ["email", "Email", Mail, "Search by email"],
    ["phone", "Mobile number", Phone, "Search by mobile number"],
    ["city", "City", Building2, "Search by city"],
    ["state", "State", MapPin, "Search by state"],
  ];

  const permissionChips = (employee, max = 4) => {
    const list = employee.admin_permissions || [];
    if (!list.length) return <span className="text-xs text-slate-400">No sections assigned</span>;
    return (
      <>
        {list.slice(0, max).map((p) => <span key={p} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700 ring-1 ring-inset ring-violet-100">{sectionLabel(p)}</span>)}
        {list.length > max && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">+{list.length - max} more</span>}
      </>
    );
  };

  const actions = (employee) => (
    <>
      {!employee.deleted_at && <button onClick={() => startEdit(employee)} className={btn.ghost}><Pencil size={13} /> Edit access</button>}
      {employee.deleted_at ? (
        <button onClick={() => suspendOrRestore(employee)} className={btn.success}><RotateCcw size={13} /> Restore</button>
      ) : (
        <>
          <button onClick={() => suspendOrRestore(employee)} className={employee.is_active ? btn.ghost : btn.success}>{employee.is_active ? "Suspend" : "Reactivate"}</button>
          <button title="Remove from team" onClick={() => setConfirm(employee)} className={btn.danger}><Trash2 size={13} /><span className="sr-only">Remove</span></button>
        </>
      )}
    </>
  );

  return (
    <AdminPageFrame title="Team access" onRefresh={load}>
      <div className="space-y-5">
        <p className="text-sm text-slate-500">Create employee accounts and grant only the owner-console sections each person needs.</p>

        {error && <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700"><AlertTriangle size={17} className="mt-0.5 shrink-0" />{error}</p>}
        {notice && <p role="status" className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</p>}

        {newCredential && (
          <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><KeyRound size={18} /></span>
                <div className="min-w-0">
                  <b className="text-sm text-amber-950">Temporary sign-in details</b>
                  <p className="mt-0.5 text-xs text-amber-800">Copy now and share through a secure channel. The password will not be shown again.</p>
                </div>
              </div>
              <button onClick={() => setNewCredential(null)} aria-label="Dismiss" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-amber-800 transition hover:bg-amber-100"><X size={17} /></button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[["email", "Email", newCredential.email], ["password", "Password", newCredential.password]].map(([key, label, value]) => (
                <div key={key} className="flex items-center justify-between gap-2 rounded-xl border border-amber-200/70 bg-white p-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <code className="block break-all text-sm text-slate-900">{value}</code>
                  </div>
                  <button onClick={() => copy(value, key)} className={btn.ghost}>{copied === key ? <Check size={13} /> : <Copy size={13} />}{copied === key ? "Copied" : "Copy"}</button>
                </div>
              ))}
            </div>
            <button onClick={() => copy(`${newCredential.email}\n${newCredential.password}`, "both")} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:underline">
              {copied === "both" ? <Check size={13} /> : <Copy size={13} />}{copied === "both" ? "Copied both" : "Copy email and password"}
            </button>
          </section>
        )}

        <StatStrip items={[
          { label: "Team accounts", value: employees.length - removed, Icon: UserRound, tone: "violet" },
          { label: "Active", value: active, Icon: ShieldCheck, tone: "emerald" },
          { label: "Suspended", value: suspended, Icon: KeyRound, tone: "amber" },
          { label: "Removed", value: removed, Icon: Trash2, tone: "rose" },
        ]} />

        {/* Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, phone or city" className={`${inputCls} pl-9`} />
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
            <button onClick={openAdd} className={btn.primary}><UserPlus size={16} /> Add team member</button>
          </div>

          <div className="admin-nav-scroll -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
            {tabs.map(([key, label, n]) => (
              <button key={key} onClick={() => setTab(key)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${tab === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === key ? "bg-white/20" : "bg-white"}`}>{n}</span>
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

                <Labeled label="Access to section">
                  <Select value={filters.section} onChange={(v) => setF({ section: v })} options={sectionOptions} />
                </Labeled>

                {hasDates && (
                  <Labeled label="Joined">
                    <Select value={filters.joined} onChange={(v) => setF({ joined: v })} options={JOINED_OPTIONS} searchable={false} />
                  </Labeled>
                )}

                <Labeled label="Sort by">
                  <Select value={filters.sort} onChange={(v) => setF({ sort: v })} options={SORT_OPTIONS} searchable={false} />
                </Labeled>
              </div>

              {(!hasCity || !hasState) && (
                <p className="mt-3 text-xs text-slate-400">{[!hasCity && "City", !hasState && "State"].filter(Boolean).join(" and ")} will filter once team accounts have {(!hasCity && !hasState) ? "these details" : "this detail"} saved.</p>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500"><b className="text-slate-900">{sorted.length}</b> team members match</p>
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-200/60" />)}</div>
        ) : !sorted.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <EmptyState icon={UserRound} title={tab === "deleted" ? "No removed team members" : employees.length ? "No matching team members" : "No team members yet"} text={employees.length ? "Try a different search, tab or filters." : "Click “Add team member” to create the first employee account."} />
            {employees.length > 0 && (query || pills.length > 0) && (
              <div className="-mt-3 pb-6 text-center">
                <button onClick={() => { setQuery(""); setFilters(DEFAULT_FILTERS); }} className={btn.ghost}>Clear search and filters</button>
              </div>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((employee) => {
              const s = stateOf(employee);
              return (
                <article key={employee.id} className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10 ${s === "active" ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"}`}>
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="flex items-start gap-3">
                    <Avatar name={employee.full_name} />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-extrabold text-slate-900">{employee.full_name}</h3>
                      <p className="truncate text-xs text-slate-400">Team member #{employee.id}</p>
                    </div>
                    <StateBadge user={employee} />
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-slate-700"><Mail size={14} className="shrink-0 text-slate-400" /><span className="truncate">{employee.email}</span></p>
                    <p className="flex items-center gap-2 text-slate-600"><Phone size={14} className="shrink-0 text-slate-400" />{employee.phone || "—"}</p>
                    {(employee.city || employee.state) && <p className="flex items-center gap-2 text-slate-600"><MapPin size={14} className="shrink-0 text-slate-400" />{[employee.city, employee.state].filter(Boolean).join(", ")}</p>}
                  </div>

                  <div className="mt-4">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Console access</span>
                    <div className="flex flex-wrap gap-1.5">{permissionChips(employee)}</div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">{actions(employee)}</div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr><th className="px-5 py-3">Member</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Console access</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visible.map((employee) => (
                    <tr key={employee.id} className={`align-top transition hover:bg-violet-50/40 ${employee.deleted_at || !employee.is_active ? "bg-slate-50/70" : ""}`}>
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><Avatar name={employee.full_name} size="h-10 w-10 text-sm" /><p className="truncate font-bold text-slate-900">{employee.full_name}</p></div></td>
                      <td className="px-3 py-3.5">
                        <p className="flex items-center gap-1.5 text-slate-700"><Mail size={13} className="text-slate-400" />{employee.email}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone size={13} className="text-slate-400" />{employee.phone || "—"}</p>
                      </td>
                      <td className="max-w-xs px-3 py-3.5"><div className="flex flex-wrap gap-1.5">{permissionChips(employee, 3)}</div></td>
                      <td className="px-3 py-3.5"><StateBadge user={employee} /></td>
                      <td className="px-5 py-3.5"><div className="flex flex-wrap justify-end gap-2">{actions(employee)}</div></td>
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
              Showing <b className="text-slate-900">{from}–{to}</b> of <b className="text-slate-900">{sorted.length}</b> team members
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-40"><Select compact searchable={false} value={pageSize} onChange={setPageSize} options={PAGE_SIZES} /></div>
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

        {/* Add team member */}
        <Modal open={addOpen} onClose={closeAdd} icon={UserPlus} title="Add team member" subtitle="Access can be changed or revoked later." wide>
          <form onSubmit={createEmployee} autoComplete="off">
            <div className="space-y-4 p-6">
              {formError && <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700"><AlertTriangle size={17} className="mt-0.5 shrink-0" />{formError}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <Labeled label="Full name">
                  <span className="relative block"><User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input required maxLength={120} autoComplete="off" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className={`${inputCls} pl-10`} /></span>
                </Labeled>
                <Labeled label="Work email">
                  <span className="relative block"><Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input required type="email" autoComplete="off" name="team-member-email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com" className={`${inputCls} pl-10`} /></span>
                </Labeled>
                <Labeled label="Phone (optional)">
                  <span className="relative block"><Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="off" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" className={`${inputCls} pl-10`} /></span>
                </Labeled>
                <PasswordField label="Temporary password" required value={form.password} onChange={(password) => setForm({ ...form, password })} placeholder="At least 12 characters" />
              </div>
              <SectionChips
                sections={sections}
                selected={form.permissions}
                onToggle={(key) => setForm((c) => ({ ...c, permissions: toggleKey(c.permissions, key) }))}
                onAll={() => setForm((c) => ({ ...c, permissions: allKeys }))}
                onClear={() => setForm((c) => ({ ...c, permissions: [] }))}
              />
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button type="button" onClick={closeAdd} className={cancelBtn}>Cancel</button>
              <button disabled={busy} className={`${btn.primary} disabled:opacity-60`}>{busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}{busy ? "Creating…" : "Create employee account"}</button>
            </div>
          </form>
        </Modal>

        {/* Edit access */}
        <Modal open={!!editing} onClose={closeEdit} icon={Pencil} title="Team settings" subtitle={editing?.email} wide>
          {editing && (
            <form onSubmit={saveEdit} autoComplete="off">
              <div className="space-y-4 p-6">
                {formError && <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700"><AlertTriangle size={17} className="mt-0.5 shrink-0" />{formError}</p>}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Labeled label="Display name">
                    <span className="relative block"><User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input required value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} className={`${inputCls} pl-10`} /></span>
                  </Labeled>
                  <Labeled label="Phone">
                    <span className="relative block"><Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input autoComplete="off" inputMode="tel" value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className={`${inputCls} pl-10`} /></span>
                  </Labeled>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Account active</p>
                    <p className="text-xs text-slate-500">Turn off to block console sign-in without removing the account.</p>
                  </div>
                  <Toggle on={Boolean(editing.is_active)} label={editing.is_active ? "Active" : "Suspended"} onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} />
                </div>

                <SectionChips
                  sections={sections}
                  selected={editPermissions}
                  onToggle={(key) => setEditPermissions((list) => toggleKey(list, key))}
                  onAll={() => setEditPermissions(allKeys)}
                  onClear={() => setEditPermissions([])}
                />

                <PasswordField label="Reset password (optional)" value={editPassword} onChange={setEditPassword} placeholder="Leave empty to keep current password" />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                <button type="button" onClick={closeEdit} className={cancelBtn}>Cancel</button>
                <button disabled={busy} className={`${btn.primary} disabled:opacity-60`}>{busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{busy ? "Saving…" : "Save access"}</button>
              </div>
            </form>
          )}
        </Modal>

        {/* Remove confirmation */}
        <Modal open={!!confirm} onClose={() => !busy && setConfirm(null)} title="Remove team member">
          {confirm && (
            <div className="p-6 sm:p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={26} /></span>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900">Remove {confirm.full_name}?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">They will lose console access immediately. You can restore them anytime from the Removed tab.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setConfirm(null)} disabled={busy} className={`${cancelBtn} disabled:opacity-50`}>Cancel</button>
                <button type="button" onClick={doRemove} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700 disabled:opacity-60">
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}{busy ? "Removing…" : "Remove member"}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AdminPageFrame>
  );
}