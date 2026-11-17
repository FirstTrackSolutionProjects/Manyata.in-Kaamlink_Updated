import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Trash2 } from "lucide-react";
import { apiRequest, getSession, logoutSession } from "../lib/api";

const emptyProfile = { full_name: "", email: "", phone: "", address_line: "", city: "", pincode: "", profile_photo: null };

async function compressPhoto(file) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Choose a photo smaller than 12 MB.");
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 640 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function Account() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(emptyProfile);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const session = getSession();

  useEffect(() => {
    if (!session.token) { navigate("/login", { replace: true }); return; }
    Promise.all([
      apiRequest("/auth/me", { token: session.token }),
      apiRequest("/bookings/me", { token: session.token }),
    ]).then(([me, items]) => {
      setProfile({ ...emptyProfile, ...me.user });
      setBookings(Array.isArray(items) ? items : []);
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [navigate, session.token]);

  const logout = () => { logoutSession(); navigate("/"); };
  const setField = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true); setProfileError("");
    try {
      const result = await apiRequest("/auth/me", { token: session.token, method: "PATCH", body: JSON.stringify(profile) });
      setProfile((current) => ({ ...current, ...result.user }));
    } catch (requestError) { setProfileError(requestError.message); }
    finally { setSaving(false); }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPhotoBusy(true); setProfileError("");
    try {
      const photo = await compressPhoto(file);
      const result = await apiRequest("/auth/me/photo", { token: session.token, method: "PUT", body: JSON.stringify({ photo }) });
      setProfile((current) => ({ ...current, profile_photo: result.profile_photo }));
    } catch (requestError) { setProfileError(requestError.message); }
    finally { setPhotoBusy(false); }
  };

  const removePhoto = async () => {
    setPhotoBusy(true); setProfileError("");
    try {
      await apiRequest("/auth/me/photo", { token: session.token, method: "DELETE" });
      setProfile((current) => ({ ...current, profile_photo: null }));
    } catch (requestError) { setProfileError(requestError.message); }
    finally { setPhotoBusy(false); }
  };

  return (
    <main className="min-h-[60vh] bg-slate-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-bold text-orange-600">Manyata account</p><h1 className="mt-1 text-3xl font-extrabold text-slate-900">Welcome, {profile.full_name || session.user?.full_name || "Customer"}</h1><p className="mt-2 text-sm text-slate-500">Your profile and service requests.</p></div>
          <button onClick={logout} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">Log out</button>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">Your profile</h2>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            {profile.profile_photo ? <img src={profile.profile_photo} alt="Your profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-orange-50" /> : <div className="grid h-24 w-24 place-items-center rounded-full bg-orange-100 text-3xl font-extrabold text-orange-700">{profile.full_name?.[0]?.toUpperCase() || "?"}</div>}
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadPhoto} className="hidden" />
              <button type="button" disabled={photoBusy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Camera size={16} />{photoBusy ? "Uploading..." : "Upload photo"}</button>
              {profile.profile_photo && <button type="button" disabled={photoBusy} onClick={removePhoto} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-60"><Trash2 size={16} />Remove photo</button>}
              <p className="basis-full text-xs text-slate-500">JPEG, PNG or WebP. The image is resized before upload.</p>
            </div>
          </div>
          {profileError && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{profileError}</p>}
          <form onSubmit={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
            {[ ["full_name", "Full name", "text"], ["email", "Email address", "email"], ["phone", "Phone number", "tel"], ["address_line", "Address", "text"], ["city", "City", "text"], ["pincode", "PIN code", "text"] ].map(([name, label, type]) => <label key={name} className={name === "address_line" ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}{name === "email" && <span className="ml-2 text-xs font-normal text-slate-400">cannot be changed here</span>}</span><input name={name} type={type} value={profile[name] || ""} onChange={setField} readOnly={name === "email"} required={name === "full_name"} maxLength={name === "address_line" ? 255 : undefined} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 read-only:bg-slate-50" /></label>)}
            <div className="sm:col-span-2"><button disabled={saving || loading} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? "Saving profile..." : "Save profile"}</button></div>
          </form>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">My bookings</h2>
          {loading && <p className="mt-5 text-sm text-slate-500">Loading your bookings...</p>}
          {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          {!loading && !error && bookings.length === 0 && <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center"><p className="text-sm text-slate-600">You don’t have any bookings yet.</p><Link to="/" className="mt-4 inline-flex rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white">Browse services</Link></div>}
          <div className="mt-5 space-y-3">{bookings.map((booking) => <article key={booking.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4"><div><h3 className="font-bold text-slate-900">{booking.service?.name || "Home service"}</h3><p className="mt-1 text-xs text-slate-500">{new Date(booking.slot_start).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {booking.address_line}, {booking.pincode}</p></div><div className="text-right"><p className="font-bold text-slate-900">₹{Number(booking.amount).toLocaleString("en-IN")}</p><p className="mt-1 text-xs font-semibold capitalize text-orange-700">{booking.status?.replaceAll("_", " ")}</p></div></article>)}</div>
        </section>
      </div>
    </main>
  );
}
