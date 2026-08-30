"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/lib/contact-info";

type Status = "idle" | "submitting" | "success" | "error";

const services = [
  { value: "", label: "What can we help with?" },
  { value: "dashboards", label: "Dashboards & Insights" },
  { value: "automation", label: "Automation" },
  { value: "custom-software", label: "Custom Software" },
  { value: "other", label: "Not sure yet" },
];

const inputClass =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-foreground placeholder:text-muted-2 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-[var(--ring)]";

/**
 * Campaign attribution — reads ?ref= / ?utm_source= from the landing URL so we
 * know which post or channel sent this lead. Read at submit time rather than on
 * mount: the query string does not change while the page is open, so no state
 * or effect is needed. Sanitised here and validated again on the server.
 */
function readSource(): string {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("ref") ?? params.get("utm_source") ?? "";
  return raw.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      service: String(fd.get("service") ?? "") || undefined,
      message: String(fd.get("message") ?? ""),
      source: readSource(),
      website: String(fd.get("hp") ?? ""), // honeypot (field named "hp" to avoid browser autofill)
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        form.reset();
        return;
      }

      if (res.status === 422 && data.issues) {
        setFieldErrors(data.issues);
        setStatus("error");
        setErrorMsg("Please check the highlighted fields.");
        return;
      }

      setStatus("error");
      setErrorMsg(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="grid place-items-center rounded-2xl border border-border bg-surface p-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-accent-2" strokeWidth={1.5} />
        <h3 className="mt-4 text-xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Thanks for reaching out. We&apos;ll get back to you shortly to talk
          through what you need.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-border bg-surface-2 px-5 py-2.5 text-sm font-medium hover:border-accent/50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      {/* Honeypot: hidden from real users, must stay empty. Named "hp" with a
          neutral label and password-manager ignore hints so browser autofill
          won't populate it (a filled value gets the submission silently dropped). */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="hp">Leave this field empty</label>
        <input
          id="hp"
          type="text"
          name="hp"
          tabIndex={-1}
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-form-type="other"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={fieldErrors.name?.[0]}>
          <input name="name" required maxLength={100} placeholder="Your name" className={inputClass} />
        </Field>
        <Field label="Email" error={fieldErrors.email?.[0]}>
          <input
            name="email"
            type="email"
            required
            maxLength={160}
            placeholder="you@company.com"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Phone / WhatsApp" optional error={fieldErrors.phone?.[0]}>
          <input
            name="phone"
            type="tel"
            maxLength={30}
            inputMode="tel"
            placeholder="+255 7XX XXX XXX"
            className={inputClass}
          />
        </Field>
        <Field label="Company" optional error={fieldErrors.company?.[0]}>
          <input name="company" maxLength={140} placeholder="Company name" className={inputClass} />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Interested in" optional error={fieldErrors.service?.[0]}>
          <select name="service" defaultValue="" className={inputClass}>
            {services.map((s) => (
              <option key={s.value} value={s.value} className="bg-surface-2">
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message" error={fieldErrors.message?.[0]}>
          <textarea
            name="message"
            required
            rows={5}
            maxLength={4000}
            placeholder="Tell us about your data, your reports, and what you'd like to automate or visualise…"
            className={`${inputClass} resize-y`}
          />
        </Field>
      </div>

      {status === "error" && errorMsg && (
        <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full accent-gradient px-6 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
      {WHATSAPP_NUMBER && (
        <p className="mt-4 text-center text-xs text-muted-2">
          Prefer to chat?{" "}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent-2 underline-offset-2 hover:underline"
          >
            Message us on WhatsApp
          </a>{" "}
          instead.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-muted-2">
        We only use your details to respond to your enquiry.
      </p>
    </form>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
        {label}
        {optional && <span className="text-xs font-normal text-muted-2">optional</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  );
}
