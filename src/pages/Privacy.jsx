
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  UserCheck,
  Share2,
  Cookie,
  Clock,
  Scale,
  Baby,
  RefreshCw,
  Mail,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    icon: ShieldCheck,
    title: "Introduction",
    content: (
      <p>
        This Privacy Policy explains how Manyata ("we", "us", "our")
        collects, uses, shares, and protects your personal information
        when you use our Platform. By using Manyata, you agree to
        the practices described in this policy.
      </p>
    ),
  },
  {
    icon: Database,
    title: "Information We Collect",
    content: (
      <>
        <p>We collect the following categories of information:</p>
        <ul>
          <li>Account information: name, email address, phone number, and password.</li>
          <li>Booking information: service address, preferred time slots, and special instructions.</li>
          <li>Payment information: processed securely by third-party payment partners. We do not store full card details.</li>
          <li>Usage data: pages visited, features used, and device/browser information.</li>
          <li>Communications: messages sent to our support team and service feedback.</li>
        </ul>
      </>
    ),
  },
  {
    icon: UserCheck,
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Create and manage your account and service bookings.</li>
          <li>Connect you with suitable verified professionals in your area.</li>
          <li>Process payments and send confirmations, reminders, and receipts.</li>
          <li>Improve our Platform and develop new features.</li>
          <li>Communicate promotions, updates, and important policy changes.</li>
          <li>Detect and prevent fraud, abuse, and security incidents.</li>
        </ul>
      </>
    ),
  },
  {
    icon: Share2,
    title: "Sharing Your Information",
    content: (
      <>
        <p>
          We share limited information with the service professional
          assigned to your booking, such as your name, address, and
          contact number, so they can complete the service.
        </p>
        <p>
          We may share information with trusted third-party vendors
          such as payment processors and cloud hosting providers
          under appropriate confidentiality obligations.
        </p>
        <p>
          We do not sell your personal information to third parties
          for their marketing purposes. Information may also be
          disclosed when legally required or necessary to protect
          the safety and rights of our users.
        </p>
      </>
    ),
  },
  {
    icon: Cookie,
    title: "Cookies & Tracking Technologies",
    content: (
      <p>
        We use cookies and similar technologies to keep you logged in,
        remember preferences, and understand how our Platform is used.
        You can control cookie settings through your browser, although
        disabling certain cookies may affect functionality.
      </p>
    ),
  },
  {
    icon: LockKeyhole,
    title: "Data Security",
    content: (
      <p>
        We implement technical and organizational security measures,
        including encryption in transit and access controls, to protect
        your personal information. However, no internet transmission
        method is completely secure, and absolute security cannot be guaranteed.
      </p>
    ),
  },
  {
    icon: Clock,
    title: "Data Retention",
    content: (
      <p>
        We retain your personal information while your account is active
        or as necessary to provide our services. Certain information may
        be retained longer to comply with legal obligations, resolve
        disputes, or enforce agreements.
      </p>
    ),
  },
  {
    icon: Scale,
    title: "Your Rights & Choices",
    content: (
      <>
        <p>Depending on applicable law, you may have the right to:</p>
        <ul>
          <li>Access, correct, or update your personal information.</li>
          <li>Request deletion of your account and associated personal data.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request a copy of your personal information.</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a
            href="mailto:privacy@Manyata.in"
            className="font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-900"
          >
            privacy@Manyata.in
          </a>.
        </p>
      </>
    ),
  },
  {
    icon: Baby,
    title: "Children's Privacy",
    content: (
      <p>
        Manyata is not intended for individuals under 18 years of age.
        We do not knowingly collect personal information from children.
        If we become aware of such collection, we will take appropriate
        steps to delete the information.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy to reflect changes in our
        practices or applicable laws. Material changes will be
        communicated through our Platform or email. The updated
        revision date will appear at the top of this page.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#fafaf7] pb-20">

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-[#14251f] text-white">
        <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <ShieldCheck size={17} />
              Your Privacy Matters
            </div>

            <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy{" "}
              <span className="text-emerald-400">Policy.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Your trust is important to us. Learn how Manyata
              collects, protects, and uses your personal information
              while delivering trusted home services.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Manyata Privacy & Security</span>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">

        {/* Privacy Highlight */}
        <div className="relative -mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <LockKeyhole size={27} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your data. Your control.
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                At Manyata, we believe your personal information
                deserves the highest level of care. We are committed
                to transparency, responsible data handling, and
                protecting your privacy.
              </p>
            </div>

          </div>
        </div>

        {/* Policy Layout */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">

          {/* Sidebar */}
          <aside className="hidden lg:sticky lg:top-28 lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                On this page
              </p>

              <nav className="mt-5 space-y-4">
                {sections.map((section, index) => (
                  <a
                    key={section.title}
                    href={`#section-${index + 1}`}
                    className="group flex items-start gap-3 text-sm leading-5 text-slate-600 transition-colors hover:text-emerald-600"
                  >
                    <span className="text-xs font-bold text-slate-300 transition-colors group-hover:text-emerald-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{section.title}</span>
                  </a>
                ))}

                <a
                  href="#contact"
                  className="group flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-emerald-600"
                >
                  <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-600">
                    11
                  </span>
                  Contact Us
                </a>
              </nav>

            </div>

            {/* Support Card */}
            <div className="mt-5 rounded-2xl bg-[#14251f] p-6 text-white shadow-lg">
              <ShieldCheck className="text-emerald-400" size={28} />

              <h3 className="mt-4 font-bold">
                Need assistance?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Have questions about your personal data?
                Our team is here to help.
              </p>

              <a
                href="mailto:privacy@Manyata.in"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Contact Privacy Team
                <ArrowRight size={16} />
              </a>
            </div>
          </aside>

          {/* Policy Sections */}
          <div className="min-w-0 space-y-5">

            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <article
                  id={`section-${index + 1}`}
                  key={section.title}
                  className="scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5 sm:p-8"
                >
                  <div className="flex items-start gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon size={21} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                          {section.title}
                        </h2>
                      </div>

                      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base [&_p]:leading-7 [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:pl-0 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-1 [&_li]:before:top-[11px] [&_li]:before:h-2 [&_li]:before:w-2 [&_li]:before:rounded-full [&_li]:before:bg-emerald-500">
                        {section.content}
                      </div>

                    </div>
                  </div>
                </article>
              );
            })}

            {/* Contact Section */}
            <article
              id="contact"
              className="scroll-mt-28 overflow-hidden rounded-2xl bg-emerald-600 p-7 text-white shadow-lg shadow-emerald-900/10 sm:p-9"
            >
              <div className="flex items-center gap-3">
                <Mail size={25} />

                <h2 className="text-xl font-bold sm:text-2xl">
                  11. Contact Us
                </h2>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50 sm:text-base">
                If you have questions or concerns about this Privacy
                Policy or how Manyata handles your personal
                information, please get in touch with us.
              </p>

              <a
                href="mailto:privacy@Manyata.in"
                className="mt-6 inline-flex max-w-full flex-wrap items-center gap-3 rounded-xl bg-white px-5 py-3 font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Mail size={18} />
                privacy@Manyata.in
                <ArrowRight size={17} />
              </a>
            </article>

            {/* Bottom Note */}
            <div className="flex flex-wrap items-center justify-center gap-2 py-6 text-center text-sm text-slate-400">
              <CheckCircle2 size={17} className="text-emerald-500" />
              Thank you for trusting Manyata.
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
