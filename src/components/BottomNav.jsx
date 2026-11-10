
import { NavLink } from "react-router-dom";
import { Home, Sparkles, BookOpen, Phone, LogIn } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/#services", label: "Services", icon: Sparkles },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/contact", label: "Contact", icon: Phone },
  { to: "/login", label: "Account", icon: LogIn },
];

export default function BottomNav() {
  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-slate-200
        bg-white/95 backdrop-blur-xl
        pb-[env(safe-area-inset-bottom)]
        md:hidden
      "
      aria-label="Bottom navigation"
    >
      <ul className="mx-auto flex w-full max-w-xl items-stretch justify-around px-1">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={label} className="min-w-0 flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-[64px] flex-col items-center justify-center gap-1
                px-1 py-2 text-[11px] font-semibold transition-colors
                ${
                  isActive
                    ? "text-brand-600"
                    : "text-slate-400 hover:text-slate-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-8 w-11 place-items-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-brand-50 text-brand-600"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </span>

                  <span className="whitespace-nowrap">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
