import { useState } from "react";
import { Archive, CheckCheck, Inbox, Mail, MessageSquare, Phone, Plus, Reply, RotateCcw, Trash2 } from "lucide-react";
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
  const [trash, setTrash] = useState(false);
  const activeRows = rows.filter((r) => !!r.deleted_at === trash);
  const count = (s) => activeRows.filter((r) => r.status === s).length;
  const shown = tab === "all" ? activeRows : activeRows.filter((r) => r.status === tab);

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: trash ? "Deleted messages" : "Total messages", value: activeRows.length, Icon: Inbox, tone: "violet" },
        { label: "New", value: count("new"), Icon: Mail, tone: "amber" },
        { label: "Replied", value: count("replied"), Icon: CheckCheck, tone: "emerald" },
        { label: "Archived", value: count("archived"), Icon: Archive, tone: "slate" },
      ]} />

      <Card icon={MessageSquare} title="Customer messages" subtitle={`${shown.length} message${shown.length === 1 ? "" : "s"}`} tools={<div className="flex gap-2"><button onClick={() => setTrash((v) => !v)} className={btn.ghost}>{trash ? "Active messages" : `Trash (${rows.filter((r) => r.deleted_at).length})`}</button><button onClick={async () => { const name = window.prompt("Sender name"); if (!name) return; const email = window.prompt("Email"); if (!email) return; const subject = window.prompt("Subject", "General inquiry") || ""; const message = window.prompt("Message"); if (!message) return; await mutate("/admin/contact", "POST", { name, email, subject, message }); }} className={btn.primary}><Plus size={14} /> Add message</button></div>}>
        {!trash && <Tabs value={tab} onChange={setTab} items={[["all", "All", activeRows.length], ["new", "New", count("new")], ["read", "Read", count("read")], ["replied", "Replied", count("replied")], ["archived", "Archived", count("archived")]]} />}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">From</th><th className="px-3 py-3">Subject / message</th><th className="px-3 py-3">Received</th><th className="px-3 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
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
                  <td className="px-3 py-4">{trash ? "Deleted" : <StatusSelect value={row.status} options={["new", "read", "replied", "archived"]} onChange={(status) => mutate(`/admin/contact/${row.id}`, "PATCH", { status })} />}</td>
                  <td className="px-5 py-4 text-right">
                    {trash ? <button onClick={() => mutate(`/admin/contact/${row.id}/restore`, "POST", {})} className={btn.ghost}><RotateCcw size={14} /> Restore</button> : <div className="flex justify-end gap-2"><button onClick={async () => { const name = window.prompt("Sender name", row.name); if (name === null) return; const email = window.prompt("Email", row.email); if (email === null) return; const subject = window.prompt("Subject", row.subject || ""); if (subject === null) return; const message = window.prompt("Message", row.message); if (message === null) return; await mutate(`/admin/contact/${row.id}`, "PATCH", { name, email, subject, message }); }} className={btn.ghost}>Edit</button><a href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject || "Your inquiry"}`)}`} className={btn.ghost}><Reply size={14} /> Reply</a><button aria-label="Move to trash" onClick={() => window.confirm("Move this message to trash?") && mutate(`/admin/contact/${row.id}`, "DELETE")} className={btn.ghost}><Trash2 size={14} /></button></div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!shown.length && <EmptyState icon={Inbox} title={activeRows.length ? "Nothing in this tab" : trash ? "Trash is empty" : "No messages yet"} text={activeRows.length ? "Try another status tab." : "Messages from the contact form will show up here."} />}
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
