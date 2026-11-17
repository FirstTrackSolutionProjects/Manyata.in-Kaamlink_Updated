import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BriefcaseBusiness, CheckCircle2, Clock, EyeOff, FolderTree, LayoutGrid, List as ListIcon, Pencil, Plus, Save, Search, Tags, X } from "lucide-react";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, EmptyState, Field, StatStrip, Toggle, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const PAGE = 9;
const EMPTY_DRAFT = { name: "", slug: "", category_id: "", description: "", base_price: "", duration_mins: "60" };
const cancelBtn = "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50";

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
  const [catFilter, setCatFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [limit, setLimit] = useState(PAGE);
  const [categoryDraft, setCategoryDraft] = useState({ name: "", slug: "", description: "" });

  const closeModal = () => { setModal(null); setEditing(null); };
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

  const live = services.filter((s) => s.is_active).length;
  const q = query.trim().toLowerCase();
  const shown = services.filter((s) =>
    (catFilter === "all" || String(s.category_id) === catFilter) &&
    (!q || `${s.name} ${s.slug} ${s.category?.name || ""}`.toLowerCase().includes(q))
  );
  const visible = shown.slice(0, limit);
  const countIn = (id) => services.filter((s) => String(s.category_id) === String(id)).length;

  const Avatar = ({ name }) => (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-base font-extrabold text-white shadow-md shadow-violet-600/20">{(name || "?").charAt(0).toUpperCase()}</span>
  );
  const Status = ({ on }) => (
    <Badge tone={on ? "emerald" : "amber"}><span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-amber-500"}`} />{on ? "Live" : "Hidden"}</Badge>
  );

  return (
    <div className="space-y-5">
      <StatStrip items={[
        { label: "Total services", value: services.length, Icon: BriefcaseBusiness, tone: "violet" },
        { label: "Live in catalog", value: live, Icon: CheckCircle2, tone: "emerald" },
        { label: "Hidden", value: services.length - live, Icon: EyeOff, tone: "amber" },
        { label: "Categories", value: categories.length, Icon: FolderTree, tone: "sky" },
      ]} />

      {/* Toolbar */}
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE); }} placeholder="Search services by name, slug or category" className={`${inputCls} pl-9`} />
          </div>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
            {[["grid", LayoutGrid], ["list", ListIcon]].map(([key, Icon]) => (
              <button key={key} onClick={() => setView(key)} aria-label={`${key} view`} className={`grid h-8 w-9 place-items-center rounded-lg transition ${view === key ? "bg-white text-violet-700 shadow" : "text-slate-500 hover:text-slate-800"}`}><Icon size={16} /></button>
            ))}
          </div>
          <button onClick={() => setModal("categories")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"><Tags size={16} /> Categories</button>
          <button onClick={() => setModal("add")} className={btn.primary}><Plus size={16} /> Add service</button>
        </div>

        <div className="admin-nav-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {[["all", "All services", services.length], ...categories.map((c) => [String(c.id), c.name, countIn(c.id)])].map(([key, label, count]) => (
            <button key={key} onClick={() => { setCatFilter(key); setLimit(PAGE); }} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${catFilter === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${catFilter === key ? "bg-white/20" : "bg-white"}`}>{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {!shown.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <EmptyState icon={BriefcaseBusiness} title={services.length ? "No matching services" : "No services yet"} text={services.length ? "Try a different search or category." : "Click “Add service” to create your first one."} />
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

      {shown.length > limit && (
        <div className="flex justify-center">
          <button onClick={() => setLimit((l) => l + PAGE)} className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700">
            Show more ({shown.length - limit} left)
          </button>
        </div>
      )}

      {/* Add service modal */}
      <Modal open={modal === "add"} onClose={closeModal} icon={Plus} title="Add a service" subtitle="Create a new bookable service">
        <form onSubmit={submit}>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <Field label="Service name"><input required placeholder="e.g. Deep Home Cleaning" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Slug"><input required placeholder="slug-like-this" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inputCls} /></Field>
            <Field label="Category" className="sm:col-span-2">
              <select required value={draft.category_id} onChange={(e) => setDraft({ ...draft, category_id: e.target.value })} className={inputCls}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </Field>
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
              <Field label="Category" className="sm:col-span-2">
                <select required value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })} className={inputCls}>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </Field>
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
          className="grid gap-3 border-b border-slate-100 p-6"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Category name" value={categoryDraft.name} onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })} className={inputCls} />
            <input required placeholder="category-slug" value={categoryDraft.slug} onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} className={inputCls} />
          </div>
          <input placeholder="Description (optional)" value={categoryDraft.description} onChange={(e) => setCategoryDraft({ ...categoryDraft, description: e.target.value })} className={inputCls} />
          <div><button className={btn.dark}><Plus size={16} /> Add category</button></div>
        </form>
        <div className="divide-y divide-slate-100">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between gap-3 px-6 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">{category.name}</p>
                <p className="truncate text-xs text-slate-400">{category.slug} · {countIn(category.id)} services</p>
              </div>
              <Toggle on={!!category.is_active} label={category.is_active ? "Live" : "Hidden"} onClick={() => mutate(`/admin/categories/${category.id}`, "PATCH", { is_active: !category.is_active })} />
            </div>
          ))}
          {!categories.length && <EmptyState icon={Tags} title="No categories yet" text="Add your first category above." />}
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