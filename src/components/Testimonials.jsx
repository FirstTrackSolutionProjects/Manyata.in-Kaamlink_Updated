import { useEffect, useMemo, useRef, useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { testimonialAvatars } from "../assets/asset";

const TESTIMONIALS = [
  {
    name: "Ananya R.",
    city: "Bengaluru",
    service: "Deep Cleaning",
    quote:
      "The team was thorough and on time. My kitchen hasn't been this clean since we moved in.",
  },
  {
    name: "Rohit S.",
    city: "Pune",
    service: "Pest Control",
    quote:
      "Booked in the evening, pro arrived the next morning. No more cockroach problem at all.",
  },
  {
    name: "Meera K.",
    city: "Mumbai",
    service: "AC Repair",
    quote:
      "Transparent pricing and the technician explained exactly what was wrong. Highly recommend.",
  },
  {
    name: "Sameer P.",
    city: "Hyderabad",
    service: "Electrical",
    quote:
      "Fixed a tricky wiring issue two other electricians couldn't. Professional and quick.",
  },
  {
    name: "Priya N.",
    city: "Delhi NCR",
    service: "Salon at Home",
    quote:
      "Convenient, hygienic, and the stylist was lovely. Booking again for my mom too.",
  },
];

const FALLBACK_AVATAR =
  "https://ui-avatars.com/api/?name=Manyata+Customer&background=E8F2ED&color=24634C&size=128";

function chunk(items, size) {
  const result = [];

  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }

  return result;
}

function getItemsPerPage() {
  if (typeof window === "undefined") return 3;

  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;

  return 3;
}

function TestimonialCard({ testimonial, avatar }) {
  const [imageError, setImageError] = useState(false);

  const avatarSrc = imageError
    ? FALLBACK_AVATAR
    : avatar?.src || FALLBACK_AVATAR;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-slate-900/5 sm:rounded-3xl sm:p-7 lg:p-8">
      {/* Decorative quote */}
      <div className="pointer-events-none absolute -right-3 -top-3 text-slate-50 transition-colors duration-300 group-hover:text-brand-50">
        <Quote size={94} strokeWidth={1.2} />
      </div>

      {/* Rating */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-1"
          aria-label="Rated 5 out of 5 stars"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={16}
              className="fill-amber-400 text-amber-400 sm:h-[18px] sm:w-[18px]"
            />
          ))}
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800 sm:text-xs">
          <CheckCircle2 size={13} />
          Customer story
        </span>
      </div>

      {/* Quote */}
      <blockquote className="relative z-10 mt-6 flex-1 text-[14px] font-medium leading-7 text-slate-600 sm:mt-7 sm:text-[15px] sm:leading-8">
        “{testimonial.quote}”
      </blockquote>

      {/* Customer details */}
      <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-slate-100 pt-5 sm:mt-8 sm:gap-4 sm:pt-6">
        <div className="relative shrink-0">
          <img
            src={avatarSrc}
            width={48}
            height={48}
            alt={`${testimonial.name} avatar`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-11 w-11 rounded-full border border-slate-200 object-cover sm:h-12 sm:w-12"
          />

          <span
            className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-emerald-600 text-white"
            aria-label="Customer"
          >
            <CheckCircle2 size={12} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {testimonial.name}
          </h3>

          <p className="mt-1 truncate text-xs text-slate-500 sm:text-sm">
            {testimonial.city}
          </p>
        </div>

        <span className="max-w-[42%] shrink-0 rounded-lg bg-slate-50 px-2.5 py-2 text-right text-[10px] font-semibold leading-4 text-brand-700 sm:max-w-[45%] sm:px-3 sm:text-xs">
          {testimonial.service}
        </span>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const pages = useMemo(
    () => chunk(TESTIMONIALS, itemsPerPage),
    [itemsPerPage]
  );

  // Adjust the number of cards when screen size changes
  useEffect(() => {
    let resizeTimer;

    const handleResize = () => {
      window.clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        const nextItems = getItemsPerPage();

        setItemsPerPage((current) =>
          current === nextItems ? current : nextItems
        );
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Keep page index valid after responsive layout changes
  useEffect(() => {
    setPage((current) => Math.min(current, pages.length - 1));
  }, [pages.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (paused || isHovered || pages.length <= 1) return;

    const interval = window.setInterval(() => {
      setPage((current) => (current + 1) % pages.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [paused, isHovered, pages.length]);

  const goTo = (index) => {
    setPage((index + pages.length) % pages.length);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      goTo(deltaX < 0 ? page + 1 : page - 1);
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-[#FAFAF8] py-16 sm:py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#94a3b80a_1px,transparent_1px),linear-gradient(to_bottom,#94a3b80a_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-72 w-72 rounded-full bg-brand-100/50 blur-[90px] sm:h-96 sm:w-96" />

      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-72 w-72 rounded-full bg-amber-100/50 blur-[90px] sm:h-96 sm:w-96" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700 shadow-sm sm:text-xs sm:tracking-[0.16em]">
              <ShieldCheck size={15} className="text-brand-600" />
              Trusted home care
            </div>

            <h2
              id="testimonials-heading"
              className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:mt-6 sm:text-4xl lg:text-5xl"
            >
              Real homes.
              <br className="sm:hidden" />{" "}
              <span className="text-brand-600">
                Real experiences.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base sm:leading-8">
              Discover why homeowners choose Manyata for dependable,
              professional services that make everyday life easier.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Star
                  size={19}
                  className="fill-amber-400 text-amber-400"
                />
                <span className="text-lg font-extrabold text-slate-900">
                  4.8/5
                </span>
              </div>

              <span className="h-4 w-px bg-slate-300" />

              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                Average customer rating
              </span>
            </div>
          </div>

          {/* Desktop controls */}
          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              aria-label="Previous testimonials"
              className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 active:scale-95 lg:h-14 lg:w-14"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={() => goTo(page + 1)}
              aria-label="Next testimonials"
              className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-brand-600 active:scale-95 lg:h-14 lg:w-14"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Testimonial carousel */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setPaused(false);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex items-stretch transition-transform duration-500 ease-in-out motion-reduce:transition-none"
              style={{
                width: `${pages.length * 100}%`,
                transform: `translateX(-${(100 / pages.length) * page}%)`,
              }}
            >
              {pages.map((group, pageIndex) => (
                <div
                  key={`${itemsPerPage}-${pageIndex}`}
                  aria-hidden={pageIndex !== page}
                  style={{ width: `${100 / pages.length}%` }}
                  className="min-w-0 shrink-0 px-0.5 pb-5 pt-2 sm:px-1"
                >
                  <div
                    className={`grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 ${
                      itemsPerPage === 1 ? "max-w-xl mx-auto" : ""
                    }`}
                  >
                    {group.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.name}
                        testimonial={testimonial}
                        avatar={
                          testimonialAvatars?.[
                            TESTIMONIALS.indexOf(testimonial)
                          ]
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="mt-5 flex flex-col items-center justify-center gap-5 sm:mt-7 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tabular-nums text-slate-500">
              {String(page + 1).padStart(2, "0")}
              <span className="mx-1.5 text-slate-300">/</span>
              {String(pages.length).padStart(2, "0")}
            </span>

            <div className="flex items-center gap-1.5">
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to testimonial slide ${index + 1}`}
                  aria-current={page === index ? "step" : undefined}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
                    page === index
                      ? "w-8 bg-brand-600"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile controls */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                aria-label="Previous testimonials"
                className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={() => goTo(page + 1)}
                aria-label="Next testimonials"
                className="grid h-11 w-11 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setPaused((current) => !current)}
              aria-pressed={paused}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {paused ? "Resume autoplay" : "Pause autoplay"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}











// import { useState, useEffect, useRef, useMemo } from "react";
// import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";
// import { testimonialAvatars } from "../assets/asset";

// const TESTIMONIALS = [
//   { name: "Ananya R.", city: "Bengaluru", service: "Deep Cleaning", quote: "The team was thorough and on time. My kitchen hasn't been this clean since we moved in." },
//   { name: "Rohit S.", city: "Pune", service: "Pest Control", quote: "Booked in the evening, pro arrived the next morning. No more cockroach problem at all." },
//   { name: "Meera K.", city: "Mumbai", service: "AC Repair", quote: "Transparent pricing and the technician explained exactly what was wrong. Highly recommend." },
//   { name: "Sameer P.", city: "Hyderabad", service: "Electrical", quote: "Fixed a tricky wiring issue two other electricians couldn't. Professional and quick." },
//   { name: "Priya N.", city: "Delhi NCR", service: "Salon at Home", quote: "Convenient, hygienic, and the stylist was lovely. Booking again for my mom too." },
// ];

// function chunk(arr, size) {
//   const out = [];
//   for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
//   return out;
// }

// function TestimonialCard({ t, avatar }) {
//   return (
//     <div className="group relative flex h-full flex-col p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-200/60 to-transparent hover:from-brand-400/60 hover:to-gold-400/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10">
//       <figure className="relative flex h-full flex-col rounded-[calc(2rem-1px)] bg-white p-7 sm:p-9 overflow-hidden">
        
//         {/* Subtle inner glow on hover */}
//         <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />

//         {/* Quote Icon */}
//         <Quote size={40} className="absolute top-8 right-8 text-slate-100 group-hover:text-brand-500/20 transition-colors duration-500 rotate-12" />
        
//         {/* Stars */}
//         <div className="flex gap-1.5 text-gold-500 mb-6 relative z-10">
//           {Array.from({ length: 5 }).map((_, s) => (
//             <Star key={s} size={18} className="fill-gold-500 drop-shadow-sm" />
//           ))}
//         </div>

//         {/* Quote */}
//         <blockquote className="relative z-10 flex-1 text-[15px] sm:text-[17px] leading-relaxed text-slate-700 font-medium italic">
//           "{t.quote}"
//         </blockquote>

//         {/* User */}
//         <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6 relative z-10">
//           <div className="relative">
//             <img
//               src={avatar.src}
//               width={avatar.width}
//               height={avatar.height}
//               alt={avatar.alt}
//               className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-brand-100 transition-all duration-300"
//             />
//             <CheckCircle2 size={16} className="absolute -bottom-1 -right-1 text-brand-500 bg-white rounded-full" />
//           </div>
//           <div>
//             <p className="text-[15px] font-extrabold text-slate-900">{t.name}</p>
//             <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
//               {t.city} <span className="h-1 w-1 rounded-full bg-slate-300"></span> <span className="text-brand-600">{t.service}</span>
//             </p>
//           </div>
//         </figcaption>
//       </figure>
//     </div>
//   );
// }

// export default function Testimonials() {
//   const pages = useMemo(() => chunk(TESTIMONIALS, 3), []);
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
//     <section className="bg-[#FAFAF9] py-24 lg:py-32 overflow-hidden relative">
//       {/* Dynamic Background Pattern */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-brand-500/10 to-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Header */}
//         <div className="mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-brand-600 mb-5 shadow-sm">
//               <Star size={12} className="fill-brand-600" /> 4.8/5 Average Rating
//             </span>
//             <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
//               Don't just take <br className="hidden sm:block"/> our word for it.
//             </h2>
//             <p className="mt-4 text-slate-500 text-base sm:text-lg">See why 50,000+ homeowners trust Manyata.</p>
//           </div>
          
//           {/* Navigation Buttons (Desktop) */}
//           <div className="hidden md:flex gap-3">
//             <button
//               onClick={() => goTo(page - 1)}
//               className="grid h-14 w-14 place-items-center rounded-full bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300 active:scale-95"
//               aria-label="Previous"
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <button
//               onClick={() => goTo(page + 1)}
//               className="grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white shadow-md transition-all hover:bg-brand-600 hover:border-brand-500 active:scale-95"
//               aria-label="Next"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Slider */}
//         <div
//           className="overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 pb-8 pt-4"
//           onMouseEnter={() => (pausedRef.current = true)}
//           onMouseLeave={() => (pausedRef.current = false)}
//         >
//           <div
//             className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
//             style={{
//               width: `${pages.length * 100}%`,
//               transform: `translateX(-${(100 / pages.length) * page}%)`,
//             }}
//           >
//             {pages.map((group, i) => (
//               <div key={i} style={{ width: `${100 / pages.length}%` }} className="shrink-0 px-3 sm:px-4">
//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//                   {group.map((t) => (
//                     <TestimonialCard
//                       key={t.name}
//                       t={t}
//                       avatar={testimonialAvatars[TESTIMONIALS.indexOf(t)]}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Pagination & Mobile Controls */}
//         <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
//           <div className="flex gap-2">
//             {pages.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => goTo(i)}
//                 aria-label={`Go to slide ${i + 1}`}
//                 className={`h-2 rounded-full transition-all duration-300 ${
//                   page === i ? "w-10 bg-brand-600" : "w-2 bg-slate-300 hover:bg-slate-400"
//                 }`}
//               />
//             ))}
//           </div>

//           {/* Navigation Buttons (Mobile) */}
//           <div className="flex md:hidden gap-4 mt-2">
//              <button
//               onClick={() => goTo(page - 1)}
//               className="grid h-12 w-12 place-items-center rounded-full bg-white border border-slate-200 shadow-sm transition-all active:scale-95"
//               aria-label="Previous"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={() => goTo(page + 1)}
//               className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition-all active:scale-95"
//               aria-label="Next"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }