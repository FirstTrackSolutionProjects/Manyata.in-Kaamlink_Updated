
import { Home, ShieldCheck, Star, MapPin, ArrowUpRight } from "lucide-react";
import useReveal from "../hooks/useReveal";

const STATS = [
  {
    value: "50K+",
    label: "Homes serviced",
    icon: Home,
    description: "Happy households",
  },
  {
    value: "12K+",
    label: "Verified professionals",
    icon: ShieldCheck,
    description: "Trusted experts",
  },
  {
    value: "4.8/5",
    label: "Average rating",
    icon: Star,
    description: "Customer satisfaction",
  },
  {
    value: "25+",
    label: "Cities covered",
    icon: MapPin,
    description: "Growing every day",
  },
];

export default function TrustStats() {
  const [ref, inView] = useReveal();

  return (
    <section className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-pink-100/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl"
      />

      <div
        ref={ref}
        className={`reveal ${
          inView ? "in-view" : ""
        } relative mx-auto max-w-7xl`}
      >
        {/* Premium statistics card */}
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-slate-800 bg-[#101827] px-5 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.16)] sm:rounded-[2.5rem] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          {/* Ambient gradients */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full bg-pink-500/15 blur-[90px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-amber-400/10 blur-[90px]"
          />

          {/* Subtle grid pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* Heading */}
          <div className="relative mb-9 text-center sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 sm:text-xs">
              <ShieldCheck size={15} />
              Trusted by thousands
            </span>

            <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              Numbers that speak
              <span className="text-amber-300"> for themselves.</span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Building trust through quality service, verified experts, and
              happier homes every day.
            </p>
          </div>

          {/* Stats grid */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-white/10">
            {STATS.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group relative flex min-w-0 flex-col items-center rounded-2xl border border-white/[0.08] bg-white/[0.035] px-2 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.07] sm:px-4 sm:py-8 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-5 lg:py-4 lg:hover:translate-y-0 lg:hover:bg-transparent"
                >
                  {/* Icon */}
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-300 transition-all duration-300 group-hover:border-amber-300/30 group-hover:bg-amber-300/10 group-hover:text-amber-300 sm:h-12 sm:w-12">
                    <Icon
                      size={21}
                      strokeWidth={1.8}
                      className={
                        stat.label === "Average rating"
                          ? "fill-current"
                          : ""
                      }
                    />
                  </div>

                  {/* Value */}
                  <p className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {stat.value}
                  </p>

                  {/* Label */}
                  <p className="mt-2 max-w-full text-xs font-semibold leading-5 text-slate-200 sm:text-sm">
                    {stat.label}
                  </p>

                  {/* Description */}
                  <p className="mt-1.5 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    {stat.description}
                  </p>

                  {/* Accent underline */}
                  <div className="mt-4 h-1 w-7 rounded-full bg-amber-300/50 transition-all duration-300 group-hover:w-12 group-hover:bg-amber-300" />
                </div>
              );
            })}
          </div>

          {/* Bottom trust message */}
          <div className="relative mt-7 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-center sm:mt-9 sm:pt-6">
            <Star
              size={15}
              className="shrink-0 fill-amber-300 text-amber-300"
            />
            <p className="text-xs leading-5 text-slate-400 sm:text-sm">
              Quality service. Trusted professionals. Happier homes.
            </p>
            <ArrowUpRight
              size={15}
              className="shrink-0 text-amber-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}