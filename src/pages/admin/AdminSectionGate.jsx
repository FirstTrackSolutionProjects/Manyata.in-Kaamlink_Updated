import { Navigate } from "react-router-dom";
import { getSession } from "../../lib/api";

export default function AdminSectionGate({ section, children }) {
  const { user } = getSession();
  if (user?.role === "admin" || user?.permissions?.includes(section)) return children;
  return <section className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-extrabold text-slate-900">Access not granted</h1><p className="mt-2 text-sm text-slate-600">Ask the owner to grant this section in Team access.</p><a href="/admin" className="mt-5 inline-flex rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white">Go to an available section</a></section>;
}
