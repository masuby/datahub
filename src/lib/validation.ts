import { z } from "zod";

/**
 * What the "Interested in" checkboxes can send, in the order the form lists
 * them. A submission's choices are stored in this order, whatever order they
 * were ticked in. src/components/site/ContactForm.tsx keeps its own copy (it
 * cannot import this module without shipping zod to the browser). Change
 * both together: an option only the form knows is refused with a 422.
 */
export const SERVICE_VALUES = [
  "dashboards",
  "automation",
  "custom-software",
  "other",
] as const;
export type ServiceValue = (typeof SERVICE_VALUES)[number];

/** Comfortably above the longest real list ("dashboards,automation,custom-software,other": 43). */
const SERVICE_LIST_MAX = 80;

/**
 * `service` is a comma-separated list of SERVICE_VALUES: "automation",
 * "dashboards,custom-software", or "" / absent for no choice. A single value
 * is the format the form sent while it had radio buttons, so older pages
 * still validate. Every entry must be a known value (no blanks: "dashboards,"
 * is refused); at most one entry per option; duplicates collapse. The output
 * is the canonical list, deduplicated and in SERVICE_VALUES order, which is
 * what the database stores.
 */
const serviceList = z
  .string()
  .trim()
  .max(SERVICE_LIST_MAX, "Service list is too long.")
  .transform((s) => (s ? s.split(",").map((v) => v.trim()) : []))
  .pipe(
    z
      .array(z.enum(SERVICE_VALUES, "Please choose from the listed services."))
      .max(SERVICE_VALUES.length, "Too many services."),
  )
  .transform((list) => SERVICE_VALUES.filter((v) => list.includes(v)).join(","));

/**
 * Server-side contact schema. This is the single source of truth for what the
 * /api/contact endpoint will accept. Everything is length-bounded and trimmed to
 * keep the attack surface small and to prevent oversized payloads.
 *
 * `website` is a honeypot field: real users never see or fill it. If it has any
 * value, we treat the submission as a bot.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Please enter a valid email.")
    .max(160, "Email is too long.")
    .email("Please enter a valid email."),
  company: z
    .string()
    .trim()
    .max(140, "Company name is too long.")
    .optional()
    .or(z.literal("")),
  // Tanzanian leads overwhelmingly prefer a phone/WhatsApp callback to email.
  // Kept permissive (digits, spaces, +, -, parentheses) rather than locked to a
  // single country format, so international enquiries are not rejected.
  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long.")
    .regex(/^[0-9+()\s-]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  service: serviceList.optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(4000, "Message is too long."),
  // Campaign attribution. Set by the client from ?ref= / ?utm_source= on the
  // landing URL, so we can tell which channel actually produces leads. Bounded
  // and slug-only — it is untrusted client input and ends up in a notification
  // email, so it must never carry arbitrary text.
  source: z
    .string()
    .trim()
    .toLowerCase()
    .max(40)
    .regex(/^[a-z0-9_-]*$/)
    .optional()
    .or(z.literal("")),
  // Honeypot — accepted by the schema so validation never reveals it exists.
  // The route silently drops the submission when this is non-empty.
  website: z.string().max(200).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** The options as the English form labels them, for the notification email. */
export const SERVICE_LABELS: Record<ServiceValue, string> = {
  dashboards: "Dashboards & business intelligence",
  automation: "Reporting automation",
  "custom-software": "AI agents & custom software",
  other: "Not sure yet",
};

/**
 * A stored list as readable labels: "dashboards,other" → ["Dashboards &
 * business intelligence", "Not sure yet"]. An entry this version does not
 * know (an older or hand-edited row) is shown as it is rather than dropped.
 */
export function serviceLabels(list: string | null | undefined): string[] {
  if (!list) return [];
  return list
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v) => (Object.hasOwn(SERVICE_LABELS, v) ? SERVICE_LABELS[v as ServiceValue] : v));
}
