import { useState } from "react";
import { BellOff, Check, CheckCircle2, Copy, Mail, Newspaper, Plus, RotateCcw, Trash2 } from "lucide-react";
import { SearchBox } from "./AdminShared";
import { filterRows } from "./adminUtils";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Badge, Card, EmptyState, StatStrip } from "./AdminUI";
import { btn } from "./AdminUI.styles";

const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

function NewsletterView({ all, rows, search, setSearch, mutate }) {
  const [copied, setCopied] = useState(false);
  const [trash, setTrash] = useState(false);
  const visibleAll = all.filter((r) => !!r.deleted_at === trash);
  const visibleRows = rows.filter((r) => !!r.deleted_at === trash);
  const active = visibleAll.filter((r) => r.is_active);

  const copyEmails = async () => {
    try {
      await navigator.clipboard.writeText(active.map((r) => r.email).join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: trash ? "Deleted subscribers" : "Total subscribers", value: visibleAll.length, Icon: Newspaper, tone: "violet" },
        { label: "Active", value: active.length, Icon: CheckCircle2, tone: "emerald" },
        { label: "Unsubscribed", value: all.length - active.length, Icon: BellOff, tone: "slate" },
      ]} />

      <Card
        icon={Newspaper}
        title="Newsletter subscribers"
        subtitle={`${visibleRows.length} of ${visibleAll.length} subscribers`}
        tools={
          <div className="flex flex-wrap items-center gap-3">
            <SearchBox value={search} onChange={setSearch} />
            <button onClick={() => setTrash((v) => !v)} className={btn.ghost}>{trash ? "Active" : `Trash (${all.filter((r) => r.deleted_at).length})`}</button>
            <button onClick={async () => { const email = window.prompt("Subscriber email"); if (email) await mutate("/admin/newsletter", "POST", { email }); }} className={btn.primary}><Plus size={14} /> Add</button>
            <button onClick={copyEmails} disabled={!active.length} className={`${btn.ghost} disabled:cursor-not-allowed disabled:opacity-50`}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy active emails"}
            </button>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr><th className="px-5 py-3">Email</th><th className="px-3 py-3">Subscribed</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleRows.map((row) => (
                <tr key={row.id} className="transition hover:bg-violet-50/40">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700"><Mail size={16} /></span>
                      <span className="truncate font-semibold text-slate-900">{row.email}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">{fmt(row.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={row.is_active ? "emerald" : "slate"}>
                      <span className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {row.is_active ? "Active" : "Unsubscribed"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">{trash ? <button onClick={() => mutate(`/admin/newsletter/${row.id}/restore`, "POST", {})} className={btn.ghost}><RotateCcw size={14} /> Restore</button> : <div className="flex justify-end gap-2"><button onClick={async () => { const email = window.prompt("Subscriber email", row.email); if (email !== null) await mutate(`/admin/newsletter/${row.id}`, "PATCH", { email }); }} className={btn.ghost}>Edit</button><button onClick={() => mutate(`/admin/newsletter/${row.id}`, "PATCH", { is_active: !row.is_active })} className={btn.ghost}>{row.is_active ? "Unsubscribe" : "Activate"}</button><button aria-label="Move to trash" onClick={() => window.confirm("Move this subscriber to trash?") && mutate(`/admin/newsletter/${row.id}`, "DELETE")} className={btn.ghost}><Trash2 size={14} /></button></div>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visibleRows.length && <EmptyState icon={Newspaper} title={visibleAll.length ? "No matching subscribers" : trash ? "Trash is empty" : "No subscribers yet"} text={visibleAll.length ? "Try a different search." : "People who subscribe from your website will appear here."} />}
      </Card>
    </div>
  );
}

export default function NewsletterPage() {
  const resource = useAdminSection("/admin/newsletter");
  const [search, setSearch] = useState("");
  const all = Array.isArray(resource.data) ? resource.data : [];
  return <AdminPageFrame title="Newsletter" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <NewsletterView all={all} rows={filterRows(resource.data, search, ["email"]) || []} search={search} setSearch={setSearch} mutate={resource.mutate} />
  </AdminPageFrame>;
}
