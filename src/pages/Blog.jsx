import { useMemo, useState } from "react";
import { Search, Clock, Mail, ArrowRight, BookOpen, X } from "lucide-react";
import useReveal from "../hooks/useReveal";
import { blogFeatured, blogCovers } from "../assets/asset";

const CATEGORIES = [
  "All",
  "Cleaning Tips",
  "Pest Control",
  "Home Maintenance",
  "Seasonal Guides",
  "Company News",
];

const POSTS = [
  {
    title: "5 Signs Your Home Needs a Deep Clean",
    category: "Cleaning Tips",
    excerpt:
      "From dust buildup behind appliances to grout discoloration, here's how to tell it's time to book a deep clean.",
    author: "Team Manayata",
    date: "Jul 14, 2026",
    readTime: "4 min read",
  },
  {
    title: "Monsoon-Proofing: A Pest Control Checklist",
    category: "Pest Control",
    excerpt:
      "Damp weather brings more than rain — here's how to keep cockroaches, mosquitoes and termites out this season.",
    author: "Sana Iyer",
    date: "Jul 2, 2026",
    readTime: "5 min read",
  },
  {
    title: "AC Maintenance Guide Before Summer Hits",
    category: "Home Maintenance",
    excerpt:
      "A pre-summer service can cut your cooling bill and extend your AC's lifespan. Here's what a full service covers.",
    author: "Karan Rao",
    date: "Jun 21, 2026",
    readTime: "6 min read",
  },
  {
    title: "How We Verify Every Manyata Professional",
    category: "Company News",
    excerpt:
      "A behind-the-scenes look at our background-check process, skills assessment and ongoing quality reviews.",
    author: "Team Manyata",
    date: "Jun 9, 2026",
    readTime: "5 min read",
  },
  {
    title: "Festive Season Home Prep Checklist",
    category: "Seasonal Guides",
    excerpt:
      "Get your home guest-ready ahead of the festivities with this room-by-room prep checklist.",
    author: "Divya Menon",
    date: "May 28, 2026",
    readTime: "4 min read",
  },
  {
    title: "DIY vs Professional: When to Call an Expert",
    category: "Home Maintenance",
    excerpt:
      "Some fixes are fine to DIY. Others can cost you more down the line. Here's how to know the difference.",
    author: "Team Manayata",
    date: "May 12, 2026",
    readTime: "5 min read",
  },
];

const FEATURED_POST = {
  title: "Inside Manayata: How 12,000 Professionals Get Verified",
  category: "Company News",
  excerpt:
    "From identity checks to skills assessments and ongoing quality audits — a full walkthrough of what it takes to wear the Manayata badge.",
  author: "Team Manayata",
  readTime: "7 min read",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80";

export default function Blog() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [headerRef, headerIn] = useReveal();
  const [gridRef, gridIn] = useReveal();

  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return POSTS.filter((post) => {
      const matchesCategory =
        category === "All" || post.category === category;

      const searchableText =
        `${post.title} ${post.excerpt} ${post.category} ${post.author}`.toLowerCase();

      return matchesCategory && searchableText.includes(searchTerm);
    });
  }, [category, query]);

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    // Connect your newsletter API here before showing success.
    setSubscribed(true);
    setEmail("");
  };

  const clearFilters = () => {
    setCategory("All");
    setQuery("");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFBF8] text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#F5F0E7] via-[#FCFBF8] to-[#FCFBF8]">
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -left-24 top-40 -z-10 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />

        <div
          ref={headerRef}
          className={`reveal ${
            headerIn ? "in-view" : ""
          } mx-auto max-w-7xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-24`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 shadow-sm sm:text-xs">
            <BookOpen size={14} />
            The Home Care Journal
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            A better home starts with{" "}
            <span className="text-emerald-700">better advice.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg">
            Discover expert cleaning tips, practical maintenance guides and
            smarter ways to care for your home — all in one place.
          </p>

          <div className="mx-auto mt-8 max-w-xl sm:mt-10">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_12px_45px_-20px_rgba(15,23,42,0.22)] transition focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-600/10 sm:rounded-full sm:pl-5">
              <Search
                size={20}
                className="ml-2 shrink-0 text-slate-400 sm:ml-0"
              />

              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search cleaning tips, guides..."
                aria-label="Search blog articles"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:py-3.5"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X size={17} />
                </button>
              )}

              <button
                type="button"
                onClick={() => document.activeElement?.blur()}
                className="hidden shrink-0 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:block"
              >
                Search
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500 sm:text-sm">
              Useful ideas for a cleaner, healthier, happier home.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        aria-label="Filter articles by category"
        className="sticky top-0 z-20 border-y border-slate-200/70 bg-[#FCFBF8]/95 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:justify-center">
            {CATEGORIES.map((item) => {
              const active = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-200 sm:px-5 sm:text-sm ${
                    active
                      ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/10"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-600/40 hover:text-emerald-800"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {category === "All" && !query.trim() && (
        <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">
                Editor's pick
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                Featured story
              </h2>
            </div>
          </div>

          <article className="group grid overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 lg:grid-cols-2 lg:rounded-[2rem]">
            <div className="relative min-h-56 overflow-hidden bg-slate-100 sm:min-h-72 lg:min-h-[410px]">
              <img
                src={blogFeatured?.src || FALLBACK_IMAGE}
                width={blogFeatured?.width}
                height={blogFeatured?.height}
                alt={blogFeatured?.alt || FEATURED_POST.title}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-sm sm:left-6 sm:top-6 sm:text-xs">
                Featured · Company News
              </span>
            </div>

            <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10 xl:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">
                {FEATURED_POST.category}
              </span>

              <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-emerald-800 sm:text-3xl xl:text-4xl">
                {FEATURED_POST.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                {FEATURED_POST.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:text-sm">
                <span className="font-semibold text-slate-700">
                  {FEATURED_POST.author}
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {FEATURED_POST.readTime}
                </span>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Article Grid */}
      <section className="pb-16 pt-8 sm:pb-24 sm:pt-10">
        <div
          ref={gridRef}
          className={`reveal ${
            gridIn ? "in-view" : ""
          } mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3 sm:mb-9">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">
                Explore & learn
              </p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Latest articles
              </h2>
            </div>

            <p className="text-xs text-slate-500 sm:text-sm">
              {filtered.length}{" "}
              {filtered.length === 1 ? "article" : "articles"} found
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center sm:py-20">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Search size={24} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No articles found
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Try another keyword or choose a different category to discover
                more home care tips.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {filtered.map((post) => {
                const originalIndex = POSTS.indexOf(post);
                const cover = blogCovers?.[originalIndex];

                return (
                  <article
                    key={post.title}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-700/20 hover:shadow-xl hover:shadow-slate-900/5 sm:rounded-3xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={cover?.src || FALLBACK_IMAGE}
                        width={cover?.width}
                        height={cover?.height}
                        alt={cover?.alt || post.title}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-sm sm:left-4 sm:top-4 sm:text-[11px]">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{post.date}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-emerald-800 sm:text-xl">
                        {post.title}
                      </h3>

                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                        {post.excerpt}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span className="min-w-0 truncate text-xs font-semibold text-slate-600 sm:text-sm">
                          {post.author}
                        </span>

                        <span
                          aria-hidden="true"
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-800 transition-all duration-300 group-hover:bg-emerald-700 group-hover:text-white"
                        >
                          <ArrowRight size={17} />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#102C25] px-5 py-10 shadow-xl shadow-emerald-950/10 sm:rounded-[2rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl sm:h-80 sm:w-80" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white sm:h-14 sm:w-14">
              <Mail size={25} />
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300 sm:text-xs">
              The monthly home edit
            </p>

            <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              A little home inspiration, delivered.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Get practical home care tips, seasonal checklists and expert
              advice delivered straight to your inbox.
            </p>

            {subscribed ? (
              <div
                role="status"
                className="mx-auto mt-8 max-w-md rounded-2xl border border-emerald-300/20 bg-white/10 px-5 py-4 text-sm font-medium text-emerald-100"
              >
                Thanks for your interest! Newsletter delivery needs to be
                connected to your email service.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:mt-8 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                  aria-label="Your email address"
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white px-5 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-400/30 sm:px-6"
                />

                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-400 px-7 py-3.5 text-sm font-bold text-[#102C25] transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-200/30"
                >
                  Subscribe
                  <ArrowRight size={17} />
                </button>
              </form>
            )}

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Helpful emails only. No spam. Unsubscribe whenever you like.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}






// import { useState, useMemo } from "react";
// import { Search, Clock, Mail, ArrowRight } from "lucide-react";
// import useReveal from "../hooks/useReveal";
// import { blogFeatured, blogCovers } from "../assets/asset";

// const CATEGORIES = [
//   "All",
//   "Cleaning Tips",
//   "Pest Control",
//   "Home Maintenance",
//   "Seasonal Guides",
//   "Company News",
// ];

// const POSTS = [
//   {
//     title: "5 Signs Your Home Needs a Deep Clean",
//     category: "Cleaning Tips",
//     excerpt:
//       "From dust buildup behind appliances to grout discoloration, here's how to tell it's time to book a deep clean.",
//     author: "Team Manayata",
//     date: "Jul 14, 2026",
//     readTime: "4 min read",
//   },
//   {
//     title: "Monsoon-Proofing: A Pest Control Checklist",
//     category: "Pest Control",
//     excerpt:
//       "Damp weather brings more than rain — here's how to keep cockroaches, mosquitoes and termites out this season.",
//     author: "Sana Iyer",
//     date: "Jul 2, 2026",
//     readTime: "5 min read",
//   },
//   {
//     title: "AC Maintenance Guide Before Summer Hits",
//     category: "Home Maintenance",
//     excerpt:
//       "A pre-summer service can cut your cooling bill and extend your AC's lifespan. Here's what a full service covers.",
//     author: "Karan Rao",
//     date: "Jun 21, 2026",
//     readTime: "6 min read",
//   },
//   {
//     title: "How We Verify Every Manyata Professional",
//     category: "Company News",
//     excerpt:
//       "A behind-the-scenes look at our background-check process, skills assessment and ongoing quality reviews.",
//     author: "Team Manyata",
//     date: "Jun 9, 2026",
//     readTime: "5 min read",
//   },
//   {
//     title: "Festive Season Home Prep Checklist",
//     category: "Seasonal Guides",
//     excerpt:
//       "Get your home guest-ready ahead of the festivities with this room-by-room prep checklist.",
//     author: "Divya Menon",
//     date: "May 28, 2026",
//     readTime: "4 min read",
//   },
//   {
//     title: "DIY vs Professional: When to Call an Expert",
//     category: "Home Maintenance",
//     excerpt:
//       "Some fixes are fine to DIY. Others can cost you more down the line. Here's how to know the difference.",
//     author: "Team Manayata",
//     date: "May 12, 2026",
//     readTime: "5 min read",
//   },
// ];

// export default function Blog() {
//   const [category, setCategory] = useState("All");
//   const [query, setQuery] = useState("");
//   const [headerRef, headerIn] = useReveal();
//   const [gridRef, gridIn] = useReveal();

//   const filtered = useMemo(() => {
//     return POSTS.filter((p) => {
//       const matchesCategory = category === "All" || p.category === category;
//       const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase());
//       return matchesCategory && matchesQuery;
//     });
//   }, [category, query]);

//   return (
//     <>
//       {/* Header */}
//       <section className="relative overflow-hidden bg-ivory pt-10 pb-4">
//         <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-gradient-to-br from-brand-400/20 to-gold-400/20 blur-3xl animate-float" />
//         <div
//           ref={headerRef}
//           className={`reveal ${headerIn ? "in-view" : ""} relative max-w-3xl mx-auto px-6 lg:px-8 pt-10 pb-12 text-center`}
//         >
//           <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
//             The Home Care Journal
//           </span>
//           <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
//             Tips, guides & stories from Manayata
//           </h1>
//           <p className="mt-4 text-slate-600 text-lg">
//             Practical advice on cleaning, maintenance and getting the most out
//             of home services.
//           </p>

//           <div className="relative mt-8 max-w-md mx-auto">
//             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search articles..."
//               className="w-full rounded-full bg-white pl-11 pr-4 py-3.5 text-sm shadow-sm border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-50 outline-none placeholder:text-slate-400 transition-all"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Category filters */}
//       <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-14">
//         <div className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-2 pb-2">
//           {CATEGORIES.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setCategory(cat)}
//               className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
//                 category === cat
//                   ? "bg-brand-600 text-white shadow-md border border-brand-600"
//                   : "bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600"
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Featured post */}
//       {category === "All" && !query && (
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
//           <a
//             href="/blog"
//             className="group grid lg:grid-cols-2 gap-8 rounded-[2rem] bg-white p-4 lg:p-6 shadow-card border border-slate-100 hover:shadow-soft transition-all items-center"
//           >
//             <div className="overflow-hidden rounded-2xl aspect-[8/5]">
//               <img
//                 src={blogFeatured.src}
//                 width={blogFeatured.width}
//                 height={blogFeatured.height}
//                 alt={blogFeatured.alt}
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//             </div>
//             <div className="pr-2 pb-4 lg:pb-0">
//               <span className="inline-block rounded-full bg-brand-50 border border-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-600">
//                 Featured · Company News
//               </span>
//               <h2 className="mt-4 text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
//                 Inside Manayata: How 12,000 Professionals Get Verified
//               </h2>
//               <p className="mt-3 text-slate-600 leading-relaxed">
//                 From identity checks to skills assessments and ongoing quality
//                 audits — a full walkthrough of what it takes to wear the
//                 Manayata badge.
//               </p>
//               <div className="mt-5 flex items-center gap-4 text-sm font-medium text-slate-500">
//                 <span>Team Manayata</span>
//                 <span className="h-1 w-1 rounded-full bg-slate-300" />
//                 <span className="flex items-center gap-1">
//                   <Clock size={14} /> 7 min read
//                 </span>
//               </div>
//             </div>
//           </a>
//         </div>
//       )}

//       {/* Post grid */}
//       <section className="pb-24">
//         <div
//           ref={gridRef}
//           className={`reveal ${gridIn ? "in-view" : ""} max-w-7xl mx-auto px-6 lg:px-8`}
//         >
//           {filtered.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-slate-500 text-lg">No articles match your search yet.</p>
//               <button onClick={() => { setQuery(""); setCategory("All"); }} className="mt-4 text-brand-600 font-semibold hover:underline">
//                 Clear filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filtered.map((post) => {
//                 const cover = blogCovers[POSTS.indexOf(post)];
//                 return (
//                   <a
//                     href="/blog"
//                     key={post.title}
//                     className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
//                   >
//                     <div className="overflow-hidden aspect-[3/2]">
//                       <img
//                         src={cover.src}
//                         width={cover.width}
//                         height={cover.height}
//                         alt={cover.alt}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     </div>
//                     <div className="p-6 flex flex-col flex-1">
//                       <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
//                         {post.category}
//                       </span>
//                       <h3 className="mt-2 text-lg font-display font-bold leading-snug text-slate-900 group-hover:text-brand-600 transition-colors">
//                         {post.title}
//                       </h3>
//                       <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">
//                         {post.excerpt}
//                       </p>
//                       <div className="mt-5 flex items-center justify-between text-xs font-medium text-slate-400 pt-4 border-t border-slate-100">
//                         <span>{post.date}</span>
//                         <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
//                           <Clock size={12} /> {post.readTime}
//                         </span>
//                       </div>
//                     </div>
//                   </a>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="pb-24">
//         <div className="max-w-4xl mx-auto px-6 lg:px-8">
//           <div className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-6 py-12 lg:py-16 text-center shadow-xl">
//             {/* Background Glow */}
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-slate-900 to-slate-900 pointer-events-none" />
            
//             <div className="relative z-10">
//               <div className="mx-auto h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5 border border-white/20">
//                 <Mail size={24} className="text-white" />
//               </div>
//               <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
//                 Get home care tips in your inbox
//               </h2>
//               <p className="mt-3 text-slate-300 text-sm max-w-md mx-auto">
//                 Join 10,000+ homeowners. One email a month. No spam, unsubscribe anytime.
//               </p>
//               <form
//                 onSubmit={(e) => e.preventDefault()}
//                 className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
//               >
//                 <input
//                   type="email"
//                   required
//                   placeholder="you@example.com"
//                   className="flex-1 rounded-full px-5 py-3.5 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-white/90 focus:bg-white transition-colors"
//                 />
//                 <button
//                   type="submit"
//                   className="group rounded-full bg-brand-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-brand-500 transition-colors whitespace-nowrap flex items-center justify-center gap-2 shadow-lg"
//                 >
//                   Subscribe
//                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }