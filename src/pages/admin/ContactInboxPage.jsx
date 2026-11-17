import { Empty, Panel, StatusSelect } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function InboxView({ rows, mutate }) { return <Panel title="Customer messages"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">From</th><th className="p-3">Subject / message</th><th className="p-3">Received</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.name}<small className="block font-normal text-slate-500">{row.email} · {row.phone || "No phone"}</small></td><td className="max-w-lg p-3"><b>{row.subject || "General inquiry"}</b><p className="mt-1 line-clamp-2 text-slate-500">{row.message}</p></td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3"><StatusSelect value={row.status} options={["new", "read", "replied", "archived"]} onChange={(status) => mutate(`/admin/contact/${row.id}`, "PATCH", { status })} /></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No messages yet.</Empty></div>}</Panel>; }

export default function ContactInboxPage() {
  const resource = useAdminSection("/admin/contact");
  return <AdminPageFrame title="Contact inbox" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <InboxView rows={filterRows(resource.data, "", ["name", "email", "subject", "message"])} mutate={resource.mutate} />
  </AdminPageFrame>;
}
