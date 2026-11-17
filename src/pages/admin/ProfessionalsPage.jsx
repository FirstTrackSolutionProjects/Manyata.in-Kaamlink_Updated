import { useState } from "react";
import { BadgeCheck, Check, Clock3, MapPin, Plus, UserCheck, UserPlus, Users } from "lucide-react";
import { SearchBox, StatusSelect } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Card, EmptyState, Field, StatStrip, Toggle, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

function ProfessionalsView({ data = {}, rows, mutate, search, setSearch }) {
  const [draft, setDraft] = useState({ full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", category_ids: [] });
  const categories = data.categories || [];
  const cities = data.cities || [];
  const all = data.professionals || [];

  const submit = (event) => {
    event.preventDefault();
    mutate("/admin/professionals", "POST", { ...draft, city_id: draft.city_id || null, experience_years: Number(draft.experience_years) });
    setDraft({ full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", category_ids: [] });
  };
  const toggleCategory = (id) => setDraft((current) => ({ ...current, category_ids: current.category_ids.includes(id) ? current.category_ids.filter((item) => item !== id) : [...current.category_ids, id] }));

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: "Total professionals", value: all.length, Icon: Users, tone: "violet" },
        { label: "Verified", value: all.filter((p) => p.verification_status === "verified").length, Icon: BadgeCheck, tone: "emerald" },
        { label: "Pending approval", value: all.filter((p) => p.verification_status === "pending").length, Icon: Clock3, tone: "amber" },
        { label: "Available now", value: all.filter((p) => p.is_available).length, Icon: UserCheck, tone: "sky" },
      ]} />

      <Card icon={UserPlus} title="Onboard a professional" subtitle="New accounts start pending and unavailable until approved.">
        <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Full name"><input required placeholder="Full name" value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} className={inputCls} /></Field>
          <Field label="Email"><input required type="email" placeholder="name@example.com" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} /></Field>
          <Field label="Phone"><input placeholder="Phone number" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputCls} /></Field>
          <Field label="Temporary password"><input required type="password" minLength="12" autoComplete="new-password" placeholder="12+ characters" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} className={inputCls} /></Field>
          <Field label="City">
            <select value={draft.city_id} onChange={(e) => setDraft({ ...draft, city_id: e.target.value })} className={inputCls}>
              <option value="">Choose city (optional)</option>
              {cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.state}</option>)}
            </select>
          </Field>
          <Field label="Experience (years)"><input type="number" min="0" max="80" value={draft.experience_years} onChange={(e) => setDraft({ ...draft, experience_years: e.target.value })} placeholder="0" className={inputCls} /></Field>

          <div className="sm:col-span-2 xl:col-span-3">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Skills / categories</span>
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
            </div>
          </div>

          <div className="sm:col-span-2 xl:col-span-3"><button className={btn.primary}><Plus size={16} /> Create professional account</button></div>
        </form>
      </Card>

      <Card icon={BadgeCheck} title="Professional approvals" subtitle={`${rows.length} of ${all.length} professionals`} tools={<SearchBox value={search} onChange={setSearch} />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Professional</th><th className="px-3 py-3">Location</th><th className="px-3 py-3">Experience</th><th className="px-3 py-3">Verification</th><th className="px-3 py-3">Availability</th><th className="px-5 py-3 text-right">Account</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-violet-50/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-extrabold text-white ring-2 ring-white shadow-md">{(row.user?.full_name || "?").charAt(0).toUpperCase()}</span>
                      <div className="min-w-0"><p className="truncate font-bold text-slate-900">{row.user?.full_name || "—"}</p><p className="truncate text-xs text-slate-400">{row.user?.email}</p></div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600"><span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-slate-400" />{row.city?.name || "—"}</span></td>
                  <td className="px-3 py-3.5 font-semibold text-slate-700">{row.experience_years} yrs</td>
                  <td className="px-3 py-3.5"><StatusSelect value={row.verification_status} options={["pending", "verified", "rejected"]} onChange={(verification_status) => mutate(`/admin/professionals/${row.id}`, "PATCH", { verification_status })} /></td>
                  <td className="px-3 py-3.5"><Toggle on={!!row.is_available} label={row.is_available ? "Available" : "Unavailable"} onClick={() => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_available: !row.is_available })} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_active: !row.user?.is_active })} className={row.user?.is_active ? btn.danger : btn.success}>{row.user?.is_active ? "Suspend" : "Restore"}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <EmptyState icon={Users} title="No professional profiles found" text="Onboard a professional above, or try a different search." />}
      </Card>
    </div>
  );
}

export default function ProfessionalsPage() {
  const resource = useAdminSection("/admin/professionals");
  const [search, setSearch] = useState("");
  return <AdminPageFrame title="Professionals" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <ProfessionalsView data={resource.data} rows={filterRows(resource.data?.professionals, search, ["user.full_name", "user.email", "verification_status"])} mutate={resource.mutate} search={search} setSearch={setSearch} />
  </AdminPageFrame>;
}
