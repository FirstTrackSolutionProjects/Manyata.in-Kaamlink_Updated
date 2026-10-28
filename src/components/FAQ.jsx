
import { useState } from "react";
import {
  ChevronDown,
  MessageCircleQuestion,
  ShieldCheck,
  CreditCard,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import useReveal from "../hooks/useReveal";

const FAQS = [
  {
    q: "How are professionals verified?",
    a: "Every professional goes through identity verification, background checks, and a skills assessment before joining KaamLink.",
    icon: ShieldCheck,
  },
  {
    q: "How is pricing decided?",
    a: "Each service shows an upfront starting price. Any additional cost (extra rooms, parts, materials) is confirmed with you before work begins.",
    icon: CreditCard,
  },
  {
    q: "Can I reschedule a booking?",
    a: "Yes, you can reschedule or cancel any booking for free up to 2 hours before the scheduled slot from the app.",
    icon: CalendarCheck,
  },
  {
    q: "Is there a service warranty?",
    a: "Most services include a 7-day service warranty. If something isn't right, we'll send a professional back at no extra cost.",
    icon: BadgeCheck,
  },
  {
    q: "What payment methods are accepted?",
    a: "UPI, cards, net banking, and cash are all accepted, and payment is only collected after the service is completed.",
    icon: CreditCard,
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const [ref, inView] = useReveal();

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#FAF9F6] py-16 sm:py-20 lg:py-28"
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-pink-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-rose-100/50 blur-3xl"
      />

      <div
        ref={ref}
        className={`reveal ${
          inView ? "in-view" : ""
        } relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8`}
      >
        {/* Section heading */}
        <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-pink-600 shadow-sm">
            <MessageCircleQuestion size={15} />
            Help & Support
          </span>

          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Got questions?
            <span className="mt-1 block text-pink-600">
              We've got answers.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Everything you need to know about our services, pricing, bookings,
            and trusted professionals.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            const Icon = item.icon;
            const answerId = `faq-answer-${i}`;

            return (
              <div
                key={item.q}
                className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-pink-200 shadow-[0_10px_35px_rgba(190,24,93,0.08)]"
                    : "border-slate-200/80 shadow-sm hover:border-pink-100 hover:shadow-md"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="flex min-h-[76px] w-full items-center gap-3 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-500 sm:gap-4 sm:px-6 sm:py-5"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 sm:h-11 sm:w-11 ${
                      isOpen
                        ? "bg-pink-600 text-white"
                        : "bg-pink-50 text-pink-600"
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </span>

                  <span
                    className={`min-w-0 flex-1 text-sm font-bold leading-6 sm:text-base ${
                      isOpen ? "text-pink-700" : "text-slate-800"
                    }`}
                  >
                    {item.q}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-pink-50 text-pink-600"
                        : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                <div
                  id={answerId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-[68px] mr-4 border-t border-slate-100 pb-5 pt-3 sm:ml-[84px] sm:mr-6 sm:pb-6 sm:pt-4">
                      <p className="text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-pink-100 bg-white/80 p-5 text-center sm:mt-10 sm:flex-row sm:p-6 sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600">
              <MessageCircleQuestion size={22} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                Still have questions?
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Our team is here to help you.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-pink-600 px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-pink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 sm:w-auto"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
