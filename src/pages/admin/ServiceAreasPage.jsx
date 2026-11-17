import { useState } from "react";
import { Panel } from "./AdminShared";
import AdminPageFrame from "./AdminPageFrame";
import useAdminSection from "./useAdminSection";

function AreasView({ data = {}, cityDraft, setCityDraft, pincodeDraft, setPincodeDraft, mutate }) {
  const cities = data.cities || []; const pincodes = data.pincodes || [];
  return <div className="space-y-5"><Panel title="Add a service city"><form onSubmit={(e) => { e.preventDefault(); mutate("/admin/cities", "POST", cityDraft); setCityDraft({ name: "", state: "" }); }} className="flex flex-wrap gap-3 p-5"><input required placeholder="City name" value={cityDraft.name} onChange={(e) => setCityDraft({ ...cityDraft, name: e.target.value })} className="rounded-xl border p-3 text-sm" /><input required placeholder="State" value={cityDraft.state} onChange={(e) => setCityDraft({ ...cityDraft, state: e.target.value })} className="rounded-xl border p-3 text-sm" /><button className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white">Add city</button></form><div className="divide-y">{cities.map((city) => <div key={city.id} className="flex items-center justify-between p-4 text-sm"><span><b>{city.name}</b>, {city.state}</span><button onClick={() => mutate(`/admin/cities/${city.id}`, "PATCH", { is_active: !city.is_active })} className="rounded-lg border px-3 py-1.5 font-bold">{city.is_active ? "Disable" : "Enable"}</button></div>)}</div></Panel><Panel title="Add serviceable PIN code"><form onSubmit={(e) => { e.preventDefault(); mutate("/admin/pincodes", "POST", { ...pincodeDraft, city_id: Number(pincodeDraft.city_id) }); setPincodeDraft({ pincode: "", city_id: "" }); }} className="flex flex-wrap gap-3 p-5"><input required pattern="[1-9][0-9]{5}" maxLength="6" placeholder="6-digit PIN code" value={pincodeDraft.pincode} onChange={(e) => setPincodeDraft({ ...pincodeDraft, pincode: e.target.value })} className="rounded-xl border p-3 text-sm" /><select required value={pincodeDraft.city_id} onChange={(e) => setPincodeDraft({ ...pincodeDraft, city_id: e.target.value })} className="rounded-xl border p-3 text-sm"><option value="">Select city</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select><button className="rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white">Add PIN code</button></form><div className="divide-y">{pincodes.map((pin) => <div key={pin.id} className="flex items-center justify-between p-4 text-sm"><span><b>{pin.pincode}</b> · {pin.City?.name || "City unavailable"}, {pin.City?.state}</span><button onClick={() => mutate(`/admin/pincodes/${pin.id}`, "PATCH", { is_serviceable: !pin.is_serviceable })} className="rounded-lg border px-3 py-1.5 font-bold">{pin.is_serviceable ? "Serviceable" : "Disabled"}</button></div>)}</div></Panel></div>;
}

export default function ServiceAreasPage() {
  const resource = useAdminSection("/admin/service-areas");
  const [cityDraft, setCityDraft] = useState({ name: "", state: "" });
  const [pincodeDraft, setPincodeDraft] = useState({ pincode: "", city_id: "" });
  return <AdminPageFrame title="Service areas" loading={resource.loading} error={resource.error} notice={resource.notice} onRefresh={resource.load}>
    <AreasView data={resource.data} cityDraft={cityDraft} setCityDraft={setCityDraft} pincodeDraft={pincodeDraft} setPincodeDraft={setPincodeDraft} mutate={resource.mutate} />
  </AdminPageFrame>;
}
