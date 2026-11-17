import { useState } from "react";
import { Plus } from "lucide-react";
import { Empty, Panel, SearchBox, StatusSelect } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function ProfessionalsView({ data = {}, rows, mutate, search, setSearch }) {
  const [draft, setDraft] = useState({ full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", category_ids: [] });
  const categories = data.categories || [];
  const cities = data.cities || [];
  const submit = (event) => {
    event.preventDefault();
    mutate("/admin/professionals", "POST", { ...draft, city_id: draft.city_id || null, experience_years: Number(draft.experience_years) });
    setDraft({ full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", category_ids: [] });
  };
  const toggleCategory = (id) => setDraft((current) => ({ ...current, category_ids: current.category_ids.includes(id) ? current.category_ids.filter((item) => item !== id) : [...current.category_ids, id] }));
  return <div className="space-y-5">
    <Panel title="Onboard a professional"><form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
      <input required placeholder="Full name" value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <input required type="email" placeholder="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <input placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <input required type="password" minLength="12" autoComplete="new-password" placeholder="Temporary password (12+ chars)" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <select value={draft.city_id} onChange={(e) => setDraft({ ...draft, city_id: e.target.value })} className="rounded-xl border p-3 text-sm"><option value="">Choose city (optional)</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.state}</option>)}</select>
      <input type="number" min="0" max="80" value={draft.experience_years} onChange={(e) => setDraft({ ...draft, experience_years: e.target.value })} placeholder="Experience years" className="rounded-xl border p-3 text-sm" />
      <div className="flex flex-wrap gap-3 sm:col-span-2 xl:col-span-3">{categories.map((category) => <label key={category.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"><input type="checkbox" checked={draft.category_ids.includes(category.id)} onChange={() => toggleCategory(category.id)} />{category.name}</label>)}</div>
      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white"><Plus size={16} /> Create professional account</button>
      <p className="self-center text-xs text-slate-500">New accounts start pending and unavailable until approved.</p>
    </form></Panel>
    <Panel title="Professional approvals" tools={<SearchBox value={search} onChange={setSearch} />}><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Professional</th><th className="p-3">Location</th><th className="p-3">Experience</th><th className="p-3">Verification</th><th className="p-3">Availability</th><th className="p-3">Account</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.user?.full_name || "—"}<small className="block font-normal text-slate-500">{row.user?.email}</small></td><td className="p-3">{row.city?.name || "—"}</td><td className="p-3">{row.experience_years} yrs</td><td className="p-3"><StatusSelect value={row.verification_status} options={["pending", "verified", "rejected"]} onChange={(verification_status) => mutate(`/admin/professionals/${row.id}`, "PATCH", { verification_status })} /></td><td className="p-3"><button onClick={() => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_available: !row.is_available })} className="font-bold text-violet-700">{row.is_available ? "Available" : "Unavailable"}</button></td><td className="p-3"><button onClick={() => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_active: !row.user?.is_active })} className="rounded-lg border px-3 py-1.5 text-xs font-bold">{row.user?.is_active ? "Suspend" : "Restore"}</button></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No professional profiles found.</Empty></div>}</Panel>
  </div>;
}

export default function ProfessionalsPage() {
  const resource = useAdminSection("/admin/professionals");
  const [search, setSearch] = useState("");
  return <AdminPageFrame title="Professionals" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <ProfessionalsView data={resource.data} rows={filterRows(resource.data?.professionals, search, ["user.full_name", "user.email", "verification_status"])} mutate={resource.mutate} search={search} setSearch={setSearch} />
  </AdminPageFrame>;
}
