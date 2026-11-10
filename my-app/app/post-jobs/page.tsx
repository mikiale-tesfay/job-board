import Link from "next/link";
import HomeNavbar from "../../components/HomeNavbar";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

const stats = [
  { value: "5,000+", label: "Verified engineers & designers" },
  { value: "72h", label: "Average time to first hire" },
  { value: "94%", label: "Client satisfaction rate" },
  { value: "12k", label: "Jobs posted last year" },
];

const benefits = [
  {
    title: "Reach vetted talent",
    body: "Every candidate is screened for real experience — no noise, no spam, no junior resumes flooding your inbox.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M12 3l7 4v5c0 5-3 8-7 9-4-1-7-4-7-9V7l7-4z" />
      </svg>
    ),
  },
  {
    title: "Post in minutes",
    body: "A single, focused form. Add your role, requirements, and salary range — publish in under three minutes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M12 21a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
    ),
  },
  {
    title: "Pay only when you hire",
    body: "No subscriptions, no listing fees. You only pay a flat fee when you successfully make a hire through us.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2m0-10v10m0 0v2m0-2v-2m0-8V6" />
      </svg>
    ),
  },
  {
    title: "Remote & local reach",
    body: "Target talent wherever they are. Filter by timezone, region, or on-site preference with a single toggle.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
      </svg>
    ),
  },
];

const steps = [
  {
    num: "01",
    title: "Register as a client",
    body: "Set up your company profile once. It takes less than two minutes.",
  },
  {
    num: "02",
    title: "Post your role",
    body: "Describe the position, set your requirements and salary range.",
  },
  {
    num: "03",
    title: "Meet your shortlist",
    body: "We surface the best-matched candidates within 72 hours.",
  },
  {
    num: "04",
    title: "Hire with confidence",
    body: "Interview, offer, and close. Pay only when you make a hire.",
  },
];

const testimonials = [
  {
    quote: "We filled two senior backend roles in under two weeks. The quality of candidates was night and day compared to other boards.",
    name: "Maya Chen",
    role: "Head of Engineering, Northwind",
  },
  {
    quote: "The only platform where I didn't have to sift through hundreds of unqualified applications. Every profile was relevant.",
    name: "Daniel Okafor",
    role: "CTO, Loopstack",
  },
  {
    quote: "Transparent pricing and real candidates. We've made it our default place to post engineering roles.",
    name: "Sofia Almeida",
    role: "Talent Lead, Brightlane",
  },
];

export default async function PostJobsLanding() {
  const session = await auth();
  if (session?.user?.role === "USER") redirect("/jobs");
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HomeNavbar />

      {/*  HERO  */}
      <section className="relative overflow-hidden">
        {/* subtle accent glow */}
        <div aria-hidden className="absolute -translate-x-1/2 rounded-full pointer-events-none -top-40 left-1/2 h-125 w-225 bg-accent/5 blur-3xl" />

        <div className="relative px-6 pt-20 pb-24 mx-auto max-w-7xl md:pt-28 md:pb-32">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              For companies hiring tech talent
            </span>

            <h1 className="mt-8 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-5xl">
              Hire the <span className="text-accent">top 1%</span> of remote &amp; local tech talent
            </h1>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground md:text-xl">
              Post a role and reach 5,000+ verified software engineers and designers. No noise. No spam. Just qualified candidates ready to interview.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
              <Link
                href="/client/register"
                className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-semibold transition rounded-full bg-accent text-accent-foreground hover:opacity-90 sm:w-auto"
              >
                Register as Client →
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center w-full px-8 py-4 text-base font-semibold transition bg-transparent border rounded-full border-border hover:bg-secondary sm:w-auto"
              >
                See how it works
              </Link>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">Free to register · Pay only when you hire</p>
          </div>
        </div>
      </section>

      {/*  STATS BAR  */}
      <section className="border-y border-border bg-secondary/50">
        <div className="grid grid-cols-2 px-6 py-10 mx-auto max-w-7xl gap-y-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold tracking-tight md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs tracking-wider uppercase text-muted-foreground md:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/*  BENEFITS  */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why companies choose Job</h2>
          <p className="mt-4 text-lg text-muted-foreground">Built for engineering and design teams who care about signal over noise.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="p-8 transition border group rounded-3xl border-border bg-card hover:border-accent/40">
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 text-accent">{b.icon}</div>
              <h3 className="mt-6 text-xl font-semibold">{b.title}</h3>
              <p className="mt-3 text-base text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/*  HOW IT WORKS  */}
      <section id="how-it-works" className="border-y border-border bg-secondary/40">
        <div className="px-6 py-24 mx-auto max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">From post to hire in four steps</h2>
            <p className="mt-4 text-lg text-muted-foreground">A simple process designed to get you in front of great candidates fast.</p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.num} className="relative">
                <div className="text-5xl font-extrabold tracking-tight text-accent/30">{s.num}</div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  TESTIMONIALS  */}
      <section className="px-6 py-24 mx-auto max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Trusted by hiring teams</h2>
          <p className="mt-4 text-lg text-muted-foreground">Here is what engineering leaders say after posting with us.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between h-full p-8 border rounded-3xl border-border bg-card">
              <blockquote className="text-base leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="pt-4 mt-6 border-t border-border">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/*  FINAL CTA  */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-border bg-card px-8 py-20 text-center md:px-16">
          <div
            aria-hidden
            className="absolute -translate-x-1/2 rounded-full pointer-events-none -bottom-32 left-1/2 h-100 w-175 bg-accent/10 blur-3xl"
          />
          <div className="relative">
            <h2 className="max-w-3xl mx-auto text-3xl font-extrabold tracking-tight uppercase md:text-5xl">Ready to meet your next great hire?</h2>
            <p className="max-w-xl mx-auto mt-6 text-lg text-muted-foreground">
              Create a client account and post your first role today. Free to start — you only pay when you hire.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
              <Link
                href="/client/register"
                className="inline-flex items-center justify-center w-full px-10 py-4 text-base font-semibold transition rounded-full bg-accent text-accent-foreground hover:opacity-90 sm:w-auto"
              >
                Register as Client →
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-full px-10 py-4 text-base font-semibold transition border rounded-full border-border hover:bg-secondary sm:w-auto"
              >
                Talk to sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*  FOOTER  */}
      <footer className="mt-auto border-t border-border">
        <div className="flex flex-col items-center justify-between gap-4 px-6 py-8 mx-auto text-sm max-w-7xl text-muted-foreground sm:flex-row">
          <span>© 2025 Job — Remote &amp; Local Tech</span>
          <span className="flex gap-6">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
