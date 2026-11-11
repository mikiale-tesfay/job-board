// app/jobs/[jobId]/apply/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FileText, CheckCircle, Loader2, Send, Shield, Check, User, AlertCircle, Target, ChevronsUpDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import LoginModal from "@/components/LoginModal";

//  Types (mirror Prisma enums / model shapes)

type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "REMOTE";
type WorkplaceType = "REMOTE" | "HYBRID" | "ON_SITE";

interface JobDTO {
  id: string;
  title: string;
  description: string;
  type: JobType;
  workplace: WorkplaceType;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  tags: string[];
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  postedOn: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
    logoColor: string | null;
  };
}

//  Helpers
const WORKPLACE_LABEL: Record<WorkplaceType, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

const formatSalary = (min: number | null, max: number | null): string => {
  if (min == null && max == null) return "Not disclosed";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

const formatPostedDate = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return hours <= 0 ? "Just now" : `${hours}h ago`;
  }
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

//  Page

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  const [job, setJob] = useState<JobDTO | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const MIN_COVER_LETTER_LENGTH = 50;
  const MAX_COVER_LETTER_LENGTH = 5000;
  const trimmedLength = coverLetter.trim().length;
  const isValid = trimmedLength >= MIN_COVER_LETTER_LENGTH && trimmedLength <= MAX_COVER_LETTER_LENGTH;

  // Fetch job
  useEffect(() => {
    if (!jobId) return;

    (async () => {
      setJobLoading(true);
      setJobError(null);
      try {
        const res = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
        if (res.status === 404) {
          setJobError("This job is no longer available.");
          return;
        }
        if (!res.ok) throw new Error("Failed to load job");
        const data = await res.json();
        setJob(data.job);
      } catch (e) {
        setJobError(e instanceof Error ? e.message : "Failed to load job");
      } finally {
        setJobLoading(false);
      }
    })();
  }, [jobId]);

  const handleSubmit = useCallback(async () => {
    if (!isValid || !user || !job) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, coverLetter }),
      });

      if (res.status === 409) {
        throw new Error("You've already applied to this job.");
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to submit application.");
      }

      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isValid, user, job, coverLetter]);

  //  Loading
  if (sessionStatus === "loading" || jobLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  //  Job not found
  if (jobError || !job || !job?.company) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-2xl px-4 py-20 mx-auto">
          <div className="p-12 text-center border bg-card border-border">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h1 className="mb-2 text-2xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              JOB UNAVAILABLE
            </h1>
            <p className="mb-6 text-muted-foreground">{jobError ?? "This job is no longer accepting applications."}</p>
            <button
              onClick={() => router.push("/jobs")}
              className="px-8 py-3 text-sm font-bold tracking-widest transition-colors bg-accent text-accent-foreground hover:bg-accent/90"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              BROWSE JOBS
            </button>
          </div>
        </div>
      </div>
    );
  }

  //  Not signed in
  if (!user) {
    return <LoginModal callbackUrl={`/jobs/${job.id}/apply`} />;
  }

  //  Success
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-2xl px-4 py-20 mx-auto">
          <div className="p-12 text-center border bg-card border-border">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              APPLICATION SUBMITTED! 🎉
            </h1>
            <p className="mb-4 text-muted-foreground">
              Your application for <strong>{job.title}</strong> at <strong>{job.company.name}</strong> has been submitted successfully.
            </p>
            <div className="p-4 mb-8 text-left border bg-muted border-border">
              <h3 className="mb-2 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                WHAT HAPPENS NEXT?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">1.</span>
                  <span>You will receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">2.</span>
                  <span>The hiring team will review your application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">3.</span>
                  <span>If shortlisted, you will be invited for an interview</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/jobs")}
                className="px-8 py-3 text-sm font-bold tracking-widest transition-colors bg-accent text-accent-foreground hover:bg-accent/90"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                BROWSE MORE JOBS
              </button>
              <button
                onClick={() => router.push("/applications")}
                className="px-8 py-3 text-sm font-bold transition-colors border border-border hover:bg-muted"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                VIEW MY APPLICATIONS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //  Main form
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Job Header */}
      <div className="px-1">
        <div className="max-w-5xl px-4 py-6 mx-auto mt-3 bg-card">
          <div className="">
            <div className="flex items-center gap-2 mb-3">
              {/* LOGO */}
              <div
                className="flex items-center justify-center w-8 h-8 overflow-hidden text-lg font-bold text-white rounded"
                style={{
                  backgroundColor: job.company.logoColor ?? "#000",
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {job.company.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={job.company.logo} alt={job.company.name} className="object-cover w-full h-full" />
                ) : (
                  job.company.name[0]?.toUpperCase()
                )}
              </div>

              <div>
                <p className="font-medium">{job.company.name}</p>
              </div>
            </div>

            <h1 className="text-xl font-bold">{job.title}</h1>
            <span className="flex items-start gap-2 my-2">
              <div className="-mt-1">
                <div className="text-xs border bg-card rounded px-2 py-0.5 text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {formatPostedDate(job.postedOn)}
                </div>
              </div>
              {job.tags?.map((tag, i) => (
                <p key={i} className="px-2 py-px text-xs rounded bg-muted">
                  {tag}
                </p>
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl px-1 py-8 mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky space-y-4 top-6">
              {/* Applicant Card */}
              <div className="p-6 border rounded bg-card border-border">
                <h3 className="mb-4 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  APPLYING AS
                </h3>
                <div className="flex items-center justify-between gap-1 px-3 py-1 rounded-full cursor-pointer sm:justify-start bg-muted/50 hover:bg-muted/90 active:bg-muted/90">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name ?? "User"} className="object-cover w-10 h-10 rounded-full" />
                    ) : (
                      <div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-black rounded-full">
                        {(user.name ?? user.email ?? "?")[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.name ?? "—"}</p>
                      <p className="text-xs truncate text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <ChevronsUpDown size={13} className="text-sm text-foreground/60" />
                </div>
              </div>

              {/* Job Overview */}
              <div className="p-6 border rounded bg-card border-border">
                <h3 className="mb-4 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  JOB OVERVIEW
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Company</span>
                    <p className="font-medium">{job.company.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Workplace</span>
                    <p className="font-medium">{WORKPLACE_LABEL[job.workplace]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salary</span>
                    <p className="font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <div className="p-6 border rounded bg-card border-border">
                  <h3 className="mb-3 text-xs font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                    REQUIREMENTS
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="p-6 border rounded bg-card border-border">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-border">
                <FileText size={20} className="text-accent" />
                <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  YOUR APPLICATION
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                  COVER LETTER *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={14}
                  maxLength={MAX_COVER_LETTER_LENGTH}
                  className="w-full px-4 py-3 text-sm transition-colors border outline-none resize-none border-border bg-background focus:border-accent"
                  placeholder={`Dear Hiring Team at ${job.company.name},

I'm excited to apply for the ${job.title} position. [Share why you're interested and what you'd bring to the team...]

Thank you for considering my application. I look forward to hearing from you!

Best regards,
${user.name ?? ""}`}
                />
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{trimmedLength < MIN_COVER_LETTER_LENGTH ? `Minimum ${MIN_COVER_LETTER_LENGTH} characters required` : "Looking good!"}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace" }}>
                    {coverLetter.length} / {MAX_COVER_LETTER_LENGTH}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="flex items-start gap-4 p-6 mt-6 border rounded bg-accent/5 border-accent/20">
              <Shield size={20} className="text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">Tips for a strong application</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-accent shrink-0" />
                    Personalize your cover letter for this specific role
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-accent shrink-0" />
                    Reference the job is requirements where relevant
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-accent shrink-0" />
                    Explain why you are excited about {job.company.name}
                  </li>
                </ul>
              </div>
            </div>

            {submitError && <div className="p-4 mt-6 text-sm border border-destructive/50 bg-destructive/10 text-destructive">{submitError}</div>}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t rounded border-border">
              <button
                type="button"
                onClick={() => router.push(`/jobs/${jobId}`)}
                className="flex items-center gap-2 text-sm font-bold transition-colors hover:text-accent"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                ← CANCEL
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className={`px-8 py-3 text-sm font-bold tracking-widest transition-colors flex items-center gap-2 ${
                  !isValid || isSubmitting
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-accent text-accent-foreground hover:bg-accent/90"
                }`}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: "0.1em",
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    SUBMITTING...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    SUBMIT APPLICATION
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
