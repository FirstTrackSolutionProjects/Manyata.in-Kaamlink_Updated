import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Plus, Search, XCircle } from "lucide-react";
import { BookingTable } from "./AdminShared";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Card, EmptyState, StatStrip, inputCls } from "./AdminUI";

const pretty = (s) => String(s).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const localInputDate = (date) => { const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000); return d.toISOString().slice(0, 16); };
const newBooking = () => ({ user_id: "", service_id: "", address_line: "", pincode: "", slot_start: "", slot_end: "", amount: "", notes: "" });

function BookingsView({ data = {}, rows, mutate, trash, setTrash, deletedCount }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(newBooking());
  const statuses = [...new Set(rows.map((r) => r.status).filter(Boolean))];
  const q = query.trim().toLowerCase();
  const shown = rows.filter((r) => (tab === "all" || r.status === tab) && (!q || JSON.stringify(r).toLowerCase().includes(q)));

  const create = async (event) => {
    event.preventDefault();
    const result = await mutate("/admin/bookings", "POST", { ...draft, user_id: Number(draft.user_id), service_id: Number(draft.service_id), amount: Number(draft.amount), slot_start: new Date(draft.slot_start).toISOString(), slot_end: new Date(draft.slot_end).toISOString() });
    if (result) { setCreating(false); setDraft(newBooking()); }
  };
  const edit = async (row) => {
    const address_line = window.prompt("Service address", row.address_line || ""); if (address_line === null) return;
    const pincode = window.prompt("PIN code", row.pincode || ""); if (pincode === null) return;
    const amount = window.prompt("Amount", row.amount); if (amount === null) return;
    const slotStartDefault = row.slot_start ? localInputDate(new Date(row.slot_start)) : "";
    const slotStartInput = window.prompt("Start time (YYYY-MM-DDTHH:mm)", slotStartDefault); if (slotStartInput === null) return;
    const slotEndDefault = row.slot_end ? localInputDate(new Date(row.slot_end)) : "";
    const slotEndInput = window.prompt("End time (YYYY-MM-DDTHH:mm)", slotEndDefault); if (slotEndInput === null) return;
    const notes = window.prompt("Booking notes", row.notes || ""); if (notes === null) return;
    if (!Number.isFinite(Number(amount)) || !new Date(slotStartInput).getTime() || !new Date(slotEndInput).getTime()) { window.alert("Enter a valid amount and start/end date and time."); return; }
    await mutate(`/admin/bookings/${row.id}`, "PATCH", { address_line, pincode, amount: Number(amount), slot_start: new Date(slotStartInput).toISOString(), slot_end: new Date(slotEndInput).toISOString(), notes });
  };

  const has = (r, word) => String(r.status || "").toLowerCase().includes(word);
  return <div className="space-y-6">
    <StatStrip items={[
      { label: trash ? "Deleted bookings" : "Total bookings", value: rows.length, Icon: CalendarDays, tone: "violet" },
      { label: "Pending", value: rows.filter((r) => has(r, "pend")).length, Icon: Clock3, tone: "amber" },
      { label: "Completed", value: rows.filter((r) => has(r, "complet")).length, Icon: CheckCircle2, tone: "emerald" },
      { label: "Cancelled", value: rows.filter((r) => has(r, "cancel")).length, Icon: XCircle, tone: "rose" },
    ]} />
    <Card icon={CalendarDays} title="Booking management" subtitle={`${shown.length} of ${rows.length} bookings`} tools={<div className="flex flex-wrap gap-2"><div className="relative w-full sm:w-64"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bookings" className={`${inputCls} pl-9`} /></div><button onClick={() => setTrash((v) => !v)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">{trash ? "Active bookings" : `Trash (${deletedCount})`}</button>{!trash && <button onClick={() => setCreating((v) => !v)} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white"><Plus size={14} /> Add booking</button>}</div>}>
      {creating && !trash && <form onSubmit={create} className="grid gap-3 border-b border-slate-100 bg-slate-50/70 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-bold text-slate-600">Customer<select required value={draft.user_id} onChange={(e) => setDraft({ ...draft, user_id: e.target.value })} className={inputCls}><option value="">Select customer</option>{(data.customers || []).map((c) => <option value={c.id} key={c.id}>{c.full_name} · {c.email}</option>)}</select></label>
        <label className="text-xs font-bold text-slate-600">Service<select required value={draft.service_id} onChange={(e) => { const service = data.services?.find((s) => String(s.id) === e.target.value); setDraft({ ...draft, service_id: e.target.value, amount: draft.amount || String(service?.base_price || "") }); }} className={inputCls}><option value="">Select service</option>{(data.services || []).map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}</select></label>
        <label className="text-xs font-bold text-slate-600">Address<input required maxLength="255" value={draft.address_line} onChange={(e) => setDraft({ ...draft, address_line: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">PIN code<input required pattern="[1-9][0-9]{5}" value={draft.pincode} onChange={(e) => setDraft({ ...draft, pincode: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">Start time<input required type="datetime-local" value={draft.slot_start} onChange={(e) => setDraft({ ...draft, slot_start: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">End time<input required type="datetime-local" value={draft.slot_end} onChange={(e) => setDraft({ ...draft, slot_end: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600">Amount<input required type="number" min="0" step="0.01" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} className={inputCls} /></label>
        <label className="text-xs font-bold text-slate-600 sm:col-span-2">Notes<input value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className={inputCls} /></label>
        <div className="flex items-end gap-2"><button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">Save booking</button><button type="button" onClick={() => { setCreating(false); setDraft(newBooking()); }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Cancel</button></div>
      </form>}
      {!trash && statuses.length > 0 && <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">{[["all", "All", rows.length], ...statuses.map((s) => [s, pretty(s), rows.filter((r) => r.status === s).length])].map(([key, label, count]) => <button key={key} onClick={() => setTab(key)} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ${tab === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>{label}<span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{count}</span></button>)}</div>}
      {shown.length ? <div className="overflow-x-auto p-2"><BookingTable rows={shown} mutate={mutate} professionals={data.professionals || []} deletedView={trash} onEdit={edit} /></div> : <EmptyState icon={CalendarDays} title={rows.length ? "No matching bookings" : trash ? "Trash is empty" : "No bookings found"} text={rows.length ? "Try another status tab or search." : "New bookings from customers will show up here."} />}
    </Card>
  </div>;
}

export default function BookingsPage() {
  const active = useAdminSection("/admin/bookings");
  const deleted = useAdminSection("/admin/bookings?deleted=true");
  const [trash, setTrash] = useState(false);
  const resource = trash ? deleted : active;
  return <AdminPageFrame title="Bookings" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}><BookingsView data={resource.data} rows={resource.data?.bookings || []} mutate={resource.mutate} trash={trash} setTrash={setTrash} deletedCount={deleted.data?.bookings?.length || 0} /></AdminPageFrame>;
}
