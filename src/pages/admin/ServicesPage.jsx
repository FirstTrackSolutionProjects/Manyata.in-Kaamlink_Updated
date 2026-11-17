import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BriefcaseBusiness, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, EyeOff, FolderTree,
  LayoutGrid, List as ListIcon, Pencil, Plus, Save, Search, SlidersHorizontal, Tags, X,
} from "lucide-react";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, EmptyState, Field, StatStrip, Toggle, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const EMPTY_DRAFT = { name: "", slug: "", category_id: "", description: "", base_price: "", duration_mins: "60" };
const DEFAULT_FILTERS = { category: "all", status: "all", minPrice: "", maxPrice: "", duration: "any", sort: "default" };

const PAGE_SIZES = [6, 9, 12, 24].map((n) => ({ value: n, label: `${n} per page` }));
const STATUS_OPTIONS = [["all", "All"], ["live", "Live"], ["hidden", "Hidden"]];
const DURATION_OPTIONS = [
  { value: "any", label: "Any duration" },
  { value: "short", label: "Up to 1 hour" },
  { value: "medium", label: "1 – 3 hours" },
  { value: "long", label: "Over 3 hours" },
];
const SORT_OPTIONS = [
  { value: "default", label: "Default order" },
  { value: "name_asc", label: "Name (A–Z)" },
  { value: "name_desc", label: "Name (Z–A)" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "dur_asc", label: "Duration: shortest" },
  { value: "dur_desc", label: "Duration: longest" },
];
const SORTERS = {
  name_asc: (a, b) => String(a.name).localeCompare(String(b.name)),
  name_desc: (a, b) => String(b.name).localeCompare(String(a.name)),
  price_asc: (a, b) => Number(a.base_price) - Number(b.base_price),
  price_desc: (a, b) => Number(b.base_price) - Number(a.base_price),
  dur_asc: (a, b) => Number(a.duration_mins) - Number(b.duration_mins),
  dur_desc: (a, b) => Number(b.duration_mins) - Number(a.duration_mins),
};

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

function Labeled({ label, children, className = "" }) {
  return (
    <div className={className}>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}

function Avatar({ name }) {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-base font-extrabold text-white shadow-md shadow-violet-600/20">
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

function Status({ on }) {
  return (
    <Badge tone={on ? "emerald" : "amber"}>
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-amber-500"}`} />
      {on ? "Live" : "Hidden"}
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

function Modal({ open, onClose, icon: Icon, title, subtitle, children }) {
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
      <div role="dialog" aria-modal="true" className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl">
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

function ServicesView({ data = {}, draft, setDraft, mutate }) {
  const categories = data.categories || [];
  const services = data.services || [];

  const [modal, setModal] = useState(null); // "add" | "categories" | "edit"
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [categoryDraft, setCategoryDraft] = useState({ name: "", slug: "", description: "" });
  const [catQuery, setCatQuery] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => { setPage(1); }, [query, filters, pageSize]);

  const setF = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const closeModal = () => { setModal(null); setEditing(null); setCatQuery(""); };
  const openEdit = (row) => {
    setEditing({ id: row.id, name: row.name, slug: row.slug, category_id: String(row.category_id), base_price: String(row.base_price), duration_mins: String(row.duration_mins) });
    setModal("edit");
  };

  const submit = (event) => {
    event.preventDefault();
    mutate("/admin/services", "POST", { ...draft, category_id: Number(draft.category_id), base_price: Number(draft.base_price), duration_mins: Number(draft.duration_mins) });
    setDraft(EMPTY_DRAFT);
    closeModal();
  };

  const saveEdit = (event) => {
    event.preventDefault();
    mutate(`/admin/services/${editing.id}`, "PATCH", { ...editing, category_id: Number(editing.category_id), base_price: Number(editing.base_price), duration_mins: Number(editing.duration_mins) });
    closeModal();
  };

  /* ---------- filtering, sorting, pagination ---------- */
  const countIn = (id) => services.filter((s) => String(s.category_id) === String(id)).length;
  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));
  const filterCategoryOptions = [{ value: "all", label: "All categories", hint: services.length }, ...categories.map((c) => ({ value: String(c.id), label: c.name, hint: countIn(c.id) }))];

  const q = query.trim().toLowerCase();
  const min = filters.minPrice === "" ? null : Number(filters.minPrice);
  const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);

  const matched = services.filter((s) => {
    if (filters.category !== "all" && String(s.category_id) !== filters.category) return false;
    if (filters.status === "live" && !s.is_active) return false;
    if (filters.status === "hidden" && s.is_active) return false;
    const price = Number(s.base_price);
    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;
    const d = Number(s.duration_mins);
    if (filters.duration === "short" && d > 60) return false;
    if (filters.duration === "medium" && (d <= 60 || d > 180)) return false;
    if (filters.duration === "long" && d <= 180) return false;
    return !q || `${s.name} ${s.slug} ${s.category?.name || ""}`.toLowerCase().includes(q);
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

  /* ---------- active filter pills ---------- */
  const pills = [];
  if (filters.category !== "all") pills.push({ key: "category", label: categories.find((c) => String(c.id) === filters.category)?.name || "Category", clear: { category: "all" } });
  if (filters.status !== "all") pills.push({ key: "status", label: filters.status === "live" ? "Live only" : "Hidden only", clear: { status: "all" } });
  if (min !== null || max !== null) pills.push({ key: "price", label: min !== null && max !== null ? `₹${min} – ₹${max}` : min !== null ? `From ₹${min}` : `Up to ₹${max}`, clear: { minPrice: "", maxPrice: "" } });
  if (filters.duration !== "any") pills.push({ key: "duration", label: DURATION_OPTIONS.find((o) => o.value === filters.duration)?.label, clear: { duration: "any" } });
  if (filters.sort !== "default") pills.push({ key: "sort", label: `Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}`, clear: { sort: "default" } });

  const live = services.filter((s) => s.is_active).length;
  const catTerm = catQuery.trim().toLowerCase();
  const shownCategories = categories.filter((c) => !catTerm || `${c.name} ${c.slug}`.toLowerCase().includes(catTerm));

  return (
    <div className="space-y-5">
      <StatStrip items={[
        { label: "Total services", value: services.length, Icon: BriefcaseBusiness, tone: "violet" },
        { label: "Live in catalog", value: live, Icon: CheckCircle2, tone: "emerald" },
        { label: "Hidden", value: services.length - live, Icon: EyeOff, tone: "amber" },
        { label: "Categories", value: categories.length, Icon: FolderTree, tone: "sky" },
      ]} />

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services by name, slug or category" className={`${inputCls} pl-9`} />
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
          <button onClick={() => setModal("categories")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"><Tags size={16} /> Categories</button>
          <button onClick={() => setModal("add")} className={btn.primary}><Plus size={16} /> Add service</button>
        </div>

        {filtersOpen && (
          <div className="mt-3 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-5">
            <Labeled label="Category">
              <Select value={filters.category} onChange={(v) => setF({ category: v })} options={filterCategoryOptions} />
            </Labeled>

            <Labeled label="Status">
              <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-100 p-1">
                {STATUS_OPTIONS.map(([key, label]) => (
                  <button key={key} type="button" onClick={() => setF({ status: key })} className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-bold transition ${filters.status === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}>{label}</button>
                ))}
              </div>
            </Labeled>

            <Labeled label="Price range (₹)">
              <div className="flex items-center gap-2">
                <input type="number" min="0" placeholder="Min" value={filters.minPrice} onChange={(e) => setF({ minPrice: e.target.value })} className={inputCls} />
                <span className="text-slate-400">–</span>
                <input type="number" min="0" placeholder="Max" value={filters.maxPrice} onChange={(e) => setF({ maxPrice: e.target.value })} className={inputCls} />
              </div>
            </Labeled>

            <Labeled label="Duration">
              <Select value={filters.duration} onChange={(v) => setF({ duration: v })} options={DURATION_OPTIONS} searchable={false} />
            </Labeled>

            <Labeled label="Sort by">
              <Select value={filters.sort} onChange={(v) => setF({ sort: v })} options={SORT_OPTIONS} searchable={false} />
            </Labeled>

            <div className="flex items-center justify-between gap-3 sm:col-span-2 xl:col-span-5">
              <p className="text-xs text-slate-500"><b className="text-slate-900">{sorted.length}</b> of {services.length} services match</p>
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

      {/* Results */}
      <div ref={resultsRef} className="scroll-mt-4" />

      {!sorted.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={BriefcaseBusiness} title={services.length ? "No matching services" : "No services yet"} text={services.length ? "Try a different search or change the filters." : "Click “Add service” to create your first one."} />
          {services.length > 0 && (query || pills.length > 0) && (
            <div className="-mt-3 pb-6 text-center">
              <button onClick={() => { setQuery(""); setFilters(DEFAULT_FILTERS); }} className={btn.ghost}>Clear search and filters</button>
            </div>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => (
            <article key={row.id} className={`group relative flex flex-col overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/10 ${row.is_active ? "border-slate-200 bg-white" : "border-dashed border-slate-300 bg-slate-50"}`}>
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={row.name} />
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-extrabold text-slate-900">{row.name}</h3>
                    <p className="truncate text-xs text-slate-400">{row.slug}</p>
                  </div>
                </div>
                <Status on={row.is_active} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {row.category?.name && <Badge tone="violet">{row.category.name}</Badge>}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"><Clock size={12} />{row.duration_mins} min</span>
              </div>

              <div className="mb-5 mt-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Starting at</p>
                <p className="text-2xl font-black tracking-tight text-slate-900">₹{Number(row.base_price).toLocaleString("en-IN")}</p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <Toggle on={!!row.is_active} label={row.is_active ? "Live" : "Hidden"} onClick={() => mutate(`/admin/services/${row.id}`, "PATCH", { is_active: !row.is_active })} />
                <button onClick={() => openEdit(row)} className={btn.ghost}><Pencil size={13} /> Edit</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr><th className="px-5 py-3">Service</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Price</th><th className="px-3 py-3">Duration</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((row) => (
                  <tr key={row.id} className="transition hover:bg-violet-50/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3"><Avatar name={row.name} /><div className="min-w-0"><p className="truncate font-bold text-slate-900">{row.name}</p><p className="truncate text-xs text-slate-400">{row.slug}</p></div></div>
                    </td>
                    <td className="px-3 py-3">{row.category?.name ? <Badge tone="violet">{row.category.name}</Badge> : "—"}</td>
                    <td className="px-3 py-3 font-extrabold text-slate-900">₹{Number(row.base_price).toLocaleString("en-IN")}</td>
                    <td className="px-3 py-3 text-slate-600">{row.duration_mins} min</td>
                    <td className="px-3 py-3"><Status on={row.is_active} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openEdit(row)} className={btn.ghost}><Pencil size={13} /> Edit</button>
                        <Toggle on={!!row.is_active} label={row.is_active ? "Hide" : "Publish"} onClick={() => mutate(`/admin/services/${row.id}`, "PATCH", { is_active: !row.is_active })} />
                      </div>
                    </td>
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
            Showing <b className="text-slate-900">{from}–{to}</b> of <b className="text-slate-900">{sorted.length}</b> services
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-40"><Select compact searchable={false} value={pageSize} onChange={setPageSize} options={PAGE_SIZES} /></div>
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

      {/* Add service modal */}
      <Modal open={modal === "add"} onClose={closeModal} icon={Plus} title="Add a service" subtitle="Create a new bookable service">
        <form onSubmit={submit}>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Field label="Service name"><input required placeholder="e.g. Deep Home Cleaning" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Slug"><input required placeholder="slug-like-this" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inputCls} /></Field>
            <Labeled label="Category" className="sm:col-span-2">
              <Select required value={draft.category_id} onChange={(v) => setDraft({ ...draft, category_id: v })} options={categoryOptions} placeholder="Select category" />
            </Labeled>
            <Field label="Starting price (₹)"><input required type="number" min="0" step="0.01" placeholder="499" value={draft.base_price} onChange={(e) => setDraft({ ...draft, base_price: e.target.value })} className={inputCls} /></Field>
            <Field label="Duration (minutes)"><input required type="number" min="1" max="1440" placeholder="60" value={draft.duration_mins} onChange={(e) => setDraft({ ...draft, duration_mins: e.target.value })} className={inputCls} /></Field>
            <Field label="Short description" className="sm:col-span-2"><input placeholder="What's included" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} /></Field>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <button type="button" onClick={closeModal} className={cancelBtn}>Cancel</button>
            <button className={btn.primary}><Plus size={16} /> Add service</button>
          </div>
        </form>
      </Modal>

      {/* Edit service modal */}
      <Modal open={modal === "edit" && !!editing} onClose={closeModal} icon={Pencil} title="Edit service" subtitle={editing?.name}>
        {editing && (
          <form onSubmit={saveEdit}>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Service name"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></Field>
              <Field label="Slug"><input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls} /></Field>
              <Labeled label="Category" className="sm:col-span-2">
                <Select required value={editing.category_id} onChange={(v) => setEditing({ ...editing, category_id: v })} options={categoryOptions} placeholder="Select category" />
              </Labeled>
              <Field label="Starting price (₹)"><input required type="number" min="0" step="0.01" value={editing.base_price} onChange={(e) => setEditing({ ...editing, base_price: e.target.value })} className={inputCls} /></Field>
              <Field label="Duration (minutes)"><input required type="number" min="1" max="1440" value={editing.duration_mins} onChange={(e) => setEditing({ ...editing, duration_mins: e.target.value })} className={inputCls} /></Field>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
              <button type="button" onClick={closeModal} className={cancelBtn}>Cancel</button>
              <button className={btn.primary}><Save size={16} /> Save changes</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Categories modal */}
      <Modal open={modal === "categories"} onClose={closeModal} icon={Tags} title="Categories" subtitle={`${categories.length} total`}>
        <form
          onSubmit={(e) => { e.preventDefault(); mutate("/admin/categories", "POST", categoryDraft); setCategoryDraft({ name: "", slug: "", description: "" }); }}
          className="grid gap-3 p-6"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Category name" value={categoryDraft.name} onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })} className={inputCls} />
            <input required placeholder="category-slug" value={categoryDraft.slug} onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} className={inputCls} />
          </div>
          <input placeholder="Description (optional)" value={categoryDraft.description} onChange={(e) => setCategoryDraft({ ...categoryDraft, description: e.target.value })} className={inputCls} />
          <div><button className={btn.dark}><Plus size={16} /> Add category</button></div>
        </form>

        <div className="sticky top-0 z-10 border-y border-slate-100 bg-white px-6 py-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={catQuery} onChange={(e) => setCatQuery(e.target.value)} placeholder="Search categories" className={`${inputCls} pl-9`} />
          </div>
          <p className="mt-2 text-xs text-slate-400">{shownCategories.length} of {categories.length} categories</p>
        </div>

        <div className="divide-y divide-slate-100">
          {shownCategories.map((category) => (
            <div key={category.id} className="flex items-center justify-between gap-3 px-6 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{category.name}</p>
                <p className="truncate text-xs text-slate-400">{category.slug} · {countIn(category.id)} {countIn(category.id) === 1 ? "service" : "services"}</p>
              </div>
              <Toggle on={!!category.is_active} label={category.is_active ? "Live" : "Hidden"} onClick={() => mutate(`/admin/categories/${category.id}`, "PATCH", { is_active: !category.is_active })} />
            </div>
          ))}
          {!shownCategories.length && <EmptyState icon={Tags} title={categories.length ? "No matching categories" : "No categories yet"} text={categories.length ? "Try a different search." : "Add your first category above."} />}
        </div>
      </Modal>
    </div>
  );
}

export default function ServicesPage() {
  const resource = useAdminSection("/admin/services");
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  return <AdminPageFrame title="Services" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <ServicesView data={resource.data} draft={draft} setDraft={setDraft} mutate={resource.mutate} />
  </AdminPageFrame>;
}