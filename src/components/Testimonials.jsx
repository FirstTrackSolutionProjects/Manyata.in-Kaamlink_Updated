// import { useState, useEffect, useRef, useMemo } from "react";
// import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
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
//     <figure className="group relative flex h-full flex-col rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
//       {/* Decorative Quote Icon */}
//       <Quote size={40} className="absolute top-6 right-6 text-slate-100 group-hover:text-brand-50 transition-colors duration-300" />
      
//       {/* Star Rating */}
//       <div className="flex gap-1 text-gold-500 mb-4">
//         {Array.from({ length: 5 }).map((_, s) => (
//           <Star key={s} size={16} className="fill-gold-500" />
//         ))}
//       </div>

//       {/* Quote Text */}
//       <blockquote className="relative z-10 flex-1 text-[15px] leading-relaxed text-slate-700 font-medium">
//         “{t.quote}”
//       </blockquote>

//       {/* User Info */}
//       <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
//         <img
//           src={avatar.src}
//           width={avatar.width}
//           height={avatar.height}
//           alt={avatar.alt}
//           className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-brand-100 transition-all"
//         />
//         <div>
//           <p className="text-sm font-bold text-slate-900">{t.name}</p>
//           <p className="text-xs font-medium text-brand-600 mt-0.5">
//             {t.city} <span className="text-slate-300 mx-1">•</span> {t.service}
//           </p>
//         </div>
//       </figcaption>
//     </figure>
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
//     <section className="bg-white py-20 lg:py-28 overflow-hidden relative">
//       {/* Subtle Background Glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold-400/5 rounded-full blur-[100px] pointer-events-none" />

//       <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
//         {/* Header */}
//         <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
//           <div className="max-w-xl">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//               Loved across India
//             </span>
//             <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
//               What our customers say
//             </h2>
//           </div>
          
//           {/* Navigation Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => goTo(page - 1)}
//               className="grid h-12 w-12 place-items-center rounded-full bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 active:scale-95"
//               aria-label="Previous"
//             >
//               <ChevronLeft size={20} />
//             </button>
//             <button
//               onClick={() => goTo(page + 1)}
//               className="grid h-12 w-12 place-items-center rounded-full bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 active:scale-95"
//               aria-label="Next"
//             >
//               <ChevronRight size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Slider */}
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

//         {/* Pagination Dots */}
//         <div className="mt-10 flex justify-center gap-2">
//           {pages.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => goTo(i)}
//               aria-label={`Go to slide ${i + 1}`}
//               className={`h-2.5 rounded-full transition-all duration-300 ${
//                 page === i ? "w-8 bg-brand-600" : "w-2.5 bg-slate-200 hover:bg-slate-300"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import { useState, useEffect, useRef, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from "lucide-react";
import { testimonialAvatars } from "../assets/asset";

const TESTIMONIALS = [
  { name: "Ananya R.", city: "Bengaluru", service: "Deep Cleaning", quote: "The team was thorough and on time. My kitchen hasn't been this clean since we moved in." },
  { name: "Rohit S.", city: "Pune", service: "Pest Control", quote: "Booked in the evening, pro arrived the next morning. No more cockroach problem at all." },
  { name: "Meera K.", city: "Mumbai", service: "AC Repair", quote: "Transparent pricing and the technician explained exactly what was wrong. Highly recommend." },
  { name: "Sameer P.", city: "Hyderabad", service: "Electrical", quote: "Fixed a tricky wiring issue two other electricians couldn't. Professional and quick." },
  { name: "Priya N.", city: "Delhi NCR", service: "Salon at Home", quote: "Convenient, hygienic, and the stylist was lovely. Booking again for my mom too." },
];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function TestimonialCard({ t, avatar }) {
  return (
    <div className="group relative flex h-full flex-col p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-200/60 to-transparent hover:from-brand-400/60 hover:to-gold-400/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10">
      <figure className="relative flex h-full flex-col rounded-[calc(2rem-1px)] bg-white p-7 sm:p-9 overflow-hidden">
        
        {/* Subtle inner glow on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors" />

        {/* Quote Icon */}
        <Quote size={40} className="absolute top-8 right-8 text-slate-100 group-hover:text-brand-500/20 transition-colors duration-500 rotate-12" />
        
        {/* Stars */}
        <div className="flex gap-1.5 text-gold-500 mb-6 relative z-10">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} size={18} className="fill-gold-500 drop-shadow-sm" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="relative z-10 flex-1 text-[15px] sm:text-[17px] leading-relaxed text-slate-700 font-medium italic">
          "{t.quote}"
        </blockquote>

        {/* User */}
        <figcaption className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6 relative z-10">
          <div className="relative">
            <img
              src={avatar.src}
              width={avatar.width}
              height={avatar.height}
              alt={avatar.alt}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-brand-100 transition-all duration-300"
            />
            <CheckCircle2 size={16} className="absolute -bottom-1 -right-1 text-brand-500 bg-white rounded-full" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold text-slate-900">{t.name}</p>
            <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
              {t.city} <span className="h-1 w-1 rounded-full bg-slate-300"></span> <span className="text-brand-600">{t.service}</span>
            </p>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

export default function Testimonials() {
  const pages = useMemo(() => chunk(TESTIMONIALS, 3), []);
  const [page, setPage] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setPage((p) => (p + 1) % pages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [pages.length]);

  const goTo = (i) => setPage((i + pages.length) % pages.length);

  return (
    <section className="bg-[#FAFAF9] py-24 lg:py-32 overflow-hidden relative">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-brand-500/10 to-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-brand-600 mb-5 shadow-sm">
              <Star size={12} className="fill-brand-600" /> 4.8/5 Average Rating
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
              Don't just take <br className="hidden sm:block"/> our word for it.
            </h2>
            <p className="mt-4 text-slate-500 text-base sm:text-lg">See why 50,000+ homeowners trust Manayata.</p>
          </div>
          
          {/* Navigation Buttons (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => goTo(page - 1)}
              className="grid h-14 w-14 place-items-center rounded-full bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-50 hover:text-brand-600 hover:border-brand-300 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => goTo(page + 1)}
              className="grid h-14 w-14 place-items-center rounded-full bg-slate-900 text-white shadow-md transition-all hover:bg-brand-600 hover:border-brand-500 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          className="overflow-hidden -mx-4 px-4 sm:-mx-6 sm:px-6 pb-8 pt-4"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              width: `${pages.length * 100}%`,
              transform: `translateX(-${(100 / pages.length) * page}%)`,
            }}
          >
            {pages.map((group, i) => (
              <div key={i} style={{ width: `${100 / pages.length}%` }} className="shrink-0 px-3 sm:px-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((t) => (
                    <TestimonialCard
                      key={t.name}
                      t={t}
                      avatar={testimonialAvatars[TESTIMONIALS.indexOf(t)]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination & Mobile Controls */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  page === i ? "w-10 bg-brand-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons (Mobile) */}
          <div className="flex md:hidden gap-4 mt-2">
             <button
              onClick={() => goTo(page - 1)}
              className="grid h-12 w-12 place-items-center rounded-full bg-white border border-slate-200 shadow-sm transition-all active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(page + 1)}
              className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-white shadow-sm transition-all active:scale-95"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}