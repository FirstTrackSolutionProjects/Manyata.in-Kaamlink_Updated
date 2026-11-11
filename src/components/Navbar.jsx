
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import manyataLogo from "../assets/LogoDesign.png";
import {
  Menu,
  X,
  UserRound,
  LogIn,
  UserPlus,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Services", href: "/#services", isRoute: false },
  { label: "About", href: "/about", isRoute: true },
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "Contact", href: "/contact", isRoute: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuToggleRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.hash]);

  // Close menus on outside click and Escape
  useEffect(() => {
    const handlePointerDown = (event) => {
      const clickedInsideMobileMenu =
        mobileMenuRef.current?.contains(event.target);

      const clickedToggleButton =
        menuToggleRef.current?.contains(event.target);

      const clickedInsideAccount =
        accountRef.current?.contains(event.target);

      // Close mobile menu only when clicking outside
      // Ignore the hamburger button so its click handler can toggle correctly
      if (
        open &&
        !clickedInsideMobileMenu &&
        !clickedToggleButton
      ) {
        setOpen(false);
      }

      // Close account dropdown when clicking outside
      if (!clickedInsideAccount) {
        setAccountOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Close mobile menu when switching to desktop screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Support Services navigation from every page
  useEffect(() => {
    if (
      location.pathname !== "/" ||
      location.hash !== "#services"
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  // Navigate to Services
  const handleServicesClick = (event) => {
    event.preventDefault();

    setOpen(false);
    setAccountOpen(false);

    if (
      location.pathname === "/" &&
      location.hash === "#services"
    ) {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }

    navigate("/#services");
  };

  // Close menus on navigation
  const handleNavClick = () => {
    setOpen(false);
    setAccountOpen(false);
  };

  const linkClasses =
    "rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <div className="relative mx-auto max-w-7xl">

        {/* MAIN NAVBAR */}
        <nav
          className={`relative z-20 flex h-[62px] items-center justify-between gap-3 rounded-2xl border px-3 transition-all duration-300 sm:h-[68px] sm:rounded-full sm:px-5 lg:px-6 ${
            scrolled
              ? "border-slate-200/80 bg-white/95 shadow-[0_8px_35px_rgba(15,23,42,0.09)] backdrop-blur-2xl"
              : "border-white/80 bg-white/80 shadow-sm backdrop-blur-xl"
          }`}
          aria-label="Main navigation"
        >

          {/* LOGO */}
          {/* LOGO */}
          <Link
            to="/"
            onClick={handleNavClick}
            className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:gap-3"
            aria-label="Manyata Home"
          >
            <img
              src={manyataLogo}
              alt="LogoDesign"
              className="h-11 w-auto max-w-[180px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
            />
          </Link>




          {/* <Link
            to="/"
            onClick={handleNavClick}
            className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:gap-3"
            aria-label="Manyata Home"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br from-brand-500 to-gold-500 text-lg font-black text-white shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
              M
            </span>

            <span className="truncate text-[19px] font-extrabold tracking-tight text-slate-900 sm:text-[22px]">
              Many<span className="text-brand-600">ata</span>
            </span>
          </Link> */}

          {/* DESKTOP NAVIGATION */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                {item.href === "/#services" ? (
                  <a
                    href="/#services"
                    onClick={handleServicesClick}
                    className={linkClasses}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    onClick={handleNavClick}
                    className={linkClasses}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* DESKTOP ACTIONS */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex">

            {/* ACCOUNT DROPDOWN */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-label="Account menu"
                aria-expanded={accountOpen}
                aria-controls="account-dropdown"
                className={`flex h-10 items-center gap-2 rounded-full border px-3 transition-all duration-200 ${
                  accountOpen
                    ? "border-brand-200 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-600"
                }`}
              >
                <UserRound size={18} />

                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="account-dropdown"
                aria-hidden={!accountOpen}
                className={`absolute right-0 top-full mt-3 w-64 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-200 ${
                  accountOpen
                    ? "visible translate-y-0 scale-100 opacity-100"
                    : "invisible pointer-events-none -translate-y-2 scale-95 opacity-0"
                }`}
              >
                <div className="mb-1 border-b border-slate-100 px-3 py-3">
                  <p className="text-sm font-bold text-slate-900">
                    Your Account
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Login or join Manyata
                  </p>
                </div>

                <Link
                  to="/login"
                  onClick={handleNavClick}
                  tabIndex={accountOpen ? 0 : -1}
                  className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  <span className="flex items-center gap-3">
                    <LogIn size={17} />
                    Login
                  </span>

                  <ArrowRight
                    size={15}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>

                <Link
                  to="/signup"
                  onClick={handleNavClick}
                  tabIndex={accountOpen ? 0 : -1}
                  className="group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  <span className="flex items-center gap-3">
                    <UserPlus size={17} />
                    Create Account
                  </span>

                  <ArrowRight
                    size={15}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              </div>
            </div>

            <Link
              to="/login"
              onClick={handleNavClick}
              className="px-2 text-sm font-bold text-slate-700 transition hover:text-brand-600"
            >
              Login
            </Link>

            <a
              href="/#services"
              onClick={handleServicesClick}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
            >
              Book a Service

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            ref={menuToggleRef}
            type="button"
            onClick={() => {
              setOpen((value) => !value);
              setAccountOpen(false);
            }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:h-11 lg:w-11 xl:hidden"
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {/* MOBILE / TABLET DRAWER */}
        <div
          ref={mobileMenuRef}
          id="mobile-navigation"
          aria-hidden={!open}
          className={`absolute left-0 right-0 top-[calc(100%+10px)] z-10 overflow-y-auto overscroll-contain rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop-blur-2xl transition-all duration-300 ease-out xl:hidden ${
            open
              ? "visible max-h-[min(75vh,620px)] translate-y-0 opacity-100"
              : "invisible pointer-events-none max-h-0 -translate-y-2 opacity-0"
          }`}
        >
          <div className="p-3 sm:p-4">

            {/* MOBILE MENU HEADING */}
            <div className="flex items-center justify-between border-b border-slate-100 px-3 pb-3 pt-2">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Explore Manyata
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Everything your home needs
                </p>
              </div>

              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <UserRound size={18} />
              </span>
            </div>

            {/* NAVIGATION LINKS */}
            <ul className="mt-3 flex flex-col gap-1">
              {NAV_LINKS.map((item, index) => (
                <li
                  key={item.href}
                  style={{
                    transitionDelay: open
                      ? `${index * 35}ms`
                      : "0ms",
                  }}
                  className={`transition-all duration-300 ${
                    open
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-2 opacity-0"
                  }`}
                >
                  {item.href === "/#services" ? (
                    <a
                      href="/#services"
                      tabIndex={open ? 0 : -1}
                      onClick={handleServicesClick}
                      className="flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {item.label}

                      <ArrowRight
                        size={16}
                        className="text-slate-400"
                      />
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      tabIndex={open ? 0 : -1}
                      onClick={handleNavClick}
                      className="flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {item.label}

                      <ArrowRight
                        size={16}
                        className="text-slate-400"
                      />
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* ACCOUNT ACTIONS */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                tabIndex={open ? 0 : -1}
                onClick={handleNavClick}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <LogIn size={17} />
                Login
              </Link>

              <Link
                to="/signup"
                tabIndex={open ? 0 : -1}
                onClick={handleNavClick}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-100 bg-brand-50 px-3 py-3 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
              >
                <UserPlus size={17} />
                Sign Up
              </Link>
            </div>

            {/* PRIMARY CTA */}
            <a
              href="/#services"
              tabIndex={open ? 0 : -1}
              onClick={handleServicesClick}
              className="group mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-brand-600/20 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              Book a Service

              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <p className="pb-1 pt-4 text-center text-[11px] text-slate-400">
              Quality home services, made simple.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}





