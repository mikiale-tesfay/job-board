// app/apply/[jobId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FileText,
  User,
  Briefcase,
  // Mail,
  // Phone,
  // MapPin,
  // Globe,
  // Link2,
  Plus,
  Trash2,
  // Star,
  CheckCircle,
  // AlertCircle,
  Loader2,
  Eye,
  // Download,
  // Calendar,
  // Clock,
  // DollarSign,
  // Building2,
  // Users,
  Award,
  // BookOpen,
  Code,
  // ExternalLink,
  X,
  // ChevronDown,
  // ChevronUp,
  // FileCheck,
  Send,
  Save,
  // AlertTriangle,
  Check,
  Sparkles,
  // Zap,
  Shield,
  Target,
  // TrendingUp,
} from "lucide-react";
// import {SiGithub, SiLinkedin,SiTwitter,} from "react-icons/fa"
import Navbar from "../../components/Navbar";

// Mock job data - in production, fetch from API
const JOB_DATA = {
  id: "1",
  title: "Staff Software Engineer",
  company: "Stripe",
  logo: "S",
  logoColor: "#635BFF",
  location: "San Francisco, CA",
  type: "Full-time",
  remote: "Hybrid",
  salary: "$220k – $310k",
  posted: "2d ago",
  description:
    "Lead architectural decisions for Stripe's core payments infrastructure serving millions of transactions daily. You'll work across teams to shape how we scale, improve reliability, and build for the next decade of financial infrastructure.",
  about:
    "Stripe is a financial infrastructure platform for businesses. Millions of companies—from the world's largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.",
  requirements: [
    "10+ years of software engineering experience",
    "Track record of delivering large-scale distributed systems",
    "Experience with financial or high-reliability systems preferred",
    "Exceptional written and verbal communication",
  ],
  responsibilities: [
    "Drive the technical direction for systems processing billions of dollars daily",
    "Mentor and develop senior engineers across multiple teams",
    "Partner with product and design to shape the roadmap",
    "Define engineering standards and best practices company-wide",
  ],
  benefits: ["Competitive salary and equity", "Health, dental, and vision insurance", "401(k) with company match", "Flexible PTO and work hours"],
};

type ProposalStatus = "draft" | "submitted" | "reviewing" | "accepted" | "rejected";

interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate: string;
  estimatedDuration: string;
  availability: string;
  status: ProposalStatus;
  submittedAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  type: "portfolio" | "resume" | "cover_letter" | "other";
  url: string;
  size: number;
  uploadedAt: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  url?: string;
  technologies: string[];
  highlights: string[];
  dateCompleted: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
}

interface Question {
  id: string;
  question: string;
  type: "text" | "textarea" | "file" | "select" | "multi_select";
  required: boolean;
  options?: string[];
}

// Mock screening questions - in production, fetched from API
const SCREENING_QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "What's your availability to start?",
    type: "select",
    required: true,
    options: ["Immediately", "Within 1 week", "Within 2 weeks", "Within 1 month", "Negotiable"],
  },
  {
    id: "q2",
    question: "Do you have experience with distributed systems?",
    type: "text",
    required: true,
  },
  {
    id: "q3",
    question: "Why are you interested in working at Stripe?",
    type: "textarea",
    required: true,
  },
  {
    id: "q4",
    question: "Upload your resume or portfolio",
    type: "file",
    required: true,
  },
];

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Freelancer profile
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    bio: "",
    title: "",
    hourlyRate: "",
  });

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: "1",
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [""],
    },
  ]);

  // Skills
  const [skills, setSkills] = useState<Skill[]>([{ id: "1", name: "", level: 3, yearsOfExperience: 0 }]);

  // Portfolio
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: "1",
      title: "",
      description: "",
      technologies: [""],
      highlights: [""],
      dateCompleted: "",
    },
  ]);

  // Proposal
  const [proposal, setProposal] = useState({
    coverLetter: "",
    proposedRate: "",
    estimatedDuration: "",
    availability: "Immediately",
    attachments: [] as Attachment[],
  });

  // Screening answers
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});

  // UI state
  const [activeTab, setActiveTab] = useState<"overview" | "profile" | "proposal" | "review">("overview");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    experience: true,
    skills: true,
    portfolio: true,
  });

  // Load saved draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(`proposal_draft_${jobId}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setProfile(parsed.profile || profile);
        setExperiences(parsed.experiences || experiences);
        setSkills(parsed.skills || skills);
        setPortfolioItems(parsed.portfolioItems || portfolioItems);
        setProposal(parsed.proposal || proposal);
        setScreeningAnswers(parsed.screeningAnswers || screeningAnswers);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, [jobId]);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      const draft = {
        profile,
        experiences,
        skills,
        portfolioItems,
        proposal,
        screeningAnswers,
      };
      localStorage.setItem(`proposal_draft_${jobId}`, JSON.stringify(draft));
    }, 2000);

    return () => clearTimeout(timer);
  }, [profile, experiences, skills, portfolioItems, proposal, screeningAnswers, jobId]);

  const totalSteps = 4;

  // Validation
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Profile
        if (!profile.firstName) newErrors.firstName = "First name is required";
        if (!profile.lastName) newErrors.lastName = "Last name is required";
        if (!profile.email) newErrors.email = "Email is required";
        if (!profile.title) newErrors.title = "Professional title is required";
        break;
      case 2: // Experience & Skills
        if (experiences.length > 0 && !experiences[0].title && !experiences[0].company) {
          // Only validate if they've started filling it out
        }
        break;
      case 3: // Proposal
        if (!proposal.coverLetter || proposal.coverLetter.length < 50) {
          newErrors.coverLetter = "Cover letter must be at least 50 characters";
        }
        if (!proposal.proposedRate) newErrors.proposedRate = "Proposed rate is required";
        if (!proposal.estimatedDuration) newErrors.estimatedDuration = "Estimated duration is required";
        break;
      case 4: // Review
        // Validate all required fields
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // In production:
    // const response = await fetch('/api/proposals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     jobId,
    //     profile,
    //     experiences,
    //     skills,
    //     portfolioItems,
    //     proposal,
    //     screeningAnswers,
    //   }),
    // });
  };

  const saveDraft = async () => {
    setIsSavingDraft(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSavingDraft(false);
    // Show toast notification
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.includes("pdf") ? "resume" : "other",
        url: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      setProposal((prev) => ({
        ...prev,
        attachments: [...prev.attachments, attachment],
      }));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setProposal((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20">
          <div className="bg-card border border-border p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              APPLICATION SUBMITTED! 🎉
            </h1>
            <p className="text-muted-foreground mb-4">
              Your application for <strong>{JOB_DATA.title}</strong> at <strong>{JOB_DATA.company}</strong> has been submitted successfully.
            </p>
            <div className="bg-muted border border-border p-4 text-left mb-8">
              <h3 className="text-xs font-bold tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                WHAT HAPPENS NEXT?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">1.</span>
                  <span>You'll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">2.</span>
                  <span>The hiring team will review your application</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-0.5">3.</span>
                  <span>If shortlisted, you'll be invited for an interview</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-accent text-accent-foreground px-8 py-3 text-sm font-bold tracking-widest hover:bg-accent/90 transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
              >
                VIEW MORE JOBS
              </button>
              <button
                onClick={() => router.push(`/applications/${jobId}`)}
                className="border border-border px-8 py-3 text-sm font-bold hover:bg-muted transition-colors"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
              >
                VIEW APPLICATION
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

      {/* Job Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.push("/")} className="p-2 border border-border hover:bg-muted transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: JOB_DATA.logoColor, fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {JOB_DATA.logo}
                </div>
                <div>
                  <h1 className="text-xl font-bold">{JOB_DATA.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{JOB_DATA.company}</span>
                    <span>•</span>
                    <span>{JOB_DATA.location}</span>
                    <span>•</span>
                    <span>{JOB_DATA.type}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold">{JOB_DATA.salary}</div>
                <div className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {JOB_DATA.posted}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
              COMPLETION {Math.round((currentStep / totalSteps) * 100)}%
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={saveDraft}
                disabled={isSavingDraft}
                className="text-xs flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSavingDraft ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isSavingDraft ? "SAVING..." : "SAVE DRAFT"}
              </button>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`flex-1 h-1 transition-colors ${i + 1 <= currentStep ? "bg-accent" : "bg-border"}`} />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Profile</span>
            <span>Experience</span>
            <span>Proposal</span>
            <span>Review</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Job Overview */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-6 space-y-4">
              <div className="bg-card border border-border p-6">
                <h3 className="text-xs font-bold tracking-widest mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                  JOB OVERVIEW
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Company</span>
                    <p className="font-medium">{JOB_DATA.company}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">{JOB_DATA.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salary</span>
                    <p className="font-medium">{JOB_DATA.salary}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type</span>
                    <p className="font-medium">{JOB_DATA.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Posted</span>
                    <p className="font-medium">{JOB_DATA.posted}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border p-6">
                <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                  REQUIREMENTS
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {JOB_DATA.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-accent/5 border border-accent/20 p-6">
                <h3 className="text-xs font-bold tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                  ⚡ APPLICATION TIPS
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                    Customize your cover letter for this role
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                    Highlight relevant experience with distributed systems
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
                    Include links to your GitHub or portfolio
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1 min-w-0">
            {/* Step 1: Profile */}
            {currentStep === 1 && (
              <div className="bg-card border border-border p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <User size={20} className="text-accent" />
                  <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                    PERSONAL INFORMATION
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      PHONE
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                    PROFESSIONAL TITLE *
                  </label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                    LOCATION
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                    BIO / SUMMARY
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Tell us about yourself, your expertise, and what you're passionate about..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      WEBSITE
                    </label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      HOURLY RATE
                    </label>
                    <input
                      type="text"
                      value={profile.hourlyRate}
                      onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="$100/hr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      GITHUB
                    </label>
                    <input
                      type="text"
                      value={profile.github}
                      onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      LINKEDIN
                    </label>
                    <input
                      type="text"
                      value={profile.linkedin}
                      onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      TWITTER
                    </label>
                    <input
                      type="text"
                      value={profile.twitter}
                      onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      placeholder="username"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience & Skills */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Experience */}
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Briefcase size={20} className="text-accent" />
                      <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                        WORK EXPERIENCE
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newExp: Experience = {
                          id: Math.random().toString(36).substr(2, 9),
                          title: "",
                          company: "",
                          location: "",
                          startDate: "",
                          endDate: "",
                          current: false,
                          description: "",
                          achievements: [""],
                        };
                        setExperiences([...experiences, newExp]);
                      }}
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> ADD EXPERIENCE
                    </button>
                  </div>

                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="border-b border-border last:border-0 pb-6 last:pb-0 mb-6 last:mb-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">Experience #{index + 1}</h4>
                        {experiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setExperiences(experiences.filter((e) => e.id !== exp.id));
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            JOB TITLE
                          </label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].title = e.target.value;
                              setExperiences(updated);
                            }}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                            placeholder="Senior Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            COMPANY
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].company = e.target.value;
                              setExperiences(updated);
                            }}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                            placeholder="Google"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            LOCATION
                          </label>
                          <input
                            type="text"
                            value={exp.location}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].location = e.target.value;
                              setExperiences(updated);
                            }}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                            placeholder="Mountain View, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            START DATE
                          </label>
                          <input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].startDate = e.target.value;
                              setExperiences(updated);
                            }}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            END DATE
                          </label>
                          <input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) => {
                              const updated = [...experiences];
                              updated[index].endDate = e.target.value;
                              setExperiences(updated);
                            }}
                            disabled={exp.current}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`current_${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].current = e.target.checked;
                            if (e.target.checked) {
                              updated[index].endDate = "";
                            }
                            setExperiences(updated);
                          }}
                          className="w-4 h-4 accent-accent"
                        />
                        <label htmlFor={`current_${exp.id}`} className="text-sm">
                          I currently work here
                        </label>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          DESCRIPTION
                        </label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].description = e.target.value;
                            setExperiences(updated);
                          }}
                          rows={3}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                          placeholder="Describe your role and responsibilities..."
                        />
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          KEY ACHIEVEMENTS
                        </label>
                        {exp.achievements.map((achievement, ai) => (
                          <div key={ai} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={achievement}
                              onChange={(e) => {
                                const updated = [...experiences];
                                updated[index].achievements[ai] = e.target.value;
                                setExperiences(updated);
                              }}
                              className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                              placeholder="e.g. Led a team of 5 to deliver the new payment system"
                            />
                            {exp.achievements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...experiences];
                                  updated[index].achievements = updated[index].achievements.filter((_, i) => i !== ai);
                                  setExperiences(updated);
                                }}
                                className="px-3 border border-border hover:bg-muted transition-colors"
                              >
                                <Trash2 size={14} className="text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...experiences];
                            updated[index].achievements.push("");
                            setExperiences(updated);
                          }}
                          className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"
                        >
                          <Plus size={12} /> ADD ACHIEVEMENT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Code size={20} className="text-accent" />
                      <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                        SKILLS
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSkills([...skills, { id: Math.random().toString(36).substr(2, 9), name: "", level: 3, yearsOfExperience: 0 }]);
                      }}
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> ADD SKILL
                    </button>
                  </div>

                  {skills.map((skill, index) => (
                    <div key={skill.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[index].name = e.target.value;
                            setSkills(updated);
                          }}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="e.g. React, TypeScript, Node.js"
                        />
                      </div>
                      <div>
                        <select
                          value={skill.level}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[index].level = parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5;
                            setSkills(updated);
                          }}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        >
                          <option value={1}>⭐ Beginner</option>
                          <option value={2}>⭐⭐ Intermediate</option>
                          <option value={3}>⭐⭐⭐ Advanced</option>
                          <option value={4}>⭐⭐⭐⭐ Expert</option>
                          <option value={5}>⭐⭐⭐⭐⭐ Master</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={skill.yearsOfExperience}
                          onChange={(e) => {
                            const updated = [...skills];
                            updated[index].yearsOfExperience = parseInt(e.target.value) || 0;
                            setSkills(updated);
                          }}
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="Years"
                          min="0"
                        />
                        {skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSkills(skills.filter((s) => s.id !== skill.id));
                            }}
                            className="px-3 border border-border hover:bg-muted transition-colors"
                          >
                            <Trash2 size={14} className="text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio */}
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Award size={20} className="text-accent" />
                      <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                        PORTFOLIO PROJECTS
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPortfolioItems([
                          ...portfolioItems,
                          {
                            id: Math.random().toString(36).substr(2, 9),
                            title: "",
                            description: "",
                            technologies: [""],
                            highlights: [""],
                            dateCompleted: "",
                          },
                        ]);
                      }}
                      className="text-xs text-accent hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> ADD PROJECT
                    </button>
                  </div>

                  {portfolioItems.map((item, index) => (
                    <div key={item.id} className="border-b border-border last:border-0 pb-6 last:pb-0 mb-6 last:mb-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">Project #{index + 1}</h4>
                        {portfolioItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setPortfolioItems(portfolioItems.filter((p) => p.id !== item.id));
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            PROJECT TITLE
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...portfolioItems];
                              updated[index].title = e.target.value;
                              setPortfolioItems(updated);
                            }}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                            placeholder="e.g. E-commerce Platform"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                            DATE COMPLETED
                          </label>
                          <input
                            type="date"
                            value={item.dateCompleted}
                            onChange={(e) => {
                              const updated = [...portfolioItems];
                              updated[index].dateCompleted = e.target.value;
                              setPortfolioItems(updated);
                            }}
                            className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          DESCRIPTION
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...portfolioItems];
                            updated[index].description = e.target.value;
                            setPortfolioItems(updated);
                          }}
                          rows={3}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                          placeholder="Describe the project, your role, and the impact..."
                        />
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          TECHNOLOGIES
                        </label>
                        {item.technologies.map((tech, ti) => (
                          <div key={ti} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => {
                                const updated = [...portfolioItems];
                                updated[index].technologies[ti] = e.target.value;
                                setPortfolioItems(updated);
                              }}
                              className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                              placeholder="e.g. React, Node.js, PostgreSQL"
                            />
                            {item.technologies.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...portfolioItems];
                                  updated[index].technologies = updated[index].technologies.filter((_, i) => i !== ti);
                                  setPortfolioItems(updated);
                                }}
                                className="px-3 border border-border hover:bg-muted transition-colors"
                              >
                                <Trash2 size={14} className="text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...portfolioItems];
                            updated[index].technologies.push("");
                            setPortfolioItems(updated);
                          }}
                          className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"
                        >
                          <Plus size={12} /> ADD TECHNOLOGY
                        </button>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          KEY FEATURES / HIGHLIGHTS
                        </label>
                        {item.highlights.map((highlight, hi) => (
                          <div key={hi} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => {
                                const updated = [...portfolioItems];
                                updated[index].highlights[hi] = e.target.value;
                                setPortfolioItems(updated);
                              }}
                              className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                              placeholder="e.g. Handled 10k concurrent users"
                            />
                            {item.highlights.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...portfolioItems];
                                  updated[index].highlights = updated[index].highlights.filter((_, i) => i !== hi);
                                  setPortfolioItems(updated);
                                }}
                                className="px-3 border border-border hover:bg-muted transition-colors"
                              >
                                <Trash2 size={14} className="text-muted-foreground" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...portfolioItems];
                            updated[index].highlights.push("");
                            setPortfolioItems(updated);
                          }}
                          className="text-xs text-accent hover:underline flex items-center gap-1 mt-1"
                        >
                          <Plus size={12} /> ADD HIGHLIGHT
                        </button>
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                          PROJECT URL
                        </label>
                        <input
                          type="url"
                          value={item.url}
                          onChange={(e) => {
                            const updated = [...portfolioItems];
                            updated[index].url = e.target.value;
                            setPortfolioItems(updated);
                          }}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Proposal */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                    <FileText size={20} className="text-accent" />
                    <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                      YOUR PROPOSAL
                    </h2>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      COVER LETTER *
                    </label>
                    <textarea
                      value={proposal.coverLetter}
                      onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })}
                      rows={8}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                      placeholder={`Dear Hiring Team at ${JOB_DATA.company},

I'm excited to apply for the ${JOB_DATA.title} position. With ${profile.title ? `my background in ${profile.title}` : "years of experience"} and a passion for building scalable systems, I believe I'd be a great fit for this role.

[Your detailed cover letter here...]

Thank you for considering my application. I look forward to hearing from you!`}
                    />
                    {errors.coverLetter && <p className="text-xs text-destructive mt-1">{errors.coverLetter}</p>}
                    <div className="text-xs text-muted-foreground mt-2">
                      {proposal.coverLetter.length} characters
                      {proposal.coverLetter.length < 50 && " · Minimum 50 characters"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        PROPOSED RATE *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center border border-r-0 border-border bg-muted px-3 text-sm">$</span>
                        <input
                          type="text"
                          value={proposal.proposedRate}
                          onChange={(e) => setProposal({ ...proposal, proposedRate: e.target.value })}
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="150"
                        />
                        <span className="inline-flex items-center border border-l-0 border-border bg-muted px-3 text-sm">/hr</span>
                      </div>
                      {errors.proposedRate && <p className="text-xs text-destructive mt-1">{errors.proposedRate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                        ESTIMATED DURATION *
                      </label>
                      <select
                        value={proposal.estimatedDuration}
                        onChange={(e) => setProposal({ ...proposal, estimatedDuration: e.target.value })}
                        className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select duration</option>
                        <option value="less_than_1_month">Less than 1 month</option>
                        <option value="1-3_months">1-3 months</option>
                        <option value="3-6_months">3-6 months</option>
                        <option value="6-12_months">6-12 months</option>
                        <option value="more_than_12_months">More than 12 months</option>
                      </select>
                      {errors.estimatedDuration && <p className="text-xs text-destructive mt-1">{errors.estimatedDuration}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: "'DM Mono', monospace" }}>
                      AVAILABILITY *
                    </label>
                    <select
                      value={proposal.availability}
                      onChange={(e) => setProposal({ ...proposal, availability: e.target.value })}
                      className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                    >
                      <option value="Immediately">Immediately</option>
                      <option value="Within_1_week">Within 1 week</option>
                      <option value="Within_2_weeks">Within 2 weeks</option>
                      <option value="Within_1_month">Within 1 month</option>
                      <option value="Negotiable">Negotiable</option>
                    </select>
                  </div>

                  <div className="mt-6 border-t border-border pt-6">
                    <label className="block text-xs font-bold mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                      ATTACHMENTS
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border p-8 text-center hover:border-accent transition-colors cursor-pointer"
                    >
                      <Upload size={24} className="mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Upload files</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, PNG, JPG up to 10MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      />
                    </div>

                    {proposal.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {proposal.attachments.map((file) => (
                          <div key={file.id} className="flex items-center justify-between border border-border p-3">
                            <div className="flex items-center gap-3">
                              <FileText size={16} className="text-accent" />
                              <div>
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-muted-foreground ml-3">{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAttachment(file.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Screening Questions */}
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                    <Target size={20} className="text-accent" />
                    <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                      SCREENING QUESTIONS
                    </h2>
                    <span className="text-xs text-muted-foreground ml-auto">Required</span>
                  </div>

                  {SCREENING_QUESTIONS.map((q) => (
                    <div key={q.id} className="mb-4 last:mb-0">
                      <label className="block text-sm font-medium mb-2">
                        {q.question}
                        {q.required && <span className="text-accent ml-1">*</span>}
                      </label>
                      {q.type === "text" && (
                        <input
                          type="text"
                          value={screeningAnswers[q.id] || ""}
                          onChange={(e) => setScreeningAnswers({ ...screeningAnswers, [q.id]: e.target.value })}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                          placeholder="Your answer..."
                        />
                      )}
                      {q.type === "textarea" && (
                        <textarea
                          value={screeningAnswers[q.id] || ""}
                          onChange={(e) => setScreeningAnswers({ ...screeningAnswers, [q.id]: e.target.value })}
                          rows={3}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors resize-none"
                          placeholder="Your answer..."
                        />
                      )}
                      {q.type === "select" && q.options && (
                        <select
                          value={screeningAnswers[q.id] || ""}
                          onChange={(e) => setScreeningAnswers({ ...screeningAnswers, [q.id]: e.target.value })}
                          className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
                        >
                          <option value="">Select an option</option>
                          {q.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                      {q.type === "file" && (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-border p-4 text-center hover:border-accent transition-colors cursor-pointer"
                        >
                          <Upload size={16} className="mx-auto text-muted-foreground mb-2" />
                          <p className="text-xs text-muted-foreground">Click to upload</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-card border border-border p-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
                    <Eye size={20} className="text-accent" />
                    <h2 className="text-sm font-bold tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>
                      REVIEW YOUR APPLICATION
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Summary */}
                    <div>
                      <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                        PROFILE
                      </h3>
                      <div className="bg-muted p-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Name</span>
                          <p className="font-medium">
                            {profile.firstName} {profile.lastName}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email</span>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Title</span>
                          <p className="font-medium">{profile.title || "—"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location</span>
                          <p className="font-medium">{profile.location || "—"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Experience Summary */}
                    {experiences.some((e) => e.title || e.company) && (
                      <div>
                        <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                          EXPERIENCE
                        </h3>
                        <div className="space-y-3">
                          {experiences
                            .filter((e) => e.title || e.company)
                            .map((exp, i) => (
                              <div key={i} className="bg-muted p-4">
                                <p className="font-medium">
                                  {exp.title} at {exp.company}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {exp.location}
                                  {exp.startDate && ` · ${exp.startDate}`}
                                  {exp.endDate && ` - ${exp.endDate}`}
                                  {exp.current && " · Present"}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Summary */}
                    {skills.some((s) => s.name) && (
                      <div>
                        <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                          SKILLS
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {skills
                            .filter((s) => s.name)
                            .map((skill) => (
                              <span key={skill.id} className="border border-border px-3 py-1 text-sm">
                                {skill.name}
                                <span className="text-muted-foreground ml-2">{"⭐".repeat(skill.level)}</span>
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Proposal Summary */}
                    <div>
                      <h3 className="text-xs font-bold tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
                        PROPOSAL
                      </h3>
                      <div className="bg-muted p-4 space-y-2">
                        <div>
                          <span className="text-muted-foreground">Rate</span>
                          <p className="font-medium">${proposal.proposedRate}/hr</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration</span>
                          <p className="font-medium">{proposal.estimatedDuration.replace(/_/g, " ")}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Availability</span>
                          <p className="font-medium">{proposal.availability.replace(/_/g, " ")}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cover Letter</span>
                          <p className="text-sm mt-1 line-clamp-3">{proposal.coverLetter}</p>
                        </div>
                        {proposal.attachments.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">Attachments</span>
                            <p className="text-sm">{proposal.attachments.length} file(s)</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/5 border border-accent/20 p-6 flex items-start gap-4">
                  <Shield size={20} className="text-accent shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold">Before you submit</h4>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent" />
                        Your application is complete and ready to submit
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent" />
                        You will receive a confirmation email
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={14} className="text-accent" />
                        You can track your application in your dashboard
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <button
                type="button"
                onClick={currentStep === 1 ? () => router.push("/") : prevStep}
                className="text-sm font-bold hover:text-accent transition-colors flex items-center gap-2"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {currentStep === 1 ? "← CANCEL" : "← BACK"}
              </button>

              <div className="flex gap-3">
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-accent text-accent-foreground px-8 py-3 text-sm font-bold tracking-widest hover:bg-accent/90 transition-colors"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
                  >
                    CONTINUE →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 text-sm font-bold tracking-widest transition-colors flex items-center gap-2 ${
                      isSubmitting ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.1em" }}
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
