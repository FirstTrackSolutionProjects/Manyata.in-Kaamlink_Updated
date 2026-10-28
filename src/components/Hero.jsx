
import { useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  CalendarCheck,
  BadgeCheck,
  ArrowUpRight,
} from "lucide-react";

import useReveal from "../hooks/useReveal";

export default function Hero() {
  const [ref, inView] = useReveal();
  const [pincode, setPincode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return;
    }

    // Connect your service-availability API here.
    // A valid pincode alone does not confirm service availability.
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#fffdf9] py-12 sm:py-16 lg:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl sm:h-[30rem] sm:w-[30rem]" />

        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-pink-100/40 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_0.6px,transparent_0.6px)] [background-size:28px_28px] opacity-20" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        {/* LEFT: Hero content */}
        <div
          ref={ref}
          className={`reveal min-w-0 ${inView ? "in-view" : ""}`}
        >
          {/* Trust badge */}
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-100 bg-white/90 px-3 py-2 text-[11px] font-bold text-slate-700 shadow-sm sm:px-4 sm:text-xs">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            <ShieldCheck size={15} className="shrink-0 text-emerald-600" />

            <span>Professional home services</span>
          </div>

          {/* Main heading */}
          <h1 className="mt-6 text-[2.45rem] font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:mt-7 lg:text-[3.65rem] xl:text-[4rem]">
            Your home deserves
            <span className="mt-1 block bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 bg-clip-text pb-1 text-transparent">
              expert care.
            </span>

            <span className="mt-1 block text-slate-900">
              Right at your doorstep.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:mt-6">
            From deep cleaning and pest control to everyday repairs, discover
            convenient home services delivered by skilled professionals.
          </p>

          {/* Pincode form */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-lg shadow-slate-900/[0.04] sm:flex-row sm:items-center sm:rounded-full sm:p-2"
          >
            <label className="relative flex min-w-0 flex-1 items-center">
              <MapPin
                size={19}
                className="pointer-events-none absolute left-3.5 text-slate-400 sm:left-4"
              />

              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                name="pincode"
                aria-label="Enter your six-digit Indian PIN code"
                placeholder="Enter your 6-digit PIN code"
                maxLength={6}
                pattern="[1-9][0-9]{5}"
                title="Enter a valid 6-digit Indian PIN code."
                value={pincode}
                onChange={(e) =>
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
                className="h-12 w-full min-w-0 rounded-xl border border-transparent bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100 sm:h-12 sm:rounded-full sm:bg-transparent sm:focus:ring-0"
              />
            </label>

            <button
              type="submit"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-md transition duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 sm:w-auto sm:shrink-0 sm:rounded-full"
            >
              Check availability
              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>

          <p className="mt-2 px-1 text-xs leading-5 text-slate-400">
            Enter your PIN code to start checking service coverage.
          </p>

          {/* Trust indicators */}
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-200/80 pt-6 sm:gap-x-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <ShieldCheck size={17} className="text-emerald-600" />
              </div>
              Verified experts
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                <Star size={17} className="fill-amber-400 text-amber-400" />
              </div>
              Quality-focused care
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <CheckCircle2 size={17} className="text-blue-600" />
              </div>
              Easy booking
            </div>
          </div>
        </div>

        {/* RIGHT: Booking preview */}
        <div className="relative mx-auto w-full min-w-0 max-w-[460px] lg:max-w-none lg:py-8">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-orange-300/50 to-violet-300/50 blur-3xl sm:h-96 sm:w-96" />

          {/* Floating discount card - desktop */}
          <div className="absolute -right-2 top-0 z-20 hidden items-center gap-3 rounded-2xl border border-white bg-white/95 p-3.5 shadow-xl shadow-slate-900/10 md:flex lg:-right-3 lg:top-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <Sparkles size={21} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-slate-900">
                Great service starts here
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Explore home care solutions
              </p>
            </div>
          </div>

          {/* Main preview card */}
          <div className="relative z-10 overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_24px_80px_-24px_rgba(15,23,42,0.22)] sm:rounded-[32px]">
            {/* Card header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-orange-600 sm:h-12 sm:w-12">
                  <Sparkles size={23} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    Booking preview
                  </p>

                  <h2 className="mt-1 truncate text-base font-extrabold text-slate-900 sm:text-lg">
                    Deep Cleaning
                  </h2>
                </div>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sample
              </span>
            </div>

            {/* Professional details */}
            <div className="px-4 py-5 sm:px-6 sm:py-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-orange-200 to-violet-200 text-sm font-extrabold text-slate-700 shadow-md sm:h-14 sm:w-14">
                    RK
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-sm font-extrabold text-slate-900 sm:text-base">
                        Service Professional
                      </h3>
                      <BadgeCheck
                        size={16}
                        className="shrink-0 text-blue-500"
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Professional home care
                    </p>

                    <div className="mt-1.5 flex items-center gap-1 text-xs">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="font-bold text-slate-800">4.9</span>
                      <span className="text-slate-400">
                        Illustrative rating
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:flex">
                  <ShieldCheck size={21} />
                </div>
              </div>

              {/* Booking status */}
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Example starting price
                    </p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      ₹499
                    </p>
                  </div>

                  <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm sm:text-xs">
                    <Clock size={13} className="text-orange-500" />
                    3–4 hours
                  </span>
                </div>

                <div className="my-5 border-t border-dashed border-slate-200" />

                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your booking journey
                </p>

                <div className="relative space-y-5 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:to-slate-200">
                  <div className="relative flex items-center gap-3">
                    <div className="z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                        Choose your service
                      </span>
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800 sm:text-sm">
                        Select a convenient slot
                      </span>
                      <CalendarCheck
                        size={15}
                        className="shrink-0 text-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-white shadow-[0_0_0_3px_rgba(249,115,22,0.12)]" />

                    <span className="text-xs font-bold text-orange-600 sm:text-sm">
                      Enjoy professional service
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom note */}
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Book with confidence
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
                    Review service details and pricing before confirming
                    your booking.
                  </p>
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-medium text-slate-400">
                  Simple and convenient
                </p>
                <p className="mt-1 text-xs font-bold text-slate-800">
                  Home care, made easier.
                </p>
              </div>

              <a
                href="#services"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Explore
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Floating trust badge */}
          <div className="relative z-20 mx-auto mt-4 flex w-fit max-w-full items-center gap-3 rounded-2xl border border-white bg-white/95 p-3 shadow-lg shadow-slate-900/5 sm:absolute sm:-bottom-5 sm:-left-5 sm:mx-0 sm:mt-0 sm:p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={21} />
            </div>

            <div>
              <p className="text-xs font-extrabold text-slate-900">
                Safety comes first
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Clear service details
              </p>
            </div>

            <CheckCircle2
              size={17}
              className="ml-1 shrink-0 text-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Bottom section divider */}
      <div className="mx-auto mt-14 max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
    </section>
  );
}





// import { ShieldCheck, Search, ArrowRight, Sparkles, Star, CheckCircle2, MapPin } from "lucide-react";
// import useReveal from "../hooks/useReveal";

// export default function Hero() {
//   const [ref, inView] = useReveal();

//   return (
//     <section className="relative overflow-hidden bg-ivory py-16 lg:py-24">
//       {/* Background Blobs */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
//         <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-400/20 rounded-full blur-[100px] animate-float" />
//         <div className="absolute top-40 right-0 w-[30rem] h-[30rem] bg-gold-400/15 rounded-full blur-[100px] animate-float [animation-delay:2s]" />
//       </div>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
//         {/* LEFT COLUMN: Text & Search */}
//         <div ref={ref} className={`reveal ${inView ? "in-view" : ""}`}>
          
//           {/* Trust Badge */}
//           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-line shadow-sm text-xs font-semibold text-slate-700 mb-6">
//             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
//             Trusted by 50,000+ Indian homes
//           </div>

//           {/* Headline */}
//           <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-[1.1] tracking-tight text-slate-900">
//             Home services, <br />
//             <span className="text-brand-600">done right</span> <br />
//             at your door.
//           </h1>

//           <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
//             Deep cleaning, pest control, repairs and 8 more services. Pick a slot, 
//             get a background-verified pro, and pay only after the job's done.
//           </p>

//           {/* Search Bar (Pincode) */}
//           <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md">
//             <div className="relative flex-1">
//               <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Enter your pincode"
//                 className="w-full rounded-full bg-white pl-11 pr-4 py-3.5 text-sm shadow-card border border-line focus:border-brand-500 outline-none placeholder:text-slate-400 transition-all"
//               />
//             </div>
//             <button
//               type="submit"
//               className="group rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lift hover:bg-brand-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
//             >
//               Check availability
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </form>

//           {/* Micro-features */}
//           <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-500">
//             <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-brand-500"/> Background verified</span>
//             <span className="flex items-center gap-1.5"><Star size={16} className="text-gold-500 fill-gold-500"/> 4.8/5 average rating</span>
//             <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-green-500"/> 7-day warranty</span>
//           </div>
//         </div>

//         {/* RIGHT COLUMN: Premium 3D UI Mockup */}
//         <div className="relative lg:h-[550px] flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
          
//           {/* Decorative Background Glows */}
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-brand-500 to-gold-400 rounded-full blur-[80px] opacity-20 animate-pulse" />
          
//           {/* Main Card */}
//           <div className="relative w-full max-w-[380px] bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 z-10 rotate-[-2deg] hover:rotate-0 hover:scale-[1.02] transition-all duration-500">
            
//             {/* Top Bar (Live tracking) */}
//             <div className="flex items-center justify-between pb-5 border-b border-slate-100">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
//                   <Sparkles size={20} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-slate-900">Deep Cleaning</p>
//                   <p className="text-[11px] font-semibold text-green-600 flex items-center gap-1">
//                     <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span> Pro is on the way
//                   </p>
//                 </div>
//               </div>
//               <div className="bg-slate-100 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-500">
//                 #BK-892
//               </div>
//             </div>

//             {/* Pro Details */}
//             <div className="py-5 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <img src="https://i.pravatar.cc/100?img=11" alt="Pro" className="h-12 w-12 rounded-full border-2 border-white shadow-sm" />
//                 <div>
//                   <p className="text-sm font-bold text-slate-900">Ramesh K.</p>
//                   <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
//                     <Star size={12} className="text-gold-500 fill-gold-500" /> 4.9 (1.2k jobs)
//                   </div>
//                 </div>
//               </div>
//               <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
//                 <CheckCircle2 size={16} />
//               </div>
//             </div>

//             {/* Price & Timeline */}
//             <div className="bg-slate-50 rounded-2xl p-4 mb-5">
//               <div className="flex justify-between items-end mb-4">
//                 <span className="text-xs font-semibold text-slate-500">Total Amount</span>
//                 <span className="text-2xl font-extrabold text-slate-900">₹499</span>
//               </div>
//               <div className="space-y-3 relative before:absolute before:inset-0 before:ml-1.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:to-slate-200">
//                 <div className="relative flex items-center gap-3">
//                   <div className="h-3.5 w-3.5 rounded-full bg-brand-500 border-2 border-white z-10" />
//                   <p className="text-xs font-medium text-slate-600">Booking Confirmed</p>
//                 </div>
//                 <div className="relative flex items-center gap-3">
//                   <div className="h-3.5 w-3.5 rounded-full bg-brand-500 border-2 border-white z-10" />
//                   <p className="text-xs font-medium text-slate-600">Pro Assigned</p>
//                 </div>
//                 <div className="relative flex items-center gap-3">
//                   <div className="h-3.5 w-3.5 rounded-full bg-white border-2 border-brand-500 z-10 shadow-[0_0_0_3px_rgba(79,70,229,0.2)]" />
//                   <p className="text-xs font-bold text-brand-600">Service in Progress</p>
//                 </div>
//               </div>
//             </div>

//             <button className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors">
//               Track Professional
//             </button>
//           </div>

//           {/* Floating Discount Tag (Decorative) */}
//           <div className="absolute top-10 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-line rotate-6 animate-float z-20 hidden md:block">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Use Code</p>
//             <p className="text-sm font-extrabold text-brand-600 bg-brand-50 px-2 py-1 rounded">FIRST50</p>
//           </div>

//           {/* Floating Trust Badge (Decorative) */}
//           <div className="absolute bottom-12 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-line -rotate-3 animate-float [animation-delay:1s] z-20 hidden md:flex items-center gap-3">
//             <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
//               <ShieldCheck size={20} />
//             </div>
//             <div>
//               <p className="text-xs font-bold text-slate-900">100% Secure</p>
//               <p className="text-[10px] text-slate-500">Verified Pros</p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }