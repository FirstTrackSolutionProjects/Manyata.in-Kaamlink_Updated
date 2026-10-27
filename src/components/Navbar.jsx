import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const location = useLocation();

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.hash]);

  // Close menus on outside click and Escape
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }

      if (
        open &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setOpen(false);
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

  // Support Services navigation from every page
  useEffect(() => {
    if (location.pathname !== "/" || location.hash !== "#services") {
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

    if (location.pathname === "/" && location.hash === "#services") {
      document.getElementById("services")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    navigate("/#services");
  };

  const handleNavClick = () => {
    setOpen(false);
    setAccountOpen(false);
  };

  const linkClasses =
    "rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-brand-50 hover:text-brand-600";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        {/* Main Navbar */}
        <nav
          className={`relative z-20 flex h-[62px] items-center justify-between gap-3 rounded-2xl border px-3 transition-all duration-300 sm:h-[68px] sm:rounded-full sm:px-5 lg:px-6 ${
            scrolled
              ? "border-slate-200/80 bg-white/95 shadow-[0_8px_35px_rgba(15,23,42,0.09)] backdrop-blur-2xl"
              : "border-white/80 bg-white/80 shadow-sm backdrop-blur-xl"
          }`}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
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
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            {/* Account Dropdown */}
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

          {/* Tablet and Mobile Toggle */}
          <button
            type="button"
            onClick={() => {
              setOpen((value) => !value);
              setAccountOpen(false);
            }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 lg:h-11 lg:w-11 xl:hidden"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {/* Mobile / Tablet Drawer */}
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
            {/* Mobile Menu Heading */}
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

            {/* Navigation Links */}
            <ul className="mt-3 flex flex-col gap-1">
              {NAV_LINKS.map((item, index) => (
                <li
                  key={item.href}
                  style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
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
                      <ArrowRight size={16} className="text-slate-400" />
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      tabIndex={open ? 0 : -1}
                      onClick={handleNavClick}
                      className="flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                      {item.label}
                      <ArrowRight size={16} className="text-slate-400" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Account Actions */}
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

            {/* Primary CTA */}
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




// // src/components/Navbar.jsx
// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { Menu, X, User, LogIn, UserPlus, ArrowRight } from "lucide-react";

// const NAV_LINKS = [
//   { label: "Home", href: "/", isRoute: true },
//   { label: "Services", href: "/#services" },
//   { label: "About", href: "/about", isRoute: true },
//   { label: "Blog", href: "/blog", isRoute: true },
//   { label: "Contact", href: "/contact", isRoute: true },
// ];

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [accountOpen, setAccountOpen] = useState(false);
//   const accountRef = useRef(null);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const onClick = (e) => {
//       if (accountRef.current && !accountRef.current.contains(e.target)) {
//         setAccountOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   // Premium hover effect for menu links
//   const linkClasses =
//     "px-4 py-2 rounded-full text-slate-600 font-semibold text-sm hover:text-brand-600 hover:bg-brand-50 hover:shadow-sm transition-all duration-300";

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pb-2 transition-all duration-300 pointer-events-none">
      
//       {/* Premium Glass Navbar Container */}
//       <nav
//         className={`pointer-events-auto max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 rounded-full border transition-all duration-500 ${
//           scrolled
//             ? "bg-white/80 backdrop-blur-2xl border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
//             : "bg-gradient-to-r from-white/90 via-brand-50/50 to-white/90 backdrop-blur-xl border-slate-200/50 shadow-sm"
//         }`}
//       >
        
//         {/* ---- Logo + wordmark ---- */}
//         <Link to="/" className="flex items-center gap-2 text-xl font-display font-extrabold tracking-tight group">
//           {/* The 'M' Icon */}
//           <span className="grid h-9 w-9 place-items-center rounded-[14px] bg-gradient-to-br from-brand-500 to-gold-500 text-white text-base font-black shadow-lift group-hover:scale-105 transition-transform duration-300">
//             M
//           </span>
          
//           {/* The Text */}
//           <span className="text-slate-900 text-[1.15rem] tracking-tight">
//             Mana<span className="text-brand-600">yata</span>
//             <span className="text-gold-500">.</span>
//           </span>
//         </Link>

//         {/* ---- Desktop nav links (Pill style) ---- */}
//         <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 p-1 bg-slate-100/50 rounded-full border border-slate-200/50">
//           {NAV_LINKS.map((link) =>
//             link.isRoute ? (
//               <li key={link.href}>
//                 <Link to={link.href} className={linkClasses}>
//                   {link.label}
//                 </Link>
//               </li>
//             ) : (
//               <li key={link.href}>
//                 <a href={link.href} className={linkClasses}>
//                   {link.label}
//                 </a>
//               </li>
//             )
//           )}
//         </ul>

//         {/* ---- Desktop right actions ---- */}
//         <div className="hidden md:flex items-center gap-3">
          
//           {/* Account icon + dropdown */}
//           <div className="relative" ref={accountRef}>
//             <button
//               onClick={() => setAccountOpen((v) => !v)}
//               className={`grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 ${
//                 accountOpen
//                   ? "bg-brand-50 border-brand-200 text-brand-600 ring-4 ring-brand-50"
//                   : "bg-white/50 border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50"
//               }`}
//               aria-label="Account menu"
//               aria-expanded={accountOpen}
//             >
//               <User size={18} />
//             </button>

//             {/* Dropdown */}
//             <div
//               className={`absolute right-0 mt-4 w-60 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-slate-100 transition-all duration-300 ${
//                 accountOpen
//                   ? "opacity-100 scale-100 translate-y-0"
//                   : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
//               }`}
//             >
//               <div className="px-3 py-2 border-b border-slate-100 mb-1">
//                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
//               </div>
//               <Link
//                 to="/login"
//                 onClick={() => setAccountOpen(false)}
//                 className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
//               >
//                 <span className="flex items-center gap-2.5">
//                   <LogIn size={16} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
//                   Log in
//                 </span>
//                 <ArrowRight size={14} className="text-brand-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
//               </Link>
//               <Link
//                 to="/signup"
//                 onClick={() => setAccountOpen(false)}
//                 className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
//               >
//                 <span className="flex items-center gap-2.5">
//                   <UserPlus size={16} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
//                   Create Account
//                 </span>
//                 <ArrowRight size={14} className="text-brand-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
//               </Link>
//             </div>
//           </div>

//           <Link
//             to="/login"
//             className="text-sm font-bold text-slate-700 hover:text-brand-600 transition-colors px-2"
//           >
//             Log in
//           </Link>

//           <a
//             href="/#services"
//             className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-lift hover:-translate-y-0.5 transition-all duration-300"
//           >
//             Book a Service
//             <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//           </a>
//         </div>

//         {/* ---- Mobile menu toggle ---- */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="md:hidden p-2 rounded-full text-slate-700 bg-white/50 border border-slate-200 hover:bg-brand-50 hover:text-brand-600 transition-colors"
//           aria-label="Toggle menu"
//           aria-expanded={open}
//         >
//           {open ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </nav>

//       {/* ---- Mobile drawer ---- */}
//       <div
//         className={`pointer-events-auto md:hidden absolute top-[5.5rem] left-4 right-4 overflow-hidden transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-xl ${
//           open ? "max-h-[30rem] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4"
//         }`}
//       >
//         <ul className="flex flex-col gap-1 p-4">
//           {NAV_LINKS.map((link) =>
//             link.isRoute ? (
//               <li key={link.href}>
//                 <Link
//                   to={link.href}
//                   onClick={() => setOpen(false)}
//                   className="block px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors"
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ) : (
//               <li key={link.href}>
//                 <a
//                   href={link.href}
//                   onClick={() => setOpen(false)}
//                   className="block px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors"
//                 >
//                   {link.label}
//                 </a>
//               </li>
//             )
//           )}

//           <div className="h-px bg-slate-100 my-2 mx-4" />

//           <li>
//             <Link
//               to="/login"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors"
//             >
//               <LogIn size={18} className="text-slate-400" />
//               Log in
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/signup"
//               onClick={() => setOpen(false)}
//               className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-semibold hover:bg-brand-50 hover:text-brand-600 transition-colors"
//             >
//               <UserPlus size={18} className="text-slate-400" />
//               Create Account
//             </Link>
//           </li>
//           <li className="pt-2">
//             <a
//               href="/#services"
//               onClick={() => setOpen(false)}
//               className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lift transition-all"
//             >
//               Book a Service
//             </a>
//           </li>
//         </ul>
//       </div>
//     </header>
//   );
// }

