
import {
  Search,
  CalendarCheck,
  ShieldCheck,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

import useReveal from "../hooks/useReveal";

const STEPS = [
  {
    icon: Search,
    title: "Choose a service",
    desc: "Explore our services and find the perfect solution for your home.",
    detail: "10+ home services",
    color: "blue",
  },
  {
    icon: CalendarCheck,
    title: "Pick your time",
    desc: "Choose a convenient date and time that fits your busy schedule.",
    detail: "Flexible scheduling",
    color: "violet",
  },
  {
    icon: ShieldCheck,
    title: "Meet your expert",
    desc: "A trusted professional arrives ready to get the job done right.",
    detail: "Verified professionals",
    color: "emerald",
  },
  {
    icon: Wallet,
    title: "Pay with confidence",
    desc: "Review the completed work and pay using your preferred method.",
    detail: "Simple payments",
    color: "orange",
  },
];

const COLOR_STYLES = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    number: "bg-blue-600",
    border: "group-hover:border-blue-200",
    glow: "bg-blue-100",
    text: "text-blue-600",
    detail: "bg-blue-50 text-blue-700",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    number: "bg-violet-600",
    border: "group-hover:border-violet-200",
    glow: "bg-violet-100",
    text: "text-violet-600",
    detail: "bg-violet-50 text-violet-700",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    number: "bg-emerald-600",
    border: "group-hover:border-emerald-200",
    glow: "bg-emerald-100",
    text: "text-emerald-600",
    detail: "bg-emerald-50 text-emerald-700",
  },
  orange: {
    icon: "bg-orange-50 text-orange-600",
    number: "bg-orange-500",
    border: "group-hover:border-orange-200",
    glow: "bg-orange-100",
    text: "text-orange-600",
    detail: "bg-orange-50 text-orange-700",
  },
};

function StepCard({ step, index }) {
  const Icon = step.icon;
  const colors = COLOR_STYLES[step.color];

  return (
    <article className="group relative flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-5 lg:flex-col lg:items-center lg:border-transparent lg:bg-transparent lg:p-0 lg:text-center lg:shadow-none lg:hover:translate-y-0 lg:hover:shadow-none">
      {/* Icon and step number */}
      <div className="relative z-10 shrink-0 lg:mb-7">
        {/* Soft background glow */}
        <div
          className={`absolute -inset-2 rounded-[28px] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70 ${colors.glow}`}
        />

        {/* Icon box */}
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg sm:h-[72px] sm:w-[72px] lg:h-[84px] lg:w-[84px] lg:rounded-3xl ${colors.icon} ${colors.border}`}
        >
          <Icon
            size={30}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:scale-110 lg:h-9 lg:w-9"
          />
        </div>

        {/* Step badge */}
        <div
          className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white text-xs font-extrabold text-white shadow-md transition-transform duration-300 group-hover:scale-110 ${colors.number}`}
        >
          {index + 1}
        </div>

        {/* Completed/check decoration */}
        <div className="absolute -bottom-1 -right-1 hidden rounded-full border-2 border-white bg-white text-emerald-500 lg:block">
          <CheckCircle2 size={19} fill="white" />
        </div>
      </div>

      {/* Text content */}
      <div className="min-w-0 flex-1 pt-1 lg:flex-none lg:px-2 lg:pt-0">
        <p
          className={`mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] sm:text-xs ${colors.text}`}
        >
          Step {String(index + 1).padStart(2, "0")}
        </p>

        <h3 className="text-base font-extrabold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-slate-700 sm:text-lg lg:text-xl">
          {step.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-[15px] lg:mx-auto lg:max-w-[245px]">
          {step.desc}
        </p>

        {/* Small detail badge */}
        <div
          className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold sm:text-xs ${colors.detail}`}
        >
          <CheckCircle2 size={13} />
          {step.detail}
        </div>
      </div>

      {/* Desktop connecting arrow */}
      {index !== STEPS.length - 1 && (
        <div className="absolute -right-5 top-[35px] z-20 hidden -translate-y-1/2 items-center justify-center text-slate-300 lg:flex">
          <ArrowRight size={22} strokeWidth={1.6} />
        </div>
      )}
    </article>
  );
}

export default function HowItWorks() {
  const [ref, inView] = useReveal();

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_0.7px,transparent_0.7px)] [background-size:26px_26px] opacity-30" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div
          ref={ref}
          className={`reveal mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20 ${
            inView ? "in-view" : ""
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/90 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-orange-600 shadow-sm sm:text-xs">
            <Sparkles size={15} />
            How It Works
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Your home care,
            <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 bg-clip-text pb-1 text-transparent">
              made incredibly simple.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Quality home services without the hassle. Book a trusted expert
            in just four easy steps and enjoy a better experience.
          </p>

          {/* Trust indicators */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-semibold text-slate-600 sm:gap-x-7 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={17} className="text-emerald-500" />
              Trusted professionals
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              Convenient booking
            </span>
          </div>
        </div>

        {/* Steps section */}
        <div className="relative">
          {/* Desktop horizontal connector */}
          <div className="absolute left-[12.5%] right-[12.5%] top-[41px] hidden h-px bg-gradient-to-r from-blue-200 via-violet-300 via-emerald-300 to-orange-300 lg:block" />

          {/* Mobile vertical connector */}
          <div className="absolute bottom-12 left-[39px] top-12 w-px bg-gradient-to-b from-blue-200 via-violet-200 via-emerald-200 to-orange-200 sm:left-[43px] lg:hidden" />

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-7">
            {STEPS.map((step, index) => (
              <StepCard
                key={step.title}
                step={step}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA panel */}
        <div className="relative mt-12 overflow-hidden rounded-3xl bg-slate-900 px-5 py-8 shadow-xl sm:mt-16 sm:px-8 sm:py-10 lg:mt-20 lg:px-12">
          {/* CTA background accents */}
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-300 sm:text-xs">
                <Sparkles size={14} />
                It's that simple
              </div>

              <h3 className="text-xl font-extrabold leading-snug text-white sm:text-2xl lg:text-3xl">
                Ready to make your life easier?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                Find your service, book your slot and leave the rest to us.
              </p>
            </div>

            <a
              href="/#services"
              className="group inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-900 sm:w-auto sm:px-7"
            >
              Explore Services
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}







// import { Search, CalendarCheck, ShieldCheck, Wallet, ArrowRight } from "lucide-react";
// import useReveal from "../hooks/useReveal";

// const STEPS = [
//   {
//     icon: Search,
//     title: "Choose a service",
//     desc: "Browse our catalog and tell us exactly what your home needs.",
//   },
//   {
//     icon: CalendarCheck,
//     title: "Pick a slot",
//     desc: "Select a time that works for you. Same-day slots available.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Verified pro arrives",
//     desc: "A background-checked professional shows up right on time.",
//   },
//   {
//     icon: Wallet,
//     title: "Pay after service",
//     desc: "Inspect the work and pay only when you are 100% satisfied.",
//   },
// ];

// export default function HowItWorks() {
//   const [ref, inView] = useReveal();

//   return (
//     <section id="how-it-works" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      
//       {/* Light Background Pattern */}
//       <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      
//       <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
//         {/* Header */}
//         <div
//           ref={ref}
//           className={`reveal ${inView ? "in-view" : ""} text-center max-w-2xl mx-auto mb-20`}
//         >
//           <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//             <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
//             How it works
//           </span>
//           <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
//             Book a service in <br />
//             <span className="bg-gradient-to-r from-brand-600 to-gold-500 bg-clip-text text-transparent">4 simple steps.</span>
//           </h2>
//           <p className="mt-4 text-slate-500 max-w-lg mx-auto">
//             We've removed all the friction. No calls, no haggling—just quality service at your doorstep.
//           </p>
//         </div>

//         {/* Steps Grid */}
//         <div className="relative">
          
//           {/* CENTER CONNECTING LINE (Ab bilkul icons ke center se jayegi) */}
//           <div className="hidden lg:block absolute top-[32px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-200 via-brand-500 to-gold-400 z-0" />

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
//             {STEPS.map(({ icon: Icon, title, desc }, i) => (
//               <div key={title} className="relative group flex flex-col items-center text-center">
                
//                 {/* Icon Wrapper */}
//                 <div className="relative mb-6">
                  
//                   {/* The white halo behind the icon to mask the line */}
//                   <div className="absolute inset-0 bg-white rounded-2xl scale-125" />

//                   {/* Icon Box */}
//                   <div className="relative z-10 h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-brand-300 group-hover:-translate-y-1 transition-all duration-300">
//                     <Icon size={28} className="text-slate-700 group-hover:text-brand-600 transition-colors duration-300" />
//                   </div>
                  
//                   {/* Step Number Badge (Ab exactly icon ke upar center mein hai) */}
//                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-white text-brand-600 text-xs font-bold flex items-center justify-center border-2 border-brand-200 z-20 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300 shadow-sm">
//                     {i + 1}
//                   </div>

//                 </div>

//                 {/* Text Content */}
//                 <div className="px-2">
//                   <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
//                     {title}
//                   </h3>
//                   <p className="text-sm text-slate-500 leading-relaxed">
//                     {desc}
//                   </p>
//                 </div>

//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom CTA */}
//         <div className="mt-20 flex justify-center">
//           <a href="/#services" className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
//             Explore all services
//             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </a>
//         </div>

//       </div>
//     </section>
//   );
// }




