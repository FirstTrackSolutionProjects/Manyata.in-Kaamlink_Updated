
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Mail,
  MapPin,
  Paintbrush,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";

// ============================================
// PAINT PRODUCTS
// Add, remove or update products from here.
// ============================================

const PRODUCTS = [
  {
    id: 1,
    name: "Interior Wall Paint",
    category: "Interior Collection",
    description:
      "Create beautiful interiors with elegant colours and a smooth finish.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85",
  },
  {
    id: 2,
    name: "Exterior Wall Paint",
    category: "Exterior Collection",
    description:
      "Give your exterior walls a fresh and attractive appearance.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85",
  },
  {
    id: 3,
    name: "Wall Primer",
    category: "Surface Preparation",
    description:
      "Prepare your walls for a smooth and beautiful paint finish.",
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=900&q=85",
  },
  {
    id: 4,
    name: "Enamel Paint",
    category: "Specialty Collection",
    description:
      "A fresh finish for doors, windows and other surfaces.",
    image:
      "https://images.unsplash.com/photo-1565373679107-344d5f3f6c9e?w=900&q=85",
  },
  {
    id: 5,
    name: "Texture Paint",
    category: "Designer Collection",
    description:
      "Add depth, character and style to your walls.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85",
  },
];

// ============================================
// DEALER INFORMATION
// Update dealer details from here.
// ============================================

const DEALER = {
  name: "Manyata Authorised Paint Dealer",
  company: "Manyata Paints",
  contactPerson: "Dealer Representative",
  city: "Soro",
  state: "Odisha",
  address: "Soro, Balasore, Odisha, India",
  phone: "+91 8114721300",
  email: "info@manyata.in",
  image:
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=85",
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function AuthorisedDealers() {
  const [imageErrors, setImageErrors] = useState({});

  const phoneLink = `tel:${DEALER.phone.replace(/\s/g, "")}`;
  const emailLink = `mailto:${DEALER.email}`;

  const requestUrl = `/contact?request=dealer&dealer=${encodeURIComponent(
    DEALER.name
  )}&company=${encodeURIComponent(
    DEALER.company
  )}&city=${encodeURIComponent(
    DEALER.city
  )}&address=${encodeURIComponent(DEALER.address)}`;

  const handleImageError = (imageKey) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafaf8] text-slate-900">

      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section className="relative overflow-hidden bg-[#101d35]">

        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:py-28">

          {/* HERO CONTENT */}

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              <Sparkles size={15} />
              Discover Manyata Paints
            </div>

            <h1 className="mt-7 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Bring Your Walls
              <span className="mt-2 block text-amber-400">
                To Life.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              Explore beautiful paint collections and connect
              with your authorised Manyata paint dealer for
              product information and assistance.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">

              <a
                href="#paint-collection"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-sm font-extrabold text-slate-950 transition hover:-translate-y-1 hover:bg-amber-300"
              >
                Explore Paints
                <ArrowRight size={18} />
              </a>

              <a
                href="#authorised-dealer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Find Dealer
                <MapPin size={18} />
              </a>

            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">

              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-amber-400" />
                Dealer Assistance
              </span>

              <span className="flex items-center gap-2">
                <Palette size={18} className="text-amber-400" />
                Paint Collections
              </span>

            </div>
          </div>

          {/* HERO IMAGE */}

          <div className="relative">

            <div className="absolute -inset-4 rounded-[2rem] border border-amber-300/20" />

            <img
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=90"
              alt="Beautiful modern home interior"
              className="relative h-[320px] w-full rounded-[1.7rem] object-cover shadow-2xl sm:h-[430px]"
            />

            <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-white/50 bg-white p-4 shadow-xl sm:left-8 sm:right-auto sm:min-w-[260px]">

              <div className="flex items-center gap-3">

                <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-amber-700">
                  <Paintbrush size={24} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    Beautiful Spaces
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Find your perfect colours
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================
          PAINT COLLECTION SECTION
      ====================================== */}

      <section
        id="paint-collection"
        className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">
              Explore Our Collection
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Discover Our Paint Range
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Explore different paint categories for your home
              and spaces.
            </p>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {PRODUCTS.map((product) => (

              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                {/* PRODUCT IMAGE */}

                <div className="relative h-60 overflow-hidden bg-slate-100">

                  {!imageErrors[`product-${product.id}`] ? (

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={() =>
                        handleImageError(`product-${product.id}`)
                      }
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                  ) : (

                    <div className="grid h-full place-items-center bg-gradient-to-br from-amber-100 to-orange-200">
                      <Paintbrush
                        size={48}
                        className="text-amber-700"
                      />
                    </div>

                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 shadow-sm">
                    {product.category}
                  </span>

                </div>

                {/* PRODUCT DETAILS */}

                <div className="p-6">

                  <h3 className="text-xl font-extrabold text-slate-900">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {product.description}
                  </p>

                  <a
                    href="#authorised-dealer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-amber-700 transition group-hover:gap-3"
                  >
                    Contact Dealer
                    <ArrowUpRight size={17} />
                  </a>

                </div>

              </article>

            ))}

          </div>
        </div>
      </section>

      {/* =====================================
          COLOUR INSPIRATION SECTION
      ====================================== */}

      <section className="bg-[#f0eee8] px-5 py-16 sm:px-8 lg:py-20">

        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">

          <div>

            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-700">
              Inspiration For Your Space
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
              Every Wall Has
              <span className="block text-amber-700">
                A Story To Tell.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-8 text-slate-600 sm:text-base">
              Give your home a fresh look with beautiful colours
              and thoughtful paint choices. Connect with our
              dealer for assistance with your paint requirements.
            </p>

            <a
              href="#authorised-dealer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#101d35] px-6 py-4 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              Connect With Dealer
              <ArrowRight size={18} />
            </a>

          </div>

          {/* INSPIRATION IMAGES */}

          <div className="grid grid-cols-2 gap-3 sm:gap-4">

            <div className="overflow-hidden rounded-3xl">

              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=700&q=85"
                alt="Modern interior colour inspiration"
                loading="lazy"
                className="h-52 w-full object-cover sm:h-64"
              />

            </div>

            <div className="mt-8 overflow-hidden rounded-3xl">

              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=85"
                alt="Elegant home interior"
                loading="lazy"
                className="h-52 w-full object-cover sm:h-64"
              />

            </div>

          </div>

        </div>
      </section>

      {/* =====================================
          AUTHORISED DEALER SECTION
      ====================================== */}

      <section
        id="authorised-dealer"
        className="scroll-mt-24 px-5 py-20 sm:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">

            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600">
              Find Your Dealer
            </span>

            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              Authorised Paint Dealer
            </h2>

            <p className="mt-4 text-sm text-slate-500 sm:text-base">
              Connect with our dealer for product enquiries and assistance.
            </p>

          </div>

          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

            {/* DEALER IMAGE */}

            <div className="relative min-h-[320px] bg-slate-200 lg:min-h-[540px]">

              {!imageErrors.dealer ? (

                <img
                  src={DEALER.image}
                  alt="Manyata paint dealer showroom"
                  onError={() => handleImageError("dealer")}
                  className="absolute inset-0 h-full w-full object-cover"
                />

              ) : (

                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-amber-100 to-orange-200">
                  <Store size={70} className="text-amber-700" />
                </div>

              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#101d35]/80 via-transparent to-transparent" />

              <div className="absolute bottom-7 left-6 right-6 text-white sm:left-9 sm:right-9">

                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur-md">
                  <BadgeCheck size={16} className="text-amber-300" />
                  Authorised Dealer
                </span>

                <h3 className="mt-4 text-2xl font-black sm:text-3xl">
                  {DEALER.company}
                </h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-white/80">
                  <MapPin size={16} />
                  {DEALER.city}, {DEALER.state}
                </p>

              </div>
            </div>

            {/* DEALER DETAILS */}

            <div className="p-6 sm:p-10 lg:p-12">

              <div className="flex items-center gap-3">

                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                  <Building2 size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Dealer Information
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Get in touch with us
                  </p>
                </div>

              </div>

              <h3 className="mt-8 text-2xl font-black text-slate-900 sm:text-3xl">
                {DEALER.name}
              </h3>

              <div className="mt-7 space-y-5">

                {/* CONTACT PERSON */}

                <div className="flex gap-4">

                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Contact Person
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {DEALER.contactPerson}
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}

                <div className="flex gap-4">

                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Full Address
                    </p>

                    <p className="mt-1 text-sm font-bold leading-6 text-slate-900">
                      {DEALER.address}
                    </p>
                  </div>

                </div>

                {/* PHONE */}

                <div className="flex gap-4">

                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <Phone size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Contact Number
                    </p>

                    <a
                      href={phoneLink}
                      className="mt-1 block text-sm font-bold text-slate-900 hover:text-amber-700"
                    >
                      {DEALER.phone}
                    </a>
                  </div>

                </div>

                {/* EMAIL */}

                <div className="flex gap-4">

                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                    <Mail size={21} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Email Address
                    </p>

                    <a
                      href={emailLink}
                      className="mt-1 block break-all text-sm font-bold text-slate-900 hover:text-amber-700"
                    >
                      {DEALER.email}
                    </a>
                  </div>

                </div>

              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-9 grid gap-3 sm:grid-cols-2">

                <a
                  href={phoneLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#101d35] px-5 py-4 text-sm font-bold text-white transition hover:bg-amber-600"
                >
                  <Phone size={18} />
                  Call Dealer
                </a>

                <a
                  href={emailLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-bold text-slate-800 transition hover:border-amber-400 hover:bg-amber-50"
                >
                  <Mail size={18} />
                  Send Email
                </a>

                <Link
                  to={requestUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-4 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 sm:col-span-2"
                >
                  Request Dealer Assistance
                  <ArrowUpRight size={18} />
                </Link>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          BECOME A DEALER SECTION
      ====================================== */}

      <section className="px-5 pb-20 sm:px-8">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#101d35] px-6 py-14 text-center sm:px-12 sm:py-16">

          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative">

            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-amber-300">
              <Store size={27} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-white sm:text-4xl">
              Become a Manyata Paint Dealer
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Interested in joining the Manyata dealer network?
              Contact our team to discuss business opportunities.
            </p>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-7 py-4 text-sm font-extrabold text-slate-950 transition hover:-translate-y-1 hover:bg-amber-300"
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







// import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Search,
//   MapPin,
//   Phone,
//   Mail,
//   Building2,
//   BadgeCheck,
//   ArrowRight,
//   ArrowUpRight,
//   Store,
//   ShieldCheck,
//   Users,
// } from "lucide-react";

// const DEALERS = [
//   {
//     id: 1,
//     name: "Manyata Dealer – Bhubaneswar",
//     company: "Demo Enterprises",
//     city: "Bhubaneswar",
//     state: "Odisha",
//     address: "Unit 4, Janpath Road, Bhubaneswar, Odisha",
//     phone: "+91 90000 00001",
//     email: "dealer1@example.com",
//     initials: "DE",
//   },
//   {
//     id: 2,
//     name: "Manyata Dealer – Cuttack",
//     company: "Demo Solutions",
//     city: "Cuttack",
//     state: "Odisha",
//     address: "College Square, Cuttack, Odisha",
//     phone: "+91 90000 00002",
//     email: "dealer2@example.com",
//     initials: "DS",
//   },
//   {
//     id: 3,
//     name: "Manyata Dealer – Kolkata",
//     company: "Demo Trading Company",
//     city: "Kolkata",
//     state: "West Bengal",
//     address: "Park Street, Kolkata, West Bengal",
//     phone: "+91 90000 00003",
//     email: "dealer3@example.com",
//     initials: "DT",
//   },
//   {
//     id: 4,
//     name: "Manyata Dealer – Bengaluru",
//     company: "Demo Marketing Services",
//     city: "Bengaluru",
//     state: "Karnataka",
//     address: "MG Road, Bengaluru, Karnataka",
//     phone: "+91 90000 00004",
//     email: "dealer4@example.com",
//     initials: "DM",
//   },
//   {
//     id: 5,
//     name: "Manyata Dealer – Mumbai",
//     company: "Demo Business Associates",
//     city: "Mumbai",
//     state: "Maharashtra",
//     address: "Andheri East, Mumbai, Maharashtra",
//     phone: "+91 90000 00005",
//     email: "dealer5@example.com",
//     initials: "DB",
//   },
//   {
//     id: 6,
//     name: "Manyata Dealer – Hyderabad",
//     company: "Demo Retail Partners",
//     city: "Hyderabad",
//     state: "Telangana",
//     address: "Hitech City, Hyderabad, Telangana",
//     phone: "+91 90000 00006",
//     email: "dealer6@example.com",
//     initials: "DR",
//   },
// ];

// const CITIES = [
//   "All Cities",
//   ...new Set(DEALERS.map((dealer) => dealer.city)),
// ];

// export default function AuthorisedDealers() {
//   const [search, setSearch] = useState("");
//   const [selectedCity, setSelectedCity] = useState("All Cities");

//   const filteredDealers = useMemo(() => {
//     return DEALERS.filter((dealer) => {
//       const searchText = search.toLowerCase();

//       const matchesSearch =
//         dealer.name.toLowerCase().includes(searchText) ||
//         dealer.company.toLowerCase().includes(searchText) ||
//         dealer.city.toLowerCase().includes(searchText) ||
//         dealer.state.toLowerCase().includes(searchText);

//       const matchesCity =
//         selectedCity === "All Cities" ||
//         dealer.city === selectedCity;

//       return matchesSearch && matchesCity;
//     });
//   }, [search, selectedCity]);

//   return (
//     <main className="min-h-screen overflow-hidden bg-[#faf9ff] text-slate-900">
//       {/* Hero Section */}
//       <section className="relative isolate overflow-hidden bg-[#17112f]">
//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -left-32 -top-32 -z-10 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl"
//         />

//         <div
//           aria-hidden="true"
//           className="pointer-events-none absolute -bottom-40 -right-20 -z-10 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
//         />

//         <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
//           <div className="mx-auto max-w-3xl text-center">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-violet-300 shadow-xl">
//               <Store size={32} />
//             </div>

//             <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
//               <BadgeCheck size={15} />
//               Manyata Dealer Network
//             </span>

//             <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
//               Find Your Nearest
//               <span className="mt-2 block text-violet-300">
//                 Authorised Dealer
//               </span>
//             </h1>

//             <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-lg sm:leading-8">
//               Connect with our authorised dealer network for genuine
//               assistance, product information and reliable support.
//             </p>

//             <a
//               href="#dealer-list"
//               className="mt-9 inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-400"
//             >
//               Explore Dealers
//               <ArrowRight size={18} />
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Highlights */}
//       <section className="relative z-10 mx-auto -mt-7 max-w-6xl px-5 sm:px-6 lg:px-8">
//         <div className="grid gap-4 sm:grid-cols-3">
//           <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/5">
//             <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
//               <Store size={24} />
//             </div>
//             <div>
//               <p className="text-2xl font-extrabold text-slate-900">
//                 {DEALERS.length}
//               </p>
//               <p className="text-sm text-slate-500">Sample dealer listings</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/5">
//             <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
//               <MapPin size={24} />
//             </div>
//             <div>
//               <p className="text-2xl font-extrabold text-slate-900">
//                 {CITIES.length - 1}
//               </p>
//               <p className="text-sm text-slate-500">Sample cities</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-900/5">
//             <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">
//               <Users size={24} />
//             </div>
//             <div>
//               <p className="text-2xl font-extrabold text-slate-900">
//                 Local
//               </p>
//               <p className="text-sm text-slate-500">Dealer assistance</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Dealer Search */}
//       <section
//         id="dealer-list"
//         className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-6 sm:py-20 lg:px-8"
//       >
//         <div className="mx-auto mb-10 max-w-2xl text-center">
//           <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
//             Our Dealer Network
//           </span>

//           <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
//             Explore Our Dealers
//           </h2>

//           <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
//             Search by dealer name, company or city to find the right
//             contact for your location.
//           </p>
//         </div>

//         {/* Search and Filter */}
//         <div className="mb-9 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:p-5">
//           <div className="relative flex-1">
//             <Search
//               size={20}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search dealer, company or city..."
//               className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
//             />
//           </div>

//           <select
//             value={selectedCity}
//             onChange={(e) => setSelectedCity(e.target.value)}
//             className="h-13 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-4 focus:ring-violet-100 sm:w-56"
//           >
//             {CITIES.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Placeholder Notice */}
//         <div className="mb-7 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//           <ShieldCheck
//             size={21}
//             className="mt-0.5 shrink-0 text-amber-600"
//           />
//           <p className="text-xs leading-6 text-amber-800 sm:text-sm">
//             <strong>Demo content:</strong> These dealer names, addresses,
//             phone numbers and email addresses are placeholders for design
//             and testing. Replace them with verified Manyata dealer details
//             before publishing.
//           </p>
//         </div>

//         {/* Dealer Cards */}
//         {filteredDealers.length > 0 ? (
//           <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//             {filteredDealers.map((dealer) => (
//               <article
//                 key={dealer.id}
//                 className="group flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-900/5"
//               >
//                 {/* Dealer Header */}
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-lg font-extrabold text-white shadow-lg shadow-violet-500/20">
//                     {dealer.initials}
//                   </div>

//                   <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
//                     <BadgeCheck size={13} />
//                     Demo listing
//                   </span>
//                 </div>

//                 <h3 className="mt-5 text-lg font-extrabold text-slate-900 transition-colors group-hover:text-violet-700">
//                   {dealer.name}
//                 </h3>

//                 <p className="mt-1 text-sm font-medium text-violet-600">
//                   {dealer.company}
//                 </p>

//                 <div className="my-5 h-px bg-slate-100" />

//                 {/* Dealer Information */}
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <MapPin
//                       size={18}
//                       className="mt-0.5 shrink-0 text-violet-500"
//                     />
//                     <p className="text-sm leading-6 text-slate-600">
//                       {dealer.address}
//                     </p>
//                   </div>

//                   <a
//                     href={`tel:${dealer.phone.replace(/\s/g, "")}`}
//                     className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-violet-700"
//                   >
//                     <Phone size={17} className="shrink-0 text-violet-500" />
//                     {dealer.phone}
//                   </a>

//                   <a
//                     href={`mailto:${dealer.email}`}
//                     className="flex items-center gap-3 break-all text-sm text-slate-600 transition-colors hover:text-violet-700"
//                   >
//                     <Mail size={17} className="shrink-0 text-violet-500" />
//                     {dealer.email}
//                   </a>
//                 </div>

//                 {/* Card Footer */}
//                 <div className="mt-auto flex gap-3 pt-7">
//                   <a
//                     href={`tel:${dealer.phone.replace(/\s/g, "")}`}
//                     className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-violet-700"
//                   >
//                     <Phone size={16} />
//                     Call Dealer
//                   </a>

//                   <a
//                     href={`mailto:${dealer.email}`}
//                     aria-label={`Email ${dealer.company}`}
//                     className="grid h-11 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
//                   >
//                     <ArrowUpRight size={19} />
//                   </a>
//                 </div>
//               </article>
//             ))}
//           </div>
//         ) : (
//           <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
//             <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600">
//               <Search size={25} />
//             </div>

//             <h3 className="mt-5 text-xl font-bold text-slate-900">
//               No dealers found
//             </h3>

//             <p className="mt-2 text-sm text-slate-500">
//               Try another dealer name or select a different city.
//             </p>

//             <button
//               type="button"
//               onClick={() => {
//                 setSearch("");
//                 setSelectedCity("All Cities");
//               }}
//               className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-violet-700"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </section>

//       {/* Become a Dealer CTA */}
//       <section className="px-5 pb-16 sm:px-6 sm:pb-20 lg:px-8">
//         <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#17112f] px-6 py-12 text-center sm:px-12 sm:py-16">
//           <div
//             aria-hidden="true"
//             className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
//           />

//           <div className="relative mx-auto max-w-2xl">
//             <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-violet-300">
//               <Building2 size={27} />
//             </div>

//             <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-4xl">
//               Interested in becoming a dealer?
//             </h2>

//             <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
//               Connect with Manyata and explore opportunities to grow
//               your business with our dealer network.
//             </p>

//             <Link
//               to="/contact"
//               className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-500 px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-violet-400"
//             >
//               Contact Manyata
//               <ArrowRight size={18} />
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }