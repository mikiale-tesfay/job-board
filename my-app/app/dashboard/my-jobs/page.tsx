"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Clock, DollarSign, Link2, Loader2, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

// Prisma Enum types
export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
export type WorkplaceType = "Remote" | "Hybrid" | "On-site";
export interface Company {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo?: string | null;
  logoColor?: string | null;
  employees?: string | null;
  industry?: string | null;
  founded?: string | null;
  website?: string | null;
  address?: string | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
  workplace: WorkplaceType;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  tags: string[];
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  isFeatured: boolean;
  postedOn: string | Date;
  postedById: string;
  companyId: string;
  company: Company;
}

function formatSalary(min?: number | null, max?: number | null): string {
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  if (max) return `Up to $${max.toLocaleString()}`;
  return "Competitive";
}

function formatPostedDate(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1d ago";
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const MyJobs = () => {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs`);
        const data = await res.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error("error");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="h-[calc(100vh-90px)] flex items-center justify-center">
        <Loader2 className="text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto mt-5 space-y-2 rounded">
        {jobs.map((job, i) => (
          <JobCard key={i} job={job} />
        ))}
      </div>
    </div>
  );
};

export default MyJobs;

function JobCard({ job }: { job: Job }) {
  const logoBg = job.company?.logoColor || "#000000";
  const initial = job.company?.name ? job.company.name.charAt(0).toUpperCase() : "C";

  return (
    <div
      className={`p-5 border border-transparent rounded cursor-pointer shadow-sm bg-card transition-all active:border-foreground hover:border-foreground `}
    >
      <Link href={`/dashboard/my-jobs/${job.id}`} className="">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded max-sm:hidden shrink-0"
              style={{
                backgroundColor: logoBg,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              {job.company?.logo ? <Image src={job.company.logo} alt={job.company.name} className="object-cover w-full h-full rounded" /> : initial}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{job.title}</h3>
                {job.isFeatured && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 bg-accent rounded text-accent-foreground font-bold"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    FEATURED
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded sm:hidden shrink-0"
                    style={{ backgroundColor: logoBg }}
                  >
                    {initial}
                  </div>
                  <span className="font-medium text-foreground">{job.company?.name}</span>
                </div>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatPostedDate(job.postedOn)}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span
                  className="text-xs px-2 py-0.5 border rounded border-border text-muted-foreground"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {job.workplace}
                </span>
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                    style={{ fontFamily: "'DM Mono', monospace" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="hidden md:flex items-center gap-1 text-xs border border-border px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors font-medium rounded"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              VIEW <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
