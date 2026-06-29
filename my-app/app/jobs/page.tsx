"use client";
import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  X,
  ChevronDown,
  ChevronRight,
  Building2,
  Globe,
  Users,
  Star,
  ArrowUpRight,
  Filter,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Link from "next/link";

const JOBS = [
  {
    id: 1,
    title: "Staff Software Engineer",
    company: "Stripe",
    logo: "S",
    logoColor: "#635BFF",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: "Hybrid",
    salary: "$220k – $310k",
    posted: "2d ago",
    tags: ["Distributed Systems", "Go", "Ruby"],
    description:
      "Lead architectural decisions for Stripe's core payments infrastructure serving millions of transactions daily. You'll work across teams to shape how we scale, improve reliability, and build for the next decade of financial infrastructure.",
    about:
      "Stripe is a financial infrastructure platform for businesses. Millions of companies—from the world's largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
    responsibilities: [
      "Drive the technical direction for systems processing billions of dollars daily",
      "Mentor and develop senior engineers across multiple teams",
      "Partner with product and design to shape the roadmap",
      "Define engineering standards and best practices company-wide",
    ],
    requirements: [
      "10+ years of software engineering experience",
      "Track record of delivering large-scale distributed systems",
      "Experience with financial or high-reliability systems preferred",
      "Exceptional written and verbal communication",
    ],
    employees: "8,000+",
    founded: "2010",
    industry: "Fintech",
    saved: false,
  },
  {
    id: 2,
    title: "Principal Product Designer",
    company: "Linear",
    logo: "L",
    logoColor: "#5E6AD2",
    location: "Remote",
    type: "Full-time",
    remote: "Remote",
    salary: "$180k – $240k",
    posted: "1d ago",
    tags: ["Product Design", "Figma", "Design Systems"],
    description:
      "Define the future of how software teams plan and build products. You'll own design across Linear's core product surface and shape a design culture that ships fast and raises the bar for product quality.",
    about: "Linear is building the system for modern software development. Linear gives high-performance teams a streamlined way to build software.",
    responsibilities: [
      "Own design for Linear's core project management surface",
      "Build and maintain a cohesive design system",
      "Prototype and validate new product directions quickly",
      "Partner directly with founders on product strategy",
    ],
    requirements: [
      "8+ years of product design experience",
      "Portfolio demonstrating shipped B2B or developer tools",
      "Deep expertise in interaction design and systems thinking",
      "Comfortable with high autonomy and fast iteration",
    ],
    employees: "80",
    founded: "2019",
    industry: "Dev Tools",
    saved: false,
  },
  {
    id: 3,
    title: "Head of Data Science",
    company: "Anthropic",
    logo: "A",
    logoColor: "#CC785C",
    location: "San Francisco, CA",
    type: "Full-time",
    remote: "On-site",
    salary: "$280k – $380k",
    posted: "3d ago",
    tags: ["ML", "Python", "Statistics"],
    description:
      "Lead the data science function at one of the most important AI safety companies. You'll build the team and infrastructure to understand and evaluate model behavior at scale.",
    about:
      "Anthropic is an AI safety company working to build reliable, interpretable, and steerable AI systems. We're dedicated to research on making AI that is safe and beneficial.",
    responsibilities: [
      "Build and lead a world-class data science team",
      "Design evaluation frameworks for frontier AI models",
      "Partner with research teams on alignment and safety metrics",
      "Develop data infrastructure for model training and analysis",
    ],
    requirements: [
      "PhD in Statistics, CS, or related field preferred",
      "7+ years in data science or ML research",
      "Experience managing and growing technical teams",
      "Strong research background with publications a plus",
    ],
    employees: "1,000+",
    founded: "2021",
    industry: "AI / Safety",
    saved: false,
  },
  {
    id: 4,
    title: "Senior Backend Engineer",
    company: "Vercel",
    logo: "V",
    logoColor: "#000000",
    location: "Remote",
    type: "Full-time",
    remote: "Remote",
    salary: "$160k – $210k",
    posted: "5d ago",
    tags: ["Node.js", "Rust", "Edge Computing"],
    description:
      "Build the infrastructure that powers millions of deployments. You'll work on Vercel's edge runtime, build tooling, and the systems that make frontend deployment instant worldwide.",
    about:
      "Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.",
    responsibilities: [
      "Build and scale Vercel's global edge infrastructure",
      "Improve cold start performance and runtime reliability",
      "Design APIs used by hundreds of thousands of developers",
      "Contribute to open source projects like Next.js",
    ],
    requirements: [
      "5+ years backend engineering experience",
      "Experience with edge/serverless compute platforms",
      "Strong knowledge of Node.js, Rust, or Go",
      "Passion for developer experience and tooling",
    ],
    employees: "700+",
    founded: "2015",
    industry: "Dev Tools",
    saved: false,
  },
  {
    id: 5,
    title: "Engineering Manager, Growth",
    company: "Figma",
    logo: "F",
    logoColor: "#F24E1E",
    location: "New York, NY",
    type: "Full-time",
    remote: "Hybrid",
    salary: "$190k – $250k",
    posted: "1w ago",
    tags: ["Engineering Management", "TypeScript", "Growth"],
    description:
      "Lead a team building the systems that drive Figma's enterprise growth. You'll balance technical rigor with business impact, helping teams ship faster while maintaining quality.",
    about:
      "Figma is a collaborative web application for interface design, with additional offline features enabled by desktop applications for macOS and Windows.",
    responsibilities: [
      "Manage a team of 6-8 engineers across growth initiatives",
      "Define and track metrics for activation, conversion, and retention",
      "Work with product to prioritize high-leverage growth experiments",
      "Drive technical quality and operational excellence",
    ],
    requirements: [
      "3+ years engineering management experience",
      "Strong technical background in web or full-stack development",
      "Experience with growth engineering and experimentation",
      "Track record of developing strong engineering teams",
    ],
    employees: "3,000+",
    founded: "2012",
    industry: "Design",
    saved: false,
  },
  {
    id: 6,
    title: "DevRel Engineer",
    company: "PlanetScale",
    logo: "P",
    logoColor: "#1F2937",
    location: "Remote",
    type: "Full-time",
    remote: "Remote",
    salary: "$140k – $185k",
    posted: "4d ago",
    tags: ["MySQL", "Developer Relations", "Technical Writing"],
    description:
      "Bridge the gap between PlanetScale's engineering team and the developer community. You'll create content, build demos, speak at conferences, and help developers get the most out of the platform.",
    about: "PlanetScale is the world's most advanced MySQL-compatible serverless database platform.",
    responsibilities: [
      "Create technical content: tutorials, videos, live demos",
      "Represent PlanetScale at conferences and community events",
      "Gather developer feedback and relay it to product teams",
      "Build sample applications showcasing platform capabilities",
    ],
    requirements: [
      "Strong software engineering background (3+ years)",
      "Demonstrated ability to explain complex concepts clearly",
      "Experience with databases, particularly MySQL",
      "Public speaking or content creation experience preferred",
    ],
    employees: "200+",
    founded: "2018",
    industry: "Database / Infra",
    saved: false,
  },
];

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const REMOTES = ["Remote", "Hybrid", "On-site"];
const LEVELS = ["Junior", "Mid-level", "Senior", "Staff", "Principal", "Head / Director"];

type Job = (typeof JOBS)[0];

export default function App() {
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeRemotes, setActiveRemotes] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  function toggleFilter(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  function toggleSave(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const filtered = JOBS.filter((j) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some((t) => t.toLowerCase().includes(q));
    const matchesLocation = !locationSearch || j.location.toLowerCase().includes(locationSearch.toLowerCase());
    const matchesType = activeTypes.length === 0 || activeTypes.includes(j.type);
    const matchesRemote = activeRemotes.length === 0 || activeRemotes.includes(j.remote);
    return matchesSearch && matchesLocation && matchesType && matchesRemote;
  });

  const activeFilterCount = activeTypes.length + activeRemotes.length;

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
      {/* Nav */}
      <Navbar />
      {/* Search bar */}
      <section className="max-w-3xl mx-auto py-20  px-3">
        <div className="flex flex-col md:flex-row gap-0 border border-border">
          <div className="flex-1 flex items-center gap-3 bg-card px-4 py-3 border-b md:border-b-0 md:border-r border-border">
            <Search className="text-muted-foreground shrink-0" size={18} />
            <input
              type="text"
              placeholder="Job title, company, or keyword"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center gap-3 bg-card px-4 py-3 border-b md:border-b-0 md:border-r border-border">
            <MapPin className="text-muted-foreground shrink-0" size={18} />
            <input
              type="text"
              placeholder="City, state, or Remote"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </div>
          <button
            className="bg-accent text-accent-foreground px-8 py-3 text-sm font-bold tracking-wide hover:bg-accent/90 transition-colors"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            SEARCH JOBS
          </button>
        </div>

        <div className="flex items-center flex-wrap gap-x-6 gap-y-1 mt-5 text-xl" style={{ fontFamily: "'DM Mono', monospace max-w-3xl mx-auto" }}>
          <span>TRENDING:</span>
          {["Staff Engineer", "Design Systems", "AI / ML", "Remote"].map((tag) => (
            <button key={tag} onClick={() => setSearch(tag)} className="hover:text-accent transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Main */}
      <div className="max-w-350 mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setActiveTypes([]);
                      setActiveRemotes([]);
                    }}
                    className="text-xs text-accent hover:underline"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    CLEAR ({activeFilterCount})
                  </button>
                )}
              </div>

              <FilterGroup title="JOB TYPE" options={TYPES} active={activeTypes} toggle={(v) => toggleFilter(activeTypes, v, setActiveTypes)} />
              <FilterGroup
                title="WORKPLACE"
                options={REMOTES}
                active={activeRemotes}
                toggle={(v) => toggleFilter(activeRemotes, v, setActiveRemotes)}
              />
              <FilterGroup title="LEVEL" options={LEVELS} active={[]} toggle={() => {}} />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                <span className="text-foreground font-medium">{filtered.length}</span> RESULTS
                {(search || locationSearch) && (
                  <span className="ml-1">
                    {search && ` · "${search}"`}
                    {locationSearch && ` · ${locationSearch}`}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-sm border border-border px-3 py-1.5 hover:bg-muted transition-colors"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  <Filter size={14} />
                  FILTER {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <select
                  className="text-xs border border-border bg-background px-3 py-1.5 outline-none"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  <option>MOST RECENT</option>
                  <option>HIGHEST SALARY</option>
                  <option>MOST RELEVANT</option>
                </select>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden mb-5 border border-border p-4 bg-card">
                <div className="grid grid-cols-2 gap-6">
                  <FilterGroup title="JOB TYPE" options={TYPES} active={activeTypes} toggle={(v) => toggleFilter(activeTypes, v, setActiveTypes)} />
                  <FilterGroup
                    title="WORKPLACE"
                    options={REMOTES}
                    active={activeRemotes}
                    toggle={(v) => toggleFilter(activeRemotes, v, setActiveRemotes)}
                  />
                </div>
              </div>
            )}

            {/* Job grid */}
            {filtered.length === 0 ? (
              <div className="border border-border p-16 text-center">
                <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
                  NO JOBS MATCH YOUR SEARCH
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setLocationSearch("");
                    setActiveTypes([]);
                    setActiveRemotes([]);
                  }}
                  className="mt-4 text-xs text-accent hover:underline"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="divide-y divide-border border border-border bg-card">
                {filtered.map((job, i) => (
                  <JobRow
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    isSaved={savedJobs.includes(job.id)}
                    onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                    onSave={(e) => toggleSave(job.id, e)}
                    index={i}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Stats strip */}
      <section className="border-t border-border mt-12 bg-secondary">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: "OPEN ROLES", value: "4,200+" },
              { label: "COMPANIES HIRING", value: "340" },
              { label: "PLACED THIS MONTH", value: "890" },
              { label: "AVG. SALARY", value: "$167k" },
            ].map((stat) => (
              <div key={stat.label} className="px-6 first:pl-0 last:pr-0 py-2">
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured companies */}
      <section className="border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              FEATURED COMPANIES
            </h2>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              SEE ALL <ChevronRight size={12} />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border border border-border">
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
              <button key={co.name} className="bg-card p-6 text-left hover:bg-muted transition-colors group">
                <div
                  className="w-9 h-9 flex items-center justify-center text-white text-sm font-bold mb-3"
                  style={{
                    backgroundColor: co.color,
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {co.name[0]}
                </div>
                <div className="font-semibold text-sm">{co.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {co.count}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2
              className="text-3xl md:text-4xl font-extrabold leading-tight"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              HIRING? REACH THE
              <br />
              <span className="text-accent">BEST ENGINEERS</span> IN THE WORLD.
            </h2>
            <p className="text-primary-foreground/50 text-sm mt-3 max-w-md">
              Post a role and get applications from vetted senior engineers within 48 hours.
            </p>
          </div>
          <button
            className="bg-accent text-accent-foreground px-8 py-4 text-sm font-bold tracking-widest hover:bg-accent/90 transition-colors whitespace-nowrap flex items-center gap-2"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            POST YOUR JOB <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* Job detail panel */}
      {selectedJob && (
        <JobDetailPanel
          job={selectedJob}
          isSaved={savedJobs.includes(selectedJob.id)}
          onSave={(e) => toggleSave(selectedJob.id, e)}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

function FilterGroup({ title, options, active, toggle }: { title: string; options: string[]; active: string[]; toggle: (v: string) => void }) {
  return (
    <div>
      <div className="text-xs font-bold tracking-widest mb-3 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
        {title}
      </div>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={`w-3.5 h-3.5 border shrink-0 flex items-center justify-center transition-colors ${
                active.includes(opt) ? "border-foreground bg-foreground" : "border-muted-foreground/40 group-hover:border-foreground"
              }`}
              onClick={() => toggle(opt)}
            >
              {active.includes(opt) && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#F2F1EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function JobRow({
  job,
  isSelected,
  isSaved,
  onClick,
  onSave,
  index,
}: {
  job: Job;
  isSelected: boolean;
  isSaved: boolean;
  onClick: () => void;
  onSave: (e: React.MouseEvent) => void;
  index: number;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-5 cursor-pointer transition-colors hover:bg-muted/50 ${isSelected ? "bg-muted border-l-2 border-l-accent" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div
            className="w-10 h-10 shrink-0 flex items-center justify-center text-white text-sm font-bold"
            style={{
              backgroundColor: job.logoColor,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            {job.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base">{job.title}</h3>
              {index === 0 && (
                <span className="text-xs px-1.5 py-0.5 bg-accent text-accent-foreground font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                  FEATURED
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
              <span className="font-medium text-foreground">{job.company}</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {job.posted}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 border border-border text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                {job.remote}
              </span>
              {job.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSave}
            className={`p-1.5 border border-border hover:bg-muted transition-colors ${isSaved ? "text-accent" : "text-muted-foreground"}`}
            title={isSaved ? "Unsave" : "Save job"}
          >
            {isSaved ? <Bookmark size={14} fill="currentColor" /> : <BookmarkPlus size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="hidden md:flex items-center gap-1 text-xs border border-border px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            VIEW <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function JobDetailPanel({
  job,
  isSaved,
  onSave,
  onClose,
}: {
  job: Job;
  isSaved: boolean;
  onSave: (e: React.MouseEvent) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-foreground/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border z-50 overflow-y-auto">
        {/* Panel header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center text-white text-sm font-bold"
              style={{
                backgroundColor: job.logoColor,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              {job.logo}
            </div>
            <div>
              <div className="font-semibold text-sm">{job.company}</div>
              <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                {job.industry}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Title + actions */}
          <div className="mb-5">
            <h2
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "-0.01em",
              }}
            >
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase size={13} />
                {job.type}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={13} />
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {job.posted}
              </span>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs px-2 py-0.5 border border-border" style={{ fontFamily: "'DM Mono', monospace" }}>
                {job.remote}
              </span>
              {job.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 bg-muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <Link
              href={"/freelancer/application"}
              className="flex-1 bg-accent text-accent-foreground py-3 text-sm font-bold tracking-widest hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              APPLY NOW <ArrowUpRight size={15} />
            </Link>
            <button onClick={onSave} className={`px-2 py-2 border border-border hover:bg-muted transition-colors ${isSaved ? "text-accent" : ""}`}>
              {isSaved ? <Bookmark size={16} fill="currentColor" /> : <BookmarkPlus size={16} />}
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              THE ROLE
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              RESPONSIBILITIES
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-0.5 shrink-0">—</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
              REQUIREMENTS
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-0.5 shrink-0">—</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* About company */}
          <div className="border-t border-border pt-6">
            <h3 className="text-xs font-bold tracking-widest mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
              ABOUT {job.company.toUpperCase()}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">{job.about}</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: <Users size={14} />,
                  label: "EMPLOYEES",
                  value: job.employees,
                },
                {
                  icon: <Star size={14} />,
                  label: "FOUNDED",
                  value: job.founded,
                },
                {
                  icon: <Globe size={14} />,
                  label: "INDUSTRY",
                  value: job.industry,
                },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted p-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{stat.icon}</div>
                  <div
                    className="text-xs text-muted-foreground"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div className="text-sm font-semibold mt-0.5">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              className="w-full bg-accent text-accent-foreground py-4 text-sm font-bold tracking-widest hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              APPLY TO {job.company.toUpperCase()} <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
