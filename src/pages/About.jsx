
import {
  ShieldCheck,
  IndianRupee,
  Award,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  Star,
} from "lucide-react";

import useReveal from "../hooks/useReveal";
import { aboutHero, teamMembers } from "../assets/asset";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    desc: "Every professional is background-verified before they enter a customer's home.",
    number: "01",
  },
  {
    icon: IndianRupee,
    title: "Fair Pricing",
    desc: "Transparent pricing with no hidden charges and fair earnings for our professionals.",
    number: "02",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    desc: "Our service promise includes a 7-day warranty and a dedicated support team.",
    number: "03",
  },
  {
    icon: Heart,
    title: "Community Impact",
    desc: "We empower local professionals with skills, opportunities and sustainable careers.",
    number: "04",
  },
];

const TIMELINE = [
  {
    year: "2021",
    text: "Manyata founded in Bengaluru with 3 services and 40 professionals.",
  },
  {
    year: "2022",
    text: "Expanded to Mumbai and Pune; crossed 1,000 verified professionals.",
  },
  {
    year: "2023",
    text: "Reached 50,000+ completed bookings across 5 cities.",
  },
  {
    year: "2024",
    text: "Expanded the professional network and added 4 service categories.",
  },
  {
    year: "2025",
    text: "Reached 8 cities with a dedicated Trust & Safety team.",
  },
  {
    year: "2026",
    text: "Working toward pan-India coverage, one verified professional at a time.",
  },
];

const TEAM = [
  { name: "Arjun Khanna", role: "Co-founder & CEO" },
  { name: "Divya Menon", role: "Co-founder & COO" },
  { name: "Karan Rao", role: "Head of Operations" },
  { name: "Sana Iyer", role: "Head of Trust & Safety" },
];

const STATS = [
  { value: "50K+", label: "Homes serviced", icon: Building2 },
  { value: "12K+", label: "Verified professionals", icon: Users },
  { value: "8", label: "Cities live", icon: CheckCircle2 },
  { value: "4.8/5", label: "Average rating", icon: Star },
];

function SectionLabel({ children }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 sm:text-xs">
      <Sparkles size={13} />
      {children}
    </span>
  );
}

export default function About() {
  const [heroRef, heroIn] = useReveal();
  const [valuesRef, valuesIn] = useReveal();
  const [timelineRef, timelineIn] = useReveal();
  const [teamRef, teamIn] = useReveal();
  const [statsRef, statsIn] = useReveal();
  const [ctaRef, ctaIn] = useReveal();

  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate bg-ivory">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-20 -z-10 h-64 w-64 rounded-full bg-brand-400/15 blur-3xl sm:h-80 sm:w-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl sm:h-80 sm:w-80"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div
            ref={heroRef}
            className={`reveal min-w-0 ${heroIn ? "in-view" : ""}`}
          >
            <SectionLabel>About Manyata</SectionLabel>

            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              Home services you can{" "}
              <span className="bg-gradient-to-r from-brand-600 to-gold-500 bg-clip-text text-transparent">
                actually trust.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
              Finding a reliable professional for your home should be simple.
              We bring you verified professionals, transparent pricing and
              dependable service, all in one place.
            </p>

            <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
              <div className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-3.5 shadow-sm sm:p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <ShieldCheck size={21} />
                </span>
                <div>
                  <p className="text-sm font-bold">Verified professionals</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Safety comes first
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-3.5 shadow-sm sm:p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <IndianRupee size={21} />
                </span>
                <div>
                  <p className="text-sm font-bold">Clear pricing</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    No hidden charges
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/contact"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 sm:mt-8 sm:w-auto"
            >
              Get in touch
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-gradient-to-br from-brand-200/70 via-white to-gold-200/70 sm:-inset-4 sm:rounded-[2.5rem]"
            />

            <div className="relative overflow-hidden rounded-[1.6rem] border border-white bg-white p-2 shadow-2xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-3">
              <img
                src={aboutHero.src}
                width={aboutHero.width}
                height={aboutHero.height}
                alt={aboutHero.alt}
                loading="eager"
                className="aspect-[4/3] w-full rounded-[1.2rem] object-cover sm:rounded-[1.5rem]"
              />

              <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 sm:h-12 sm:w-12">
                  <Heart size={23} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 sm:text-base">
                    Your home, in good hands
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    Reliable service. Genuine care.
                  </p>
                </div>
                <CheckCircle2
                  size={23}
                  className="shrink-0 text-brand-600"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20 lg:py-24">
        <div
          ref={valuesRef}
          className={`reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
            valuesIn ? "in-view" : ""
          }`}
        >
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <SectionLabel>What drives us</SectionLabel>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Our mission & values
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Making quality home services accessible, reliable and fairly
              priced for every household.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, desc, number }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-900/5 sm:p-6"
              >
                <span className="absolute right-4 top-3 text-4xl font-black text-slate-100 transition-colors group-hover:text-brand-50">
                  {number}
                </span>

                <div className="relative mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={23} />
                </div>

                <h3 className="relative text-base font-bold text-slate-900 sm:text-lg">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {desc}
                </p>

                <div className="mt-5 h-1 w-10 rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-300 group-hover:w-16" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-50 py-14 sm:py-20 lg:py-24">
        <div
          ref={timelineRef}
          className={`reveal mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ${
            timelineIn ? "in-view" : ""
          }`}
        >
          <div className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
            <SectionLabel>Our journey</SectionLabel>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
              From 3 services to 10
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Every milestone brings us closer to making home services easier
              and more dependable.
            </p>
          </div>

          <div className="relative ml-2 space-y-5 border-l-2 border-brand-100 pl-6 sm:ml-6 sm:space-y-7 sm:pl-10">
            {TIMELINE.map((item, index) => (
              <article
                key={item.year}
                className="relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-md sm:p-5"
              >
                <span className="absolute -left-[2.02rem] top-5 h-4 w-4 rounded-full border-[3px] border-white bg-brand-600 ring-2 ring-brand-100 sm:-left-[3.02rem] sm:h-5 sm:w-5" />

                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-5">
                  <span className="w-fit rounded-lg bg-brand-50 px-3 py-1 text-sm font-extrabold text-brand-700">
                    {item.year}
                  </span>

                  <p className="min-w-0 flex-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 sm:py-20 lg:py-24">
        <div
          ref={teamRef}
          className={`reveal mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
            teamIn ? "in-view" : ""
          }`}
        >
          <div className="mx-auto mb-10 max-w-xl text-center sm:mb-14">
            <SectionLabel>Leadership</SectionLabel>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-4xl">
              The team behind Manyata
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              The people working to make every customer experience better.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {TEAM.map((member, index) => {
              const personImage = teamMembers[index];

              return (
                <article
                  key={member.name}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 sm:p-5"
                >
                  <div className="overflow-hidden rounded-2xl bg-slate-50">
                    {personImage?.src && (
                      <img
                        src={personImage.src}
                        width={personImage.width}
                        height={personImage.height}
                        alt={personImage.alt || member.name}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <h3 className="mt-4 break-words text-sm font-bold text-slate-900 sm:text-base">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium leading-5 text-brand-700 sm:text-sm">
                    {member.role}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div
          ref={statsRef}
          className={`reveal mx-auto max-w-7xl ${statsIn ? "in-view" : ""}`}
        >
          <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-slate-950 px-4 py-9 shadow-2xl shadow-slate-900/10 sm:rounded-[2.5rem] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-brand-600/25 blur-3xl sm:h-80 sm:w-80"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"
            />

            <div className="mb-8 text-center sm:mb-12">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-300 sm:text-sm">
                Manyata in numbers
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Growing with your trust
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="min-w-0 text-center">
                  <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-brand-300 sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Icon size={21} />
                  </div>

                  <p className="break-words text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                    {value}
                  </p>

                  <p className="mx-auto mt-2 max-w-36 text-xs leading-5 text-slate-400 sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div
          ref={ctaRef}
          className={`reveal relative mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] border border-brand-100 bg-gradient-to-br from-brand-50 via-white to-amber-50 px-5 py-10 text-center sm:rounded-[2.5rem] sm:px-10 sm:py-14 ${
            ctaIn ? "in-view" : ""
          }`}
        >
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-700 shadow-sm sm:h-14 sm:w-14">
            <Heart size={26} />
          </div>

          <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Want to join the Manyata network?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            We welcome skilled professionals who care about quality service
            and want to build a better future with us.
          </p>

          <a
            href="/contact"
            className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 sm:mt-8 sm:w-auto"
          >
            Partner with us
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>
      </section>
    </main>
  );
}







// import { ShieldCheck, IndianRupee, Award, Heart, ArrowRight } from "lucide-react";
// import useReveal from "../hooks/useReveal";
// import { aboutHero, teamMembers } from "../assets/asset";

// const VALUES = [
//   {
//     icon: ShieldCheck,
//     title: "Trust & Safety",
//     desc: "Every professional is background-verified before they ever enter a customer's home.",
//   },
//   {
//     icon: IndianRupee,
//     title: "Fair Pricing",
//     desc: "Upfront pricing with no hidden charges — for customers and fair earnings for our pros.",
//   },
//   {
//     icon: Award,
//     title: "Quality Assurance",
//     desc: "Every job comes with a 7-day service warranty and a real human support team.",
//   },
//   {
//     icon: Heart,
//     title: "Community Impact",
//     desc: "We train and upskill local service professionals to build sustainable careers.",
//   },
// ];

// const TIMELINE = [
//   { year: "2021", text: "Manyata founded in Bengaluru with 3 services and 40 professionals." },
//   { year: "2022", text: "Expanded to Mumbai and Pune; crossed 1,000 verified professionals." },
//   { year: "2023", text: "Reached 50,000+ completed bookings across 5 cities." },
//   { year: "2024", text: "Grew the professional network past 12,000, added 4 new service categories." },
//   { year: "2025", text: "Live in 8 cities with a dedicated Trust & Safety team." },
//   { year: "2026", text: "Building toward pan-India coverage, one verified professional at a time." },
// ];

// const TEAM = [
//   { name: "Arjun Khanna", role: "Co-founder & CEO" },
//   { name: "Divya Menon", role: "Co-founder & COO" },
//   { name: "Karan Rao", role: "Head of Operations" },
//   { name: "Sana Iyer", role: "Head of Trust & Safety" },
// ];

// const STATS = [
//   { value: "50K+", label: "Homes serviced" },
//   { value: "12K+", label: "Verified professionals" },
//   { value: "8", label: "Cities live" },
//   { value: "4.8/5", label: "Average rating" },
// ];

// export default function About() {
//   const [heroRef, heroIn] = useReveal();
//   const [valuesRef, valuesIn] = useReveal();
//   const [timelineRef, timelineIn] = useReveal();
//   const [teamRef, teamIn] = useReveal();
//   const [statsRef, statsIn] = useReveal();
//   const [ctaRef, ctaIn] = useReveal();

//   return (
//     <>
//       {/* Hero */}
//       <section className="relative overflow-hidden bg-ivory pt-10 pb-4">
//         <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand-400/20 to-gold-400/20 blur-3xl animate-float" />
//         <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-20 grid lg:grid-cols-2 gap-12 items-center">
//           <div ref={heroRef} className={`reveal ${heroIn ? "in-view" : ""}`}>
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//               About Manyata
//             </span>
//             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
//               We're making home services something you can{" "}
//               <span className="bg-gradient-to-r from-brand-600 to-gold-500 bg-clip-text text-transparent">
//                 actually trust
//               </span>
//               .
//             </h1>
//             <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-lg leading-relaxed">
//               Manyata started with a simple frustration: finding a reliable
//               professional for basic home needs shouldn't be this hard. So we
//               built a platform where every professional is verified, every
//               price is upfront, and every job is backed by a warranty.
//             </p>
//           </div>
//           <div className="relative">
//             <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-100 to-gold-400/20 -rotate-3 scale-95 blur-sm" />
//             <img
//               src={aboutHero.src}
//               width={aboutHero.width}
//               height={aboutHero.height}
//               alt={aboutHero.alt}
//               className="relative w-full max-w-md mx-auto rounded-[2.5rem] shadow-soft border border-slate-100"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Values */}
//       <section className="py-20 lg:py-24 bg-white">
//         <div
//           ref={valuesRef}
//           className={`reveal ${valuesIn ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8`}
//         >
//           <div className="text-center max-w-xl mx-auto mb-14">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//               What drives us
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
//               Our mission & values
//             </h2>
//             <p className="mt-3 text-slate-500">
//               To make quality home services accessible, reliable and fairly
//               priced for every Indian household.
//             </p>
//           </div>
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {VALUES.map(({ icon: Icon, title, desc }) => (
//               <div
//                 key={title}
//                 className="group rounded-3xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-soft hover:border-brand-100 hover:-translate-y-1 transition-all duration-300"
//               >
//                 <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
//                   <Icon size={22} />
//                 </div>
//                 <p className="font-display font-bold text-slate-900">{title}</p>
//                 <p className="mt-2 text-sm text-slate-500 leading-relaxed">{desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Timeline */}
//       <section className="py-20 lg:py-24 bg-slate-50">
//         <div
//           ref={timelineRef}
//           className={`reveal ${timelineIn ? "in-view" : ""} max-w-3xl mx-auto px-6 lg:px-8`}
//         >
//           <div className="text-center mb-14">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//               Our journey
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
//               From 3 services to 10
//             </h2>
//           </div>
//           <div className="relative pl-8 border-l-2 border-slate-200 space-y-10">
//             {TIMELINE.map((t) => (
//               <div key={t.year} className="relative">
//                 <span className="absolute -left-[2.55rem] top-0 h-5 w-5 rounded-full bg-gradient-to-br from-brand-500 to-gold-500 ring-4 ring-slate-50" />
//                 <p className="text-sm font-bold text-brand-600">{t.year}</p>
//                 <p className="mt-1 text-slate-700 font-medium">{t.text}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Team */}
//       <section className="py-20 lg:py-24 bg-white">
//         <div
//           ref={teamRef}
//           className={`reveal ${teamIn ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8`}
//         >
//           <div className="text-center max-w-xl mx-auto mb-14">
//             <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-xs font-bold uppercase tracking-wider text-brand-600 mb-4">
//               Leadership
//             </span>
//             <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
//               The team behind Manyata
//             </h2>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//             {TEAM.map((member, i) => (
//               <div key={member.name} className="text-center group">
//                 <div className="relative inline-block">
//                   <img
//                     src={teamMembers[i].src}
//                     width={teamMembers[i].width}
//                     height={teamMembers[i].height}
//                     alt={teamMembers[i].alt}
//                     className="mx-auto h-36 w-36 rounded-[2rem] object-cover shadow-sm border border-slate-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300"
//                   />
//                 </div>
//                 <p className="mt-5 font-display font-bold text-slate-900">{member.name}</p>
//                 <p className="text-sm font-medium text-brand-600 mt-0.5">{member.role}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats */}
//       <section className="py-16 lg:py-20 bg-slate-50">
//         <div
//           ref={statsRef}
//           className={`reveal ${statsIn ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8`}
//         >
//           <div className="rounded-[2rem] bg-slate-900 px-6 py-12 lg:py-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center shadow-xl relative overflow-hidden">
//             {/* Background Glow */}
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-slate-900 to-slate-900 pointer-events-none" />
            
//             {STATS.map((s) => (
//               <div key={s.label} className="relative z-10">
//                 <p className="text-3xl sm:text-4xl font-display font-extrabold text-white">
//                   {s.value}
//                 </p>
//                 <p className="mt-2 text-sm font-medium text-slate-400">{s.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-16 lg:py-20 bg-white">
//         <div
//           ref={ctaRef}
//           className={`reveal ${ctaIn ? "in-view" : ""} max-w-3xl mx-auto px-6 lg:px-8 text-center`}
//         >
//           <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
//             Want to join the Manyata network?
//           </h2>
//           <p className="mt-4 text-slate-500">
//             We're always looking for skilled, background-verified professionals
//             to join our platform.
//           </p>
          
//           <a
//             href="/contact"
//             className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-md hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
//           >
//             Partner with us
//             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//           </a>
//         </div>
//       </section>
//     </>
//   );
// }