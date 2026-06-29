// app/post-job/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Globe,
  Users,
  FileText,
  Tag,
  Mail,
  Phone,
  CheckCircle,
  ArrowLeft,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";

type FormData = {
  // Company info
  companyName: string;
  companyLogo: string;
  companyIndustry: string;
  companySize: string;
  companyWebsite: string;
  companyEmail: string;
  companyPhone: string;
  companyDescription: string;

  // Job details
  jobTitle: string;
  jobType: string;
  remoteType: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  experienceLevel: string;

  // Job description
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];

  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Application
  applicationUrl: string;
  applicationEmail: string;
  deadline: string;
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const REMOTE_TYPES = ["Remote", "Hybrid", "On-site", "Flexible"];
const EXPERIENCE_LEVELS = ["Junior", "Mid-level", "Senior", "Staff", "Principal", "Head / Director"];
const INDUSTRIES = [
  "Fintech",
  "Dev Tools",
  "AI / Safety",
  "Design",
  "Database / Infra",
  "SaaS",
  "E-commerce",
  "Healthcare",
  "Education",
  "Gaming",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "Other",
];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyLogo: "",
    companyIndustry: "",
    companySize: "",
    companyWebsite: "",
    companyEmail: "",
    companyPhone: "",
    companyDescription: "",
    jobTitle: "",
    jobType: "",
    remoteType: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "USD",
    experienceLevel: "",
    description: "",
    responsibilities: [""],
    requirements: [""],
    benefits: [""],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    applicationUrl: "",
    applicationEmail: "",
    deadline: "",
  });

  const totalSteps = 4;

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: keyof FormData, index: number, value: string) => {
    const arr = [...(formData[field] as string[])];
    arr[index] = value;
    updateField(field, arr);
  };

  const addArrayItem = (field: keyof FormData) => {
    const arr = [...(formData[field] as string[])];
    arr.push("");
    updateField(field, arr);
  };

  const removeArrayItem = (field: keyof FormData, index: number) => {
    const arr = [...(formData[field] as string[])];
    arr.splice(index, 1);
    updateField(field, arr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    // In production, send data to your API
    // const response = await fetch('/api/jobs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.companyName.trim() && formData.companyIndustry && formData.companyDescription.trim();
      case 2:
        return (
          formData.jobTitle.trim() && formData.jobType && formData.remoteType && formData.location.trim() && formData.salaryMin && formData.salaryMax
        );
      case 3:
        return formData.description.trim();
      case 4:
        return formData.contactName.trim() && formData.contactEmail.trim();
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-card border border-border p-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              JOB POSTED SUCCESSFULLY!
            </h1>
            <p className="text-muted-foreground mb-8">Your job listing is now live. You'll receive applications at your email.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-accent text-accent-foreground px-8 py-3 text-sm font-bold tracking-widest hover:bg-accent/90 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
              >
                VIEW JOB BOARD
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setStep(1);
                  setFormData({
                    companyName: "",
                    companyLogo: "",
                    companyIndustry: "",
                    companySize: "",
                    companyWebsite: "",
                    companyEmail: "",
                    companyPhone: "",
                    companyDescription: "",
                    jobTitle: "",
                    jobType: "",
                    remoteType: "",
                    location: "",
                    salaryMin: "",
                    salaryMax: "",
                    salaryCurrency: "USD",
                    experienceLevel: "",
                    description: "",
                    responsibilities: [""],
                    requirements: [""],
                    benefits: [""],
                    contactName: "",
                    contactEmail: "",
                    contactPhone: "",
                    applicationUrl: "",
                    applicationEmail: "",
                    deadline: "",
                  });
                }}
                className="border border-border px-8 py-3 text-sm font-bold hover:bg-muted transition-colors"
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
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            <span className="text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
              BACK TO JOBS
            </span>
          </button>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "-0.02em" }}>
            POST A JOB
          </h1>
          <p className="text-muted-foreground mt-1">Reach the best engineers in the world. Complete all steps to publish your listing.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className={`flex-1 h-1 transition-colors ${i + 1 <= step ? "bg-accent" : "bg-border"}`} />
            </div>
          ))}
          <span className="text-xs text-muted-foreground ml-4" style={{ fontFamily: "'DM Mono', monospace" }}>
            STEP {step}/{totalSteps}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="text-sm font-bold tracking-widest mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                  COMPANY INFORMATION
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        COMPANY NAME *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => updateField("companyName", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="e.g. Stripe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        COMPANY LOGO
                      </label>
                      <input
                        type="text"
                        value={formData.companyLogo}
                        onChange={(e) => updateField("companyLogo", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="URL or initial letter"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        INDUSTRY *
                      </label>
                      <select
                        value={formData.companyIndustry}
                        onChange={(e) => updateField("companyIndustry", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        required
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        COMPANY SIZE
                      </label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => updateField("companySize", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select size</option>
                        {COMPANY_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size} employees
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        WEBSITE
                      </label>
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) => updateField("companyWebsite", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        EMAIL
                      </label>
                      <input
                        type="email"
                        value={formData.companyEmail}
                        onChange={(e) => updateField("companyEmail", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="hr@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      COMPANY DESCRIPTION *
                    </label>
                    <textarea
                      value={formData.companyDescription}
                      onChange={(e) => updateField("companyDescription", e.target.value)}
                      rows={4}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                      placeholder="Tell candidates about your company..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="text-sm font-bold tracking-widest mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                  JOB DETAILS
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      JOB TITLE *
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => updateField("jobTitle", e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="e.g. Staff Software Engineer"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        JOB TYPE *
                      </label>
                      <select
                        value={formData.jobType}
                        onChange={(e) => updateField("jobType", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        required
                      >
                        <option value="">Select type</option>
                        {JOB_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        WORKPLACE TYPE *
                      </label>
                      <select
                        value={formData.remoteType}
                        onChange={(e) => updateField("remoteType", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        required
                      >
                        <option value="">Select type</option>
                        {REMOTE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        LOCATION *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="e.g. San Francisco, CA"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        EXPERIENCE LEVEL
                      </label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => updateField("experienceLevel", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select level</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        SALARY (MIN) *
                      </label>
                      <input
                        type="text"
                        value={formData.salaryMin}
                        onChange={(e) => updateField("salaryMin", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="$100k"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        SALARY (MAX) *
                      </label>
                      <input
                        type="text"
                        value={formData.salaryMax}
                        onChange={(e) => updateField("salaryMax", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="$150k"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        CURRENCY
                      </label>
                      <select
                        value={formData.salaryCurrency}
                        onChange={(e) => updateField("salaryCurrency", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                        <option value="INR">INR</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Job Description */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="text-sm font-bold tracking-widest mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
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
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
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
                        className="text-xs text-accent hover:underline flex items-center gap-1"
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
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="e.g. Drive technical direction..."
                        />
                        {formData.responsibilities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("responsibilities", index)}
                            className="px-3 border border-border hover:bg-muted transition-colors"
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
                        className="text-xs text-accent hover:underline flex items-center gap-1"
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
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="e.g. 5+ years of experience..."
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("requirements", index)}
                            className="px-3 border border-border hover:bg-muted transition-colors"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Benefits */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                        BENEFITS & PERKS
                      </label>
                      <button
                        type="button"
                        onClick={() => addArrayItem("benefits")}
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} /> ADD
                      </button>
                    </div>
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateArrayField("benefits", index, e.target.value)}
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="e.g. Health insurance, 401k..."
                        />
                        {formData.benefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem("benefits", index)}
                            className="px-3 border border-border hover:bg-muted transition-colors"
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

          {/* Step 4: Application & Contact */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-card border border-border p-6">
                <h2 className="text-sm font-bold tracking-widest mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                  APPLICATION & CONTACT
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        CONTACT NAME *
                      </label>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => updateField("contactName", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        CONTACT EMAIL *
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        placeholder="jane@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      CONTACT PHONE
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                      APPLICATION METHOD (choose at least one)
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          APPLICATION URL
                        </label>
                        <input
                          type="url"
                          value={formData.applicationUrl}
                          onChange={(e) => updateField("applicationUrl", e.target.value)}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="https://company.com/careers"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          APPLICATION EMAIL
                        </label>
                        <input
                          type="email"
                          value={formData.applicationEmail}
                          onChange={(e) => updateField("applicationEmail", e.target.value)}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="careers@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      APPLICATION DEADLINE
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => updateField("deadline", e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-muted border border-border p-6">
                <h3 className="text-xs font-bold tracking-widest mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                  SUMMARY
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Company:</span>
                    <span className="ml-2 font-medium">{formData.companyName || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Job Title:</span>
                    <span className="ml-2 font-medium">{formData.jobTitle || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2 font-medium">{formData.location || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 font-medium">{formData.jobType || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salary:</span>
                    <span className="ml-2 font-medium">
                      {formData.salaryMin && formData.salaryMax ? `${formData.salaryCurrency} ${formData.salaryMin} – ${formData.salaryMax}` : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="ml-2 font-medium">{formData.companyIndustry || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={step === 1 ? () => router.push("/") : prevStep}
              className="text-sm font-bold hover:text-accent transition-colors"
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
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
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
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
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
