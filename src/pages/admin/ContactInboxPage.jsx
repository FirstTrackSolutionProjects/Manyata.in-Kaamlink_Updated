import { useState } from "react";
import { Archive, CheckCheck, Inbox, Mail, MessageSquare, Phone, Reply } from "lucide-react";
import { StatusSelect } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Card, EmptyState, StatStrip } from "./AdminUI";
import { btn } from "./AdminUI.styles";

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

function InboxView({ rows, mutate }) {
  const [tab, setTab] = useState("all");
  const count = (s) => rows.filter((r) => r.status === s).length;
  const shown = tab === "all" ? rows : rows.filter((r) => r.status === tab);

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: "Total messages", value: rows.length, Icon: Inbox, tone: "violet" },
        { label: "New", value: count("new"), Icon: Mail, tone: "amber" },
        { label: "Replied", value: count("replied"), Icon: CheckCheck, tone: "emerald" },
        { label: "Archived", value: count("archived"), Icon: Archive, tone: "slate" },
      ]} />

      <Card icon={MessageSquare} title="Customer messages" subtitle={`${shown.length} message${shown.length === 1 ? "" : "s"}`}>
        <Tabs value={tab} onChange={setTab} items={[["all", "All", rows.length], ["new", "New", count("new")], ["read", "Read", count("read")], ["replied", "Replied", count("replied")], ["archived", "Archived", count("archived")]]} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">From</th><th className="px-3 py-3">Subject / message</th><th className="px-3 py-3">Received</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Reply</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((row) => (
                <tr key={row.id} className="align-top transition hover:bg-violet-50/40">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-extrabold text-white shadow-md ring-2 ring-white">{(row.name || "?").charAt(0).toUpperCase()}</span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-slate-900">{row.name}</p>
                        <p className="truncate text-xs text-slate-500">{row.email}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400"><Phone size={11} />{row.phone || "No phone"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-md px-3 py-4">
                    <p className="font-bold text-slate-900">{row.subject || "General inquiry"}</p>
                    <p className="mt-1 line-clamp-2 text-slate-500">{row.message}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-slate-600">{fmt(row.created_at)}</td>
                  <td className="px-3 py-4"><StatusSelect value={row.status} options={["new", "read", "replied", "archived"]} onChange={(status) => mutate(`/admin/contact/${row.id}`, "PATCH", { status })} /></td>
                  <td className="px-5 py-4 text-right">
                    <a href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject || "Your inquiry"}`)}`} className={btn.ghost}><Reply size={14} /> Reply</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!shown.length && <EmptyState icon={Inbox} title={rows.length ? "Nothing in this tab" : "No messages yet"} text={rows.length ? "Try another status tab." : "Messages from the contact form will show up here."} />}
      </Card>
    </div>
  );
}

export default function ContactInboxPage() {
  const resource = useAdminSection("/admin/contact");
  return <AdminPageFrame title="Contact inbox" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <InboxView rows={filterRows(resource.data, "", ["name", "email", "subject", "message"]) || []} mutate={resource.mutate} />
  </AdminPageFrame>;
}
