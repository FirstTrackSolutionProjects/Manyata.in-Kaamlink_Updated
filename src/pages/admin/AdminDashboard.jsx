import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import {
  BadgeCheck, BriefcaseBusiness, CalendarDays, ClipboardList, House,
  LayoutDashboard, LogOut, Mail, MapPinned, MessageSquareText, ShieldCheck, Users,
} from "lucide-react";
import { getSession, logoutSession } from "../../lib/api";

const sections = [
  ["overview", "Overview", LayoutDashboard],
  ["bookings", "Bookings", CalendarDays],
  ["services", "Services", BriefcaseBusiness],
  ["professionals", "Professionals", BadgeCheck],
  ["customers", "Customers", Users],
  ["contact", "Contact inbox", Mail],
  ["tickets", "Support tickets", MessageSquareText],
  ["service-areas", "Service areas", MapPinned],
  ["newsletter", "Newsletter", ClipboardList],
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const logout = async () => {
    await logoutSession();
    navigate("/admin/login", { replace: true });
  };

  const navClass = ({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${isActive ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="bg-slate-950 p-4 text-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:p-5">
        <Link to="/admin/overview" className="flex items-center gap-3 rounded-2xl px-2 py-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600"><ShieldCheck size={22} /></span><span><b className="block text-lg">Manyata</b><small className="text-slate-400">Owner console</small></span></Link>
        <nav className="mt-5 flex gap-1 overflow-x-auto pb-1 lg:mt-8 lg:flex-1 lg:flex-col lg:overflow-visible">
          <Link to="/" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"><House size={17} />Home page</Link>
          {sections.map(([path, label, Icon]) => <NavLink key={path} to={`/admin/${path}`} end className={navClass}><Icon size={17} />{label}</NavLink>)}
        </nav>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 lg:mt-auto"><div className="min-w-0"><p className="truncate text-sm font-bold">{session.user?.full_name || "Owner"}</p><p className="text-xs text-slate-400">Administrator</p></div><button onClick={logout} title="Log out" className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><LogOut size={18} /><span>Log out</span></button></div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-9"><Outlet /></main>
    </div>
  );
}
