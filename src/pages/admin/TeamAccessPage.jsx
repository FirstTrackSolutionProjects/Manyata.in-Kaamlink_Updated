import { useEffect, useMemo, useState } from "react";
import { KeyRound, Mail, Plus, RefreshCw, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { apiRequest, getSession } from "../../lib/api";
import AdminPageFrame from "./AdminPageFrame";
import { Badge, EmptyState, StatStrip } from "./AdminUI";

const blankForm = { full_name: "", email: "", phone: "", password: "", permissions: [] };
const labelStatus = (user) => user.deleted_at ? "Deleted" : user.is_active ? "Active" : "Suspended";

export default function TeamAccessPage() {
  const { token } = getSession();
  const [employees, setEmployees] = useState([]);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [editPermissions, setEditPermissions] = useState([]);
  const [editPassword, setEditPassword] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [newCredential, setNewCredential] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try { const data = await apiRequest("/admin/team", { token }); setEmployees(data.employees || []); setSections(data.sections || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const phoneNeedle = needle.replace(/\D/g, "");
    return employees.filter((item) => {
      const searchableText = [item.full_name, item.email, item.phone, item.id]
        .map((value) => String(value ?? "").toLowerCase());
      const phoneDigits = String(item.phone || "").replace(/\D/g, "");
      return !needle || searchableText.some((value) => value.includes(needle)) ||
        (phoneNeedle.length > 0 && phoneDigits.includes(phoneNeedle));
    });
  }, [employees, search]);
  const toggle = (items, setter, key) => setter(items.includes(key) ? items.filter((item) => item !== key) : [...items, key]);

  const createEmployee = async (event) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice(""); setNewCredential(null);
    try {
      const created = await apiRequest("/admin/team", { token, method: "POST", body: JSON.stringify(form) });
      setEmployees((current) => [created.employee, ...current]);
      setNewCredential({ email: created.employee.email, password: form.password });
      setForm(blankForm); setNotice("Team member created. Save the temporary password and share it securely.");
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const startEdit = (employee) => { setEditing(employee); setEditPermissions(employee.admin_permissions || []); setEditPassword(""); setError(""); setNotice(""); };
  const saveEdit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const body = { permissions: editPermissions, is_active: Boolean(editing.is_active), full_name: editing.full_name, phone: editing.phone || null };
      if (editPassword) body.password = editPassword;
      const data = await apiRequest(`/admin/team/${editing.id}`, { token, method: "PATCH", body: JSON.stringify(body) });
      setEmployees((current) => current.map((row) => row.id === editing.id ? data.employee : row));
      if (editPassword) setNewCredential({ email: data.employee.email, password: editPassword });
      setEditing(null); setNotice(editPassword ? "Access updated and password reset. Save the new password securely." : "Employee access updated.");
    } catch (e) { setError(e.message); }
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

  const remove = async (employee) => {
    if (!window.confirm(`Remove ${employee.full_name} from the team? They will lose console access immediately.`)) return;
    try { await apiRequest(`/admin/team/${employee.id}`, { token, method: "DELETE" }); await load(); }
    catch (e) { setError(e.message); }
  };

  return <AdminPageFrame title="Team access">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-slate-500">Create employee accounts and grant only the owner-console sections each person needs.</p></div><button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold"><RefreshCw size={15} /> Refresh</button></div>
    {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
    {notice && <p role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
    {newCredential && <section className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex items-start justify-between gap-3"><div><b className="text-sm text-amber-950">Temporary sign-in details</b><p className="mt-1 text-xs text-amber-800">Copy now and share through a secure channel. The password will not be shown again.</p><code className="mt-3 block break-all rounded-lg bg-white p-3 text-sm">{newCredential.email}<br />{newCredential.password}</code></div><button onClick={() => setNewCredential(null)} aria-label="Dismiss" className="rounded-lg p-1 text-amber-800"><X size={17} /></button></div></section>}
    <StatStrip items={[
      { label: "Team accounts", value: employees.length, Icon: UserRound, tone: "violet" },
      { label: "Active", value: employees.filter((p) => p.is_active && !p.deleted_at).length, Icon: ShieldCheck, tone: "emerald" },
      { label: "Suspended", value: employees.filter((p) => !p.is_active && !p.deleted_at).length, Icon: KeyRound, tone: "amber" },
      { label: "Removed", value: employees.filter((p) => p.deleted_at).length, Icon: Trash2, tone: "rose" },
    ]} />
    <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(330px,.8fr)]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4"><label className="relative min-w-[200px] flex-1"><UserRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-500" /></label></div>{loading ? <p className="p-10 text-center text-sm text-slate-500">Loading team…</p> : rows.length ? <div className="divide-y divide-slate-100">{rows.map((employee) => <article key={employee.id} className="p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-extrabold text-white">{employee.full_name?.[0]?.toUpperCase()}</span><div className="min-w-0"><b className="block truncate text-sm text-slate-900">{employee.full_name}</b><span className="flex items-center gap-1 truncate text-xs text-slate-500"><Mail size={12} />{employee.email}</span></div></div><Badge tone={employee.deleted_at ? "rose" : employee.is_active ? "emerald" : "amber"}>{labelStatus(employee)}</Badge></div><div className="mt-3 flex flex-wrap gap-1.5">{(employee.admin_permissions || []).length ? employee.admin_permissions.map((permission) => <span key={permission} className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold capitalize text-violet-700">{sections.find((s) => s.key === permission)?.label || permission}</span>) : <span className="text-xs text-slate-400">No sections assigned</span>}</div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => startEdit(employee)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-violet-300 hover:text-violet-700">Edit access</button><button onClick={() => suspendOrRestore(employee)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">{employee.deleted_at ? "Restore" : employee.is_active ? "Suspend" : "Reactivate"}</button>{!employee.deleted_at && <button onClick={() => remove(employee)} className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">Remove</button>}</div></article>)}</div> : <div className="p-6"><EmptyState title="No team members found" text="Try searching by employee name, email address, or phone number." /></div>}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Plus size={20} /></span><div><h2 className="font-extrabold text-slate-900">Add team member</h2><p className="text-xs text-slate-500">Access can be changed or revoked later.</p></div></div><form onSubmit={createEmployee} className="mt-5 space-y-3"><input required maxLength={120} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500" /><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Work email" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500" /><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500" /><label className="block text-xs font-bold text-slate-600">Temporary password<input required minLength={12} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 12 characters" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-normal outline-none focus:border-violet-500" /></label><fieldset className="rounded-xl border border-slate-200 p-3"><legend className="px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Grant console sections</legend><div className="mt-1 grid gap-1.5 sm:grid-cols-2">{sections.map((section) => <label key={section.key} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={form.permissions.includes(section.key)} onChange={() => toggle(form.permissions, (permissions) => setForm((current) => ({ ...current, permissions })), section.key)} className="accent-violet-600" />{section.label}</label>)}</div></fieldset><button disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-600/20 disabled:opacity-60"><Plus size={16} />{busy ? "Creating…" : "Create employee account"}</button></form></section>
    </div>
    {editing && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4"><form onSubmit={saveEdit} className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"><header className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-700">Team settings</p><h2 className="mt-1 text-xl font-black">{editing.email}</h2></div><button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 hover:bg-slate-100"><X size={19} /></button></header><label className="mt-5 block text-xs font-bold text-slate-600">Display name<input value={editing.full_name} onChange={(e) => setEditing({ ...editing, full_name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="mt-3 block text-xs font-bold text-slate-600">Phone<input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="mt-3 flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(editing.is_active)} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="accent-violet-600" />Account active</label><fieldset className="mt-4 rounded-xl border border-slate-200 p-3"><legend className="px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Access granted by owner</legend><div className="grid gap-1.5 sm:grid-cols-2">{sections.map((section) => <label key={section.key} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold"><input type="checkbox" checked={editPermissions.includes(section.key)} onChange={() => toggle(editPermissions, setEditPermissions, section.key)} className="accent-violet-600" />{section.label}</label>)}</div></fieldset><label className="mt-4 block text-xs font-bold text-slate-600">Reset password (optional)<input minLength={12} type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Leave empty to keep current password" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-normal" /></label><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Cancel</button><button disabled={busy} className="rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{busy ? "Saving…" : "Save access"}</button></div></form></div>}
  </AdminPageFrame>;
}
