import { tones } from "./AdminUI.styles";
export const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10";
export const inputSmCls = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";

export function StatStrip({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {items.map(({ label, value, Icon, tone }) => {
        const t = tones[tone] || tones.violet;
        return (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${t.icon}`}><Icon size={22} /></span>
            <div className="min-w-0">
              <p className="text-2xl font-black leading-none tracking-tight text-slate-900">{value}</p>
              <p className="mt-1.5 truncate text-xs font-semibold text-slate-500">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Card({ icon: Icon, title, subtitle, tools, children, className = "" }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-600/25">
              <Icon size={18} />
            </span>
          )}
          <div>
            <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {tools}
      </header>
      {children}
    </section>
  );
}

export function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export function Badge({ tone = "slate", children }) {
  const t = tones[tone] || tones.slate;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${t.badge}`}>{children}</span>;
}

export function Toggle({ on, onClick, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onClick} className="group inline-flex items-center gap-2.5 text-xs font-bold text-slate-600">
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="m-5 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
      {Icon && <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-600 shadow-sm"><Icon size={22} /></span>}
      <p className="text-sm font-extrabold text-slate-800">{title}</p>
      {text && <p className="max-w-xs text-xs text-slate-500">{text}</p>}
    </div>
  );
}