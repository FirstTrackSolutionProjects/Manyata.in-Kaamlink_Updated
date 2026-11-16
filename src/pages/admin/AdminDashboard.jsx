import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity, BadgeCheck, Banknote, BriefcaseBusiness, CalendarDays,
  Check, ChevronDown, ClipboardList, LayoutDashboard, LogOut,
  House, Mail, MapPinned, MessageSquareText, Plus, RefreshCw, Search, ShieldCheck,
  Users, X,
} from "lucide-react";
import { apiRequest, clearSession, getSession } from "../../lib/api";

const sections = [
  ["overview", "Overview", LayoutDashboard], ["bookings", "Bookings", CalendarDays],
  ["services", "Services", BriefcaseBusiness], ["professionals", "Professionals", BadgeCheck],
  ["customers", "Customers", Users], ["contact", "Contact inbox", Mail],
  ["tickets", "Support tickets", MessageSquareText], ["areas", "Service areas", MapPinned],
  ["newsletter", "Newsletter", ClipboardList],
];
const statusLabels = {
  pending: "Pending", confirmed: "Confirmed", assigned: "Assigned", in_progress: "In progress",
  completed: "Completed", cancelled: "Cancelled", refunded: "Refunded", unpaid: "Unpaid", paid: "Paid",
  new: "New", read: "Read", replied: "Replied", archived: "Archived", resolved: "Resolved", closed: "Closed",
  verified: "Verified", rejected: "Rejected",
};
const bookingStatuses = ["pending", "confirmed", "assigned", "in_progress", "completed", "cancelled", "refunded"];

function StatusSelect({ value, options, onChange }) {
  return <span className="relative inline-flex items-center"><select aria-label="Update status" value={value} onChange={(event) => onChange(event.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none focus:border-violet-500">{options.map((item) => <option key={item} value={item}>{statusLabels[item] || item}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-slate-400" /></span>;
}

function Empty({ children = "Nothing here yet." }) { return <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center text-sm text-slate-500">{children}</div>; }

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const [section, setSection] = useState("overview");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [serviceDraft, setServiceDraft] = useState({ name: "", slug: "", category_id: "", description: "", base_price: "", duration_mins: "60" });
  const [cityDraft, setCityDraft] = useState({ name: "", state: "" });
  const [pincodeDraft, setPincodeDraft] = useState({ pincode: "", city_id: "" });
  const token = session.token;

  const handleRequestError = useCallback((requestError) => {
    if (requestError.status === 401) {
      clearSession();
      navigate("/admin/login", { replace: true });
      return;
    }
    setError(requestError.message);
  }, [navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const path = section === "overview" ? "/admin/overview" : `/admin/${section === "areas" ? "service-areas" : section}`;
      const result = await apiRequest(path, { token });
      setData(result);
    } catch (requestError) {
      handleRequestError(requestError);
    } finally {
      setLoading(false);
    }
  }, [handleRequestError, section, token]);

  useEffect(() => { load(); }, [load]);

  const mutate = async (path, method, body) => {
    setError(""); setNotice("");
    try {
      await apiRequest(path, { token, method, body: JSON.stringify(body) });
      setNotice("Saved successfully.");
      await load();
    } catch (requestError) { handleRequestError(requestError); }
  };

  const logout = () => { clearSession(); navigate("/admin/login", { replace: true }); };
  const heading = sections.find(([key]) => key === section)?.[1] || "Overview";
  const visible = (items, fields) => (Array.isArray(items) ? items : []).filter((item) => !search || fields.some((key) => String(key.split(".").reduce((value, part) => value?.[part], item) ?? "").toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="bg-slate-950 p-4 text-white lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:p-5">
        <a href="/admin" className="flex items-center gap-3 rounded-2xl px-2 py-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600"><ShieldCheck size={22} /></span><span><b className="block text-lg">Manyata</b><small className="text-slate-400">Owner console</small></span></a>
        <nav className="mt-5 flex gap-1 overflow-x-auto pb-1 lg:mt-8 lg:flex-1 lg:flex-col lg:overflow-visible">
          <a href="/" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"><House size={17} />Home page</a>
          {sections.map(([key, label, Icon]) => <button key={key} onClick={() => { setSection(key); setSearch(""); }} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${section === key ? "bg-violet-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={17} />{label}</button>)}
        </nav>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4 lg:mt-auto"><div className="min-w-0"><p className="truncate text-sm font-bold">{session.user?.full_name || "Owner"}</p><p className="text-xs text-slate-400">Administrator</p></div><button onClick={logout} title="Log out" className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"><LogOut size={18} /><span>Log out</span></button></div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64 lg:p-9">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">Manyata operations</p><h1 className="mt-1 text-3xl font-black tracking-tight">{heading}</h1><p className="mt-1 text-sm text-slate-500">Manage bookings, people, catalog, and customer support.</p></div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm hover:border-violet-300"><RefreshCw size={16} /> Refresh</button>
        </header>
        {error && <div role="alert" className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><X size={17} />{error}</div>}
        {notice && <div role="status" className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"><Check size={17} />{notice}</div>}
        {loading ? <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500">Loading {heading.toLowerCase()}…</div> : error ? (
          <section role="alert" className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm"><h2 className="text-lg font-extrabold">Could not load {heading.toLowerCase()}</h2><p className="mt-2 text-sm text-slate-600">{error}</p><button onClick={load} className="mt-5 rounded-xl bg-violet-700 px-4 py-2.5 text-sm font-bold text-white">Try again</button></section>
        ) : (
          <>
            {section === "overview" && <Overview data={data} setSection={setSection} />}
            {section === "bookings" && <Bookings data={data} rows={visible(data?.bookings, ["id", "status", "user.full_name", "user.phone", "service.name"])} mutate={mutate} />}
            {section === "customers" && <Customers rows={visible(data, ["full_name", "email", "phone"])} mutate={mutate} search={search} setSearch={setSearch} />}
            {section === "professionals" && <Professionals data={data} rows={visible(data?.professionals, ["user.full_name", "user.email", "verification_status"])} mutate={mutate} search={search} setSearch={setSearch} />}
            {section === "services" && <Services data={data} draft={serviceDraft} setDraft={setServiceDraft} mutate={mutate} />}
            {section === "contact" && <Inbox rows={visible(data, ["name", "email", "subject", "message"])} mutate={mutate} />}
            {section === "tickets" && <Tickets rows={visible(data, ["ticket_ref", "booking_reference", "category", "description"])} mutate={mutate} />}
            {section === "newsletter" && <Newsletter rows={visible(data, ["email"])} />}
            {section === "areas" && <Areas data={data} cityDraft={cityDraft} setCityDraft={setCityDraft} pincodeDraft={pincodeDraft} setPincodeDraft={setPincodeDraft} mutate={mutate} />}
          </>
        )}
      </main>
    </div>
  );
}

function Overview({ data, setSection }) {
  const stats = data || {};
  const cards = [
    ["Bookings", stats.bookings, CalendarDays, "bookings"], ["Awaiting action", stats.pendingBookings, Activity, "bookings"],
    ["Customers", stats.customers, Users, "customers"], ["Professionals", stats.professionals, BadgeCheck, "professionals"],
    ["Active services", stats.services, BriefcaseBusiness, "services"], ["Paid revenue", `₹${Number(stats.paidRevenue || 0).toLocaleString("en-IN")}`, Banknote, "bookings"],
    ["New messages", stats.newMessages, Mail, "contact"], ["Open tickets", stats.openTickets, MessageSquareText, "tickets"],
  ];
  return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, Icon, dest]) => <button key={label} onClick={() => setSection(dest)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Icon size={19} /></span></div><p className="mt-4 text-3xl font-black">{value ?? "—"}</p></button>)}</div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-extrabold">Recent bookings</h2><BookingTable rows={stats.recentBookings || []} /></section></div>;
}

function Panel({ title, children, tools }) { return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"><h2 className="text-lg font-extrabold">{title}</h2>{tools}</div><div className="overflow-x-auto">{children}</div></section>; }
function SearchBox({ value, onChange }) { return <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500"><Search size={15} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search" className="w-36 outline-none sm:w-48" /></label>; }
function BookingTable({ rows, mutate, professionals = [] }) { return rows.length ? <table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Booking</th><th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Schedule</th><th className="p-3">Amount</th><th className="p-3">Assigned professional</th><th className="p-3">Status / payment</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">#{row.id}</td><td className="p-3">{row.user?.full_name || "—"}<small className="block text-slate-500">{row.user?.phone || row.user?.email}</small></td><td className="p-3">{row.service?.name || "—"}</td><td className="p-3">{row.slot_start ? new Date(row.slot_start).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"}</td><td className="p-3 font-bold">₹{Number(row.amount).toLocaleString("en-IN")}</td><td className="p-3">{mutate ? <select aria-label={`Assign professional to booking ${row.id}`} value={row.professional_id || ""} onChange={(event) => mutate(`/admin/bookings/${row.id}`, "PATCH", { professional_id: event.target.value || null })} className="max-w-48 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold"><option value="">Unassigned</option>{professionals.map((person) => <option key={person.id} value={person.id} disabled={!person.is_available && person.id !== row.professional_id}>{person.user?.full_name}{person.is_available ? "" : " (Unavailable)"}</option>)}</select> : row.professional?.user?.full_name || "Unassigned"}</td><td className="p-3">{mutate ? <div className="flex flex-col gap-2"><StatusSelect value={row.status} options={bookingStatuses} onChange={(status) => mutate(`/admin/bookings/${row.id}`, "PATCH", { status })} /><StatusSelect value={row.payment_status} options={["unpaid", "paid", "refunded"]} onChange={(payment_status) => mutate(`/admin/bookings/${row.id}`, "PATCH", { payment_status })} /></div> : <span>{statusLabels[row.status] || row.status}</span>}</td></tr>)}</tbody></table> : <div className="p-6"><Empty>No bookings found.</Empty></div>; }
function Bookings({ data = {}, rows, mutate }) { return <Panel title="Booking management"><BookingTable rows={rows} mutate={mutate} professionals={data.professionals || []} /></Panel>; }
function Customers({ rows, mutate, search, setSearch }) { return <Panel title="Customer accounts" tools={<SearchBox value={search} onChange={setSearch} />}><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Customer</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined</th><th className="p-3">Access</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.full_name}</td><td className="p-3">{row.email}</td><td className="p-3">{row.phone || "—"}</td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3">{row.is_active ? "Active" : "Suspended"}</td><td className="p-3"><button onClick={() => mutate(`/admin/customers/${row.id}`, "PATCH", { is_active: !row.is_active })} className="rounded-lg border px-3 py-1.5 text-xs font-bold hover:border-violet-400">{row.is_active ? "Suspend" : "Restore"}</button></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No customers found.</Empty></div>}</Panel>; }
function Professionals({ data = {}, rows, mutate, search, setSearch }) {
  const [draft, setDraft] = useState({ full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", category_ids: [] });
  const categories = data.categories || [];
  const cities = data.cities || [];
  const submit = (event) => {
    event.preventDefault();
    mutate("/admin/professionals", "POST", { ...draft, city_id: draft.city_id || null, experience_years: Number(draft.experience_years) });
    setDraft({ full_name: "", email: "", phone: "", password: "", city_id: "", experience_years: "0", category_ids: [] });
  };
  const toggleCategory = (id) => setDraft((current) => ({ ...current, category_ids: current.category_ids.includes(id) ? current.category_ids.filter((item) => item !== id) : [...current.category_ids, id] }));
  return <div className="space-y-5">
    <Panel title="Onboard a professional"><form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
      <input required placeholder="Full name" value={draft.full_name} onChange={(e) => setDraft({ ...draft, full_name: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <input required type="email" placeholder="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <input placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <input required type="password" minLength="12" autoComplete="new-password" placeholder="Temporary password (12+ chars)" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} className="rounded-xl border p-3 text-sm" />
      <select value={draft.city_id} onChange={(e) => setDraft({ ...draft, city_id: e.target.value })} className="rounded-xl border p-3 text-sm"><option value="">Choose city (optional)</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}, {city.state}</option>)}</select>
      <input type="number" min="0" max="80" value={draft.experience_years} onChange={(e) => setDraft({ ...draft, experience_years: e.target.value })} placeholder="Experience years" className="rounded-xl border p-3 text-sm" />
      <div className="flex flex-wrap gap-3 sm:col-span-2 xl:col-span-3">{categories.map((category) => <label key={category.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"><input type="checkbox" checked={draft.category_ids.includes(category.id)} onChange={() => toggleCategory(category.id)} />{category.name}</label>)}</div>
      <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white"><Plus size={16} /> Create professional account</button>
      <p className="self-center text-xs text-slate-500">New accounts start pending and unavailable until approved.</p>
    </form></Panel>
    <Panel title="Professional approvals" tools={<SearchBox value={search} onChange={setSearch} />}><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Professional</th><th className="p-3">Location</th><th className="p-3">Experience</th><th className="p-3">Verification</th><th className="p-3">Availability</th><th className="p-3">Account</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.user?.full_name || "—"}<small className="block font-normal text-slate-500">{row.user?.email}</small></td><td className="p-3">{row.city?.name || "—"}</td><td className="p-3">{row.experience_years} yrs</td><td className="p-3"><StatusSelect value={row.verification_status} options={["pending", "verified", "rejected"]} onChange={(verification_status) => mutate(`/admin/professionals/${row.id}`, "PATCH", { verification_status })} /></td><td className="p-3"><button onClick={() => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_available: !row.is_available })} className="font-bold text-violet-700">{row.is_available ? "Available" : "Unavailable"}</button></td><td className="p-3"><button onClick={() => mutate(`/admin/professionals/${row.id}`, "PATCH", { is_active: !row.user?.is_active })} className="rounded-lg border px-3 py-1.5 text-xs font-bold">{row.user?.is_active ? "Suspend" : "Restore"}</button></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No professional profiles found.</Empty></div>}</Panel>
  </div>;
}

function Services({ data = {}, draft, setDraft, mutate }) {
  const categories = data.categories || []; const services = data.services || [];
  const [editing, setEditing] = useState(null);
  const [categoryDraft, setCategoryDraft] = useState({ name: "", slug: "", description: "" });
  const submit = (event) => { event.preventDefault(); mutate("/admin/services", "POST", { ...draft, category_id: Number(draft.category_id), base_price: Number(draft.base_price), duration_mins: Number(draft.duration_mins) }); setDraft({ name: "", slug: "", category_id: "", description: "", base_price: "", duration_mins: "60" }); };
  return <div className="space-y-5">
    <Panel title="Add a service"><form onSubmit={submit} className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3"><input required placeholder="Service name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-xl border p-3 text-sm" /><input required placeholder="slug-like-this" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="rounded-xl border p-3 text-sm" /><select required value={draft.category_id} onChange={(e) => setDraft({ ...draft, category_id: e.target.value })} className="rounded-xl border p-3 text-sm"><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><input required type="number" min="0" step="0.01" placeholder="Starting price ₹" value={draft.base_price} onChange={(e) => setDraft({ ...draft, base_price: e.target.value })} className="rounded-xl border p-3 text-sm" /><input required type="number" min="1" max="1440" placeholder="Duration in minutes" value={draft.duration_mins} onChange={(e) => setDraft({ ...draft, duration_mins: e.target.value })} className="rounded-xl border p-3 text-sm" /><input placeholder="Short description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="rounded-xl border p-3 text-sm" /><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white"><Plus size={16} /> Add service</button></form></Panel>
    <Panel title="Add a category"><form onSubmit={(e) => { e.preventDefault(); mutate("/admin/categories", "POST", categoryDraft); setCategoryDraft({ name: "", slug: "", description: "" }); }} className="grid gap-3 p-5 sm:grid-cols-3"><input required placeholder="Category name" value={categoryDraft.name} onChange={(e) => setCategoryDraft({ ...categoryDraft, name: e.target.value })} className="rounded-xl border p-3 text-sm" /><input required placeholder="category-slug" value={categoryDraft.slug} onChange={(e) => setCategoryDraft({ ...categoryDraft, slug: e.target.value })} className="rounded-xl border p-3 text-sm" /><input placeholder="Description" value={categoryDraft.description} onChange={(e) => setCategoryDraft({ ...categoryDraft, description: e.target.value })} className="rounded-xl border p-3 text-sm" /><button className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white"><Plus size={16} /> Add category</button></form><div className="divide-y px-5 pb-2">{categories.map((category) => <div key={category.id} className="flex items-center justify-between gap-3 py-3 text-sm"><span className="font-semibold">{category.name}<small className="ml-2 text-slate-500">{category.slug}</small></span><button onClick={() => mutate(`/admin/categories/${category.id}`, "PATCH", { is_active: !category.is_active })} className="rounded-lg border px-3 py-1.5 text-xs font-bold">{category.is_active ? "Hide" : "Publish"}</button></div>)}</div></Panel>
    <Panel title="Service catalog"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Service</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Duration</th><th className="p-3">Visibility</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{services.map((row) => <tr key={row.id}>{editing?.id === row.id ? <><td className="p-3"><input aria-label="Service name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-40 rounded border p-2" /><input aria-label="Service slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="mt-2 w-40 rounded border p-2" /></td><td className="p-3"><select value={editing.category_id} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })} className="rounded border p-2">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></td><td className="p-3"><input type="number" min="0" step="0.01" value={editing.base_price} onChange={(e) => setEditing({ ...editing, base_price: e.target.value })} className="w-24 rounded border p-2" /></td><td className="p-3"><input type="number" min="1" max="1440" value={editing.duration_mins} onChange={(e) => setEditing({ ...editing, duration_mins: e.target.value })} className="w-20 rounded border p-2" /></td><td className="p-3">{row.is_active ? "Live" : "Hidden"}</td><td className="p-3"><div className="flex gap-2"><button onClick={() => { mutate(`/admin/services/${row.id}`, "PATCH", { ...editing, category_id: Number(editing.category_id), base_price: Number(editing.base_price), duration_mins: Number(editing.duration_mins) }); setEditing(null); }} className="rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-bold text-white">Save</button><button onClick={() => setEditing(null)} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Cancel</button></div></td></> : <><td className="p-3 font-bold">{row.name}<small className="block font-normal text-slate-500">{row.slug}</small></td><td className="p-3">{row.category?.name || "—"}</td><td className="p-3">₹{Number(row.base_price).toLocaleString("en-IN")}</td><td className="p-3">{row.duration_mins} min</td><td className="p-3">{row.is_active ? "Live" : "Hidden"}</td><td className="p-3"><div className="flex gap-2"><button onClick={() => setEditing({ id: row.id, name: row.name, slug: row.slug, category_id: String(row.category_id), base_price: String(row.base_price), duration_mins: String(row.duration_mins) })} className="rounded-lg border px-3 py-1.5 text-xs font-bold">Edit</button><button onClick={() => mutate(`/admin/services/${row.id}`, "PATCH", { is_active: !row.is_active })} className="rounded-lg border px-3 py-1.5 text-xs font-bold">{row.is_active ? "Hide" : "Publish"}</button></div></td></>}</tr>)}</tbody></table>{!services.length && <div className="p-5"><Empty>No services yet.</Empty></div>}</Panel>
  </div>;
}

function Inbox({ rows, mutate }) { return <Panel title="Customer messages"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">From</th><th className="p-3">Subject / message</th><th className="p-3">Received</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.name}<small className="block font-normal text-slate-500">{row.email} · {row.phone || "No phone"}</small></td><td className="max-w-lg p-3"><b>{row.subject || "General inquiry"}</b><p className="mt-1 line-clamp-2 text-slate-500">{row.message}</p></td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3"><StatusSelect value={row.status} options={["new", "read", "replied", "archived"]} onChange={(status) => mutate(`/admin/contact/${row.id}`, "PATCH", { status })} /></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No messages yet.</Empty></div>}</Panel>; }
function Tickets({ rows, mutate }) { return <Panel title="Support queue"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Ticket</th><th className="p-3">Booking</th><th className="p-3">Issue</th><th className="p-3">Opened</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-bold">{row.ticket_ref}</td><td className="p-3">{row.booking_reference || "—"}</td><td className="max-w-lg p-3">{row.category || "General"}<p className="mt-1 line-clamp-2 text-slate-500">{row.description}</p></td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3"><StatusSelect value={row.status} options={["new", "in_progress", "resolved", "closed"]} onChange={(status) => mutate(`/admin/tickets/${row.id}`, "PATCH", { status })} /></td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No support tickets.</Empty></div>}</Panel>; }
function Newsletter({ rows }) { return <Panel title="Newsletter subscribers"><table className="w-full min-w-[500px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Email</th><th className="p-3">Subscribed</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.id}><td className="p-3 font-semibold">{row.email}</td><td className="p-3">{new Date(row.created_at).toLocaleDateString("en-IN")}</td><td className="p-3">{row.is_active ? "Active" : "Unsubscribed"}</td></tr>)}</tbody></table>{!rows.length && <div className="p-5"><Empty>No subscribers yet.</Empty></div>}</Panel>; }

function Areas({ data = {}, cityDraft, setCityDraft, pincodeDraft, setPincodeDraft, mutate }) {
  const cities = data.cities || []; const pincodes = data.pincodes || [];
  return <div className="space-y-5"><Panel title="Add a service city"><form onSubmit={(e) => { e.preventDefault(); mutate("/admin/cities", "POST", cityDraft); setCityDraft({ name: "", state: "" }); }} className="flex flex-wrap gap-3 p-5"><input required placeholder="City name" value={cityDraft.name} onChange={(e) => setCityDraft({ ...cityDraft, name: e.target.value })} className="rounded-xl border p-3 text-sm" /><input required placeholder="State" value={cityDraft.state} onChange={(e) => setCityDraft({ ...cityDraft, state: e.target.value })} className="rounded-xl border p-3 text-sm" /><button className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white">Add city</button></form><div className="divide-y">{cities.map((city) => <div key={city.id} className="flex items-center justify-between p-4 text-sm"><span><b>{city.name}</b>, {city.state}</span><button onClick={() => mutate(`/admin/cities/${city.id}`, "PATCH", { is_active: !city.is_active })} className="rounded-lg border px-3 py-1.5 font-bold">{city.is_active ? "Disable" : "Enable"}</button></div>)}</div></Panel><Panel title="Add serviceable PIN code"><form onSubmit={(e) => { e.preventDefault(); mutate("/admin/pincodes", "POST", { ...pincodeDraft, city_id: Number(pincodeDraft.city_id) }); setPincodeDraft({ pincode: "", city_id: "" }); }} className="flex flex-wrap gap-3 p-5"><input required pattern="[1-9][0-9]{5}" maxLength="6" placeholder="6-digit PIN code" value={pincodeDraft.pincode} onChange={(e) => setPincodeDraft({ ...pincodeDraft, pincode: e.target.value })} className="rounded-xl border p-3 text-sm" /><select required value={pincodeDraft.city_id} onChange={(e) => setPincodeDraft({ ...pincodeDraft, city_id: e.target.value })} className="rounded-xl border p-3 text-sm"><option value="">Select city</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select><button className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white">Add PIN code</button></form><div className="divide-y">{pincodes.map((pin) => <div key={pin.id} className="flex items-center justify-between p-4 text-sm"><span><b>{pin.pincode}</b> · {pin.City?.name || "City unavailable"}, {pin.City?.state}</span><button onClick={() => mutate(`/admin/pincodes/${pin.id}`, "PATCH", { is_serviceable: !pin.is_serviceable })} className="rounded-lg border px-3 py-1.5 font-bold">{pin.is_serviceable ? "Serviceable" : "Disabled"}</button></div>)}</div></Panel></div>;
}
