import { useState } from "react";
import { Mail, Phone, UserCheck, UserPlus, UserX, Users, Eye, Pencil, RotateCcw, Trash2, X } from "lucide-react";
import { apiRequest } from "../../lib/api";
import { SearchBox } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, Card, EmptyState, StatStrip } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const blankProfile = { full_name: "", email: "", phone: "", address_line: "", city: "", pincode: "" };

function CustomerProfileModal({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({ ...blankProfile, ...customer });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const updated = await apiRequest(`/admin/customers/${customer.id}`, { method: "PATCH", body: JSON.stringify(form) });
      setForm((current) => ({ ...current, ...updated })); setEditing(false); onSaved();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  return <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="customer-profile-title" className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">Customer record · #{customer.id}</p><h2 id="customer-profile-title" className="mt-1 text-2xl font-extrabold text-slate-900">{editing ? "Edit customer profile" : "Customer profile"}</h2></div><button onClick={onClose} aria-label="Close" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>
      <div className="mt-6 flex items-center gap-4">{form.profile_photo ? <img src={form.profile_photo} alt="Customer profile" className="h-20 w-20 rounded-full object-cover ring-4 ring-violet-50" /> : <div className="grid h-20 w-20 place-items-center rounded-full bg-violet-100 text-2xl font-extrabold text-violet-700">{form.full_name?.[0]?.toUpperCase() || "?"}</div>}<div><p className="text-lg font-bold text-slate-900">{form.full_name}</p><p className="text-sm text-slate-500">Joined {fmt(form.created_at)}</p><Badge tone={form.deleted_at ? "rose" : form.is_active ? "emerald" : "amber"}>{form.deleted_at ? "Deleted" : form.is_active ? "Active" : "Suspended"}</Badge></div></div>
      {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
        {[["full_name", "Full name"], ["email", "Email"], ["phone", "Phone"], ["address_line", "Address"], ["city", "City"], ["pincode", "PIN code"]].map(([name, label]) => <label key={name} className={name === "address_line" ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span><input name={name} value={form[name] || ""} onChange={set} readOnly={!editing} required={name === "full_name" || name === "email"} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-400 read-only:bg-slate-50" /></label>)}
        <div className="flex flex-wrap gap-2 sm:col-span-2">{editing ? <><button disabled={saving} className={btn.primary}>{saving ? "Saving..." : "Save changes"}</button><button type="button" onClick={() => { setForm({ ...blankProfile, ...customer }); setEditing(false); }} className={btn.ghost}>Cancel</button></> : <button type="button" onClick={() => setEditing(true)} className={btn.primary}><Pencil size={15} />Edit profile</button>}</div>
      </form>
      <div className="mt-8 border-t border-slate-100 pt-6"><h3 className="font-bold text-slate-900">Booking history <span className="ml-1 text-sm font-medium text-slate-500">({customer.bookings?.length || 0})</span></h3>{customer.bookings?.length ? <div className="mt-3 max-h-56 space-y-2 overflow-y-auto">{customer.bookings.map((booking) => <article key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-sm"><div><p className="font-semibold text-slate-800">{booking.service?.name || "Home service"}</p><p className="text-xs text-slate-500">{fmt(booking.created_at)} · {booking.address_line || "Address not provided"}{booking.pincode ? `, ${booking.pincode}` : ""}</p></div><div className="text-right"><p className="font-bold text-slate-800">₹{Number(booking.amount || 0).toLocaleString("en-IN")}</p><p className="text-xs font-semibold capitalize text-violet-700">{booking.status?.replaceAll("_", " ")}</p></div></article>)}</div> : <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No bookings for this customer yet.</p>}</div>
    </section>
  </div>;
}

function CustomersView({ all, rows, mutate, reload, search, setSearch }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("all");
  const [actionError, setActionError] = useState("");
  const deleted = all.filter((row) => row.deleted_at).length;
  const active = all.filter((row) => row.is_active && !row.deleted_at).length;
  const suspended = all.filter((row) => !row.is_active && !row.deleted_at).length;
  const thisMonth = all.filter((row) => { const date = new Date(row.created_at); const now = new Date(); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).length;
  const visibleRows = rows.filter((row) => tab === "all" || (tab === "deleted" ? row.deleted_at : tab === "suspended" ? !row.is_active && !row.deleted_at : row.is_active && !row.deleted_at));
  const run = async (path, method, body) => { setActionError(""); await mutate(path, method, body); };
  const openProfile = async (row) => {
    try { setSelected(await apiRequest(`/admin/customers/${row.id}`)); }
    catch (err) { setActionError(err.message); }
  };

  return <div className="space-y-6">
    <StatStrip items={[
      { label: "Total customers", value: all.length - deleted, Icon: Users, tone: "violet" },
      { label: "Active accounts", value: active, Icon: UserCheck, tone: "emerald" },
      { label: "Suspended", value: suspended, Icon: UserX, tone: "rose" },
      { label: "Joined this month", value: thisMonth, Icon: UserPlus, tone: "sky" },
    ]} />
    <Card icon={Users} title="Customer accounts" subtitle={`${visibleRows.length} records · ${deleted} deleted`} tools={<SearchBox value={search} onChange={setSearch} />}>
      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">{[["all", "All"], ["active", "Active"], ["suspended", "Suspended"], ["deleted", "Deleted / restore"]].map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${tab === key ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{label}{key === "deleted" ? ` (${deleted})` : ""}</button>)}</div>
      {actionError && <p role="alert" className="mx-5 mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{actionError}</p>}
      <div className="overflow-x-auto"><table className="w-full min-w-[960px] text-left text-sm">
        <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3">Access</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{visibleRows.map((row) => <tr key={row.id} className="transition hover:bg-violet-50/40">
          <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-extrabold text-white">{(row.full_name || "?").charAt(0).toUpperCase()}</span><p className="truncate font-bold text-slate-900">{row.full_name}{row.has_photo && <span className="ml-2 text-xs font-normal text-violet-600">Photo</span>}</p></div></td>
          <td className="px-3 py-3.5"><p className="flex items-center gap-1.5 text-slate-700"><Mail size={13} className="text-slate-400" />{row.email}</p><p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone size={13} className="text-slate-400" />{row.phone || "—"}</p></td>
          <td className="px-3 py-3.5 text-slate-600">{fmt(row.created_at)}</td>
          <td className="px-3 py-3.5"><Badge tone={row.deleted_at ? "rose" : row.is_active ? "emerald" : "amber"}><span className={`h-1.5 w-1.5 rounded-full ${row.deleted_at ? "bg-rose-500" : row.is_active ? "bg-emerald-500" : "bg-amber-500"}`} />{row.deleted_at ? "Deleted" : row.is_active ? "Active" : "Suspended"}</Badge></td>
          <td className="px-5 py-3.5"><div className="flex justify-end gap-2"><button title="View profile" onClick={() => openProfile(row)} className={btn.ghost}><Eye size={15} /><span className="sr-only">View profile</span></button>{row.deleted_at ? <button onClick={() => run(`/admin/customers/${row.id}/restore`, "POST", {})} className={btn.success}><RotateCcw size={15} />Restore</button> : <><button onClick={() => run(`/admin/customers/${row.id}`, "PATCH", { is_active: !row.is_active })} className={row.is_active ? btn.ghost : btn.success}>{row.is_active ? "Suspend" : "Activate"}</button><button title="Delete customer" onClick={() => { if (window.confirm(`Soft-delete ${row.full_name}? Their bookings will be preserved, and you can restore them later.`)) run(`/admin/customers/${row.id}`, "DELETE"); }} className={btn.danger}><Trash2 size={15} /><span className="sr-only">Delete</span></button></>}</div></td>
        </tr>)}</tbody>
      </table></div>
      {!visibleRows.length && <EmptyState icon={Users} title={tab === "deleted" ? "No deleted customers" : "No customers found"} text="Customer records matching this view will appear here." />}
    </Card>
    {selected && <CustomerProfileModal customer={selected} onClose={() => setSelected(null)} onSaved={() => { void reload(); }} />}
  </div>;
}

export default function CustomersPage() {
  const resource = useAdminSection("/admin/customers");
  const [search, setSearch] = useState("");
  const all = Array.isArray(resource.data) ? resource.data : [];
  return <AdminPageFrame title="Customers" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <CustomersView all={all} rows={filterRows(resource.data, search, ["full_name", "email", "phone"])} mutate={resource.mutate} reload={resource.load} search={search} setSearch={setSearch} />
  </AdminPageFrame>;
}
