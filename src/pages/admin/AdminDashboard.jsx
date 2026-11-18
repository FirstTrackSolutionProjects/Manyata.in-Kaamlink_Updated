import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  BadgeCheck, BriefcaseBusiness, CalendarDays, ClipboardList,
  LayoutDashboard, LogOut, Mail, MapPinned, MessageSquareText, ShieldCheck, Users,
} from "lucide-react";
import { getSession, logoutSession } from "../../lib/api";

const groups = [
  { label: "Main", items: [
    ["overview", "Overview", LayoutDashboard],
    ["bookings", "Bookings", CalendarDays],
  ]},
  { label: "Catalog", items: [
    ["services", "Services", BriefcaseBusiness],
    ["professionals", "Professionals", BadgeCheck],
    ["service-areas", "Service areas", MapPinned],
  ]},
  { label: "People", items: [
    ["customers", "Customers", Users],
  ]},
  { label: "Support", items: [
    ["contact", "Contact inbox", Mail],
    ["tickets", "Support tickets", MessageSquareText],
    ["newsletter", "Newsletter", ClipboardList],
  ]},
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const logout = async () => {
    await logoutSession();
    navigate("/admin/login", { replace: true });
  };

  const navClass = ({ isActive }) => `group relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-1.5 text-left text-sm font-semibold transition-all duration-200 ${isActive ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40" : "text-slate-400 hover:bg-white/5 hover:text-white"}`;

  const initial = (session.user?.full_name || "Owner").trim().charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="relative overflow-hidden bg-slate-950 p-4 text-white lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:p-5">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:h-full lg:min-h-0">
          <Link to="/admin/overview" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur transition hover:bg-white/10">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/50 ring-1 ring-white/20">
              <ShieldCheck size={22} />
            </span>
            <span className="min-w-0">
              <b className="block text-lg leading-tight tracking-tight">Manyata</b>
              <small className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">Owner console</small>
            </span>
          </Link>

          <nav className="admin-nav-scroll mt-5 flex gap-4 overflow-x-auto pb-1 lg:mt-4 lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-2 lg:overflow-y-auto lg:overflow-x-hidden lg:pb-3 lg:pr-1">
            {groups.map((g) => (
              <div key={g.label} className="flex gap-1 lg:flex-col">
                <p className="mb-1 hidden px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 lg:block">{g.label}</p>
                {g.items.map(([path, label, Icon]) => (
                  <NavLink key={path} to={`/admin/${path}`} end className={navClass}>
                    {({ isActive }) => (
                      <>
                        {isActive && <span className="absolute -left-1 top-1/2 hidden h-5 w-1 -translate-y-1/2 rounded-full bg-white lg:block" />}
                        <Icon size={18} className="shrink-0 transition group-hover:scale-110" />
                        <span className="whitespace-nowrap">{label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>

          <Link
            to="/admin/overview"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
            className="group relative z-10 mt-2 flex shrink-0 items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-2.5 text-left text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20 hover:text-white lg:mt-0"
          >
            <LayoutDashboard size={18} className="transition group-hover:scale-110" />
            <span className="flex-1">Go to dashboard</span>
          </Link>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur lg:mt-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-extrabold ring-2 ring-white/20">{initial}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{session.user?.full_name || "Owner"}</p>
                <p className="flex items-center gap-1.5 text-xs text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Administrator</p>
              </div>
            </div>
            <button onClick={logout} title="Log out" className="inline-flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300">
              <LogOut size={18} /><span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-72 lg:p-9"><Outlet /></main>
    </div>
  );
}
