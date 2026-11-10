
import { useState } from "react";
import {
  ChevronDown,
  MessageCircleQuestion,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  BadgeCheck,
  Headset,
} from "lucide-react";
import useReveal from "../hooks/useReveal";

const FAQS = [
  {
    q: "How are professionals verified?",
    a: "Every professional goes through identity verification, background checks, and a skills assessment before joining Manyata. We focus on providing reliable and trusted professionals for your home.",
    icon: ShieldCheck,
  },
  {
    q: "How is pricing decided?",
    a: "Each service displays an upfront starting price. Any additional costs, such as extra rooms, parts, or materials, are discussed and confirmed with you before the work begins.",
    icon: CreditCard,
  },
  {
    q: "Can I reschedule a booking?",
    a: "Yes! You can reschedule or cancel your booking for free up to 2 hours before your scheduled service slot. Contact our support team if you need assistance.",
    icon: CalendarCheck,
  },
  {
    q: "Is there a service warranty?",
    a: "Most services include a 7-day service warranty. If something isn't right after the service, we'll help arrange a professional revisit at no extra cost, subject to service terms.",
    icon: BadgeCheck,
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI, debit cards, credit cards, net banking, and cash. Payment is collected only after the service has been completed.",
    icon: CreditCard,
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [ref, inView] = useReveal();

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-[#F8F7F3] py-16 sm:py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-20 -z-10 h-80 w-80 rounded-full bg-brand-400/10 blur-[90px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-32 -z-10 h-80 w-80 rounded-full bg-gold-400/10 blur-[90px]"
      />

      <div
        ref={ref}
        className={`reveal ${
          inView ? "in-view" : ""
        } relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}
      >
        {/* Section heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/15 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600 shadow-sm sm:text-xs">
            <MessageCircleQuestion size={15} />
            Help & Support
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Everything you need
            <span className="mt-1 block text-brand-600">
              to know about Manyata.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Have questions about our services? Find quick answers about
            bookings, pricing, payments, and our trusted professionals.
          </p>
        </div>

        {/* FAQ Layout */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">

          {/* Left information panel */}
          <div className="relative overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-xl sm:p-9 lg:sticky lg:top-28">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl"
            />

            <div className="relative">
              <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-gold-400">
                <Headset size={28} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">
                We're here to help
              </p>

              <h3 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                Need a little more help?
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/60">
                Can't find the answer you're looking for? Our support team
                is ready to help you with your questions and bookings.
              </p>

              <div className="my-7 h-px bg-white/10" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold-400">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Trusted home services
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    Your comfort is our priority.
                  </p>
                </div>
              </div>

              <a
                href="/contact"
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 px-5 py-3 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Contact Manyata Support
                <ChevronDown className="-rotate-90" size={17} />
              </a>
            </div>
          </div>

          {/* Right FAQ accordion */}
          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((item, i) => {
              const isOpen = open === i;
              const Icon = item.icon;
              const answerId = `manyata-faq-answer-${i}`;

              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-brand-500/30 shadow-[0_12px_35px_rgba(15,23,42,0.07)]"
                      : "border-slate-200/80 shadow-sm hover:border-brand-500/20 hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    className="flex min-h-[76px] w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:gap-4 sm:px-5 sm:py-5"
                  >
                    {/* Icon */}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 sm:h-11 sm:w-11 ${
                        isOpen
                          ? "bg-brand-600 text-white"
                          : "bg-brand-50 text-brand-600"
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.8} />
                    </span>

                    {/* Question */}
                    <span
                      className={`min-w-0 flex-1 text-sm font-bold leading-6 transition-colors sm:text-base ${
                        isOpen ? "text-brand-700" : "text-ink"
                      }`}
                    >
                      {item.q}
                    </span>

                    {/* Arrow */}
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-gold-400/20 text-brand-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    id={answerId}
                    aria-hidden={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-[68px] mr-4 border-t border-slate-100 pb-5 pt-3 sm:ml-[76px] sm:mr-5 sm:pb-6 sm:pt-4">
                        <p className="text-sm leading-7 text-slate-500">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom message */}
        <div className="mx-auto mt-10 max-w-6xl text-center sm:mt-14">
          <p className="text-xs font-medium text-slate-500 sm:text-sm">
            Thank you for choosing{" "}
            <span className="font-bold text-brand-600">Manyata</span>
            {" "}— we're always happy to help.
          </p>
        </div>
      </div>
    </section>
  );
}











// import { useState } from "react";
// import {
//   ChevronDown,
//   MessageCircleQuestion,
//   ShieldCheck,
//   CreditCard,
//   CalendarCheck,
//   BadgeCheck,
// } from "lucide-react";
// import useReveal from "../hooks/useReveal";

// const FAQS = [
//   {
//     q: "How are professionals verified?",
//     a: "Every professional goes through identity verification, background checks, and a skills assessment before joining KaamLink.",
//     icon: ShieldCheck,
//   },
//   {
//     q: "How is pricing decided?",
//     a: "Each service shows an upfront starting price. Any additional cost (extra rooms, parts, materials) is confirmed with you before work begins.",
//     icon: CreditCard,
//   },
//   {
//     q: "Can I reschedule a booking?",
//     a: "Yes, you can reschedule or cancel any booking for free up to 2 hours before the scheduled slot from the app.",
//     icon: CalendarCheck,
//   },
//   {
//     q: "Is there a service warranty?",
//     a: "Most services include a 7-day service warranty. If something isn't right, we'll send a professional back at no extra cost.",
//     icon: BadgeCheck,
//   },
//   {
//     q: "What payment methods are accepted?",
//     a: "UPI, cards, net banking, and cash are all accepted, and payment is only collected after the service is completed.",
//     icon: CreditCard,
//   },
// ];

// export default function FAQ() {
//   const [open, setOpen] = useState(0);
//   const [ref, inView] = useReveal();

//   return (
//     <section
//       id="faq"
//       className="relative overflow-hidden bg-[#FAF9F6] py-16 sm:py-20 lg:py-28"
//     >
//       {/* Background decoration */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-pink-100/60 blur-3xl"
//       />
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-rose-100/50 blur-3xl"
//       />

//       <div
//         ref={ref}
//         className={`reveal ${
//           inView ? "in-view" : ""
//         } relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8`}
//       >
//         {/* Section heading */}
//         <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
//           <span className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-pink-600 shadow-sm">
//             <MessageCircleQuestion size={15} />
//             Help & Support
//           </span>

//           <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
//             Got questions?
//             <span className="mt-1 block text-pink-600">
//               We've got answers.
//             </span>
//           </h2>

//           <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
//             Everything you need to know about our services, pricing, bookings,
//             and trusted professionals.
//           </p>
//         </div>

//         {/* FAQ accordion */}
//         <div className="space-y-3 sm:space-y-4">
//           {FAQS.map((item, i) => {
//             const isOpen = open === i;
//             const Icon = item.icon;
//             const answerId = `faq-answer-${i}`;

//             return (
//               <div
//                 key={item.q}
//                 className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
//                   isOpen
//                     ? "border-pink-200 shadow-[0_10px_35px_rgba(190,24,93,0.08)]"
//                     : "border-slate-200/80 shadow-sm hover:border-pink-100 hover:shadow-md"
//                 }`}
//               >
//                 <button
//                   type="button"
//                   onClick={() => setOpen(isOpen ? -1 : i)}
//                   aria-expanded={isOpen}
//                   aria-controls={answerId}
//                   className="flex min-h-[76px] w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-500 sm:gap-4 sm:px-6 sm:py-5"
//                 >
//                   <span
//                     className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 sm:h-11 sm:w-11 ${
//                       isOpen
//                         ? "bg-pink-600 text-white"
//                         : "bg-pink-50 text-pink-600"
//                     }`}
//                   >
//                     <Icon size={20} strokeWidth={1.8} />
//                   </span>

//                   <span
//                     className={`min-w-0 flex-1 text-sm font-bold leading-6 sm:text-base ${
//                       isOpen ? "text-pink-700" : "text-slate-800"
//                     }`}
//                   >
//                     {item.q}
//                   </span>

//                   <span
//                     className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
//                       isOpen
//                         ? "rotate-180 bg-pink-50 text-pink-600"
//                         : "bg-slate-50 text-slate-500"
//                     }`}
//                   >
//                     <ChevronDown size={18} />
//                   </span>
//                 </button>

//                 <div
//                   id={answerId}
//                   aria-hidden={!isOpen}
//                   className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
//                     isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                   }`}
//                 >
//                   <div className="overflow-hidden">
//                     <div className="ml-[68px] mr-4 border-t border-slate-100 pb-5 pt-3 sm:ml-[84px] sm:mr-6 sm:pb-6 sm:pt-4">
//                       <p className="text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
//                         {item.a}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Support footer */}
//         <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-pink-100 bg-white/80 p-5 text-center sm:mt-10 sm:flex-row sm:p-6 sm:text-left">
//           <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600">
//               <MessageCircleQuestion size={22} />
//             </div>

//             <div>
//               <h3 className="text-sm font-bold text-slate-900 sm:text-base">
//                 Still have questions?
//               </h3>
//               <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
//                 Our team is here to help you.
//               </p>
//             </div>
//           </div>

//           <a
//             href="#contact"
//             className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 sm:w-auto"
//           >
//             Contact Support
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }
