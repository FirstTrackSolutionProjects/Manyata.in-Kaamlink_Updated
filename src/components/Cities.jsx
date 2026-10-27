
import {
  MapPin,
  ArrowRight,
  Plus,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import useReveal from "../hooks/useReveal";

const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Bhubaneswar",
];

export default function Cities() {
  const [ref, inView] = useReveal();

  return (
    <section
      id="cities"
      className="relative isolate overflow-hidden bg-slate-50 py-14 sm:py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 -z-10 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl sm:h-80 sm:w-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-20 -z-10 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl sm:h-80 sm:w-80"
      />

      <div
        ref={ref}
        className={`reveal mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${
          inView ? "in-view" : ""
        }`}
      >
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 shadow-sm sm:text-xs">
            <Sparkles size={14} />
            Our growing network
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Quality home services,
            <span className="mt-1 block bg-gradient-to-r from-brand-600 to-amber-500 bg-clip-text text-transparent">
              closer to you.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base sm:leading-8">
            We're expanding to more neighborhoods. Discover the cities where
            you can find reliable, background-verified home service
            professionals.
          </p>
        </div>

        {/* City count highlight */}
        <div className="mx-auto mt-8 flex w-fit max-w-full items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-md shadow-slate-900/5 sm:mt-10 sm:gap-4 sm:px-6 sm:py-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 sm:h-12 sm:w-12">
            <Building2 size={23} />
          </div>

          <div className="text-left">
            <p className="text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl">
              {CITIES.length} cities
            </p>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              And our network keeps growing
            </p>
          </div>

          <CheckCircle2
            size={20}
            className="ml-1 shrink-0 text-brand-600"
          />
        </div>

        {/* City cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:gap-5">
          {CITIES.map((city, index) => (
            <div
              key={city}
              className="group flex min-h-[76px] min-w-0 items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5 sm:min-h-[92px] sm:gap-3 sm:rounded-3xl sm:p-5"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                <MapPin size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="break-words text-xs font-bold leading-5 text-slate-800 transition-colors group-hover:text-brand-700 sm:text-sm md:text-base">
                  {city}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400 sm:text-xs">
                  Service location
                </p>
              </div>

              <ArrowRight
                size={15}
                className="hidden shrink-0 text-brand-500 transition-transform group-hover:translate-x-1 min-[420px]:block"
              />
            </div>
          ))}

          {/* Expansion card */}
          <div className="flex min-h-[76px] min-w-0 items-center gap-2.5 rounded-2xl border border-dashed border-brand-200 bg-brand-50/70 p-3 sm:min-h-[92px] sm:gap-3 sm:rounded-3xl sm:p-5">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-700 shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl">
              <Plus size={23} />
            </div>

            <div className="min-w-0">
              <p className="break-words text-xs font-bold leading-5 text-brand-800 sm:text-sm md:text-base">
                More cities
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-slate-500 sm:text-xs">
                Coming soon
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-9 text-center sm:mt-12">
          <p className="mb-4 text-xs leading-5 text-slate-500 sm:text-sm">
            Ready to find a trusted professional for your home?
          </p>

          <a
            href="#top"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl sm:w-auto sm:px-8"
          >
            Check availability in your city
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}






// import { MapPin, ArrowRight, Plus } from "lucide-react";
// import useReveal from "../hooks/useReveal";

// const CITIES = [
//   "Bengaluru",
//   "Mumbai",
//   "Delhi NCR",
//   "Pune",
//   "Hyderabad",
//   "Chennai",
//   "Kolkata",
//   "Ahmedabad",
//   "Bhubaneswar"
// ];

// export default function Cities() {
//   const [ref, inView] = useReveal();

//   return (
//     <section id="cities" className="py-20 lg:py-28 relative overflow-hidden">
//       <div
//         ref={ref}
//         className={`reveal ${inView ? "in-view" : ""} max-w-4xl mx-auto px-6 lg:px-8 text-center`}
//       >
//         <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//           Now live in
//         </span>
//         <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
//           {CITIES.length} cities, and counting
//         </h2>
//         <p className="mt-4 text-slate-500 max-w-xl mx-auto">
//           We're expanding fast. Find background-verified professionals right in your neighborhood.
//         </p>

//         {/* City Chips */}
//         <div className="mt-10 flex flex-wrap justify-center gap-3">
//           {CITIES.map((city) => (
//             <span
//               key={city}
//               className="group inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md hover:border-brand-200 hover:text-brand-600 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
//             >
//               <MapPin size={16} className="text-slate-400 group-hover:text-brand-500 transition-colors" />
//               {city}
//             </span>
//           ))}
          
//           {/* More every month chip */}
//           <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-transparent px-5 py-2.5 text-sm font-semibold text-slate-500">
//             <Plus size={16} /> More every month
//           </span>
//         </div>

//         {/* CTA Button */}
//         <div className="mt-12">
//           <a
//             href="#top"
//             className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
//           >
//             Check availability in your city
//             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }