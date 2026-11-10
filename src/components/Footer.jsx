
import { Link } from "react-router-dom";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const SERVICE_LINKS = [
  "Deep Cleaning",
  "Pest Control",
  "AC Repair",
  "Plumbing",
  "Electrical",
];

const COMPANY_LINKS = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/contact" },
  { label: "Partner with us", to: "/contact" },
  { label: "Blog", to: "/blog" },
];

const QUICK_LINKS = [
  { label: "FAQ", to: "/faq" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Refund & Cancellation", to: "/refund" },
  { label: "Data Security", to: "/data" },
];

const SOCIALS = [
  { Icon: FaFacebookF, href: "#top", label: "Facebook" },
  { Icon: FaInstagram, href: "#top", label: "Instagram" },
  { Icon: FaTwitter, href: "#top", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory/80">
      {/* Top border */}
      <div className="h-px w-full bg-white/10" />

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-32 h-72 w-72 rounded-full bg-coral-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-12 sm:px-6 md:grid-cols-6 lg:px-8 lg:py-14">

        {/* Brand */}
        <div className="col-span-2">
          <Link to="/" className="inline-block">
            <p className="text-2xl font-display font-extrabold text-ivory">
              Man<span className="gradient-text">yata</span>
            </p>
          </Link>

          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/60">
            Verified home professionals, booked in minutes. Cleaning, repairs
            and more — trusted in every home we visit.
          </p>

          {/* Social links */}
          <div className="mt-5 flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-ivory/70 transition-all duration-300 hover:border-brand-500 hover:bg-brand-500 hover:text-white"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="mb-4 text-sm font-semibold text-ivory">
            Services
          </p>

          <ul className="space-y-2.5 text-sm">
            {SERVICE_LINKS.map((service) => (
              <li key={service}>
                <a
                  href="/#services"
                  className="text-ivory/60 transition-colors hover:text-ivory"
                >
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="mb-4 text-sm font-semibold text-ivory">
            Company
          </p>

          <ul className="space-y-2.5 text-sm">
            {COMPANY_LINKS.map((company) => (
              <li key={company.label}>
                <Link
                  to={company.to}
                  className="text-ivory/60 transition-colors hover:text-ivory"
                >
                  {company.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <p className="mb-4 text-sm font-semibold text-ivory">
            Quick Links
          </p>

          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-ivory/60 transition-colors hover:text-brand-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="mb-4 text-sm font-semibold text-ivory">
            Get in touch
          </p>

          <ul className="space-y-3 text-sm text-ivory/60">
            <li>
              <a
                href="tel:+918114721300"
                className="flex items-center gap-2 transition-colors hover:text-ivory"
              >
                <Phone size={14} className="shrink-0 text-brand-400" />
                +91 8114721300
              </a>
            </li>

            <li>
              <a
                href="mailto:info@manyata.in"
                className="flex items-center gap-2 transition-colors hover:text-ivory"
              >
                <Mail size={14} className="shrink-0 text-brand-400" />
                info@manyata.in
              </a>
            </li>

            <li>
              <Link
                to="/contact"
                className="mt-1 inline-flex items-center gap-1 font-medium text-brand-400 transition-colors hover:text-coral-400"
              >
                Book a service
                <ArrowUpRight size={14} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      
      {/* Copyright */}

      
{/* Copyright Section */}
<div className="relative z-10 w-full border-t border-white/10 px-4 pt-5 pb-24 sm:px-6 sm:pb-5">
  <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-1 text-center text-xs leading-6 text-ivory/60 sm:flex-row sm:flex-wrap sm:gap-x-2">

        {/* <span className="block w-full sm:w-auto">
          © {new Date().getFullYear()} Manyata. All rights reserved.
        </span> */}

        {/* <span className="hidden sm:inline">|</span> */}

        <span className="block w-full break-words sm:w-auto">
          © 2026 Manyata by{" "}
          <span className="font-semibold text-brand-400">
            First Track Solution Technologies
          </span>
          . All rights reserved.
        </span>

      </div>
    </div>
    </footer>

  );
}