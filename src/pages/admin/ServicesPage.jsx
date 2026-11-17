import { useState } from "react";
import { BriefcaseBusiness, CheckCircle2, Clock, EyeOff, FolderTree, Pencil, Plus, Save, Search, Tags, X } from "lucide-react";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, Card, EmptyState, Field, StatStrip, Toggle, inputCls, inputSmCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

function ServicesView({ data = {}, draft, setDraft, mutate }) {
  const categories = data.categories || [];
  const services = data.services || [];
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryDraft, setCategoryDraft] = useState({ name: "", slug: "", description: "" });

  const submit = (event) => {
    event.preventDefault();
    mutate("/admin/services", "POST", { ...draft, category_id: Number(draft.category_id), base_price: Number(draft.base_price), duration_mins: Number(draft.duration_mins) });
    setDraft({ name: "", slug: "", category_id: "", description: "", base_price: "", duration_mins: "60" });
  };

  const live = services.filter((s) => s.is_active).length;
  const q = query.trim().toLowerCase();
  const shown = services.filter((s) => !q || `${s.name} ${s.slug} ${s.category?.name || ""}`.toLowerCase().includes(q));

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: "Total services", value: services.length, Icon: BriefcaseBusiness, tone: "violet" },
        { label: "Live in catalog", value: live, Icon: CheckCircle2, tone: "emerald" },
        { label: "Hidden", value: services.length - live, Icon: EyeOff, tone: "amber" },
        { label: "Categories", value: categories.length, Icon: FolderTree, tone: "sky" },
      ]} />

      <div className="grid gap-6 xl:grid-cols-5">
        <Card icon={Plus} title="Add a service" subtitle="Create a new bookable service" className="xl:col-span-3">
          <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Service name"><input required placeholder="e.g. Deep Home Cleaning" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} /></Field>
            <Field label="Slug"><input required placeholder="slug-like-this" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className={inputCls} /></Field>
            <Field label="Category">
              <select required value={draft.category_id} onChange={(e) => setDraft({ ...draft, category_id: e.target.value })} className={inputCls}>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </Field>
            <Field label="Starting price (₹)"><input required type="number" min="0" step="0.01" placeholder="499" value={draft.base_price} onChange={(e) => setDraft({ ...draft, base_price: e.target.value })} className={inputCls} /></Field>
            <Field label="Duration (minutes)"><input required type="number" min="1" max="1440" placeholder="60" value={draft.duration_mins} onChange={(e) => setDraft({ ...draft, duration_mins: e.target.value })} className={inputCls} /></Field>
            <Field label="Short description"><input placeholder="What's included" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} /></Field>
            <div className="sm:col-span-2"><button className={btn.primary}><Plus size={16} /> Add service</button></div>
          </form>
        </Card>

        <Card icon={Tags} title="Categories" subtitle={`${categories.length} total`} className="xl:col-span-2">
          <form
            onSubmit={(e) => { e.preventDefault(); mutate("/admin/categories", "POST", categoryDraft); setCategoryDraft({ name: "", slug: "", description: "" }); }}
            className="grid gap-3 border-b border-slate-100 p-5"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Category name" value={categoryDraft.name} onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })} className={inputCls} />
              <input required placeholder="category-slug" value={categoryDraft.slug} onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} className={inputCls} />
            </div>
            <input placeholder="Description (optional)" value={categoryDraft.description} onChange={(e) => setCategoryDraft({ ...categoryDraft, description: e.target.value })} className={inputCls} />
            <div><button className={btn.dark}><Plus size={16} /> Add category</button></div>
          </form>
          <div className="max-h-[300px] divide-y divide-slate-100 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">{category.name}</p>
                  <p className="truncate text-xs text-slate-400">{category.slug}</p>
                </div>
                <Toggle on={!!category.is_active} label={category.is_active ? "Live" : "Hidden"} onClick={() => mutate(`/admin/categories/${category.id}`, "PATCH", { is_active: !category.is_active })} />
              </div>
            ))}
            {!categories.length && <EmptyState icon={Tags} title="No categories yet" text="Add your first category above." />}
          </div>
        </Card>
      </div>

      <Card
        icon={BriefcaseBusiness}
        title="Service catalog"
        subtitle={`${shown.length} of ${services.length} services`}
        tools={
          <div className="relative w-full sm:w-64">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services" className={`${inputCls} pl-9`} />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Service</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Price</th><th className="px-3 py-3">Duration</th><th className="px-3 py-3">Visibility</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((row) => (
                <tr key={row.id} className="transition hover:bg-violet-50/40">
                  {editing?.id === row.id ? (
                    <>
                      <td className="space-y-2 px-5 py-3">
                        <input aria-label="Service name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={`${inputSmCls} w-44`} />
                        <input aria-label="Service slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={`${inputSmCls} w-44`} />
                      </td>
                      <td className="px-3 py-3">
                        <select value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })} className={inputSmCls}>
                          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3"><input type="number" min="0" step="0.01" value={editing.base_price} onChange={(e) => setEditing({ ...editing, base_price: e.target.value })} className={`${inputSmCls} w-24`} /></td>
                      <td className="px-3 py-3"><input type="number" min="1" max="1440" value={editing.duration_mins} onChange={(e) => setEditing({ ...editing, duration_mins: e.target.value })} className={`${inputSmCls} w-20`} /></td>
                      <td className="px-3 py-3"><Badge tone={row.is_active ? "emerald" : "amber"}>{row.is_active ? "Live" : "Hidden"}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { mutate(`/admin/services/${row.id}`, "PATCH", { ...editing, category_id: Number(editing.category_id), base_price: Number(editing.base_price), duration_mins: Number(editing.duration_mins) }); setEditing(null); }} className={btn.success}><Save size={14} /> Save</button>
                          <button onClick={() => setEditing(null)} className={btn.ghost}><X size={14} /> Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-extrabold text-white shadow-md shadow-violet-600/20">{(row.name || "?").charAt(0).toUpperCase()}</span>
                          <div className="min-w-0"><p className="truncate font-bold text-slate-900">{row.name}</p><p className="truncate text-xs text-slate-400">{row.slug}</p></div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">{row.category?.name ? <Badge tone="violet">{row.category.name}</Badge> : "—"}</td>
                      <td className="px-3 py-3.5 font-extrabold text-slate-900">₹{Number(row.base_price).toLocaleString("en-IN")}</td>
                      <td className="px-3 py-3.5 text-slate-600"><span className="inline-flex items-center gap-1.5"><Clock size={14} className="text-slate-400" />{row.duration_mins} min</span></td>
                      <td className="px-3 py-3.5"><Badge tone={row.is_active ? "emerald" : "amber"}><span className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-amber-500"}`} />{row.is_active ? "Live" : "Hidden"}</Badge></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => setEditing({ id: row.id, name: row.name, slug: row.slug, category_id: String(row.category_id), base_price: String(row.base_price), duration_mins: String(row.duration_mins) })} className={btn.ghost}><Pencil size={13} /> Edit</button>
                          <Toggle on={!!row.is_active} label={row.is_active ? "Hide" : "Publish"} onClick={() => mutate(`/admin/services/${row.id}`, "PATCH", { is_active: !row.is_active })} />
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!shown.length && <EmptyState icon={BriefcaseBusiness} title={services.length ? "No matching services" : "No services yet"} text={services.length ? "Try a different search." : "Add your first service using the form above."} />}
      </Card>
    </div>
  );
}

export default function ServicesPage() {
  const resource = useAdminSection("/admin/services");
  const [draft, setDraft] = useState({ name: "", slug: "", category_id: "", description: "", base_price: "", duration_mins: "60" });
  return <AdminPageFrame title="Services" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <ServicesView data={resource.data} draft={draft} setDraft={setDraft} mutate={resource.mutate} />
  </AdminPageFrame>;
}
