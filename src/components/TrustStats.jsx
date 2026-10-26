import { Home, ShieldCheck, Star, MapPin } from "lucide-react";
import useReveal from "../hooks/useReveal";

const STATS = [
  { value: "50K+", label: "Homes serviced", icon: Home },
  { value: "12K+", label: "Verified professionals", icon: ShieldCheck },
  { value: "4.8/5", label: "Average rating", icon: Star },
  { value: "25+", label: "Cities covered", icon: MapPin },
];

export default function TrustStats() {
  const [ref, inView] = useReveal();

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-white">
      <div ref={ref} className={`reveal ${inView ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8`}>
        
        {/* Premium Dark Card */}
        <div className="relative rounded-[2.5rem] bg-slate-900 px-6 py-12 lg:py-16 shadow-xl overflow-hidden border border-slate-800">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/15 rounded-full blur-[80px] pointer-events-none" />

          {/* Grid */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 lg:divide-x lg:divide-white/10">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center text-center lg:px-6 group">
                  
                  {/* Icon */}
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 group-hover:border-brand-500/30 transition-all duration-300">
                    <Icon size={22} className="text-slate-400 group-hover:text-brand-400 transition-colors" />
                  </div>

                  {/* Number */}
                  <p className="text-3xl sm:text-4xl font-display font-extrabold text-white">
                    {s.value}
                  </p>
                  
                  {/* Label */}
                  <p className="mt-2 text-sm font-medium text-slate-400">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}