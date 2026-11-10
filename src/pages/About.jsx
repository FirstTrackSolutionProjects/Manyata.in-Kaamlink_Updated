
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

// ==================== VALUES ====================

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

// ==================== TIMELINE ====================

const TIMELINE = [
  {
    year: "2026",
    text: "Working toward pan-India coverage, one verified professional at a time.",
  },
];

// ==================== TEAM ====================

const TEAM = [
  { name: "Arjun Khanna", role: "Co-founder & CEO" },
  { name: "Divya Menon", role: "Co-founder & COO" },
  { name: "Karan Rao", role: "Head of Operations" },
  { name: "Sana Iyer", role: "Head of Trust & Safety" },
];

// ==================== STATISTICS ====================

const STATS = [
  {
    value: 50000,
    suffix: "K+",
    divisor: 1000,
    label: "Homes serviced",
    icon: Building2,
  },
  {
    value: 12000,
    suffix: "K+",
    divisor: 1000,
    label: "Verified professionals",
    icon: Users,
  },
  {
    value: 8,
    suffix: "",
    divisor: 1,
    label: "Cities live",
    icon: CheckCircle2,
  },
  {
    value: 4.8,
    suffix: "/5",
    divisor: 1,
    decimals: 1,
    label: "Average rating",
    icon: Star,
  },
];

// ==================== SECTION LABEL ====================

function SectionLabel({ children }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700 sm:text-xs">
      <Sparkles size={13} />
      {children}
    </span>
  );
}

// ==================== ANIMATED COUNTER ====================

function AnimatedCounter({
  value,
  suffix = "",
  divisor = 1,
  decimals = 0,
  start,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let animationFrame;

    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easedProgress = 1 - Math.pow(1 - progress, 4);

      const currentValue =
        (value / divisor) * easedProgress;

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value / divisor);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [start, value, divisor]);

  return (
    <>
      {count.toFixed(decimals)}
      {suffix}
    </>
  );
}

// ==================== ABOUT PAGE ====================

export default function About() {
  const [heroRef, heroIn] = useReveal();
  const [valuesRef, valuesIn] = useReveal();
  const [timelineRef, timelineIn] = useReveal();
  const [teamRef, teamIn] = useReveal();
  const [ctaRef, ctaIn] = useReveal();

  // Stats animation
  const statsRef = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    const section = statsRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="overflow-hidden bg-white text-slate-900">

      {/* ==================== HERO SECTION ==================== */}

      <section className="relative isolate overflow-hidden bg-ivory">

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-20 -z-10 h-64 w-64 rounded-full bg-brand-400/15 blur-3xl sm:h-80 sm:w-80"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl sm:h-80 sm:w-80"
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">

          {/* Hero Content */}

          <div
            ref={heroRef}
            className={`reveal min-w-0 ${heroIn ? "in-view" : ""}`}
          >
            <SectionLabel>About Manyata</SectionLabel>

            <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-slate-950">
              <span className="block">
                Home services you can
              </span>

              <span className="mt-1 block text-brand-700">
                actually trust.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Finding a reliable professional for your home should be simple.
              We bring you verified professionals, transparent pricing and
              dependable service, all in one place.
            </p>

            {/* Trust Cards */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4">

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <ShieldCheck size={23} />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Verified professionals
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Safety comes first
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
                  <IndianRupee size={23} />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Clear pricing
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    No hidden charges
                  </p>
                </div>

              </div>

            </div>

            {/* <a
              href="/contact"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-xl sm:w-auto"
            >
              Get in touch
              <ArrowRight size={18} />
            </a> */}

            <Link
              to="/contact"
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-700 hover:shadow-xl sm:w-auto"
            >
              Get in Touch
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* Hero Image */}

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

      {/* ==================== VALUES SECTION ==================== */}

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

      {/* ==================== 2026 JOURNEY SECTION ==================== */}

      <section className="relative isolate overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-10 -z-10 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl"
        />

        <div
          ref={timelineRef}
          className={`reveal relative mx-auto max-w-5xl ${timelineIn ? "in-view" : ""}`}
        >
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <SectionLabel>Our journey</SectionLabel>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              The journey continues in <span className="text-brand-700">2026.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              We are focused on making dependable home services accessible to more homes, with trust at the heart of every experience.
            </p>
          </div>

          {TIMELINE.map((item) => (
            <article
              key={item.year}
              className="group relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-brand-100 bg-white p-6 shadow-xl shadow-brand-950/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-950/10 sm:p-10 lg:p-12"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-100/70 blur-3xl transition-transform duration-700 group-hover:scale-125"
              />
              <div className="relative grid items-center gap-7 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
                <div className="text-center md:border-r md:border-slate-100 md:pr-10">
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
                    <span className="h-2 w-2 rounded-full bg-brand-600" />
                    Current focus
                  </span>
                  <p className="mt-4 bg-gradient-to-br from-brand-700 to-indigo-500 bg-clip-text text-7xl font-black leading-none tracking-[-0.07em] text-transparent sm:text-8xl lg:text-9xl">
                    {item.year}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    A year of progress
                  </p>
                </div>

                <div className="text-center md:text-left">
                  <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 md:mx-0">
                    <ArrowRight size={27} />
                  </div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                    Moving forward, together.
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                    {item.text}
                  </p>
                  <div className="mt-7 flex items-center justify-center gap-2 text-sm font-semibold text-brand-700 md:justify-start">
                    <ShieldCheck size={18} />
                    <span>Built on trust. Focused on every home.</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== TEAM SECTION ==================== */}

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

      {/* ==================== ANIMATED STATS SECTION ==================== */}

      <section
        ref={statsRef}
        className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <div className="relative isolate overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-12 shadow-2xl sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-14">

            {/* Background Effects */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-brand-600/25 blur-[100px]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px]"
            />

            <div className="relative z-10">

              {/* Heading */}

              <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">

              <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-white sm:text-sm">
                MANYATA IN NUMBERS
              </span>

                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">

                  Growing with

                  <span className="block bg-gradient-to-r from-brand-300 to-amber-300 bg-clip-text text-transparent">
                    your trust.
                  </span>

                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  Every number represents a home served, a professional
                  empowered and a customer who trusts Manyata.
                </p>

                <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-amber-400" />

              </div>

              {/* Statistics Grid */}

              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">

                {STATS.map(
                  ({
                    value,
                    suffix,
                    divisor,
                    decimals = 0,
                    label,
                    icon: Icon,
                  }) => (

                    <div
                      key={label}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand-400/40 hover:bg-white/[0.08] sm:rounded-3xl sm:p-7"
                    >

                      {/* Card Glow */}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                      <div className="relative z-10">

                        {/* Icon */}

                        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-brand-400/20 bg-brand-500/10 text-brand-300 transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white sm:h-14 sm:w-14">

                          <Icon size={25} strokeWidth={1.8} />

                        </div>

                        {/* Animated Number */}

                        <h3 className="min-h-10 text-3xl font-extrabold tracking-tight text-white sm:min-h-12 sm:text-4xl lg:text-5xl">

                          <AnimatedCounter
                            value={value}
                            suffix={suffix}
                            divisor={divisor}
                            decimals={decimals}
                            start={statsStarted}
                          />

                        </h3>

                        {/* Label */}

                        <p className="mx-auto mt-3 max-w-[150px] text-xs font-medium leading-5 text-slate-400 sm:text-sm">
                          {label}
                        </p>

                        {/* Bottom Line */}

                        <div className="mx-auto mt-5 h-1 w-8 rounded-full bg-gradient-to-r from-brand-400 to-amber-400 transition-all duration-500 group-hover:w-14" />

                      </div>

                    </div>

                  )
                )}

              </div>

              {/* Bottom Trust Message */}

              <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-slate-400 sm:mt-12 sm:text-sm">

                <ShieldCheck size={17} className="text-brand-300" />

                <span>
                  Built on trust. Driven by quality. Growing together.
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ==================== CTA SECTION ==================== */}

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

          {/* <a
            href="/contact"
            className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 sm:mt-8 sm:w-auto"
          >
            Partner with us

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />

          </a> */}
        <Link
          to="/contact"
          className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 sm:mt-8 sm:w-auto"
        >
          Partner With Us
          <ArrowRight size={18} />
        </Link>

        </div>

      </section>

    </main>
  );
}


