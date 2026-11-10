"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle, ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import HomeNavbar from "@/components/HomeNavbar";

// Matches the Prisma enums
type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
type WorkplaceType = "REMOTE" | "HYBRID" | "ON_SITE" | "FLEXIBLE";

// Only fields that map to the Job model
type FormData = {
  // Job fields
  title: string;
  type: JobType | "";
  workplace: WorkplaceType | "";
  location: string;
  salaryMin: string; // kept as string in state, parsed to Int on submit
  salaryMax: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  tags: string[];

  // Flags
  isActive: boolean;
  isFeatured: boolean;
};

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
];

const WORKPLACE_TYPES: { value: WorkplaceType; label: string }[] = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ON_SITE", label: "On-site" },
  { value: "FLEXIBLE", label: "Flexible" },
];

const emptyForm: FormData = {
  title: "",
  type: "",
  workplace: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  description: "",
  responsibilities: [""],
  requirements: [""],
  tags: [""],

  isActive: true,
  isFeatured: false,
};

export default function PostJob() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>(emptyForm);

  const totalSteps = 4;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: "responsibilities" | "requirements" | "tags", index: number, value: string) => {
    const arr = [...formData[field]];
    arr[index] = value;
    updateField(field, arr);
  };

  const addArrayItem = (field: "responsibilities" | "requirements" | "tags") => {
    updateField(field, [...formData[field], ""]);
  };

  const removeArrayItem = (field: "responsibilities" | "requirements" | "tags", index: number) => {
    const arr = [...formData[field]];
    arr.splice(index, 1);
    updateField(field, arr);
  };

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!user) {
      router.push("/login?callbackUrl=/jobs/post-job");
      return;
    }

    if (user?.role !== "RECRUITER") {
      alert("You are not allowed to post a job");
      router.push("/client/register?callbackUrl=/jobs/post-job");
      router.refresh();
    }
  }, [user, router, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") {
      return;
    }
    if (!user) {
      router.push("/login?callbackUrl=/jobs/post-job");
      return;
    }

    if (user.role !== "RECRUITER" && user.role !== "ADMIN") {
      alert("You do not have permission to post a job. Only recruiters and admins can post jobs.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      workplace: formData.workplace,
      location: formData.location.trim(),
      salaryMin: formData.salaryMin ? parseInt(formData.salaryMin, 10) : null,
      salaryMax: formData.salaryMax ? parseInt(formData.salaryMax, 10) : null,
      tags: formData.tags.map((t) => t.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.map((r) => r.trim()).filter(Boolean),
      requirements: formData.requirements.map((r) => r.trim()).filter(Boolean),
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const dsta = await res.json();
    console.log("Response from /api/jobs:", dsta);
    alert(dsta.message);

    setIsSubmitting(false);
    if (dsta?.success) {
      setIsSuccess(true);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.title.trim() &&
          formData.type &&
          formData.workplace &&
          formData.location.trim() &&
          formData.salaryMin &&
          formData.salaryMax &&
          Number(formData.salaryMin) <= Number(formData.salaryMax)
        );
      case 2:
        return formData.description.trim();
      case 3:
        return true; // arrays optional; tags optional
      case 4:
        return true; // preview step
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setStep(1);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <HomeNavbar />
        <div className="max-w-2xl px-4 py-20 mx-auto text-center">
          <div className="p-12 border bg-card border-border">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-accent/10">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              JOB POSTED SUCCESSFULLY!
            </h1>
            <p className="mb-8 text-muted-foreground">Your job listing is now live. You will receive applications at your email.</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 text-sm font-bold tracking-widest transition-colors bg-accent text-accent-foreground hover:bg-accent/90"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
              >
                VIEW JOB BOARD
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  resetForm();
                }}
                className="px-8 py-3 text-sm font-bold transition-colors border border-border hover:bg-muted"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
              >
                POST ANOTHER JOB
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomeNavbar />

      <div className="max-w-4xl px-4 py-12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 mb-4 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
              BACK TO JOBS
            </span>
          </button>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.02em" }}>
            POST A JOB
          </h1>
          <p className="mt-1 text-muted-foreground">Reach the best engineers in the world. Complete all steps to publish your listing.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex-1 h-1 transition-colors ${i + 1 <= step ? "bg-accent" : "bg-border"}`} />
            </div>
          ))}
          <span className="ml-4 text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
            STEP {step}/{totalSteps}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Job Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="p-6 border bg-card border-border">
                <h2 className="mb-6 text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  JOB DETAILS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      JOB TITLE *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="w-full px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                      placeholder="e.g. Staff Software Engineer"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        JOB TYPE *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => updateField("type", e.target.value as JobType)}
                        className="w-full px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                        required
                      >
                        <option value="">Select type</option>
                        {JOB_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        WORKPLACE TYPE *
                      </label>
                      <select
                        value={formData.workplace}
                        onChange={(e) => updateField("workplace", e.target.value as WorkplaceType)}
                        className="w-full px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                        required
                      >
                        <option value="">Select type</option>
                        {WORKPLACE_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      LOCATION *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="w-full px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                      placeholder="e.g. San Francisco, CA"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        SALARY (MIN) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.salaryMin}
                        onChange={(e) => updateField("salaryMin", e.target.value)}
                        className="w-full px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                        placeholder="100000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        SALARY (MAX) *
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formData.salaryMax}
                        onChange={(e) => updateField("salaryMax", e.target.value)}
                        className="w-full px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                        placeholder="150000"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description & Requirements */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-6 border bg-card border-border">
                <h2 className="mb-6 text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  JOB DESCRIPTION
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      DESCRIPTION *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 text-sm transition-colors border outline-none resize-none border-border bg-background focus:border-accent"
                      placeholder="Describe the role, team, and impact..."
                      required
                    />
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                        RESPONSIBILITIES
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("responsibilities")}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        <Plus size={12} /> ADD
                      </button>
                    </div>
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => updateArrayField("responsibilities", index, e.target.value)}
                          className="flex-1 px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                          placeholder="e.g. Drive technical direction..."
                        />
                        {formData.responsibilities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("responsibilities", index)}
                            className="px-3 transition-colors border border-border hover:bg-muted"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Requirements */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                        REQUIREMENTS
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("requirements")}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        <Plus size={12} /> ADD
                      </button>
                    </div>
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => updateArrayField("requirements", index, e.target.value)}
                          className="flex-1 px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                          placeholder="e.g. 5+ years of experience..."
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("requirements", index)}
                            className="px-3 transition-colors border border-border hover:bg-muted"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Tags & Flags */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-6 border bg-card border-border">
                <h2 className="mb-6 text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  TAGS & VISIBILITY
                </h2>

                <div className="space-y-6">
                  {/* Tags */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                        TAGS
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("tags")}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        <Plus size={12} /> ADD
                      </button>
                    </div>
                    {formData.tags.map((tag, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => updateArrayField("tags", index, e.target.value)}
                          className="flex-1 px-3 py-2 text-sm transition-colors border outline-none border-border bg-background focus:border-accent"
                          placeholder="e.g. React, TypeScript, Remote"
                        />
                        {formData.tags.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("tags", index)}
                            className="px-3 transition-colors border border-border hover:bg-muted"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Flags */}
                  <div className="pt-4 space-y-3 border-t border-border">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => updateField("isActive", e.target.checked)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-sm">
                        <span className="font-bold">Active</span>{" "}
                        <span className="text-muted-foreground">— publish immediately (visible on the board)</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => updateField("isFeatured", e.target.checked)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="flex items-center gap-2 text-sm">
                        <Star size={14} className="text-accent" />
                        <span className="font-bold">Featured</span>{" "}
                        <span className="text-muted-foreground">— highlight this listing at the top of the board</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="p-6 border bg-muted border-border">
                <h2 className="mb-4 text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                  REVIEW YOUR LISTING
                </h2>
                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <SummaryRow label="Job Title" value={formData.title} />
                  <SummaryRow label="Type" value={JOB_TYPES.find((t) => t.value === formData.type)?.label ?? ""} />
                  <SummaryRow label="Workplace" value={WORKPLACE_TYPES.find((t) => t.value === formData.workplace)?.label ?? ""} />
                  <SummaryRow label="Location" value={formData.location} />
                  <SummaryRow
                    label="Salary"
                    value={formData.salaryMin && formData.salaryMax ? `${formData.salaryMin} – ${formData.salaryMax}` : ""}
                  />
                  <SummaryRow label="Tags" value={formData.tags.filter(Boolean).join(", ")} />
                  <SummaryRow label="Status" value={formData.isActive ? "Active" : "Draft (inactive)"} />
                  {formData.isFeatured && <SummaryRow label="Featured" value="Yes" />}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-border">
            <button
              type="button"
              onClick={step === 1 ? () => router.push("/") : prevStep}
              className="text-sm font-bold transition-colors hover:text-accent"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {step === 1 ? "← CANCEL" : "← BACK"}
            </button>

            <div className="flex gap-3">
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep()}
                  className={`px-8 py-3 text-sm font-bold tracking-widest transition-colors ${
                    validateStep()
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  NEXT STEP →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !validateStep()}
                  className={`px-8 py-3 text-sm font-bold tracking-widest transition-colors ${
                    isSubmitting || !validateStep()
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
                  }`}
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  {isSubmitting ? "POSTING..." : "POST JOB →"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}:</span> <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
