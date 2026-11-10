"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type CompanyFormState = {
  name: string;
  description: string;
  logo: string;
  logoColor: string;
  employees: string;
  industry: string;
  founded: string;
  website: string;
  address: string;
};

const initialState: CompanyFormState = {
  name: "",
  description: "",
  logo: "",
  logoColor: "#000000",
  employees: "",
  industry: "",
  founded: "",
  website: "",
  address: "",
};

const industryOptions = [
  "Software & SaaS",
  "Fintech",
  "E-commerce",
  "Healthcare",
  "Education",
  "AI & Machine Learning",
  "Cybersecurity",
  "Web3 & Crypto",
  "Design & Creative",
  "Other",
];

const employeeRanges = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

const inputBase = "w-full rounded border bg-input-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-ring/20";
const inputOk = "border-border focus:border-ring";
const inputErr = "border-red-500 focus:border-red-500";

export default function CompanyDetailsForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const router = useRouter();
  const [form, setForm] = useState<CompanyFormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update =
    <K extends keyof CompanyFormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  function validate(values: CompanyFormState) {
    const next: Partial<Record<keyof CompanyFormState, string>> = {};
    if (!values.name.trim()) next.name = "Company name is required.";
    else if (values.name.length > 80) next.name = "Keep the name under 80 characters.";

    if (!values.description.trim()) next.description = "A short description is required.";
    else if (values.description.length < 20) next.description = "Please write at least 20 characters.";
    else if (values.description.length > 1000) next.description = "Keep the description under 1000 characters.";

    if (values.website && !/^https?:\/\/.+/i.test(values.website)) next.website = "Enter a full URL starting with http:// or https://";

    if (values.founded && !/^\d{4}$/.test(values.founded)) next.founded = "Enter a 4-digit year.";

    if (values.logoColor && !/^#[0-9a-f]{6}$/i.test(values.logoColor)) next.logoColor = "Use a valid hex color like #ff2b00.";

    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Something went wrong. Try again.");
      }
      router.push(callbackUrl);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full p-6 space-y-10 border rounded shadow-sm border-border bg-card md:p-10">
      {serverError && (
        <div role="alert" className="px-4 py-3 text-sm text-red-600 border rounded border-red-500/30 bg-red-500/10">
          {serverError}
        </div>
      )}

      {/* Identity */}
      <section className="space-y-6">
        <SectionHeading title="Company identity" subtitle="How candidates will recognize you." />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:items-center">
            <div
              className="flex items-center justify-center w-20 h-20 overflow-hidden text-2xl font-bold text-white border rounded border-border"
              style={{ backgroundColor: form.logoColor }}
            >
              {form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.logo} alt="Logo preview" className="object-cover w-full h-full" />
              ) : (
                (form.name.charAt(0) || "?").toUpperCase()
              )}
            </div>
          </div>

          <div className="flex-1 gap-2 max-sm:space-y-4 sm:flex sm:items-center">
            <Field id="logo" label="Logo URL" error={errors.logo}>
              <input
                id="logo"
                type="url"
                value={form.logo}
                onChange={update("logo")}
                placeholder="https://yourcompany.com/logo.png"
                className={`${inputBase} ${errors.logo ? inputErr : inputOk}`}
              />
            </Field>

            <Field id="logoColor" label="Brand color" error={errors.logoColor}>
              <div className="relative">
                <input
                  id="logoColor"
                  type="color"
                  value={form.logoColor}
                  onChange={update("logoColor")}
                  className="absolute p-px bg-transparent rounded cursor-pointer left-1 top-1 h-9 w-9"
                />
                <input
                  type="text"
                  value={form.logoColor}
                  onChange={update("logoColor")}
                  placeholder="#000000"
                  className={`${inputBase} pl-13 ${errors.logoColor ? inputErr : inputOk} font-mono text-sm uppercase`}
                />
              </div>
            </Field>
          </div>
        </div>

        <Field id="name" label="Company name" required error={errors.name}>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="e.g. Northwind Labs"
            maxLength={80}
            required
            className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
          />
        </Field>

        <Field id="description" label="Short description" required hint={`${form.description.length}/1000 characters`} error={errors.description}>
          <textarea
            id="description"
            value={form.description}
            onChange={update("description")}
            rows={5}
            maxLength={1000}
            placeholder="What does your company do? What's it like to work there?"
            required
            className={`${inputBase} ${errors.description ? inputErr : inputOk} resize-none`}
          />
        </Field>
      </section>

      {/* Facts */}
      <section className="pt-8 space-y-6 border-t border-border">
        <SectionHeading title="Company facts" subtitle="Quick signals candidates use to filter." />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Field id="industry" label="Industry" error={errors.industry}>
            <select id="industry" value={form.industry} onChange={update("industry")} className={`${inputBase} ${inputOk}`}>
              <option value="">Select an industry</option>
              {industryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </Field>

          <Field id="employees" label="Company size" error={errors.employees}>
            <select id="employees" value={form.employees} onChange={update("employees")} className={`${inputBase} ${inputOk}`}>
              <option value="">Select a range</option>
              {employeeRanges.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} employees
                </option>
              ))}
            </select>
          </Field>

          <Field id="founded" label="Founded" error={errors.founded}>
            <input
              id="founded"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={form.founded}
              onChange={update("founded")}
              placeholder="2018"
              className={`${inputBase} ${errors.founded ? inputErr : inputOk}`}
            />
          </Field>

          <Field id="website" label="Website" error={errors.website}>
            <input
              id="website"
              type="url"
              value={form.website}
              onChange={update("website")}
              placeholder="https://yourcompany.com"
              className={`${inputBase} ${errors.website ? inputErr : inputOk}`}
            />
          </Field>
        </div>

        <Field id="address" label="Headquarters address" hint="City, region, or full address. Optional." error={errors.address}>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={update("address")}
            placeholder="San Francisco, CA"
            className={`${inputBase} ${errors.address ? inputErr : inputOk}`}
          />
        </Field>
      </section>

      {/* Submit */}
      <section className="flex flex-col-reverse gap-3 pt-8 border-t border-border sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setForm(initialState)}
          disabled={submitting}
          className="px-6 py-3 text-sm font-semibold transition border rounded border-border hover:bg-secondary disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-3 text-sm font-semibold transition rounded bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Creating profile…" : "Create company profile →"}
        </button>
      </section>
    </form>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="block font-medium">
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
