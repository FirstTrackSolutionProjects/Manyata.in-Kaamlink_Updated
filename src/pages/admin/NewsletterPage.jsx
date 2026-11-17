import { Empty, Panel } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function NewsletterView({ rows }) { return <Panel title="Newsletter subscribers"><table className="w-full min-w-[500px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Email</th><th className="p-3">Subscribed</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-semibold">{row.email}</td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3">{row.is_active ? "Active" : "Unsubscribed"}</td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No subscribers yet.</Empty></div>}</Panel>; }

export default function NewsletterPage() {
  const resource = useAdminSection("/admin/newsletter");
  return <AdminPageFrame title="Newsletter" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <NewsletterView rows={filterRows(resource.data, "", ["email"])} />
  </AdminPageFrame>;
}
