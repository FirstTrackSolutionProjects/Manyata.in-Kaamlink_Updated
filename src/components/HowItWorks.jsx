import { Search, CalendarCheck, ShieldCheck, Wallet, ArrowRight } from "lucide-react";
import useReveal from "../hooks/useReveal";

const STEPS = [
  {
    icon: Search,
    title: "Choose a service",
    desc: "Browse our catalog and tell us exactly what your home needs.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a slot",
    desc: "Select a time that works for you. Same-day slots available.",
  },
  {
    icon: ShieldCheck,
    title: "Verified pro arrives",
    desc: "A background-checked professional shows up right on time.",
  },
  {
    icon: Wallet,
    title: "Pay after service",
    desc: "Inspect the work and pay only when you are 100% satisfied.",
  },
];

export default function HowItWorks() {
  const [ref, inView] = useReveal();

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white relative overflow-hidden">
      
      {/* Light Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div
          ref={ref}
          className={`reveal ${inView ? "in-view" : ""} text-center max-w-2xl mx-auto mb-20`}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            How it works
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Book a service in <br />
            <span className="bg-gradient-to-r from-brand-600 to-gold-500 bg-clip-text text-transparent">4 simple steps.</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto">
            We've removed all the friction. No calls, no haggling—just quality service at your doorstep.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          
          {/* CENTER CONNECTING LINE (Ab bilkul icons ke center se jayegi) */}
          <div className="hidden lg:block absolute top-[32px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-brand-200 via-brand-500 to-gold-400 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="relative group flex flex-col items-center text-center">
                
                {/* Icon Wrapper */}
                <div className="relative mb-6">
                  
                  {/* The white halo behind the icon to mask the line */}
                  <div className="absolute inset-0 bg-white rounded-2xl scale-125" />

                  {/* Icon Box */}
                  <div className="relative z-10 h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-brand-300 group-hover:-translate-y-1 transition-all duration-300">
                    <Icon size={28} className="text-slate-700 group-hover:text-brand-600 transition-colors duration-300" />
                  </div>
                  
                  {/* Step Number Badge (Ab exactly icon ke upar center mein hai) */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-white text-brand-600 text-xs font-bold flex items-center justify-center border-2 border-brand-200 z-20 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-300 shadow-sm">
                    {i + 1}
                  </div>

                </div>

                {/* Text Content */}
                <div className="px-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center">
          <a href="/#services" className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Explore all services
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
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
//     desc: "Tell us what your home needs, from cleaning to repairs.",
//   },
//   {
//     icon: CalendarCheck,
//     title: "Pick a slot",
//     desc: "Same-day and next-day slots available in your city.",
//   },
//   {
//     icon: ShieldCheck,
//     title: "Verified pro arrives",
//     desc: "Background-checked professional shows up on time.",
//   },
//   {
//     icon: Wallet,
//     title: "Pay after service",
//     desc: "Rate your experience and pay only when you're satisfied.",
//   },
// ];

// export default function HowItWorks() {
//   const [ref, inView] = useReveal();

//   return (
//     <section id="how-it-works" className="py-20 lg:py-28 bg-white relative overflow-hidden">
//       {/* Subtle Background Glow */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-50/50 rounded-full blur-[100px] pointer-events-none" />

//       <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
//         <div
//           ref={ref}
//           className={`reveal ${inView ? "in-view" : ""} text-center max-w-xl mx-auto mb-16 lg:mb-20`}
//         >
//           <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//             Simple process
//           </span>
//           <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
//             How Manayata works
//           </h2>
//           <p className="mt-4 text-slate-500">
//             Book a verified professional in just a few taps. No hidden charges, no hassle.
//           </p>
//         </div>

//         <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
//           {/* Connecting dashed line (Desktop only) */}
//           <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-slate-200 z-0" />

//           {STEPS.map(({ icon: Icon, title, desc }, i) => (
//             <div key={title} className="relative group text-center z-10 flex flex-col items-center">
              
//               {/* Icon Container */}
//               <div className="relative mb-6">
//                 <div className="h-20 w-20 rounded-[1.5rem] bg-white border-2 border-slate-100 shadow-sm grid place-items-center group-hover:border-brand-200 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 relative z-10">
//                   <Icon size={28} className="text-brand-600 group-hover:scale-110 transition-transform duration-300" />
//                 </div>
                
//                 {/* Step Number Badge */}
//                 <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 text-white text-xs font-bold grid place-items-center shadow-md z-20 border-2 border-white">
//                   {i + 1}
//                 </span>
//               </div>

//               {/* Text Content */}
//               <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
//                 {title}
//               </h3>
//               <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-[220px]">
//                 {desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }