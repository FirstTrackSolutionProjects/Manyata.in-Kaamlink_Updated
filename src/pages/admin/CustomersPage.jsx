import { useState } from "react";
import { Mail, Phone, UserCheck, UserPlus, UserX, Users } from "lucide-react";
import { SearchBox } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, Card, EmptyState, StatStrip } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function CustomersView({ all, rows, mutate, search, setSearch }) {
  const now = new Date();
  const active = all.filter((r) => r.is_active).length;
  const thisMonth = all.filter((r) => {
    const d = new Date(r.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: "Total customers", value: all.length, Icon: Users, tone: "violet" },
        { label: "Active accounts", value: active, Icon: UserCheck, tone: "emerald" },
        { label: "Suspended", value: all.length - active, Icon: UserX, tone: "rose" },
        { label: "Joined this month", value: thisMonth, Icon: UserPlus, tone: "sky" },
      ]} />

      <Card icon={Users} title="Customer accounts" subtitle={`${rows.length} of ${all.length} customers`} tools={<SearchBox value={search} onChange={setSearch} />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Contact</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3">Access</th><th className="px-5 py-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-violet-50/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-extrabold text-white shadow-md ring-2 ring-white">{(row.full_name || "?").charAt(0).toUpperCase()}</span>
                      <p className="truncate font-bold text-slate-900">{row.full_name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="flex items-center gap-1.5 text-slate-700"><Mail size={13} className="text-slate-400" />{row.email}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone size={13} className="text-slate-400" />{row.phone || "—"}</p>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">{fmt(row.created_at)}</td>
                  <td className="px-3 py-3.5">
                    <Badge tone={row.is_active ? "emerald" : "rose"}>
                      <span className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-rose-500"}`} />
                      {row.is_active ? "Active" : "Suspended"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => mutate(`/admin/customers/${row.id}`, "PATCH", { is_active: !row.is_active })} className={row.is_active ? btn.danger : btn.success}>
                      {row.is_active ? "Suspend" : "Restore"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!rows.length && <EmptyState icon={Users} title="No customers found" text="Customers will appear here once they sign up." />}
      </Card>
    </div>
  );
}

export default function CustomersPage() {
  const resource = useAdminSection("/admin/customers");
  const [search, setSearch] = useState("");
  const all = Array.isArray(resource.data) ? resource.data : [];
  return <AdminPageFrame title="Customers" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <CustomersView all={all} rows={filterRows(resource.data, search, ["full_name", "email", "phone"])} mutate={resource.mutate} search={search} setSearch={setSearch} />
  </AdminPageFrame>;
}
