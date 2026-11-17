import { RefreshCw, X, Check } from "lucide-react";

export default function AdminPageFrame({ title, loading, error, notice, onRefresh, children }) {
  return (
    <>
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Manyata operations</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">Manage bookings, people, catalog, and customer support.</p>
        </div>
        <button onClick={onRefresh} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:border-violet-300"><RefreshCw size={16} /> Refresh</button>
      </header>
      {error && <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><X size={17} />{error}</div>}
      {notice && <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><Check size={17} />{notice}</div>}
      {loading ? <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500">Loading {title.toLowerCase()}…</div> : error ? (
        <section role="alert" className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm"><h2 className="text-lg font-extrabold">Could not load {title.toLowerCase()}</h2><p className="mt-2 text-sm text-slate-600">{error}</p><button onClick={onRefresh} className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white">Try again</button></section>
      ) : children}
    </>
  );
}
