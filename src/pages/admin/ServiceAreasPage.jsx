import { useState } from "react";
import { Building2, CheckCircle2, Hash, MapPin, MapPinned, Plus } from "lucide-react";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";
import { Card, EmptyState, Field, StatStrip, Toggle, inputCls } from "./AdminUI";
import { btn } from "./AdminUI.styles";

function AreasView({ data = {}, cityDraft, setCityDraft, pincodeDraft, setPincodeDraft, mutate }) {
  const cities = data.cities || [];
  const pincodes = data.pincodes || [];

  return (
    <div className="space-y-6">
      <StatStrip items={[
        { label: "Cities", value: cities.length, Icon: Building2, tone: "violet" },
        { label: "Active cities", value: cities.filter((c) => c.is_active).length, Icon: CheckCircle2, tone: "emerald" },
        { label: "PIN codes", value: pincodes.length, Icon: Hash, tone: "sky" },
        { label: "Serviceable PINs", value: pincodes.filter((p) => p.is_serviceable).length, Icon: MapPinned, tone: "indigo" },
      ]} />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card icon={Building2} title="Service cities" subtitle="Cities where you accept bookings">
          <form onSubmit={(e) => { e.preventDefault(); mutate("/admin/cities", "POST", cityDraft); setCityDraft({ name: "", state: "" }); }} className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-2">
            <Field label="City name"><input required placeholder="e.g. Pune" value={cityDraft.name} onChange={(e) => setCityDraft({ ...cityDraft, name: e.target.value })} className={inputCls} /></Field>
            <Field label="State"><input required placeholder="e.g. Maharashtra" value={cityDraft.state} onChange={(e) => setCityDraft({ ...cityDraft, state: e.target.value })} className={inputCls} /></Field>
            <div className="sm:col-span-2"><button className={btn.primary}><Plus size={16} /> Add city</button></div>
          </form>
          <div className="max-h-[440px] divide-y divide-slate-100 overflow-y-auto">
            {cities.map((city) => (
              <div key={city.id} className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-violet-50/40">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${city.is_active ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-400"}`}><MapPin size={18} /></span>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-bold ${city.is_active ? "text-slate-900" : "text-slate-400"}`}>{city.name}</p>
                    <p className="truncate text-xs text-slate-400">{city.state}</p>
                  </div>
                </div>
                <Toggle on={!!city.is_active} label={city.is_active ? "Active" : "Disabled"} onClick={() => mutate(`/admin/cities/${city.id}`, "PATCH", { is_active: !city.is_active })} />
              </div>
            ))}
            {!cities.length && <EmptyState icon={Building2} title="No cities yet" text="Add your first service city above." />}
          </div>
        </Card>

        <Card icon={Hash} title="Serviceable PIN codes" subtitle="Control which areas you can reach">
          <form onSubmit={(e) => { e.preventDefault(); mutate("/admin/pincodes", "POST", { ...pincodeDraft, city_id: Number(pincodeDraft.city_id) }); setPincodeDraft({ pincode: "", city_id: "" }); }} className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-2">
            <Field label="PIN code"><input required pattern="[1-9][0-9]{5}" maxLength="6" placeholder="6-digit PIN code" value={pincodeDraft.pincode} onChange={(e) => setPincodeDraft({ ...pincodeDraft, pincode: e.target.value })} className={inputCls} /></Field>
            <Field label="City">
              <select required value={pincodeDraft.city_id} onChange={(e) => setPincodeDraft({ ...pincodeDraft, city_id: e.target.value })} className={inputCls}>
                <option value="">Select city</option>
                {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2"><button className={btn.primary}><Plus size={16} /> Add PIN code</button></div>
          </form>
          <div className="max-h-[440px] divide-y divide-slate-100 overflow-y-auto">
            {pincodes.map((pin) => (
              <div key={pin.id} className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-violet-50/40">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`rounded-lg px-2.5 py-1.5 font-mono text-sm font-extrabold tracking-wider ${pin.is_serviceable ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>{pin.pincode}</span>
                  <p className="truncate text-sm text-slate-600">{pin.City?.name || "City unavailable"}{pin.City?.state ? `, ${pin.City.state}` : ""}</p>
                </div>
                <Toggle on={!!pin.is_serviceable} label={pin.is_serviceable ? "Serviceable" : "Disabled"} onClick={() => mutate(`/admin/pincodes/${pin.id}`, "PATCH", { is_serviceable: !pin.is_serviceable })} />
              </div>
            ))}
            {!pincodes.length && <EmptyState icon={Hash} title="No PIN codes yet" text="Add serviceable PIN codes above." />}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ServiceAreasPage() {
  const resource = useAdminSection("/admin/service-areas");
  const [cityDraft, setCityDraft] = useState({ name: "", state: "" });
  const [pincodeDraft, setPincodeDraft] = useState({ pincode: "", city_id: "" });
  return <AdminPageFrame title="Service areas" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <AreasView data={resource.data} cityDraft={cityDraft} setCityDraft={setCityDraft} pincodeDraft={pincodeDraft} setPincodeDraft={setPincodeDraft} mutate={resource.mutate} />
  </AdminPageFrame>;
}
