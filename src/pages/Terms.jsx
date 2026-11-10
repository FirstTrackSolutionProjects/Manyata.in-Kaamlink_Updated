
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Scale,
  LockKeyhole,
} from "lucide-react";

const TERMS_SECTIONS = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      'By creating an account, browsing, or booking a service through Manyata ("we", "us", "our", or the "Platform"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the Platform.',
      "These terms apply to all users, including customers booking services and professionals offering services through Manyata.",
    ],
  },
  {
    title: "Description of Services",
    paragraphs: [
      "Manyata is an online marketplace that connects customers with independent, background-verified home service professionals for categories including deep cleaning, pest control, AC repair, plumbing, electrical work, appliance repair, painting, carpentry, salon services, and packers & movers.",
      "Manyata facilitates the booking and payment process but does not itself perform the services. Services are rendered by independent professionals or partner service providers.",
    ],
  },
  {
    title: "Eligibility & Account Registration",
    paragraphs: [
      "You must be at least 18 years old and capable of entering into a legally binding contract to use Manyata. When you register, you agree to provide accurate, current, and complete information.",
    ],
    bullets: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You are responsible for all activity that occurs under your account.",
      "You must notify us immediately of any unauthorized use of your account.",
    ],
  },
  {
    title: "Booking, Pricing & Payments",
    paragraphs: [
      "Prices displayed on the Platform are starting prices for the listed service category. Final pricing may vary based on the scope of work, materials required, and any additional services requested, and will be confirmed with you before work begins.",
      "Payment can be made via UPI, credit/debit card, net banking, or cash, and is generally collected after the service is completed to your satisfaction, unless stated otherwise for a specific service category.",
    ],
  },
  {
    title: "Cancellations & Rescheduling",
    paragraphs: [
      "You may cancel or reschedule a booking free of charge up to 2 hours before the scheduled slot. Cancellations made after this window, or repeated no-shows, may be subject to a cancellation fee to compensate the assigned professional.",
    ],
  },
  {
    title: "Service Professional Conduct & Warranty",
    paragraphs: [
      "All professionals listed on Manyata undergo identity verification and background checks prior to onboarding. Most services include a 7-day service warranty; if you are not satisfied with the outcome of a service, contact our support team within this window and we will arrange for the issue to be resolved at no additional cost, subject to review.",
      "Manyata reserves the right to suspend or remove any professional from the Platform who violates our code of conduct, engages in unsafe behavior, or receives repeated valid complaints.",
    ],
  },
  {
    title: "User Responsibilities & Prohibited Conduct",
    paragraphs: ["When using Manyata, you agree not to:"],
    bullets: [
      "Provide false or misleading information during booking or registration.",
      "Use the Platform for any unlawful purpose or in violation of any applicable law.",
      "Harass, threaten, or behave abusively toward any service professional or Manyata staff.",
      "Attempt to circumvent the Platform to transact directly with a professional in a way that violates these Terms.",
      "Interfere with or disrupt the security or proper functioning of the Platform.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "All content on the Platform, including the Manyata name, logo, design, text, graphics, and software, is the property of Manyata or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our prior written consent.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "Manyata acts as a facilitator connecting customers with independent service professionals. To the maximum extent permitted by law, Manyata shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform or the services booked through it.",
      "Nothing in these Terms limits any liability that cannot be excluded or limited under applicable law, including liability for death or personal injury caused by negligence.",
    ],
  },
  {
    title: "Termination",
    paragraphs: [
      "We may suspend or terminate your access to the Platform at our discretion if you violate these Terms, engage in fraudulent activity, or misuse the Platform in a way that harms other users, professionals, or Manyata.",
      "You may close your account at any time by contacting our support team.",
    ],
  },
  {
    title: "Governing Law & Dispute Resolution",
    paragraphs: [
      "These Terms are governed by the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, unless otherwise required by applicable consumer protection law.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these Terms from time to time to reflect changes in our services or applicable law. We will notify users of material changes through the Platform or via email, and continued use of Manyata after such changes constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      "If you have any questions about these Terms & Conditions, please reach out to us at info@manyata.in or through our Contact page.",
    ],
  },
];

export default function Terms() {
  return (
    <section className="relative isolate overflow-hidden bg-[#F8F7F3] py-12 sm:py-16 lg:py-20">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 -z-10 h-80 w-80 rounded-full bg-brand-500/10 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-32 -z-10 h-80 w-80 rounded-full bg-gold-500/10 blur-[100px]"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Back to home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-600"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Header card */}
        <div className="relative mb-8 overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-brand-500/20 blur-[90px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-gold-500/10 blur-[80px]"
          />

          <div className="relative">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-gold-400">
              <FileText size={28} />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Legal Information
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Please read these terms carefully before using Manyata's
              platform, creating an account, or booking a home service.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                <ShieldCheck size={15} className="text-gold-400" />
                Customer Protection
              </span>

              {/* <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-medium text-white/80">
                Last updated: July 1, 2026
              </span> */}
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-6 rounded-2xl border border-brand-500/10 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <LockKeyhole size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-ink">
                Your agreement with Manyata
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600">
                These Terms & Conditions govern your access to and use of
                Manyata. By using our platform, you acknowledge that you
                have read and agreed to these terms.
              </p>
            </div>
          </div>
        </div>

        {/* Terms sections */}
        <div className="space-y-4 sm:space-y-5">
          {TERMS_SECTIONS.map((section, index) => (
            <article
              key={section.title}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-brand-500/20 hover:shadow-md sm:p-7 lg:p-8"
            >
              <div className="flex items-start gap-4">
                {/* Section number */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-extrabold text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white sm:h-11 sm:w-11">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Section content */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold leading-6 text-ink sm:text-lg">
                    {section.title}
                  </h2>

                  <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-[15px]">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && (
                    <ul className="mt-4 space-y-3">
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-600 sm:text-[15px]"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Contact details */}
                  {index === 12 && (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <a
                        href="mailto:info@manyata.in"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
                      >
                        <Mail size={16} />
                        info@manyata.in
                      </a>

                      <Link
                        to="/contact"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                      >
                        Contact Manyata
                        <ArrowLeft className="rotate-180" size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-8 rounded-2xl border border-gold-500/20 bg-white p-5 text-center sm:mt-10 sm:p-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold-50 text-gold-600">
            <Scale size={21} />
          </div>

          <h3 className="mt-3 text-base font-bold text-ink">
            Thank you for choosing Manyata
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            We appreciate your trust. We are committed to providing a
            reliable and transparent home service experience.
          </p>

          <Link
            to="/"
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-600 transition-colors hover:text-brand-800"
          >
            Return to Home
            <ArrowLeft className="rotate-180" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}