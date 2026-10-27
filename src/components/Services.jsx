
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Sparkles,
  Bug,
  Wind,
  Wrench,
  Zap,
  Settings,
  PaintRoller,
  Hammer,
  Scissors,
  Truck,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const SERVICES = [
  {
    icon: Sparkles,
    name: "Deep Cleaning",
    desc: "Complete home deep cleaning, including kitchens and bathrooms.",
    rating: 4.9,
    reviews: "2.3k",
    duration: "3–4 hrs",
    price: 499,
    original: 699,
    tag: "Bestseller",
    color: "orange",
  },
  {
    icon: Bug,
    name: "Pest Control",
    desc: "Effective treatment for cockroaches, ants and termites.",
    rating: 4.8,
    reviews: "1.8k",
    duration: "60–90 min",
    price: 599,
    original: 799,
    tag: "Popular",
    color: "green",
  },
  {
    icon: Wind,
    name: "AC Repair & Service",
    desc: "AC servicing, gas refill and installation by skilled experts.",
    rating: 4.7,
    reviews: "1.2k",
    duration: "45–60 min",
    price: 399,
    original: null,
    tag: null,
    color: "blue",
  },
  {
    icon: Wrench,
    name: "Plumbing",
    desc: "Quick solutions for leaking taps, pipes and bathroom fittings.",
    rating: 4.6,
    reviews: "950",
    duration: "30–45 min",
    price: 299,
    original: null,
    tag: null,
    color: "cyan",
  },
  {
    icon: Zap,
    name: "Electrical",
    desc: "Reliable wiring, switchboard and electrical repair services.",
    rating: 4.7,
    reviews: "890",
    duration: "30–45 min",
    price: 299,
    original: null,
    tag: null,
    color: "yellow",
  },
  {
    icon: Settings,
    name: "Appliance Repair",
    desc: "Expert home repairs for washing machines, fridges and more.",
    rating: 4.6,
    reviews: "760",
    duration: "45–60 min",
    price: 349,
    original: null,
    tag: null,
    color: "purple",
  },
  {
    icon: PaintRoller,
    name: "Painting",
    desc: "Beautiful interior and exterior finishes for your home.",
    rating: 4.8,
    reviews: "540",
    duration: "1–2 days",
    price: 899,
    original: null,
    tag: "New",
    color: "pink",
  },
  {
    icon: Hammer,
    name: "Carpentry",
    desc: "Furniture repairs, installations and custom woodwork.",
    rating: 4.5,
    reviews: "610",
    duration: "45–60 min",
    price: 349,
    original: null,
    tag: null,
    color: "amber",
  },
  {
    icon: Scissors,
    name: "Salon at Home",
    desc: "Personal grooming, haircuts and beauty services at home.",
    rating: 4.9,
    reviews: "2.1k",
    duration: "60–90 min",
    price: 449,
    original: 599,
    tag: "Popular",
    color: "rose",
  },
  {
    icon: Truck,
    name: "Packers & Movers",
    desc: "Careful and convenient home shifting within and across cities.",
    rating: 4.7,
    reviews: "430",
    duration: "Half day",
    price: 1499,
    original: null,
    tag: null,
    color: "indigo",
  },
];

const COLOR_STYLES = {
  orange: {
    icon: "bg-orange-100 text-orange-600",
    glow: "group-hover:bg-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
    accent: "text-orange-600",
    light: "bg-orange-50",
  },
  green: {
    icon: "bg-green-100 text-green-600",
    glow: "group-hover:bg-green-500",
    button: "bg-green-600 hover:bg-green-700",
    accent: "text-green-600",
    light: "bg-green-50",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    glow: "group-hover:bg-blue-500",
    button: "bg-blue-600 hover:bg-blue-700",
    accent: "text-blue-600",
    light: "bg-blue-50",
  },
  cyan: {
    icon: "bg-cyan-100 text-cyan-700",
    glow: "group-hover:bg-cyan-500",
    button: "bg-cyan-600 hover:bg-cyan-700",
    accent: "text-cyan-700",
    light: "bg-cyan-50",
  },
  yellow: {
    icon: "bg-yellow-100 text-yellow-700",
    glow: "group-hover:bg-yellow-500",
    button: "bg-yellow-500 hover:bg-yellow-600",
    accent: "text-yellow-700",
    light: "bg-yellow-50",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600",
    glow: "group-hover:bg-purple-500",
    button: "bg-purple-600 hover:bg-purple-700",
    accent: "text-purple-600",
    light: "bg-purple-50",
  },
  pink: {
    icon: "bg-pink-100 text-pink-600",
    glow: "group-hover:bg-pink-500",
    button: "bg-pink-600 hover:bg-pink-700",
    accent: "text-pink-600",
    light: "bg-pink-50",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700",
    glow: "group-hover:bg-amber-500",
    button: "bg-amber-600 hover:bg-amber-700",
    accent: "text-amber-700",
    light: "bg-amber-50",
  },
  rose: {
    icon: "bg-rose-100 text-rose-600",
    glow: "group-hover:bg-rose-500",
    button: "bg-rose-600 hover:bg-rose-700",
    accent: "text-rose-600",
    light: "bg-rose-50",
  },
  indigo: {
    icon: "bg-indigo-100 text-indigo-600",
    glow: "group-hover:bg-indigo-500",
    button: "bg-indigo-600 hover:bg-indigo-700",
    accent: "text-indigo-600",
    light: "bg-indigo-50",
  },
};

function chunk(arr, size) {
  const result = [];

  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}

function ServiceCard({ service, onBook }) {
  const Icon = service.icon;
  const colors = COLOR_STYLES[service.color];

  const handleBooking = () => {
    if (onBook) {
      onBook(service);
      return;
    }

    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl sm:p-6">
      {/* Top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${colors.button.split(" ")[0]}`}
      />

      {/* Icon and badge */}
      <div className="flex items-center justify-between gap-3">
        <div
          className={`grid h-14 w-14 place-items-center rounded-2xl transition-all duration-300 ${colors.icon} ${colors.glow} group-hover:shadow-lg`}
        >
          <Icon
            size={25}
            strokeWidth={1.8}
            className="transition-colors duration-300 group-hover:text-white"
          />
        </div>

        {service.tag && (
          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              service.tag === "Bestseller"
                ? "bg-amber-100 text-amber-700"
                : service.tag === "Popular"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {service.tag}
          </span>
        )}
      </div>

      {/* Service information */}
      <div className="mt-5">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-slate-700">
          {service.name}
        </h3>

        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
          {service.desc}
        </p>
      </div>

      {/* Rating and duration */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="inline-flex items-center gap-1.5">
          <Star
            size={15}
            className="fill-amber-400 text-amber-400"
          />
          <span className="text-sm font-bold text-slate-800">
            {service.rating}
          </span>
          <span className="text-xs text-slate-400">
            ({service.reviews})
          </span>
        </div>

        <span className="h-1 w-1 rounded-full bg-slate-300" />

        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Clock size={14} />
          {service.duration}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-dashed border-slate-200" />

      {/* Pricing and booking */}
      <div className="mt-auto flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">
            Starting from
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              ₹{service.price.toLocaleString("en-IN")}
            </span>

            {service.original && (
              <span className="text-sm text-slate-400 line-through">
                ₹{service.original.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {service.original && (
            <p className={`mt-1 text-xs font-semibold ${colors.accent}`}>
              Save ₹{service.original - service.price}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleBooking}
          aria-label={`Book ${service.name}`}
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:px-4 ${colors.button}`}
        >
          Book Now
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}

export default function Services({ onBookService }) {
  const pages = useMemo(() => chunk(SERVICES, 3), []);
  const [page, setPage] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!pausedRef.current) {
        setPage((current) => (current + 1) % pages.length);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [pages.length]);

  const goTo = (index) => {
    setPage((index + pages.length) % pages.length);
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-600 shadow-sm">
              <Sparkles size={14} />
              What We Offer
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Expert services.
              <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 bg-clip-text text-transparent">
                Right at your doorstep.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              From everyday repairs to complete home care, find trusted
              professionals for all your needs in one place.
            </p>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <p className="text-sm font-medium text-slate-500">
              <span className="font-bold text-slate-900">
                {String(page + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(pages.length).padStart(2, "0")} collections
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                aria-label="Previous services"
                className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-900 hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => goTo(page + 1)}
                aria-label="Next services"
                className="grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Service carousel */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
          onFocusCapture={() => {
            pausedRef.current = true;
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              pausedRef.current = false;
            }
          }}
        >
          <div
            className="flex items-stretch transition-transform duration-500 ease-in-out"
            style={{
              width: `${pages.length * 100}%`,
              transform: `translateX(-${(100 / pages.length) * page}%)`,
            }}
          >
            {pages.map((group, index) => (
              <div
                key={index}
                className="shrink-0 px-1 pb-3"
                style={{ width: `${100 / pages.length}%` }}
                aria-hidden={page !== index}
              >
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {group.map((service) => (
                    <ServiceCard
                      key={service.name}
                      service={service}
                      onBook={onBookService}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel pagination */}
        <div className="mt-7 flex items-center justify-center gap-2">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to service collection ${index + 1}`}
              aria-current={page === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                page === index
                  ? "w-9 bg-gradient-to-r from-orange-500 to-pink-500"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-12 grid grid-cols-1 gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3 sm:p-6 lg:mt-16">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Trusted Professionals
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Quality-focused service
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Convenient Booking
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Save time and effort
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Services in One Place
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Simple home care solutions
              </p>
            </div>
          </div>
        </div>

        {/* Bottom call to action */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-slate-900 px-6 py-7 text-center sm:flex-row sm:px-8 sm:text-left">
          <div>
            <h3 className="text-lg font-bold text-white sm:text-xl">
              Need help choosing a service?
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Get in touch with us to find the right solution for your home.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Contact Us
            <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}





// import { useState, useEffect, useRef, useMemo } from "react";
// import {
//   Sparkles, Bug, Wind, Wrench, Zap, Settings, PaintRoller,
//   Hammer, Scissors, Truck, ChevronLeft, ChevronRight,
//   Star, Clock, ArrowUpRight,
// } from "lucide-react";

// const SERVICES = [
//   { icon: Sparkles, name: "Deep Cleaning", desc: "Full home deep clean, kitchen & bathrooms included", rating: 4.9, reviews: "2.3k", duration: "3-4 hrs", price: 499, original: 699, tag: "Bestseller" },
//   { icon: Bug, name: "Pest Control", desc: "Cockroach, ant & termite treatment, odourless spray", rating: 4.8, reviews: "1.8k", duration: "60-90 min", price: 599, original: 799, tag: "Popular" },
//   { icon: Wind, name: "AC Repair & Service", desc: "Gas refill, servicing & installation for split/window ACs", rating: 4.7, reviews: "1.2k", duration: "45-60 min", price: 399, original: null, tag: null },
//   { icon: Wrench, name: "Plumbing", desc: "Leak fixes, tap & pipe repair, bathroom fittings", rating: 4.6, reviews: "950", duration: "30-45 min", price: 299, original: null, tag: null },
//   { icon: Zap, name: "Electrical", desc: "Wiring, switchboard & appliance connection repairs", rating: 4.7, reviews: "890", duration: "30-45 min", price: 299, original: null, tag: null },
//   { icon: Settings, name: "Appliance Repair", desc: "Washing machine, fridge & microwave repairs at home", rating: 4.6, reviews: "760", duration: "45-60 min", price: 349, original: null, tag: null },
//   { icon: PaintRoller, name: "Painting", desc: "Interior & exterior wall painting with premium finish", rating: 4.8, reviews: "540", duration: "1-2 days", price: 899, original: null, tag: "New" },
//   { icon: Hammer, name: "Carpentry", desc: "Furniture repair, fittings & custom woodwork", rating: 4.5, reviews: "610", duration: "45-60 min", price: 349, original: null, tag: null },
//   { icon: Scissors, name: "Salon at Home", desc: "Haircut, facial & grooming by certified experts", rating: 4.9, reviews: "2.1k", duration: "60-90 min", price: 449, original: 599, tag: "Popular" },
//   { icon: Truck, name: "Packers & Movers", desc: "Safe, insured home shifting within and across cities", rating: 4.7, reviews: "430", duration: "Half day", price: 1499, original: null, tag: null },
// ];

// const TAG_STYLES = {
//   Bestseller: "bg-gradient-to-r from-amber-500 to-pink-600 text-white",
//   Popular: "bg-ink text-white",
//   New: "bg-white border border-pink-500 text-pink-600",
// };

// function chunk(arr, size) {
//   const out = [];
//   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
//   return out;
// }

// function ServiceCard({ s }) {
//   const Icon = s.icon;
//   return (
//     <div className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
//       <div className="flex items-start justify-between">
//         <div className="h-11 w-11 rounded-xl bg-brand-50 grid place-items-center transition-colors group-hover:bg-brand-600">
//           <Icon size={20} className="text-brand-600 transition-colors group-hover:text-white" />
//         </div>
//         {s.tag && (
//           <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
//             s.tag === "Bestseller"
//               ? "bg-gold-400/15 text-gold-600"
//               : s.tag === "Popular"
//               ? "bg-brand-50 text-brand-600"
//               : "bg-white border border-line text-muted"
//           }`}>
//             {s.tag}
//           </span>
//         )}
//       </div>

//       <h3 className="mt-4 font-display text-base font-bold leading-snug text-ink">{s.name}</h3>
//       <p className="mt-1.5 text-sm leading-relaxed text-muted line-clamp-2">{s.desc}</p>

//       <div className="mt-3 flex items-center gap-3 text-xs text-muted">
//         <span className="inline-flex items-center gap-1">
//           <Star size={12} className="fill-gold-400 text-gold-400" />
//           <span className="font-semibold text-ink">{s.rating}</span>
//           <span>({s.reviews})</span>
//         </span>
//         <span className="h-1 w-1 rounded-full bg-line" />
//         <span className="inline-flex items-center gap-1"><Clock size={12} /> {s.duration}</span>
//       </div>

//       <div className="mt-auto pt-4 flex items-end justify-between border-t border-line mt-4">
//         <div>
//           <p className="text-[10px] uppercase tracking-wide text-muted">From</p>
//           <p className="flex items-baseline gap-1.5">
//             <span className="font-display text-lg font-extrabold text-ink">₹{s.price}</span>
//             {s.original && <span className="text-xs text-muted line-through">₹{s.original}</span>}
//           </p>
//         </div>
//         <button
//           aria-label={`Book ${s.name}`}
//           className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white"
//         >
//           <ArrowUpRight size={15} />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function Services() {
//   const pages = useMemo(() => chunk(SERVICES, 3), []);
//   const [page, setPage] = useState(0);
//   const pausedRef = useRef(false);

//   useEffect(() => {
//     const id = setInterval(() => {
//       if (!pausedRef.current) setPage((p) => (p + 1) % pages.length);
//     }, 5000);
//     return () => clearInterval(id);
//   }, [pages.length]);

//   const goTo = (i) => setPage((i + pages.length) % pages.length);

//   return (
//     <section id="services" className="py-20 lg:py-28">
//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="mb-10 flex items-end justify-between gap-6">
//           <div>
//             <span className="text-xs font-semibold uppercase tracking-wider text-pink-600">
//               What we offer
//             </span>
//             <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
//               10 services, one app
//             </h2>
//           </div>
//           <div className="hidden gap-2 sm:flex">
//             <button
//               onClick={() => goTo(page - 1)}
//               className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card transition-shadow hover:shadow-soft"
//               aria-label="Previous"
//             >
//               <ChevronLeft size={18} />
//             </button>
//             <button
//               onClick={() => goTo(page + 1)}
//               className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-card transition-shadow hover:shadow-soft"
//               aria-label="Next"
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>

//         <div
//           className="overflow-hidden"
//           onMouseEnter={() => (pausedRef.current = true)}
//           onMouseLeave={() => (pausedRef.current = false)}
//         >
//           <div
//             className="flex transition-transform duration-500 ease-out"
//             style={{
//               width: `${pages.length * 100}%`,
//               transform: `translateX(-${(100 / pages.length) * page}%)`,
//             }}
//           >
//             {pages.map((group, i) => (
//               <div key={i} style={{ width: `${100 / pages.length}%` }} className="shrink-0 px-1">
//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                   {group.map((s) => (
//                     <ServiceCard key={s.name} s={s} />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-8 flex justify-center gap-2">
//           {pages.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => goTo(i)}
//               aria-label={`Go to slide ${i + 1}`}
//               className={`h-2 rounded-full transition-all ${
//                 page === i ? "w-6 bg-gradient-to-r from-amber-500 to-pink-600" : "w-2 bg-line"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }