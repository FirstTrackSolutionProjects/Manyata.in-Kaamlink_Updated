import { ChevronDown, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";

const statusLabels = {
  pending: "Pending", confirmed: "Confirmed", assigned: "Assigned", in_progress: "In progress",
  completed: "Completed", cancelled: "Cancelled", refunded: "Refunded", unpaid: "Unpaid", paid: "Paid",
  new: "New", read: "Read", replied: "Replied", archived: "Archived", resolved: "Resolved", closed: "Closed",
  verified: "Verified", rejected: "Rejected",
};
const bookingStatuses = ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled", "refunded"];

export function StatusSelect({ value, options, onChange }) {
  return <span className="relative inline-flex items-center"><select aria-label="Update status" value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-violet-500">{options.map((item) => <option key={item} value={item}>{statusLabels[item] || item}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-slate-400" /></span>;
}

export function Empty({ children = "Nothing here yet." }) { return <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">{children}</div>; }

export function Panel({ title, children, tools }) { return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><h2 className="text-lg font-extrabold">{title}</h2>{tools}</div><div className="overflow-x-auto">{children}</div></section>; }

export function SearchBox({ value, onChange }) { return <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500"><Search size={15} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search" className="w-36 outline-none sm:w-48" /></label>; }

export function BookingTable({ rows, mutate, professionals = [], deletedView = false, onEdit }) {
  if (!rows.length) return <div className="p-6"><Empty>No bookings found.</Empty></div>;
  return <table className="w-full min-w-[1180px] text-left text-sm">
    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Booking</th><th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Schedule</th><th className="p-3">Amount</th><th className="p-3">Assigned partner</th><th className="p-3">Status / payment</th><th className="p-3 text-right">Actions</th></tr></thead>
    <tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}>
      <td className="p-3 font-bold">#{row.id}</td><td className="p-3">{row.user?.full_name || "—"}<small className="block text-slate-500">{row.user?.phone || row.user?.email}</small></td><td className="p-3">{row.service?.name || "—"}</td>
      <td className="p-3">{row.slot_start ? new Date(row.slot_start).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}</td><td className="p-3 font-bold">₹{Number(row.amount).toLocaleString("en-IN")}</td>
      <td className="p-3">{mutate && !deletedView ? <select aria-label={`Assign partner to booking ${row.id}`} value={row.professional_id || ""} onChange={(event) => mutate(`/admin/bookings/${row.id}`, "PATCH", { professional_id: event.target.value || null })} className="max-w-48 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold"><option value="">Unassigned</option>{professionals.map((person) => <option key={person.id} value={person.id} disabled={!person.is_available && person.id !== row.professional_id}>{person.user?.full_name}{person.is_available ? "" : " (Unavailable)"}</option>)}</select> : row.professional?.user?.full_name || "Unassigned"}</td>
      <td className="p-3">{mutate && !deletedView ? <div className="flex flex-col gap-2"><StatusSelect value={row.status} options={bookingStatuses} onChange={(status) => mutate(`/admin/bookings/${row.id}`, "PATCH", { status })} /><span className="text-xs font-bold text-slate-600">Payment: {statusLabels[row.payment_status] || row.payment_status} ({row.payment_method === "razorpay" ? "Razorpay" : "after service"})</span>{row.payment_status === "paid" && row.payment_method === "razorpay" && <button type="button" onClick={() => mutate(`/payments/bookings/${row.id}/refund`, "POST", {})} className="self-start rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50">Issue full refund</button>}</div> : <span>{statusLabels[row.status] || row.status} · {statusLabels[row.payment_status] || row.payment_status}</span>}</td>
      <td className="p-3"><div className="flex justify-end gap-2">{deletedView ? <button onClick={() => mutate(`/admin/bookings/${row.id}/restore`, "POST", {})} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold"><RotateCcw size={13} /> Restore</button> : <><button onClick={() => onEdit?.(row)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold"><Pencil size={13} /> Edit</button><button aria-label={`Move booking ${row.id} to trash`} onClick={() => window.confirm(`Move booking #${row.id} to trash?`) && mutate(`/admin/bookings/${row.id}`, "DELETE")} className="rounded-lg border border-rose-200 p-2 text-rose-700"><Trash2 size={14} /></button></>}</div></td>
    </tr>)}</tbody>
  </table>;
}
