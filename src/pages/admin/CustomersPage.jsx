import { Empty, Panel, SearchBox } from "./AdminShared";
import { filterRows } from "./adminUtils";
import { useState } from "react";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function CustomersView({ rows, mutate, search, setSearch }) { return <Panel title="Customer accounts" tools={<SearchBox value={search} onChange={setSearch} />}><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Customer</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined</th><th className="p-3">Access</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.full_name}</td><td className="p-3">{row.email}</td><td className="p-3">{row.phone || "—"}</td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3">{row.is_active ? "Active" : "Suspended"}</td><td className="p-3"><button onClick={() => mutate(`/admin/customers/${row.id}`, "PATCH", { is_active: !row.is_active })} className="rounded-lg border px-3 py-1.5 text-xs font-bold hover:border-violet-400">{row.is_active ? "Suspend" : "Restore"}</button></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No customers found.</Empty></div>}</Panel>; }

export default function CustomersPage() {
  const resource = useAdminSection("/admin/customers");
  const [search, setSearch] = useState("");
  return <AdminPageFrame title="Customers" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <CustomersView rows={filterRows(resource.data, search, ["full_name", "email", "phone"])} mutate={resource.mutate} search={search} setSearch={setSearch} />
  </AdminPageFrame>;
}
