import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BadgeCheck, BriefcaseBusiness, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Eye, EyeOff, LayoutGrid,
  List as ListIcon, Mail, MapPin, Pencil, Phone, Plus, RefreshCw, Search, SlidersHorizontal, Trash2, UserCheck, UserPlus, Users, X,
} from "lucide-react";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, EmptyState, Field, StatStrip, Toggle, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const EMPTY_DRAFT = { full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", bio: "", category_ids: [] };
const DEFAULT_FILTERS = { verification: "all", availability: "all", account: "all", city: "all", minExp: "", sort: "default" };

const PAGE_SIZES = [6, 9, 12, 24].map((n) => ({ value: n, label: `${n} per page` }));
const AVAILABILITY_OPTIONS = [["all", "All"], ["available", "Available"], ["unavailable", "Unavailable"]];
const ACCOUNT_OPTIONS = [["all", "All"], ["active", "Active"], ["suspended", "Suspended"]];
const SORT_OPTIONS = [
  { value: "default", label: "Default order" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "exp_desc", label: "Experience: high to low" },
  { value: "exp_asc", label: "Experience: low to high" },
];
const nm = (r) => String(r.user?.full_name || "");
const SORTERS = {
  name_asc: (a, b) => nm(a).localeCompare(nm(b)),
  name_desc: (a, b) => nm(b).localeCompare(nm(a)),
  exp_desc: (a, b) => Number(b.experience_years) - Number(a.experience_years),
  exp_asc: (a, b) => Number(a.experience_years) - Number(b.experience_years),
};

const VERIFY = [["pending", "Pending"], ["verified", "Verified"], ["rejected", "Rejected"]];
const VERIFY_TONE = { pending: "amber", verified: "emerald", rejected: "rose" };
const VERIFY_ON = { pending: "bg-amber-500 text-white shadow", verified: "bg-emerald-500 text-white shadow", rejected: "bg-rose-500 text-white shadow" };

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
    <span className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-extrabold text-white shadow-md ring-2 ring-white ${size}`}>
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function VerifySeg({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Verification status" className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
      {VERIFY.map(([key, label]) => (
        <button
          key={key}
          type="button"
          role="radio"
          aria-checked={value === key}
          onClick={() => value !== key && onChange(key)}
          className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${value === key ? VERIFY_ON[key] : "text-slate-500 hover:text-slate-800"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function VerifyBadge({ status }) {
  const tone = VERIFY_TONE[status] || "slate";
  const dot = { amber: "bg-amber-500", emerald: "bg-emerald-500", rose: "bg-rose-500", slate: "bg-slate-400" }[tone];
  return (
    <Badge tone={tone}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {String(status || "pending").replace(/^\w/, (c) => c.toUpperCase())}
    </Badge>
  );
}

/* Custom dropdown: searchable, never clipped by modals, flips upward near the screen bottom */
function Select({ value, onChange, options, placeholder = "Select…", searchable, required, compact = false }) {
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

      {required && <input tabIndex={-1} aria-hidden="true" required value={value ?? ""} onChange={() => {}} className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0" />}

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
                  <span className="flex shrink-0 items-center gap-2">
                    {o.hint !== undefined && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{o.hint}</span>}
                    {on && <Check size={15} />}
                  </span>
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
      <div role="dialog" aria-modal="true" className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${wide ? "sm:max-w-2xl" : "sm:max-w-xl"}`}>
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-600/25"><Icon size={18} /></span>
            )}
            <div>
              <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"><X size={18} /></button>
        </header>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function ProfessionalsView({ data = {}, mutate }) {
  const categories = data.categories || [];
  const cities = data.cities || [];
  const all = data.professionals || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [showPw, setShowPw] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const resultsRef = useRef(null);

  const setF = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPage(1);
  };
  const closeModal = () => { setModalOpen(false); setShowPw(false); setEditing(null); };

  const openCreate = () => { setEditing(null); setDraft(EMPTY_DRAFT); setShowPw(false); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setDraft({
      full_name: row.user?.full_name || "", email: row.user?.email || "", phone: row.user?.phone || "",
      password: "", city_id: row.city_id ? String(row.city_id) : "", experience_years: String(row.experience_years ?? 0),
      bio: row.bio || "", category_ids: (row.categories || []).map((c) => Number(c.id)),
    });
    setShowPw(false);
    setModalOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    const body = { ...draft, city_id: draft.city_id || null, experience_years: Number(draft.experience_years) };
    const saved = editing
      ? await mutate(`/admin/professionals/${editing.id}`, "PATCH", body)
      : await mutate("/admin/professionals", "POST", body);
    if (!saved) return;
    setDraft(EMPTY_DRAFT);
    closeModal();
  };

  const toggleCategory = (id) => setDraft((cur) => ({ ...cur, category_ids: cur.category_ids.includes(id) ? cur.category_ids.filter((item) => item !== id) : [...cur.category_ids, id] }));

  const setVerification = (row, verification_status) => mutate(`/admin/professionals/${row.id}`, "PATCH", { verification_status });
  const setAvailable = (row) => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_available: !row.is_available });
  const setAccount = (row) => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_active: !row.user?.is_active });
  const deletePartner = async (row) => {
    const name = row.user?.full_name || "this partner";
    if (!window.confirm(`Remove ${name} from the active partner list? Their booking history will be retained.`)) return;
    await mutate(`/admin/professionals/${row.id}`, "DELETE", {});
  };

  /* ---------- filtering, sorting, pagination ---------- */
  const cityOptions = cities.map((c) => ({ value: String(c.id), label: `${c.name}, ${c.state}` }));
  const filterCityOptions = [{ value: "all", label: "All cities" }, ...cityOptions];
  const cityDraftOptions = [{ value: "", label: "No city (optional)" }, ...cityOptions];

  const q = query.trim().toLowerCase();
  const minExp = filters.minExp === "" ? null : Number(filters.minExp);

  const matched = all.filter((r) => {
    if (filters.verification !== "all" && r.verification_status !== filters.verification) return false;
    if (filters.availability === "available" && !r.is_available) return false;
    if (filters.availability === "unavailable" && r.is_available) return false;
    const active = !!r.user?.is_active;
    if (filters.account === "active" && !active) return false;
    if (filters.account === "suspended" && active) return false;
    if (filters.city !== "all" && String(r.city?.id ?? r.city_id ?? "") !== filters.city) return false;
    if (minExp !== null && Number(r.experience_years) < minExp) return false;
    return !q || `${r.user?.full_name || ""} ${r.user?.email || ""} ${r.user?.phone || ""} ${r.city?.name || ""}`.toLowerCase().includes(q);
  });
  const sorted = filters.sort === "default" ? matched : [...matched].sort(SORTERS[filters.sort]);

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

  /* ---------- active filter pills (verification lives in the tabs) ---------- */
  const pills = [];
  if (filters.availability !== "all") pills.push({ key: "availability", label: filters.availability === "available" ? "Available" : "Unavailable", clear: { availability: "all" } });
  if (filters.account !== "all") pills.push({ key: "account", label: filters.account === "active" ? "Active accounts" : "Suspended accounts", clear: { account: "all" } });
  if (filters.city !== "all") pills.push({ key: "city", label: cityOptions.find((o) => o.value === filters.city)?.label || "City", clear: { city: "all" } });
  if (minExp !== null) pills.push({ key: "exp", label: `${minExp}+ yrs experience`, clear: { minExp: "" } });
  if (filters.sort !== "default") pills.push({ key: "sort", label: `Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}`, clear: { sort: "default" } });
  const resetPanel = () => {
    setFilters((f) => ({ ...DEFAULT_FILTERS, verification: f.verification }));
    setPage(1);
  };

  const count = (s) => all.filter((p) => p.verification_status === s).length;
  const tabs = [["all", "All", all.length], ["pending", "Pending", count("pending")], ["verified", "Verified", count("verified")], ["rejected", "Rejected", count("rejected")]];

  return (
    <div className="space-y-5">
      <StatStrip items={[
        { label: "Total partners", value: all.length, Icon: Users, tone: "violet" },
        { label: "Verified", value: count("verified"), Icon: BadgeCheck, tone: "emerald" },
        { label: "Pending approval", value: count("pending"), Icon: Clock3, tone: "amber" },
        { label: "Available now", value: all.filter((p) => p.is_available).length, Icon: UserCheck, tone: "sky" },
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
          <button onClick={openCreate} className={btn.primary}><UserPlus size={16} /> Onboard partner</button>
        </div>

        {/* Verification tabs */}
        <div className="admin-nav-scroll -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {tabs.map(([key, label, n]) => (
            <button key={key} onClick={() => setF({ verification: key })} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${filters.verification === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filters.verification === key ? "bg-white/20" : "bg-white"}`}>{n}</span>
            </button>
          ))}
        </div>

        {filtersOpen && (
          <div className="mt-3 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-5">
            <Labeled label="Availability">
              <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                {AVAILABILITY_OPTIONS.map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setF({ availability: key })} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition ${filters.availability === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
                ))}
              </div>
            </Labeled>

            <Labeled label="Account">
              <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                {ACCOUNT_OPTIONS.map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setF({ account: key })} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition ${filters.account === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
                ))}
              </div>
            </Labeled>

            <Labeled label="City">
              <Select value={filters.city} onChange={(v) => setF({ city: v })} options={filterCityOptions} />
            </Labeled>

            <Labeled label="Min. experience (years)">
              <input type="number" min="0" max="80" placeholder="e.g. 3" value={filters.minExp} onChange={(e) => setF({ minExp: e.target.value })} className={inputCls} />
            </Labeled>

            <Labeled label="Sort by">
              <Select value={filters.sort} onChange={(v) => setF({ sort: v })} options={SORT_OPTIONS} searchable={false} />
            </Labeled>

            <div className="flex items-center justify-between gap-3 sm:col-span-2 xl:col-span-5">
              <p className="text-xs text-slate-500"><b className="text-slate-900">{sorted.length}</b> of {all.length} partners match</p>
              <button onClick={resetPanel} disabled={!pills.length} className={`${btn.ghost} disabled:cursor-not-allowed disabled:opacity-40`}>Reset filters</button>
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
            <button onClick={resetPanel} className="ml-1 text-xs font-bold text-slate-500 underline-offset-2 hover:text-violet-700 hover:underline">Clear all</button>
          </div>
        )}
      </div>

      {/* Results */}
      <div ref={resultsRef} className="scroll-mt-4" />

      {!sorted.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={Users} title={all.length ? "No matching partners" : "No partners yet"} text={all.length ? "Try a different search, tab or filters." : "Click “Onboard partner” to add your first one."} />
          {all.length > 0 && (query || pills.length > 0 || filters.verification !== "all") && (
            <div className="-mt-3 pb-6 text-center">
              <button onClick={() => { setQuery(""); setFilters(DEFAULT_FILTERS); setPage(1); }} className={btn.ghost}>Clear search and filters</button>
            </div>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const active = !!row.user?.is_active;
            return (
              <article key={row.id} className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10 ${active ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"}`}>
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="flex items-start gap-3">
                  <Avatar name={row.user?.full_name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-extrabold text-slate-900">{row.user?.full_name || "—"}</h3>
                    <p className="flex items-center gap-1.5 truncate text-xs text-slate-400"><Mail size={12} className="shrink-0" />{row.user?.email}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <VerifyBadge status={row.verification_status} />
                  {!active && <Badge tone="rose">Suspended</Badge>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"><MapPin size={12} />{row.city?.name || "No city"}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"><BriefcaseBusiness size={12} />{row.experience_years} yrs</span>
                  {row.user?.phone && <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"><Phone size={12} />{row.user.phone}</span>}
                </div>

                <div className="mt-5">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">Verification</span>
                  <VerifySeg value={row.verification_status} onChange={(s) => setVerification(row, s)} />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <Toggle on={!!row.is_available} label={row.is_available ? "Available" : "Unavailable"} onClick={() => setAvailable(row)} />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.user?.full_name}`} title="Edit partner" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-violet-300 hover:text-violet-700"><Pencil size={14} /> Edit</button>
                    <button type="button" onClick={() => deletePartner(row)} aria-label={`Remove ${row.user?.full_name}`} title="Remove partner" className="grid h-9 w-9 place-items-center rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 size={15} /></button>
                    <button onClick={() => setAccount(row)} className={active ? btn.danger : btn.success}>{active ? "Suspend" : "Restore"}</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr><th className="px-5 py-3">Partner</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">Experience</th><th className="px-3 py-3">Verification</th><th className="px-3 py-3">Availability</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((row) => {
                  const active = !!row.user?.is_active;
                  return (
                    <tr key={row.id} className={`transition hover:bg-violet-50/40 ${active ? "" : "bg-slate-50/70"}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={row.user?.full_name} size="h-10 w-10 text-sm" />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-900">{row.user?.full_name || "—"}</p>
                            <p className="truncate text-xs text-slate-400">{row.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600"><span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{row.city?.name || "—"}</span></td>
                      <td className="px-3 py-3 font-semibold text-slate-700">{row.experience_years} yrs</td>
                      <td className="w-72 px-3 py-3"><VerifySeg value={row.verification_status} onChange={(s) => setVerification(row, s)} /></td>
                      <td className="px-3 py-3"><Toggle on={!!row.is_available} label={row.is_available ? "Available" : "Unavailable"} onClick={() => setAvailable(row)} /></td>
                      <td className="px-5 py-3 text-right"><div className="inline-flex items-center gap-2"><button type="button" onClick={() => openEdit(row)} aria-label={`Edit ${row.user?.full_name}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-violet-300 hover:text-violet-700"><Pencil size={13} /> Edit</button><button type="button" onClick={() => deletePartner(row)} aria-label={`Remove ${row.user?.full_name}`} className="grid h-9 w-9 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"><Trash2 size={14} /></button><button onClick={() => setAccount(row)} className={active ? btn.danger : btn.success}>{active ? "Suspend" : "Restore"}</button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Showing <b className="text-slate-900">{from}–{to}</b> of <b className="text-slate-900">{sorted.length}</b> partners
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-40"><Select compact searchable={false} value={pageSize} onChange={(size) => { setPageSize(size); setPage(1); }} options={PAGE_SIZES} /></div>
            {totalPages > 1 && (
              <nav className="flex items-center gap-1.5" aria-label="Pagination">
                <button onClick={() => goTo(current - 1)} disabled={current === 1} className={`${pgBtn} ${pgIdle}`}><ChevronLeft size={16} /><span className="hidden sm:inline">Prev</span></button>
                {pageList(current, totalPages).map((n, i) =>
                  n === "…" ? (
                    <span key={`gap-${i}`} className="px-1 text-slate-400">…</span>
                  ) : (
                    <button key={n} onClick={() => goTo(n)} aria-current={n === current ? "page" : undefined} className={`${pgBtn} ${n === current ? pgOn : pgIdle}`}>{n}</button>
                  )
                )}
                <button onClick={() => goTo(current + 1)} disabled={current === totalPages} className={`${pgBtn} ${pgIdle}`}><span className="hidden sm:inline">Next</span><ChevronRight size={16} /></button>
              </nav>
            )}
          </div>
        </div>
      )}

      {/* Onboard modal */}
      <Modal open={modalOpen} onClose={closeModal} icon={editing ? Pencil : UserPlus} title={editing ? "Edit partner" : "Onboard a partner"} subtitle={editing ? "Update the partner profile, login, city and skills." : "New accounts start pending and unavailable until approved."} wide>
        <form onSubmit={submit}>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Field label="Full name"><input required maxLength="120" placeholder="Full name" value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} className={inputCls} /></Field>
            <Field label="Email"><input required type="email" placeholder="name@example.com" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} /></Field>
            <Field label="Phone"><input placeholder="Phone number" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputCls} /></Field>
            <Field label="Experience (years)"><input type="number" min="0" max="80" placeholder="0" value={draft.experience_years} onChange={(e) => setDraft({ ...draft, experience_years: e.target.value })} className={inputCls} /></Field>

            <Labeled label="City">
              <Select value={draft.city_id} onChange={(v) => setDraft({ ...draft, city_id: v })} options={cityDraftOptions} placeholder="Choose city (optional)" />
            </Labeled>

            <Labeled label={editing ? "New password (optional)" : "Temporary password"}>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <input required={!editing} type={showPw ? "text" : "password"} minLength="12" autoComplete="new-password" placeholder={editing ? "Leave blank to keep current password" : "12+ characters"} value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} className={`${inputCls} pr-11`} />
                  <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button type="button" onClick={() => { setDraft({ ...draft, password: genPassword() }); setShowPw(true); }} title="Generate a strong password" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
                  <RefreshCw size={14} /> Generate
                </button>
              </div>
            </Labeled>

            <div className="sm:col-span-2"><Field label="Partner bio"><textarea maxLength="10000" rows="3" placeholder="Experience, specialties, or introduction" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} className={inputCls} /></Field></div>

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className={`${labelCls} !mb-0`}>Skills / categories <span className="ml-1 normal-case tracking-normal text-slate-400">({draft.category_ids.length} selected)</span></span>
                {categories.length > 0 && (
                  <div className="flex gap-3 text-xs font-bold">
                    <button type="button" onClick={() => setDraft({ ...draft, category_ids: categories.map((c) => c.id) })} className="text-violet-700 hover:underline">Select all</button>
                    <button type="button" onClick={() => setDraft({ ...draft, category_ids: [] })} className="text-slate-500 hover:underline">Clear</button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const on = draft.category_ids.includes(category.id);
                  return (
                    <label key={category.id} className={`inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${on ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25" : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700"}`}>
                      <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleCategory(category.id)} />
                      {on && <Check size={14} />}
                      {category.name}
                    </label>
                  );
                })}
                {!categories.length && <p className="text-xs text-slate-400">No categories yet. Add categories from the Services page first.</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <button type="button" onClick={closeModal} className={cancelBtn}>Cancel</button>
            <button className={btn.primary}>{editing ? <Pencil size={16} /> : <Plus size={16} />}{editing ? "Save changes" : "Create partner account"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function ProfessionalsPage() {
  const resource = useAdminSection("/admin/professionals");
  return <AdminPageFrame title="Partners" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <ProfessionalsView data={resource.data} mutate={resource.mutate} />
  </AdminPageFrame>;
}
