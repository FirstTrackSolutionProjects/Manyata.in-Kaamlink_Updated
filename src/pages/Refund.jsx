
import {
  ShieldCheck,
  CalendarX,
  CalendarClock,
  UserX,
  RefreshCw,
  CheckCircle2,
  Clock,
  CreditCard,
  Wallet,
  AlertCircle,
  BadgeCheck,
  Mail,
  ArrowRight,
  IndianRupee,
  FileText,
} from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "Overview",
    content: (
      <p>
        We want booking a service on Manyata to feel simple and
        hassle-free. This policy explains when you can cancel or
        reschedule a booking, when refunds apply, and how long
        refunds take to process.
      </p>
    ),
  },
  {
    icon: CalendarX,
    title: "Cancellation by You",
    content: (
      <>
        <p>
          You may cancel a booking free of charge up to{" "}
          <strong className="font-bold text-slate-900">6 hours</strong>{" "}
          before the scheduled slot. Any amount already paid will
          be refunded in full.
        </p>
        <p>
          Cancellations made within 6 hours of the scheduled slot,
          or repeated no-shows, may be subject to a cancellation
          fee to compensate the assigned professional for the
          reserved time.
        </p>
      </>
    ),
  },
  {
    icon: UserX,
    title: "Cancellation by Manyata or the Professional",
    content: (
      <>
        <p>
          If a professional cannot attend your booking, or if we
          cannot assign a professional for your requested slot,
          you will be notified as early as possible and offered
          a free reschedule or a full refund.
        </p>
        <p>
          If a service cannot be completed due to circumstances
          beyond the professional's control, such as an unsafe
          worksite or missing access, you will only be charged
          for the work actually completed. The remaining amount
          will be refunded.
        </p>
      </>
    ),
  },
  {
    icon: CalendarClock,
    title: "Rescheduling Policy",
    content: (
      <p>
        You can reschedule a booking free of charge up to 6 hours
        before the scheduled slot, subject to professional
        availability. Requests made after this window are treated
        as cancellations and may be subject to the applicable
        cancellation fee.
      </p>
    ),
  },
  {
    icon: BadgeCheck,
    title: "Refund Eligibility",
    content: (
      <>
        <p>You may be eligible for a refund if:</p>
        <ul>
          <li>You cancel a booking 6 hours or more before the scheduled slot.</li>
          <li>Manyata or the assigned professional cancels the booking or cannot complete it.</li>
          <li>You were charged but your booking was never confirmed.</li>
          <li>You raise a valid quality complaint within the 7-day service warranty and the issue cannot be resolved through a free re-visit.</li>
        </ul>
      </>
    ),
  },
  {
    icon: RefreshCw,
    title: "Refund Process & Timeline",
    content: (
      <>
        <p>
          Once approved, your refund is initiated to your original
          payment method within 24 hours. The actual crediting time
          depends on your bank or payment provider.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {[
            {
              icon: Wallet,
              title: "UPI",
              time: "2–4 business days",
            },
            {
              icon: CreditCard,
              title: "Credit / Debit Card",
              time: "5–7 business days",
            },
            {
              icon: IndianRupee,
              title: "Net Banking",
              time: "5–7 business days",
            },
            {
              icon: Wallet,
              title: "Wallet Balance",
              time: "Instant, where applicable",
            },
          ].map((method) => {
            const Icon = method.icon;

            return (
              <div
                key={method.title}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {method.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {method.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </>
    ),
  },
  {
    icon: AlertCircle,
    title: "Non-Refundable Cases",
    content: (
      <>
        <p>The following are generally not eligible for a refund:</p>
        <ul>
          <li>Cancellations made within 6 hours of the scheduled slot, except for any refundable amount after applicable fees.</li>
          <li>Cost of materials or parts already purchased specifically for your job.</li>
          <li>Work that has already been completed according to the agreed scope.</li>
          <li>Bookings made using non-refundable promotional credits or discount codes, unless required by law.</li>
        </ul>
      </>
    ),
  },
  {
    icon: CheckCircle2,
    title: "Service Quality Refunds",
    content: (
      <p>
        Most services include a 7-day service warranty. If you are
        dissatisfied with the service outcome, contact our support
        team within 7 days. We will first arrange a free re-visit
        to resolve the issue. If the issue remains unresolved,
        a partial or full refund may be issued depending on
        the nature of the complaint.
      </p>
    ),
  },
  {
    icon: FileText,
    title: "How to Request a Cancellation or Refund",
    content: (
      <p>
        To cancel or reschedule, visit "My Bookings" in your account
        and select the relevant booking. For a refund request
        concerning a completed service, use the "Report an Issue"
        option or contact our support team directly with your
        order ID.
      </p>
    ),
  },
];

export default function RefundCancellation() {
  return (
    <main className="min-h-screen bg-[#fafaf7] pb-20">

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#14251f] text-white">
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <RefreshCw size={16} />
              Transparent Refund Policy
            </div>

            <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Refund &{" "}
              <span className="text-emerald-400">
                Cancellation.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Your convenience matters to us. Understand our
              cancellation, rescheduling and refund process
              before booking a service with Manyata.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              {/* <span className="inline-flex items-center gap-2">
                <Clock size={16} />
                Last updated: November 4, 2026
              </span> */}

              <span className="h-1 w-1 rounded-full bg-emerald-400" />

              <span>Manyata Customer Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Cancellation Highlight */}
        <div className="relative -mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarClock size={27} />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                Flexible Cancellation Window
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                Cancel or reschedule your booking free of charge
                up to 6 hours before your scheduled service slot,
                subject to the terms of this policy.
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="text-4xl font-extrabold text-emerald-600">
                6
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Hours
              </p>
            </div>
          </div>
        </div>

        {/* Policy Layout */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                On this page
              </p>

              <nav className="mt-5 space-y-4">
                {sections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#refund-section-${index + 1}`}
                    className="group flex items-start gap-3 text-sm leading-5 text-slate-600 transition-colors hover:text-emerald-600"
                  >
                    <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </a>
                ))}

                <a
                  href="#refund-contact"
                  className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-emerald-600"
                >
                  <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-600">
                    10
                  </span>
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Support Card */}
            <div className="mt-5 rounded-2xl bg-[#14251f] p-6 text-white shadow-lg">
              <ShieldCheck className="text-emerald-400" size={28} />

              <h3 className="mt-4 font-bold">
                Need assistance?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Our support team is here to help with
                your booking and refund queries.
              </p>

              <a
                href="mailto:refunds@manyata.in"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Contact Support
                <ArrowRight size={16} />
              </a>
            </div>
          </aside>

          {/* Policy Sections */}
          <div className="min-w-0 space-y-5">

            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <article
                  id={`refund-section-${index + 1}`}
                  key={section.title}
                  className="scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5 sm:p-8"
                >
                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                          {section.title}
                        </h2>
                      </div>

                      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base [&_p]:leading-7 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:pl-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[11px] [&_li]:before:h-2 [&_li]:before:w-2 [&_li]:before:rounded-full [&_li]:before:bg-emerald-500">
                        {section.content}
                      </div>

                    </div>
                  </div>
                </article>
              );
            })}

            {/* Contact Section */}
            <article
              id="refund-contact"
              className="scroll-mt-28 overflow-hidden rounded-2xl bg-emerald-600 p-7 text-white shadow-lg shadow-emerald-900/10 sm:p-9"
            >
              <div className="flex items-center gap-3">
                <Mail size={25} />

                <h2 className="text-xl font-bold sm:text-2xl">
                  10. Contact Us
                </h2>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
                For any questions about cancellations, rescheduling
                or refunds, please contact our customer support team.
              </p>

              <a
                href="mailto:refunds@manyata.in"
                className="mt-6 inline-flex max-w-full flex-wrap items-center gap-3 rounded-xl bg-white px-5 py-3 font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Mail size={18} />
                refunds@manyata.in
                <ArrowRight size={17} />
              </a>
            </article>

            {/* Bottom Note */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-6 text-center text-sm text-slate-400">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Thank you for choosing Manyata.
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
