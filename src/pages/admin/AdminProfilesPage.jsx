import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Building2, Camera, ContactRound, Mail, MapPin, Phone, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { apiRequest, getSession } from "../../lib/api";
import AdminPageFrame from "./AdminPageFrame";
import { Badge, EmptyState, StatStrip } from "./AdminUI";

const ROLE = { customer: "Customer", partner: "Partner", employee: "Employee", admin: "Owner" };
const tone = { customer: "violet", partner: "sky", employee: "amber", admin: "emerald" };

export default function AdminProfilesPage() {
  const { token } = getSession();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await apiRequest("/admin/profiles", { token });
      setProfiles(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => profiles.filter((item) => {
    const matchesRole = role === "all" || item.role === role;
    const needle = search.trim().toLowerCase();
    const phoneNeedle = needle.replace(/\D/g, "");
    const searchableText = [item.full_name, item.email, item.phone, item.city, ROLE[item.role], item.id]
      .map((value) => String(value ?? "").toLowerCase());
    const phoneDigits = String(item.phone || "").replace(/\D/g, "");
    const matchesSearch = !needle || searchableText.some((value) => value.includes(needle)) ||
      (phoneNeedle.length > 0 && phoneDigits.includes(phoneNeedle));
    return matchesRole && matchesSearch;
  }), [profiles, role, search]);

  const openProfile = async (item) => {
    setSelected(item); setPhoto("");
    if (item.profile_photo_available) {
      try { const data = await apiRequest(`/admin/profiles/${item.id}/photo`, { token }); setPhoto(data.profile_photo || ""); } catch { /* profile details remain available if photo storage is unavailable */ }
    }
  };

  return <AdminPageFrame eyebrow="People directory" title="All profiles" description="Owner view of customer, partner, team member, and owner accounts.">
    <StatStrip items={[
      { label: "All accounts", value: profiles.length, Icon: ContactRound, tone: "violet" },
      { label: "Customers", value: profiles.filter((p) => p.role === "customer").length, Icon: UserRound, tone: "blue" },
      { label: "Partners", value: profiles.filter((p) => p.role === "partner").length, Icon: BriefcaseBusiness, tone: "emerald" },
      { label: "Team members", value: profiles.filter((p) => p.role === "employee").length, Icon: ShieldCheck, tone: "amber" },
    ]} />
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
        <label className="relative min-w-[220px] flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone, city" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500" /></label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"><option value="all">All roles</option>{Object.entries(ROLE).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
        <button onClick={load} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Refresh</button>
      </div>
      {error && <p role="alert" className="m-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {loading ? <p className="p-10 text-center text-sm text-slate-500">Loading profiles…</p> : filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Person</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((item) => <tr key={item.id} className="hover:bg-slate-50/70"><td className="px-5 py-3.5"><button onClick={() => openProfile(item)} className="flex items-center gap-3 text-left"><span className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 font-extrabold text-violet-700">{item.full_name?.[0]?.toUpperCase() || "?"}</span><span><b className="block text-slate-900">{item.full_name}</b><small className="text-slate-500">ID {item.id}</small></span></button></td><td className="px-5 py-3.5"><Badge tone={tone[item.role]}>{ROLE[item.role] || item.role}</Badge></td><td className="px-5 py-3.5"><span className="block">{item.email}</span><span className="text-xs text-slate-500">{item.phone || "No phone"}</span></td><td className="px-5 py-3.5"><Badge tone={item.account_status === "active" ? "emerald" : item.account_status === "suspended" ? "amber" : "rose"}>{item.account_status}</Badge></td><td className="px-5 py-3.5 text-slate-600">{new Date(item.created_at).toLocaleDateString("en-IN")}</td><td className="px-5 py-3.5"><button onClick={() => openProfile(item)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold hover:border-violet-300 hover:text-violet-700">View</button></td></tr>)}</tbody></table></div> : <div className="p-6"><EmptyState title="No profiles found" text="Try another search or role filter." /></div>}
      <footer className="border-t border-slate-100 px-5 py-3 text-xs font-medium text-slate-500">Showing {filtered.length} of {profiles.length} profiles</footer>
    </section>

    {selected && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}><section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><header className="flex items-start justify-between border-b border-slate-100 p-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-violet-600">{ROLE[selected.role]} profile</p><h2 className="mt-1 text-2xl font-black text-slate-900">{selected.full_name}</h2></div><button onClick={() => setSelected(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></header><div className="grid gap-6 p-6 sm:grid-cols-[150px_1fr]"><div className="flex flex-col items-center gap-3"><span className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-violet-100 text-3xl font-black text-violet-700">{photo ? <img src={photo} alt="Profile" className="h-full w-full object-cover" /> : selected.full_name?.[0]?.toUpperCase()}</span>{selected.profile_photo_available && <span className="flex items-center gap-1 text-xs text-slate-500"><Camera size={13} /> Profile photo</span>}</div><div className="grid content-start gap-4 sm:grid-cols-2">{[["Email", selected.email, Mail], ["Phone", selected.phone || "Not added", Phone], ["City", selected.city || "Not added", Building2], ["Address", selected.address_line || "Not added", MapPin], ["PIN code", selected.pincode || "Not added", MapPin], ["Account status", selected.account_status, ShieldCheck]].map(([label, value, Icon]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500"><Icon size={13} />{label}</span><p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p></div>)}{selected.professional && <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 sm:col-span-2"><b className="text-sm text-violet-900">Partner details</b><p className="mt-2 text-sm text-slate-700">{selected.professional.city?.name ? `${selected.professional.city.name}${selected.professional.city.state ? `, ${selected.professional.city.state}` : ""} · ` : ""}{selected.professional.experience_years} years experience · {selected.professional.verification_status} · {selected.professional.is_available ? "Available" : "Unavailable"}</p><p className="mt-1 text-sm text-slate-600">{selected.professional.bio || "No bio added."}</p></div>}{selected.role === "employee" && <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4 sm:col-span-2"><b className="text-sm text-amber-900">Owner-granted access</b><div className="mt-2 flex flex-wrap gap-2">{(selected.admin_permissions || []).length ? selected.admin_permissions.map((permission) => <Badge key={permission} tone="amber">{permission}</Badge>) : <span className="text-sm text-slate-600">No console sections assigned</span>}</div></div>}</div></div></section></div>}
  </AdminPageFrame>;
}
