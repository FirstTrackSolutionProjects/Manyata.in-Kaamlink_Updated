import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Eye,
  Server,
  Activity,
  UserCog,
  Mail,
  ArrowRight,
} from "lucide-react";

const BADGES = [
  { icon: Lock, label: "Protected passwords", note: "Hashed before storage" },
  { icon: CreditCard, label: "No card details collected", note: "Card numbers are not stored" },
  { icon: Eye, label: "Minimal data sharing", note: "Only what's needed, per booking" },
  { icon: Activity, label: "Protected API access", note: "Account routes require sign-in" },
];

const SECTIONS = [
  {
    icon: Lock,
    heading: "Encryption, everywhere",
    body: "Use the secure HTTPS version of Manyata when sending information. Account passwords are hashed before they are stored, and private account routes require a valid sign-in.",
  },
  {
    icon: CreditCard,
    heading: "Payment security",
    body: "Manyata does not collect or store card numbers, CVVs, or online banking credentials on this website.",
  },
  {
    icon: UserCog,
    heading: "Strict access controls",
    body: "Booking details are associated with the signed-in customer account. Private booking and administration routes require an authenticated account with the appropriate role.",
  },
  {
    icon: Server,
    heading: "Secure infrastructure",
    body: "Your data is hosted on secure cloud infrastructure with firewall protection, regular automated backups, and access restricted through authenticated, role-based permissions.",
  },
  {
    icon: Activity,
    heading: "Monitoring & incident response",
    body: "We continuously monitor our systems for unusual activity. In the unlikely event of a security incident affecting your data, we will notify affected users and relevant authorities in accordance with applicable law.",
  },
];

export default function DataSecurity() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-300/30 to-pink-400/20 blur-3xl animate-blob-float" />
        <div className="relative max-w-3xl mx-auto px-6 lg:px-8 pt-16 pb-14 lg:pt-24 text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-600 grid place-items-center shadow-card">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Your data, protected at every step
          </h1>
          <p className="mt-4 text-muted">
            Whether you're booking a service or managing your account, your
            personal information is handled with the same care we'd want for
            our own homes. Here's exactly how we keep it safe.
          </p>
        </div>
      </section>

      {/* Trust badges */}
      <section className="pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BADGES.map(({ icon: Icon, label, note }) => (
            <div
              key={label}
              className="rounded-3xl bg-white p-6 shadow-card hover:shadow-soft hover:-translate-y-1 transition-all text-center"
            >
              <div className="mx-auto h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-600 grid place-items-center mb-4">
                <Icon size={20} className="text-white" />
              </div>
              <p className="font-display font-bold text-sm">{label}</p>
              <p className="mt-1 text-xs text-muted">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed sections */}
      <section className="pb-20 lg:pb-28 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 space-y-10 pt-16">
          {SECTIONS.map(({ icon: Icon, heading, body }) => (
            <div key={heading} className="flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-ivory grid place-items-center">
                <Icon size={20} className="text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">{heading}</h2>
                <p className="mt-2 text-ink/80 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-4">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-ivory grid place-items-center">
              <ShieldCheck size={20} className="text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Your control over your data</h2>
              <p className="mt-2 text-ink/80 leading-relaxed">
                You can access, correct, or request deletion of your personal
                data at any time. Full details on your rights and how to
                exercise them are in our{" "}
                <Link to="/privacy" className="text-pink-600 font-medium hover:text-amber-600 transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="h-11 w-11 shrink-0 rounded-2xl bg-ivory grid place-items-center">
              <Mail size={20} className="text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Report a security concern</h2>
              <p className="mt-2 text-ink/80 leading-relaxed">
                If you're a security researcher or have found a potential
                vulnerability, we want to hear from you. Please report it
                responsibly to{" "}
                <a href="mailto:info@manyata.in?subject=Security%20Concern" className="text-pink-600 font-medium">info@manyata.in</a>{" "}
                and our team will respond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Have a question about your data?
          </h2>
          <p className="mt-3 text-muted">
            Our support team is happy to walk you through how we keep your
            information safe.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-card hover:shadow-soft hover:-translate-y-0.5 transition-all"
          >
            Contact support
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
