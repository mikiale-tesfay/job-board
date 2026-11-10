"use client";
import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  X,
  ChevronRight,
  Globe,
  Users,
  Star,
  ArrowUpRight,
  Filter,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: {
    id: String;
    name: string;
    description: String;
    logo: string;
    logoColor: String;
    industry: string;
    employees: string;
    founded: String;
  };
  logo: string;
  logoColor: string;
  location: string;
  type: string;
  remote: string;
  salaryMin: Number;
  salaryMax: Number;
  posted: string;
  tags: string[];
  description: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  employees: string;
  founded: string;
  industry: string;
  saved: boolean;
};

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const LOCATIONS = ["Remote", "Hybrid", "On-site"];
const LEVELS = ["Junior", "Mid-level", "Senior", "Staff", "Principal", "Head / Director"];

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
      }
    };

    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
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
      <section className="px-5 py-10 mx-5 mt-5 border rounded md:px-20 md:py-20">
        <div className="flex flex-col gap-0 border md:flex-row border-border">
          <div className="flex items-center flex-1 gap-3 px-4 py-3 border-b bg-card md:border-b-0 md:border-r border-border">
            <Search className="text-muted-foreground shrink-0" size={18} />
            <input
              type="text"
              placeholder="Job title, company, or keyword"
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center flex-1 gap-3 px-4 py-3 border-b bg-card md:border-b-0 md:border-r border-border">
            <MapPin className="text-muted-foreground shrink-0" size={18} />
            <input
              type="text"
              placeholder="City, state, or Remote"
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
            />
          </div>
          <button
            className="px-8 py-3 text-sm font-bold tracking-wide transition-colors bg-accent text-accent-foreground hover:bg-accent/90"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            SEARCH JOBS
          </button>
        </div>

        <div className="flex flex-wrap items-center mt-5 text-xl gap-x-6 gap-y-1" style={{ fontFamily: "'DM Mono', monospace max-w-3xl mx-auto" }}>
          <span>TRENDING:</span>
          {["Staff Engineer", "Design Systems", "AI / ML", "Remote"].map((tag) => (
            <button key={tag} onClick={() => setSearch(tag)} className="transition-colors hover:text-accent">
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Main */}
      <div className="px-2 mx-auto mt-5 max-w-350">
        <div className="sticky w-full h-4 bg-background top-16"></div>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden sticky top-18 w-56 max-h-[calc(100vh-64px)] h-full lg:block shrink-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between pt-4">
                <span className="text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setActiveTypes([]);
                      setActiveRemotes([]);
                    }}
                    className="px-3 text-xs border rounded py-0.5 mb-0.5 border-accent text-accent hover:underline"
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
                options={LOCATIONS}
                active={activeRemotes}
                toggle={(v) => toggleFilter(activeRemotes, v, setActiveRemotes)}
              />
              <FilterGroup title="LEVEL" options={LEVELS} active={[]} toggle={() => {}} />
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="sticky bg-background top-18">
              <div className="flex items-center justify-between pb-2 mb-5 border-b border-muted bg-background">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                    <span className="font-medium text-foreground">{filtered.length}</span> RESULTS
                    {(search || locationSearch) && (
                      <span className="ml-1">
                        {search && ` · "${search}"`}
                        {locationSearch && ` · ${locationSearch}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`lg:hidden flex items-center gap-2 text-sm border border-border px-3 rounded py-1.5 hover:bg-muted transition-colors ${activeFilterCount > 0 && "text-red-500"}`}
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <Filter size={14} />
                    FILTER {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </button>
                  <select
                    className="text-xs rounded border border-border bg-background px-3 py-1.5 outline-none"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    <option>MOST RECENT</option>
                    <option>HIGHEST SALARY</option>
                    <option>MOST RELEVANT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="p-4 mb-5 border rounded lg:hidden border-border bg-card">
                <div className="grid grid-cols-2 gap-6">
                  <FilterGroup title="JOB TYPE" options={TYPES} active={activeTypes} toggle={(v) => toggleFilter(activeTypes, v, setActiveTypes)} />
                  <FilterGroup
                    title="WORKPLACE"
                    options={LOCATIONS}
                    active={activeRemotes}
                    toggle={(v) => toggleFilter(activeRemotes, v, setActiveRemotes)}
                  />
                </div>
              </div>
            )}

            {/* Job grid */}
            {filtered.length === 0 ? (
              <div className="p-16 text-center border rounded rounded-radius border-border">
                <p className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
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
              <div className="pb-20">
                <div className="flex items-center gap-4">
                  <button>All</button>
                  <button>Saved</button>
                  <button>Matches</button>
                </div>
                <div className="space-y-2 divide-y rounded">
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

                <div className="flex items-center justify-center mt-5 max-sm:space-y-3">
                  <button className="w-full px-5 py-2 border rounded-full cursor-pointer bg-background">Load More</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

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
      <div className="mb-3 text-xs font-bold tracking-widest text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
        {title}
      </div>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              className={`w-3.5 h-3.5 border shrink-0 flex items-center justify-center transition-colors ${
                active.includes(opt) ? "border-foreground bg-foreground" : "border-muted-foreground/40 rounded group-hover:border-foreground"
              }`}
              onClick={() => toggle(opt)}
            >
              {active.includes(opt) && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#F2F1EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm transition-colors text-muted-foreground group-hover:text-foreground">{opt}</span>
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
      className={`p-5 border rounded cursor-pointer shadow bg-card transition-colors active:border-foreground hover:border-foreground ${isSelected ? "bg-muted border-l-2 border-l-accent" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div
            className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded max-sm:hidden shrink-0"
            style={{
              backgroundColor: job.logoColor,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}
          >
            {job.logo}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{job.title}</h3>
              {index === 0 && (
                <div
                  className="text-xs px-1.5 py-0.5 bg-accent rounded text-accent-foreground font-bold"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  FEATURED
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
              {/* COMPANY */}
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded sm:hidden shrink-0"
                  style={{
                    backgroundColor: job.logoColor,
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {job.logo}
                </div>
                <span className="font-medium text-foreground">{job.company?.name}</span>
              </div>
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                {job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax}` : job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {job.posted}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-xs px-2 py-0.5 border rounded border-border text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                {job.remote}
              </span>
              {job.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onSave}
            className={`p-1.5 rounded border border-border hover:bg-muted transition-colors ${isSaved ? "text-accent" : "text-muted-foreground"}`}
            title={isSaved ? "Unsave" : "Save job"}
          >
            {isSaved ? <Bookmark size={14} fill="currentColor" /> : <BookmarkPlus size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="hidden md:flex items-center gap-1 text-xs border border-border px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors font-medium rounded"
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
      <div className="fixed inset-0 z-50 bg-black/80" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 w-full h-screen max-w-xl overflow-y-auto border-l bg-card border-border">
        {/* Panel header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-card border-border">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center text-sm font-bold text-white rounded w-9 h-9"
              style={{
                backgroundColor: /*job.company?.logoColor */ "#000",
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              {job.company?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold">{job.company?.name}</div>
              <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                {job.company?.industry}
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
            <div className="flex flex-wrap items-center mt-2 text-sm gap-x-4 gap-y-1 text-muted-foreground">
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
                {job.salaryMin && job.salaryMax ? `${job.salaryMin} - ${job.salaryMax}` : job.salary}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {job.posted}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs rounded px-2 py-0.5 border border-border" style={{ fontFamily: "'DM Mono', monospace" }}>
                {job.remote}
              </span>
              {job.tags.map((tag) => (
                <span key={tag} className="flex items-center px-2 py-0.5 text-xs rounded bg-muted" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mb-8">
            <Link
              href={`/jobs/${job.id}/apply`}
              className="flex items-center justify-center flex-1 gap-2 py-3 text-sm font-bold tracking-widest transition-colors rounded bg-accent text-accent-foreground hover:bg-accent/90"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              APPLY NOW <ArrowUpRight size={15} />
            </Link>
            <button
              onClick={onSave}
              className={`px-3 rounded py-2 border border-border hover:bg-muted transition-colors ${isSaved ? "text-accent" : ""}`}
            >
              {isSaved ? <Bookmark size={20} fill="currentColor" /> : <BookmarkPlus size={20} />}
            </button>
          </div>
          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              THE ROLE
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          </div>
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              RESPONSIBILITIES
            </h3>
            <ul className="space-y-2">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center justify-center text-accent shrink-0">-</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              REQUIREMENTS
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-0.5 shrink-0">-</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          {/* About company */}
          <div className="pt-6 border-t border-border">
            <h3 className="mb-4 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
              ABOUT {job.company?.name?.toUpperCase()}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{job.about}</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: <Users size={14} />,
                  label: "EMPLOYEES",
                  value: job.company?.employees,
                },
                {
                  icon: <Star size={14} />,
                  label: "FOUNDED",
                  value: job.company?.founded,
                },
                {
                  icon: <Globe size={14} />,
                  label: "INDUSTRY",
                  value: job.company?.industry,
                },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded bg-muted">
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
            <Link
              href={`/jobs/${job.id}/apply`}
              className="flex items-center justify-center w-full gap-2 py-4 text-sm font-bold tracking-widest transition-colors rounded bg-accent text-accent-foreground hover:bg-accent/90"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              APPLY TO {job.company?.name?.toUpperCase()} <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
