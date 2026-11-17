import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, Search, XCircle } from "lucide-react";
import { BookingTable } from "./AdminShared";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Card, EmptyState, StatStrip, inputCls } from "./AdminUI";

const pretty = (s) => String(s).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function BookingsView({ data = {}, rows, mutate }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");

  const has = (r, word) => String(r.status || "").toLowerCase().includes(word);
  const statuses = [...new Set(rows.map((r) => r.status).filter(Boolean))];
  const q = query.trim().toLowerCase();
  const shown = rows.filter((r) => (tab === "all" || r.status === tab) && (!q || JSON.stringify(r).toLowerCase().includes(q)));

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: "Total bookings", value: rows.length, Icon: CalendarDays, tone: "violet" },
        { label: "Pending", value: rows.filter((r) => has(r, "pend")).length, Icon: Clock3, tone: "amber" },
        { label: "Completed", value: rows.filter((r) => has(r, "complet")).length, Icon: CheckCircle2, tone: "emerald" },
        { label: "Cancelled", value: rows.filter((r) => has(r, "cancel")).length, Icon: XCircle, tone: "rose" },
      ]} />

      <Card
        icon={CalendarDays}
        title="Booking management"
        subtitle={`${shown.length} of ${rows.length} bookings`}
        tools={
          <div className="relative w-full sm:w-72">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bookings" className={`${inputCls} pl-9`} />
          </div>
        }
      >
        {statuses.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">
            {[["all", "All", rows.length], ...statuses.map((s) => [s, pretty(s), rows.filter((r) => r.status === s).length])].map(([key, label, count]) => (
              <button key={key} onClick={() => setTab(key)} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${tab === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${tab === key ? "bg-white/20" : "bg-white"}`}>{count}</span>
              </button>
            ))}
          </div>
        )}

        {shown.length ? (
          <div className="overflow-x-auto p-2">
            <BookingTable rows={shown} mutate={mutate} professionals={data.professionals || []} />
          </div>
        ) : (
          <EmptyState icon={CalendarDays} title={rows.length ? "No matching bookings" : "No bookings found"} text={rows.length ? "Try another status tab or search." : "New bookings from customers will show up here."} />
        )}
      </Card>
    </div>
  );
}

export default function BookingsPage() {
  const resource = useAdminSection("/admin/bookings");
  return <AdminPageFrame title="Bookings" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <BookingsView data={resource.data} rows={resource.data?.bookings || []} mutate={resource.mutate} />
  </AdminPageFrame>;
}