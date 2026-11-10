import { ArrowUpRight, ChevronRight, Search } from "lucide-react";
import HomeNavbar from "../components/HomeNavbar";

import { redirect } from "next/navigation";

import { auth } from "@/auth";

const HomePage = async () => {
  const session = await auth();
  if (session?.user?.role === "USER") redirect("/jobs");

  return (
    <div className="min-h-screen">
      <HomeNavbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
        <h2 className="mb-5 text-2xl font-bold uppercase md:text-4xl">Find Your Next remote or localtech job </h2>
        <p className="text-xl capitalize md:text-2xl max-w-150">discover 5,000+ verified software engineering and design positions</p>

        <div className="flex items-center justify-center w-full gap-2 mt-5 md:flex-row">
          <div className="relative shrink">
            <input type="text" name="" id="" className="p-2 pl-8 border" placeholder="Job title or keyword..." />
            <Search className="absolute top-2.5 left-1.5 text-foreground/60" size={20} />
          </div>

          <button className="p-2 px-5 text-white shrink bg-accent">Search</button>
        </div>
      </div>

      {/* Featured companies */}
      <section className="flex items-center min-h-screen border-t">
        <div className="w-full px-6 py-12 mx-auto max-w-350">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              POPULAR COMPANIES
            </h2>
            <a
              href="#"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              SEE ALL <ChevronRight size={12} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-px border md:grid-cols-3 lg:grid-cols-6 bg-border border-border">
            {[
              {
                name: "Stripe",
                count: "12 roles",
                color: "#635BFF",
              },
              {
                name: "Linear",
                count: "4 roles",
                color: "#5E6AD2",
              },
              {
                name: "Vercel",
                count: "9 roles",
                color: "#000000",
              },
              {
                name: "Figma",
                count: "7 roles",
                color: "#F24E1E",
              },
              {
                name: "Anthropic",
                count: "15 roles",
                color: "#CC785C",
              },
              {
                name: "PlanetScale",
                count: "3 roles",
                color: "#1F2937",
              },
            ].map((co) => (
              <button key={co.name} className="p-6 text-left transition-colors bg-card hover:bg-muted group">
                <div
                  className="flex items-center justify-center mb-3 text-sm font-bold text-white w-9 h-9"
                  style={{
                    backgroundColor: co.color,
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {co.name[0]}
                </div>
                <div className="text-sm font-semibold">{co.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {co.count}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex items-center justify-center min-h-screen border-t border-border ">
        <div className="flex flex-col items-start justify-between gap-8 px-6 py-16 mx-auto max-w-350 md:flex-row md:items-center">
          <div>
            <h2
              className="text-3xl font-extrabold leading-tight md:text-4xl"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              HIRING? REACH THE
              <br />
              <span className="text-accent">BEST ENGINEERS</span> IN THE WORLD.
            </h2>
            <p className="max-w-md mt-3 text-sm text-foreground/50">Post a role and get applications from vetted senior engineers within 48 hours.</p>
          </div>
          <button
            className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest transition-colors bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            POST YOUR JOB <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mt-12 border-t border-border bg-secondary">
        <div className="px-6 py-8 mx-auto max-w-350">
          <div className="grid grid-cols-2 divide-x md:grid-cols-4 divide-border">
            {[
              { label: "OPEN ROLES", value: "4,200+" },
              { label: "COMPANIES HIRING", value: "340" },
              { label: "PLACED THIS MONTH", value: "890" },
              { label: "AVG. SALARY", value: "$167k" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-2 first:pl-0 last:pr-0">
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
