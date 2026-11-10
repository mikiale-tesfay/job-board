import Navbar from "@/components/Navbar";
import CompanyDetailsForm from "@/components/CompanyDetailsForm";

export const metadata = {
  title: "Register your company · Job",
  description: "Create your company profile to start posting jobs and hiring top tech talent.",
};

const steps = [
  {
    num: "01",
    title: "Create your profile",
    body: "Add your logo, brand color, and a short description. It takes under two minutes.",
  },
  {
    num: "02",
    title: "Post your first role",
    body: "Describe the position, set requirements and a salary range. Publish instantly.",
  },
  {
    num: "03",
    title: "Meet your shortlist",
    body: "We surface the best-matched candidates within 72 hours of publishing.",
  },
];

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="grid w-full grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12 xl:px-20">
          {/* LEFT */}
          <aside className="py-5 lg:sticky lg:top-24 lg:self-start">
            <h1 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight md:text-5xl xl:text-6xl">
              Register as a <span className="text-accent">client</span>
            </h1>

            <p className="max-w-xl mt-6 text-lg text-muted-foreground">
              Set up your company profile once and post unlimited roles. Reach 5,000+ verified software engineers and designers — no noise, no spam,
              just qualified candidates.
            </p>

            {/* Steps */}
            <ol className="mt-12 space-y-8">
              {steps.map((s) => (
                <li key={s.num} className="flex gap-5">
                  <span className="text-3xl font-extrabold tracking-tight text-accent/30">{s.num}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded bg-accent" />
                Free to register
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded bg-accent" />
                Pay only when you hire
              </span>
            </div>
          </aside>

          {/* RIGHT: Form */}
          <div className="w-full pb-5 sm:pb-10 sm:py-10">
            <CompanyDetailsForm />
          </div>
        </div>
      </main>
    </div>
  );
}
