import { useNavigate } from "react-router-dom";
import { Activity, BadgeCheck, Banknote, BriefcaseBusiness, CalendarDays, Mail, MessageSquareText, Users } from "lucide-react";
import { BookingTable } from "./AdminShared";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function OverviewView({ data, setSection }) {
  const stats = data || {};
  const cards = [
    ["Bookings", stats.bookings, CalendarDays, "bookings"], ["Awaiting action", stats.pendingBookings, Activity, "bookings"],
    ["Customers", stats.customers, Users, "customers"], ["Professionals", stats.professionals, BadgeCheck, "professionals"],
    ["Active services", stats.services, BriefcaseBusiness, "services"], ["Paid revenue", `₹${Number(stats.paidRevenue || 0).toLocaleString("en-IN")}`, Banknote, "bookings"],
    ["New messages", stats.newMessages, Mail, "contact"], ["Open tickets", stats.openTickets, MessageSquareText, "tickets"],
  ];
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, dest]) => <button key={label} onClick={() => setSection(dest)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Icon size={19} /></span></div><p className="mt-4 text-3xl font-black">{value ?? "—"}</p></button>)}</div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-extrabold">Recent bookings</h2><BookingTable rows={stats.recentBookings || []} /></section></div>;
}

export default function OverviewPage() {
  const navigate = useNavigate();
  const resource = useAdminSection("/admin/overview");
  return <AdminPageFrame title="Overview" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <OverviewView data={resource.data} setSection={(path) => navigate(`/admin/${path}`)} />
  </AdminPageFrame>;
}
