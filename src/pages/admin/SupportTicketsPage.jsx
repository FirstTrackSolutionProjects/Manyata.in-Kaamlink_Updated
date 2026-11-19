import { useState } from "react";
import { CheckCircle2, Clock3, Inbox, LifeBuoy, Plus, RotateCcw, Trash2 } from "lucide-react";
import { StatusSelect } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, Card, EmptyState, StatStrip } from "./AdminUI";

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function Tabs({ value, onChange, items }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-100 px-5 py-3">
      {items.map(([key, label, count]) => (
        <button key={key} onClick={() => onChange(key)} className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${value === key ? "bg-slate-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700"}`}>
          {label}
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${value === key ? "bg-white/20" : "bg-white"}`}>{count}</span>
        </button>
      ))}
    </div>
  );
}

function TicketsView({ rows, mutate }) {
  const [tab, setTab] = useState("all");
  const [trash, setTrash] = useState(false);
  const activeRows = rows.filter((r) => !!r.deleted_at === trash);
  const count = (s) => activeRows.filter((r) => r.status === s).length;
  const shown = tab === "all" ? activeRows : activeRows.filter((r) => r.status === tab);

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: trash ? "Deleted tickets" : "Total tickets", value: activeRows.length, Icon: LifeBuoy, tone: "violet" },
        { label: "New", value: count("new"), Icon: Inbox, tone: "amber" },
        { label: "In progress", value: count("in_progress"), Icon: Clock3, tone: "sky" },
        { label: "Resolved / closed", value: count("resolved") + count("closed"), Icon: CheckCircle2, tone: "emerald" },
      ]} />

      <Card icon={LifeBuoy} title="Support queue" subtitle={`${shown.length} ticket${shown.length === 1 ? "" : "s"}`} tools={<div className="flex gap-2"><button onClick={() => setTrash((v) => !v)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">{trash ? "Active tickets" : `Trash (${rows.filter((r) => r.deleted_at).length})`}</button><button onClick={async () => { const booking_reference = window.prompt("Booking reference (optional)") || ""; const category = window.prompt("Issue category", "General") || "General"; const description = window.prompt("Describe the issue"); if (!description) return; await mutate("/admin/tickets", "POST", { booking_reference, category, description }); }} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white"><Plus size={14} /> Add ticket</button></div>}>
        {!trash && <Tabs value={tab} onChange={setTab} items={[["all", "All", activeRows.length], ["new", "New", count("new")], ["in_progress", "In progress", count("in_progress")], ["resolved", "Resolved", count("resolved")], ["closed", "Closed", count("closed")]]} />}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Ticket</th><th className="px-3 py-3">Booking</th><th className="px-3 py-3">Issue</th><th className="px-3 py-3">Opened</th><th className="px-5 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((row) => (
                <tr key={row.id} className="align-top transition hover:bg-violet-50/40">
                  <td className="px-5 py-4"><span className="rounded-lg bg-slate-900 px-2.5 py-1.5 font-mono text-xs font-extrabold tracking-wider text-white">{row.ticket_ref}</span></td>
                  <td className="px-3 py-4 font-semibold text-slate-700">{row.booking_reference || "—"}</td>
                  <td className="max-w-md px-3 py-4">
                    <Badge tone="violet">{row.category || "General"}</Badge>
                    <p className="mt-2 line-clamp-2 text-slate-500">{row.description}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-slate-600">{fmt(row.created_at)}</td>
                  <td className="px-5 py-4">{trash ? <button onClick={() => mutate(`/admin/tickets/${row.id}/restore`, "POST", {})} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold"><RotateCcw size={13} /> Restore</button> : <div className="flex items-center gap-2"><StatusSelect value={row.status} options={["new", "in_progress", "resolved", "closed"]} onChange={(status) => mutate(`/admin/tickets/${row.id}`, "PATCH", { status })} /><button onClick={async () => { const category = window.prompt("Issue category", row.category || "General"); if (category === null) return; const booking_reference = window.prompt("Booking reference", row.booking_reference || ""); if (booking_reference === null) return; const description = window.prompt("Description", row.description); if (description === null) return; await mutate(`/admin/tickets/${row.id}`, "PATCH", { category, booking_reference, description }); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold">Edit</button><button aria-label="Move to trash" onClick={() => window.confirm("Move this ticket to trash?") && mutate(`/admin/tickets/${row.id}`, "DELETE")} className="rounded-lg border border-rose-200 p-2 text-rose-700"><Trash2 size={14} /></button></div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!shown.length && <EmptyState icon={LifeBuoy} title={activeRows.length ? "Nothing in this tab" : trash ? "Trash is empty" : "No support tickets"} text={activeRows.length ? "Try another status tab." : "Great news, there are no open issues right now."} />}
      </Card>
    </div>
  );
}

export default function SupportTicketsPage() {
  const resource = useAdminSection("/admin/tickets");
  return <AdminPageFrame title="Support tickets" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <TicketsView rows={filterRows(resource.data, "", ["ticket_ref", "booking_reference", "category", "description"]) || []} mutate={resource.mutate} />
  </AdminPageFrame>;
}
