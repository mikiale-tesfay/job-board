"use client";

import { FormEvent, useState } from "react";

type FormState = {
  companyName: string;
  website: string;
  industry: string;
  size: string;
  founded: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  terms: boolean;
};

const initialState: FormState = {
  companyName: "",
  website: "",
  industry: "",
  size: "",
  founded: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  contactEmail: "",
  contactPhone: "",
  terms: false,
};

export default function ClientRegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const update =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: call your API route here, e.g. POST /api/clients
    console.log("Client registration:", form);
    setSubmitted(true);
  };

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 shadow-sm">
      <h3 className="mb-6 text-2xl font-bold">Company details</h3>

      {submitted && (
        <div className="px-4 py-3 mb-6 text-sm text-green-700 border rounded-xl border-green-600/30 bg-green-500/10 dark:text-green-300">
          Thanks! Your client registration was submitted (demo).
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company name */}
        <div>
          <label htmlFor="companyName" className="mb-1.5 block font-medium">
            Company name
          </label>
          <input
            id="companyName"
            type="text"
            required
            value={form.companyName}
            onChange={update("companyName")}
            placeholder="e.g. Acme Inc."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
          />
        </div>

        {/* Website + Industry */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="website" className="mb-1.5 block font-medium">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={form.website}
              onChange={update("website")}
              placeholder="https://"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
            />
          </div>
          <div>
            <label htmlFor="industry" className="mb-1.5 block font-medium">
              Industry
            </label>
            <input
              id="industry"
              type="text"
              value={form.industry}
              onChange={update("industry")}
              placeholder="e.g. SaaS, Fintech"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
            />
          </div>
        </div>

        {/* Size + Founded */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="size" className="mb-1.5 block font-medium">
              Company size
            </label>
            <select
              id="size"
              value={form.size}
              onChange={update("size")}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
            >
              <option value="">Select range</option>
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
              <option>201-500</option>
              <option>500+</option>
            </select>
          </div>
          <div>
            <label htmlFor="founded" className="mb-1.5 block font-medium">
              Founded year
            </label>
            <input
              id="founded"
              type="text"
              value={form.founded}
              onChange={update("founded")}
              placeholder="e.g. 2018"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
            />
          </div>
        </div>

        {/* Address */}
        <div className="pt-2">
          <h4 className="mb-3 text-lg font-semibold">Company address</h4>
          <div className="space-y-4">
            <div>
              <label htmlFor="street" className="mb-1.5 block font-medium">
                Street address
              </label>
              <input
                id="street"
                type="text"
                value={form.street}
                onChange={update("street")}
                placeholder="123 Main St"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="mb-1.5 block font-medium">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={update("city")}
                  placeholder="San Francisco"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
                />
              </div>
              <div>
                <label htmlFor="state" className="mb-1.5 block font-medium">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={update("state")}
                  placeholder="CA"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zip" className="mb-1.5 block font-medium">
                  ZIP / Postal code
                </label>
                <input
                  id="zip"
                  type="text"
                  value={form.zip}
                  onChange={update("zip")}
                  placeholder="94107"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
                />
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block font-medium">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={update("country")}
                  placeholder="United States"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="pt-2">
          <h4 className="mb-3 text-lg font-semibold">Contact information</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="contactEmail" className="mb-1.5 block font-medium">
                Contact email
              </label>
              <input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={update("contactEmail")}
                placeholder="hiring@company.com"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="mb-1.5 block font-medium">
                Phone number
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={update("contactPhone")}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-background)] px-4 py-3 outline-none transition focus:border-[var(--color-ring)] focus:ring-2 focus:ring-[var(--color-ring)]/20"
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 pt-2">
          <input type="checkbox" id="terms" required checked={form.terms} onChange={update("terms")} className="mt-1 accent-[var(--color-accent)]" />
          <label htmlFor="terms" className="text-sm font-normal text-[var(--color-muted-foreground)]">
            I agree to the{" "}
            <a href="#" className="text-[var(--color-accent)] underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[var(--color-accent)] underline">
              Privacy Policy
            </a>
            .
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-full bg-[var(--color-accent)] py-3 text-lg font-semibold text-[var(--color-accent-foreground)] transition hover:opacity-90"
        >
          Register as Client →
        </button>
        <p className="mt-3 text-center text-xs text-[var(--color-muted-foreground)]">You&apos;ll be able to post your first job immediately.</p>
      </form>
    </div>
  );
}
