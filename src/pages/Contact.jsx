
import { useState } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  ChevronDown,
  Send,
  CheckCircle2,
  Building2,
  ArrowRight,
  Sparkles,
  Headphones,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import useReveal from "../hooks/useReveal";

const METHODS = [
  {
    icon: Phone,
    title: "Call us",
    detail: "8114721300 / 7008581300",
    note: "Mon–Sun, 7am–11pm",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Mail,
    title: "Email us",
    detail: "support@themanyata.com",
    note: "Reply within 24 hours",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    detail: "Chat in the app",
    note: "Fast response, 9am–9pm",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: MapPin,
    title: "Visit us",
    detail: "Balasore & Rourkela",
    note: "By appointment only",
    color: "bg-violet-50 text-violet-600",
  },
];

const OFFICES = [
  {
    name: "Main Office",
    address: "College Square, Soro, Balasore, Odisha - 756045",
    phone: "8114721300 / 7008581300",
  },
  {
    name: "Sundargarh Branch",
    address: "At: Bisra, Rourkela, Sundargarh, Odisha - 770036",
    phone: "8114721300",
  },
];

const HOURS = [
  { day: "Monday – Friday", time: "7:00 AM – 7:00 PM" },
  { day: "Saturday – Sunday", time: "8:00 AM – 7:00 PM" },
];

const MINI_FAQS = [
  {
    q: "Do you operate in my city?",
    a: "We're currently live in Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai, Kolkata and Ahmedabad, with new cities added regularly.",
  },
  {
    q: "How do I become a Manyata partner?",
    a: 'Fill out the form on this page with "Partner with us" as the subject, and our onboarding team will reach out within 2 business days.',
  },
  {
    q: "What if I'm not satisfied with a service?",
    a: "Every booking includes a 7-day warranty — contact support and we'll send a professional back at no extra cost.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [headerRef, headerIn] = useReveal();
  const [methodsRef, methodsIn] = useReveal();
  const [formRef, formIn] = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="overflow-hidden bg-slate-50">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-950 pt-24 pb-28 sm:pt-32 sm:pb-36">

        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />

        <div
          ref={headerRef}
          className={`reveal ${headerIn ? "in-view" : ""} relative z-10 mx-auto max-w-5xl px-6 text-center`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-200 backdrop-blur-md">
            <Sparkles size={15} />
            We're here to help
          </span>

          <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-7xl">
            Let's make your
            <span className="block text-indigo-300">
              home life easier.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-indigo-100/80 sm:text-lg">
            Have a question, need booking support, or interested in partnering
            with Manyata? We'd love to hear from you.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href="tel:8114721300"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition-all hover:-translate-y-1 hover:bg-indigo-400"
            >
              <Phone size={17} />
              Call us now
            </a>

            <a
              href="mailto:support@themanyata.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-indigo-950"
            >
              <Mail size={17} />
              Email us
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT METHODS */}
      <section className="relative z-10 px-6 py-16 lg:py-20">
        <div
          ref={methodsRef}
          className={`reveal ${methodsIn ? "in-view" : ""} mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4`}
        >
          {METHODS.map(({ icon: Icon, title, detail, note, color }) => (
            <div
              key={title}
              className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
            >
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon size={25} />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                {title}
              </h3>

              <p className="mt-2 break-words text-sm font-bold text-slate-700">
                {detail}
              </p>

              <p className="mt-2 text-xs text-slate-500">{note}</p>

              <div className="mt-5 h-1 w-10 rounded-full bg-indigo-500 transition-all duration-300 group-hover:w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM + OFFICE DETAILS */}
      <section className="bg-white px-6 py-20 lg:py-28">
        <div
          ref={formRef}
          className={`reveal ${formIn ? "in-view" : ""} mx-auto grid max-w-7xl gap-10 lg:grid-cols-5`}
        >

          {/* CONTACT FORM */}
          <div className="lg:col-span-3">
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 shadow-sm sm:p-10 lg:p-12">

              <div className="mb-8">
                <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
                  Contact our team
                </span>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Send us a message.
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                  Tell us what you need. Our team will get back to you within
                  24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-3xl border border-indigo-100 bg-white p-8 text-center sm:p-12">
                  <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-indigo-50">
                    <CheckCircle2 size={38} className="text-indigo-600" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-900">
                    Message sent!
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                    Thank you for reaching out. Our support team will review
                    your message and get back to you shortly.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700"
                  >
                    Send another message
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        Full name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Priya Sharma"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold text-slate-700">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Subject
                    </label>
                    <select
                      required
                      defaultValue=""
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="" disabled>
                        Select a topic
                      </option>
                      <option>General inquiry</option>
                      <option>Booking support</option>
                      <option>Partner with us</option>
                      <option>Feedback</option>
                      <option>Press & media</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-700">
                      Your message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 sm:w-auto"
                  >
                    Send message
                    <Send size={17} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* OFFICE INFORMATION */}
          <div className="space-y-6 lg:col-span-2">

            <div className="rounded-[2rem] bg-gradient-to-br from-indigo-950 to-blue-950 p-7 text-white shadow-xl sm:p-8">

              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500 text-white">
                  <Building2 size={21} />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">Our offices</h3>
                  <p className="text-xs text-indigo-200">
                    Come say hello
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-7">
                {OFFICES.map((office) => (
                  <div
                    key={office.name}
                    className="border-l-2 border-indigo-400 pl-4"
                  >
                    <h4 className="text-sm font-bold text-white">
                      {office.name}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-indigo-100/80">
                      {office.address}
                    </p>

                    <a
                      href={`tel:${office.phone.split(" / ")[0]}`}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-indigo-300 transition-colors hover:text-white"
                    >
                      <Phone size={13} />
                      {office.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* GOOGLE MAP */}
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 p-5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900">
                    Find our office
                  </h3>
                  <p className="text-xs text-slate-500">
                    Soro, Balasore
                  </p>
                </div>
              </div>

              <div className="h-[260px] bg-slate-100">
                <iframe
                  title="Manyata Main Office Location"
                  src="https://www.google.com/maps?q=College+Square,+Soro,+Balasore,+Odisha+-+756045&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* SUPPORT HOURS */}
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Clock size={21} />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900">
                    Support hours
                  </h3>
                  <p className="text-xs text-slate-500">
                    We're available for you
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {HOURS.map((hour) => (
                  <div
                    key={hour.day}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-600">
                      {hour.day}
                    </span>

                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900">
                      {hour.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-slate-50 px-6 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">

          <div>
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-600">
              <Headphones size={16} />
              Need more help?
            </span>

            <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
              We've got answers
              <span className="block text-indigo-600">for you.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              Find quick answers to common questions about our services,
              partnerships and support.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-white p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShieldCheck size={24} />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Here for your peace of mind
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Your satisfaction matters to us.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {MINI_FAQS.map((item, i) => {
              const isOpen = openFaq === i;

              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-indigo-300 shadow-lg shadow-indigo-100/50"
                      : "border-slate-100 shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold leading-6 text-slate-900 sm:text-base">
                      {item.q}
                    </span>

                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all ${
                        isOpen
                          ? "rotate-180 bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-6 text-sm leading-7 text-slate-500 sm:px-6">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white px-6 pb-20 pt-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-700 via-indigo-800 to-blue-950 px-7 py-14 text-center shadow-xl shadow-indigo-200/40 sm:px-12 sm:py-16">

          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10 text-white">
              <CalendarCheck size={27} />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Ready to get started?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
              Whether you need a service or want to grow with Manyata, our team
              is just one conversation away.
            </p>

            <a
              href="tel:8114721300"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-indigo-700 transition-all hover:-translate-y-1 hover:bg-indigo-50"
            >
              Talk to our team
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}







// import { useState } from "react";
// import {
//   Phone,
//   Mail,
//   MessageCircle,
//   MapPin,
//   Clock,
//   ChevronDown,
//   Send,
//   CheckCircle2,
//   Building2,
// } from "lucide-react";
// import useReveal from "../hooks/useReveal";

// // Updated Contact Methods
// const METHODS = [
//   {
//     icon: Phone,
//     title: "Call us",
//     detail: "8114721300 / 7008581300",
//     note: "Mon–Sun, 7am–11pm",
//   },
//   {
//     icon: Mail,
//     title: "Email us",
//     detail: "support@themanyata.com",
//     note: "We reply within 24 hours",
//   },
//   {
//     icon: MessageCircle,
//     title: "Live chat",
//     detail: "Chat in the app",
//     note: "Fastest response, 9am–9pm",
//   },
//   {
//     icon: MapPin,
//     title: "Visit us",
//     detail: "Balasore & Rourkela",
//     note: "By appointment only",
//   },
// ];

// // Updated Office Addresses
// const OFFICES = [
//   {
//     name: "Main Office",
//     address: "College Square, Soro, Balasore, Odisha - 756045",
//     phone: "8114721300 / 7008581300",
//   },
//   {
//     name: "Sundargarh Branch",
//     address: "At: Bisra, Rourkela, Sundargarh, Odisha - 770036",
//     phone: "8114721300",
//   },
// ];

// const HOURS = [
//   { day: "Monday – Friday", time: "7:00 AM – 7:00 PM" },
//   { day: "Saturday – Sunday", time: "8:00 AM – 7:00 PM" },
// ];

// const MINI_FAQS = [
//   {
//     q: "Do you operate in my city?",
//     a: "We're currently live in Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Chennai, Kolkata and Ahmedabad, with new cities added regularly.",
//   },
//   {
//     q: "How do I become a Manyata partner?",
//     a: 'Fill out the form on this page with "Partner with us" as the subject, and our onboarding team will reach out within 2 business days.',
//   },
//   {
//     q: "What if I'm not satisfied with a service?",
//     a: "Every booking includes a 7-day warranty — contact support and we'll send a professional back at no extra cost.",
//   },
// ];

// export default function Contact() {
//   const [openFaq, setOpenFaq] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [headerRef, headerIn] = useReveal();
//   const [methodsRef, methodsIn] = useReveal();
//   const [formRef, formIn] = useReveal();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };

//   return (
//     <>
//       {/* Header */}
//       <section className="relative overflow-hidden bg-ivory pt-10 pb-4">
//         <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand-400/20 to-gold-400/20 blur-3xl animate-float" />
//         <div
//           ref={headerRef}
//           className={`reveal ${headerIn ? "in-view" : ""} relative max-w-3xl mx-auto px-6 lg:px-8 pt-10 pb-14 text-center`}
//         >
//           <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
//             We're here to help
//           </span>
//           <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
//             Get in touch with Manyata
//           </h1>
//           <p className="mt-4 text-slate-600 text-lg">
//             Questions about a booking, interested in partnering with us, or
//             just want to say hello — reach us any way that works for you.
//           </p>
//         </div>
//       </section>

//       {/* Contact methods */}
//       <section className="pb-16 lg:pb-20">
//         <div
//           ref={methodsRef}
//           className={`reveal ${methodsIn ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6`}
//         >
//           {METHODS.map(({ icon: Icon, title, detail, note }) => (
//             <div
//               key={title}
//               className="group rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-soft hover:border-brand-100 hover:-translate-y-1 transition-all duration-300"
//             >
//               <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
//                 <Icon size={22} />
//               </div>
//               <p className="font-display font-bold text-slate-900">{title}</p>
//               <p className="mt-1.5 text-sm font-semibold text-slate-700 break-words">{detail}</p>
//               <p className="mt-1 text-xs text-slate-500">{note}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Form + side info */}
//       <section className="pb-20 lg:pb-28 bg-white">
//         <div
//           ref={formRef}
//           className={`reveal ${formIn ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8 pt-16 grid lg:grid-cols-5 gap-10`}
//         >
//           {/* Form */}
//           <div className="lg:col-span-3 rounded-[2rem] bg-ivory p-6 sm:p-10 shadow-card border border-slate-100">
//             <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
//               Send us a message
//             </h2>
//             <p className="mt-2 text-sm text-slate-500">
//               Fill in the details below and our team will get back to you within 24 hours.
//             </p>

//             {submitted ? (
//               <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-10 text-center shadow-sm">
//                 <div className="mx-auto h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
//                   <CheckCircle2 size={32} className="text-green-500" />
//                 </div>
//                 <p className="text-xl font-display font-bold text-slate-900">Message sent successfully</p>
//                 <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
//                   Thanks for reaching out! Our support team will review your message and get back to you shortly.
//                 </p>
//                 <button 
//                   onClick={() => setSubmitted(false)}
//                   className="mt-6 text-sm font-bold text-brand-600 hover:text-brand-700"
//                 >
//                   Send another message
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//                 <div className="grid sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full name</label>
//                     <input
//                       type="text"
//                       required
//                       placeholder="Priya Sharma"
//                       className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all placeholder:text-slate-400"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone number</label>
//                     <input
//                       type="tel"
//                       required
//                       placeholder="+91 98765 43210"
//                       className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all placeholder:text-slate-400"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email address</label>
//                   <input
//                     type="email"
//                     required
//                     placeholder="you@themanyata.com"
//                     className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all placeholder:text-slate-400"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-xs font-bold text-slate-700 mb-1.5 block">Subject</label>
//                   <select
//                     required
//                     defaultValue=""
//                     className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all text-slate-700"
//                   >
//                     <option value="" disabled>
//                       Select a topic
//                     </option>
//                     <option>General inquiry</option>
//                     <option>Booking support</option>
//                     <option>Partner with us</option>
//                     <option>Feedback</option>
//                     <option>Press & media</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-xs font-bold text-slate-700 mb-1.5 block">Message</label>
//                   <textarea
//                     required
//                     rows={4}
//                     placeholder="How can we help?"
//                     className="w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50 transition-all placeholder:text-slate-400 resize-none"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="inline-flex items-center justify-center w-full sm:w-auto gap-2 rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
//                 >
//                   Send message
//                   <Send size={16} />
//                 </button>
//               </form>
//             )}
//           </div>

//           {/* Side info */}
//           <div className="lg:col-span-2 space-y-6">
            
//             {/* Offices + Map Container */}
//             <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              
//               {/* Offices Section */}
//               <div className="p-6 border-b border-slate-100">
//                 <div className="flex items-center gap-2 mb-5">
//                   <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
//                     <Building2 size={16} />
//                   </div>
//                   <p className="font-display font-bold text-slate-900">Our Offices</p>
//                 </div>
//                 <div className="space-y-5">
//                   {OFFICES.map((office, i) => (
//                     <div key={i} className="pl-4 border-l-2 border-brand-200">
//                       <p className="text-sm font-bold text-slate-900">{office.name}</p>
//                       <p className="mt-1 text-xs text-slate-500 leading-relaxed">{office.address}</p>
//                       <p className="mt-1.5 text-xs font-semibold text-brand-600 flex items-center gap-1">
//                         <Phone size={12} /> {office.phone}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Map - BMC Style Zoomed View */}
//               <div className="w-full h-[280px] bg-slate-100 relative">
//                 <iframe
//                   title="Manyata Main Office Location"
//                   // Exact location of Balasore office
//                   src="https://www.google.com/maps?q=College+Square,+Soro,+Balasore,+Odisha+-+756045&output=embed"
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   allowFullScreen=""
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                   className="absolute inset-0 grayscale-[20%] contrast-[110%]"
//                 />
//               </div>
//             </div>

//             {/* Support Hours */}
//             <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
//                   <Clock size={16} />
//                 </div>
//                 <p className="font-display font-bold text-slate-900">Support hours</p>
//               </div>
//               <ul className="space-y-3 text-sm">
//                 {HOURS.map((h) => (
//                   <li key={h.day} className="flex justify-between items-center text-slate-500">
//                     <span>{h.day}</span>
//                     <span className="font-semibold text-slate-900 bg-slate-50 px-2 py-1 rounded-md text-xs">{h.time}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Quick Answers */}
//             <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
//               <p className="font-display font-bold text-slate-900 mb-4">Quick answers</p>
//               <div className="space-y-3">
//                 {MINI_FAQS.map((item, i) => {
//                   const isOpen = openFaq === i;
//                   return (
//                     <div key={item.q} className="rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
//                       <button
//                         onClick={() => setOpenFaq(isOpen ? -1 : i)}
//                         className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
//                         aria-expanded={isOpen}
//                       >
//                         <span className="text-sm font-semibold text-slate-800">{item.q}</span>
//                         <ChevronDown
//                           size={16}
//                           className={`shrink-0 text-brand-600 transition-transform duration-300 ${
//                             isOpen ? "rotate-180" : ""
//                           }`}
//                         />
//                       </button>
//                       <div
//                         className={`grid transition-all duration-300 ease-out ${
//                           isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                         }`}
//                       >
//                         <div className="overflow-hidden">
//                           <p className="px-4 pb-4 text-xs text-slate-500 leading-relaxed">
//                             {item.a}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }



