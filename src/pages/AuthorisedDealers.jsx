import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Building2,
  BadgeCheck,
  ArrowRight,
  ArrowUpRight,
  Store,
  ShieldCheck,
  Users,
} from "lucide-react";

const DEALERS = [
  {
    id: 1,
    name: "Manyata Dealer – Bhubaneswar",
    company: "Demo Enterprises",
    city: "Bhubaneswar",
    state: "Odisha",
    address: "Unit 4, Janpath Road, Bhubaneswar, Odisha",
    phone: "+91 90000 00001",
    email: "dealer1@example.com",
    initials: "DE",
  },
  {
    id: 2,
    name: "Manyata Dealer – Cuttack",
    company: "Demo Solutions",
    city: "Cuttack",
    state: "Odisha",
    address: "College Square, Cuttack, Odisha",
    phone: "+91 90000 00002",
    email: "dealer2@example.com",
    initials: "DS",
  },
  {
    id: 3,
    name: "Manyata Dealer – Kolkata",
    company: "Demo Trading Company",
    city: "Kolkata",
    state: "West Bengal",
    address: "Park Street, Kolkata, West Bengal",
    phone: "+91 90000 00003",
    email: "dealer3@example.com",
    initials: "DT",
  },
  {
    id: 4,
    name: "Manyata Dealer – Bengaluru",
    company: "Demo Marketing Services",
    city: "Bengaluru",
    state: "Karnataka",
    address: "MG Road, Bengaluru, Karnataka",
    phone: "+91 90000 00004",
    email: "dealer4@example.com",
    initials: "DM",
  },
  {
    id: 5,
    name: "Manyata Dealer – Mumbai",
    company: "Demo Business Associates",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Andheri East, Mumbai, Maharashtra",
    phone: "+91 90000 00005",
    email: "dealer5@example.com",
    initials: "DB",
  },
  {
    id: 6,
    name: "Manyata Dealer – Hyderabad",
    company: "Demo Retail Partners",
    city: "Hyderabad",
    state: "Telangana",
    address: "Hitech City, Hyderabad, Telangana",
    phone: "+91 90000 00006",
    email: "dealer6@example.com",
    initials: "DR",
  },
];

const CITIES = [
  "All Cities",
  ...new Set(DEALERS.map((dealer) => dealer.city)),
];

export default function AuthorisedDealers() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const filteredDealers = useMemo(() => {
    return DEALERS.filter((dealer) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        dealer.name.toLowerCase().includes(searchText) ||
        dealer.company.toLowerCase().includes(searchText) ||
        dealer.city.toLowerCase().includes(searchText) ||
        dealer.state.toLowerCase().includes(searchText);

      const matchesCity =
        selectedCity === "All Cities" ||
        dealer.city === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [search, selectedCity]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9ff] text-slate-900">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#17112f]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-violet-300 shadow-xl">
              <Store size={32} />
            </div>

            <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
              <BadgeCheck size={15} />
              Manyata Dealer Network
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Nearest
              <span className="mt-2 block text-violet-300">
                Authorised Dealer
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Connect with our authorised dealer network for genuine
              assistance, product information and reliable support.
            </p>

            <a
              href="#dealer-list"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400"
            >
              Explore Dealers
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="relative z-10 mx-auto -mt-7 max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Store size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {DEALERS.length}
              </p>
              <p className="text-sm text-slate-500">Sample dealer listings</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {CITIES.length - 1}
              </p>
              <p className="text-sm text-slate-500">Sample cities</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                Local
              </p>
              <p className="text-sm text-slate-500">Dealer assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dealer Search */}
      <section
        id="dealer-list"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Our Dealer Network
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore Our Dealers
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
            Search by dealer name, company or city to find the right
            contact for your location.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-9 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:p-5">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dealer, company or city..."
              className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="h-13 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:w-56"
          >
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Placeholder Notice */}
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-amber-600"
          />
          <p className="text-xs leading-6 text-amber-800 sm:text-sm">
            <strong>Demo content:</strong> These dealer names, addresses,
            phone numbers and email addresses are placeholders for design
            and testing. Replace them with verified Manyata dealer details
            before publishing.
          </p>
        </div>

        {/* Dealer Cards */}
        {filteredDealers.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredDealers.map((dealer) => (
              <article
                key={dealer.id}
                className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5"
              >
                {/* Dealer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-lg font-extrabold text-white shadow-lg shadow-violet-500/20">
                    {dealer.initials}
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    <BadgeCheck size={13} />
                    Demo listing
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-slate-900 transition-colors group-hover:text-violet-700">
                  {dealer.name}
                </h3>

                <p className="mt-1 text-sm font-medium text-violet-600">
                  {dealer.company}
                </p>

                <div className="my-5 h-px bg-slate-100" />

                {/* Dealer Information */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-500"
                    />
                    <p className="text-sm leading-6 text-slate-600">
                      {dealer.address}
                    </p>
                  </div>

                  <a
                    href={`tel:${dealer.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-violet-700"
                  >
                    <Phone size={17} className="shrink-0 text-violet-500" />
                    {dealer.phone}
                  </a>

                  <a
                    href={`mailto:${dealer.email}`}
                    className="flex items-center gap-3 break-all text-sm text-slate-600 transition-colors hover:text-violet-700"
                  >
                    <Mail size={17} className="shrink-0 text-violet-500" />
                    {dealer.email}
                  </a>
                </div>

                {/* Card Footer */}
                <div className="mt-auto flex gap-3 pt-7">
                  <a
                    href={`tel:${dealer.phone.replace(/\s/g, "")}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-violet-700"
                  >
                    <Phone size={16} />
                    Call Dealer
                  </a>

                  <a
                    href={`mailto:${dealer.email}`}
                    aria-label={`Email ${dealer.company}`}
                    className="grid h-11 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  >
                    <ArrowUpRight size={19} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600">
              <Search size={25} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No dealers found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another dealer name or select a different city.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCity("All Cities");
              }}
              className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Become a Dealer CTA */}
      <section className="px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#17112f] px-6 py-12 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-violet-300">
              <Building2 size={27} />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-4xl">
              Interested in becoming a dealer?
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Connect with Manyata and explore opportunities to grow
              your business with our dealer network.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-violet-400"
            >
              Contact Manyata
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}