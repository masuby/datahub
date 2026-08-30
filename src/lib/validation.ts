import { z } from "zod";

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
  service: z
    .enum(["dashboards", "automation", "custom-software", "other"])
    .optional(),
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

export const SERVICE_LABELS: Record<string, string> = {
  dashboards: "Dashboards & Insights",
  automation: "Automation",
  "custom-software": "Custom Software",
  other: "Other / Not sure yet",
};
