import { Empty, Panel, StatusSelect } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function TicketsView({ rows, mutate }) { return <Panel title="Support queue"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Ticket</th><th className="p-3">Booking</th><th className="p-3">Issue</th><th className="p-3">Opened</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.ticket_ref}</td><td className="p-3">{row.booking_reference || "—"}</td><td className="max-w-lg p-3">{row.category || "General"}<p className="mt-1 line-clamp-2 text-slate-500">{row.description}</p></td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3"><StatusSelect value={row.status} options={["new", "in_progress", "resolved", "closed"]} onChange={(status) => mutate(`/admin/tickets/${row.id}`, "PATCH", { status })} /></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No support tickets.</Empty></div>}</Panel>; }

export default function SupportTicketsPage() {
  const resource = useAdminSection("/admin/tickets");
  return <AdminPageFrame title="Support tickets" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <TicketsView rows={filterRows(resource.data, "", ["ticket_ref", "booking_reference", "category", "description"])} mutate={resource.mutate} />
  </AdminPageFrame>;
}
