import { useNavigate } from "react-router-dom";
import {
  Activity, ArrowRight, ArrowUpRight, BadgeCheck, Banknote, BriefcaseBusiness, CalendarDays,
  CheckCircle2, Mail, MapPinned, MessageSquareText, Users,
} from "lucide-react";
import { getSession } from "../../lib/api";
import { BookingTable } from "./AdminShared";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

const tones = {
  violet: { icon: "bg-violet-50 text-violet-700", bar: "from-violet-500 to-indigo-500" },
  amber: { icon: "bg-amber-50 text-amber-600", bar: "from-amber-400 to-orange-500" },
  sky: { icon: "bg-sky-50 text-sky-600", bar: "from-sky-400 to-blue-500" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", bar: "from-emerald-400 to-teal-500" },
  indigo: { icon: "bg-indigo-50 text-indigo-600", bar: "from-indigo-400 to-violet-500" },
  rose: { icon: "bg-rose-50 text-rose-600", bar: "from-rose-400 to-pink-500" },
  fuchsia: { icon: "bg-fuchsia-50 text-fuchsia-600", bar: "from-fuchsia-400 to-purple-500" },
};

function OverviewView({ data, setSection }) {
  const stats = data || {};
  const session = getSession();
  const firstName = (session?.user?.full_name || "Owner").trim().split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const pending = Number(stats.pendingBookings || 0);
  const messages = Number(stats.newMessages || 0);
  const tickets = Number(stats.openTickets || 0);
  const revenue = `₹${Number(stats.paidRevenue || 0).toLocaleString("en-IN")}`;

  const cards = [
    { label: "Bookings", value: stats.bookings, Icon: CalendarDays, dest: "bookings", tone: "violet", hint: "All bookings" },
    { label: "Awaiting action", value: stats.pendingBookings, Icon: Activity, dest: "bookings", tone: "amber", hint: "Needs your review" },
    { label: "Customers", value: stats.customers, Icon: Users, dest: "customers", tone: "sky", hint: "Registered users" },
    { label: "Professionals", value: stats.professionals, Icon: BadgeCheck, dest: "professionals", tone: "emerald", hint: "On the platform" },
    { label: "Active services", value: stats.services, Icon: BriefcaseBusiness, dest: "services", tone: "indigo", hint: "Live in catalog" },
    { label: "Paid revenue", value: revenue, Icon: Banknote, dest: "bookings", tone: "emerald", hint: "Total received" },
    { label: "New messages", value: stats.newMessages, Icon: Mail, dest: "contact", tone: "fuchsia", hint: "Contact inbox" },
    { label: "Open tickets", value: stats.openTickets, Icon: MessageSquareText, dest: "tickets", tone: "rose", hint: "Support queue" },
  ];

  const attention = [
    { label: "Bookings awaiting action", count: pending, Icon: Activity, dest: "bookings", tone: "amber" },
    { label: "New contact messages", count: messages, Icon: Mail, dest: "contact", tone: "fuchsia" },
    { label: "Open support tickets", count: tickets, Icon: MessageSquareText, dest: "tickets", tone: "rose" },
  ];
  const allClear = attention.every((a) => a.count === 0);

  const quick = [
    ["Manage services", "services", BriefcaseBusiness],
    ["Professionals", "professionals", BadgeCheck],
    ["Customers", "customers", Users],
    ["Service areas", "service-areas", MapPinned],
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900 p-6 text-white shadow-xl shadow-violet-900/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">{today}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{greeting}, {firstName}</h2>
            <p className="mt-2 text-sm text-violet-100/90">
              {pending > 0
                ? `${pending} booking${pending > 1 ? "s" : ""} waiting for your action.`
                : "Everything is up to date. No bookings are waiting for action."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => setSection("bookings")} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-violet-50">
                View bookings <ArrowRight size={16} />
              </button>
              <button onClick={() => setSection("contact")} className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                <Mail size={16} /> Open inbox
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-semibold text-violet-100">Paid revenue</p>
              <p className="mt-1 text-2xl font-black">{revenue}</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs font-semibold text-violet-100">Active services</p>
              <p className="mt-1 text-2xl font-black">{stats.services ?? "—"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, Icon, dest, tone, hint }) => {
          const t = tones[tone];
          return (
            <button key={label} onClick={() => setSection(dest)} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-violet-900/10">
              <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.bar} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{label}</span>
                <span className={`grid h-10 w-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${t.icon}`}><Icon size={19} /></span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">{value ?? "—"}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-400">
                <span>{hint}</span>
                <ArrowUpRight size={15} className="opacity-0 transition group-hover:opacity-100" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">Recent bookings</h2>
              <p className="text-xs text-slate-500">Latest activity across your services</p>
            </div>
            <button onClick={() => setSection("bookings")} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-sm font-bold text-violet-700 transition hover:bg-violet-100">
              View all <ArrowRight size={15} />
            </button>
          </div>
          <BookingTable rows={stats.recentBookings || []} />
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold">Needs attention</h2>
            <div className="mt-4 space-y-2">
              {allClear ? (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={20} /> All clear. Nothing needs action right now.
                </div>
              ) : (
                attention.map(({ label, count, Icon, dest, tone }) => (
                  <button key={label} onClick={() => setSection(dest)} className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-slate-200 hover:bg-slate-50">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tones[tone].icon}`}><Icon size={18} /></span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-slate-700">{label}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${count > 0 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>{count}</span>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold">Quick links</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quick.map(([label, dest, Icon]) => (
                <button key={dest} onClick={() => setSection(dest)} className="group flex flex-col items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-violet-700 shadow-sm"><Icon size={17} /></span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-violet-700">{label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const navigate = useNavigate();
  const resource = useAdminSection("/admin/overview");
  return <AdminPageFrame title="Overview" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <OverviewView data={resource.data} setSection={(path) => navigate(`/admin/${path}`)} />
  </AdminPageFrame>;
}