import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, getSession, logoutSession } from "../lib/api";

export default function Account() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const session = getSession();

  useEffect(() => {
    if (!session.token) {
      navigate("/login", { replace: true });
      return;
    }
    apiRequest("/bookings/me", { token: session.token })
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [navigate, session.token]);

  const logout = () => {
    logoutSession();
    navigate("/");
  };

  return (
    <main className="min-h-[60vh] bg-slate-50 px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-bold text-orange-600">Manyata account</p><h1 className="mt-1 text-3xl font-extrabold text-slate-900">Welcome, {session.user?.full_name || "Customer"}</h1><p className="mt-2 text-sm text-slate-500">Your upcoming and previous service requests.</p></div>
          <button onClick={logout} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">Log out</button>
        </div>
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
