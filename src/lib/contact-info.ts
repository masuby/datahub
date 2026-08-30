/**
 * Single source of truth for the public contact details shown on the site.
 *
 * These are read from NEXT_PUBLIC_* env vars so they can be changed without a
 * code edit — but they must be referenced as full literals (not
 * `process.env[key]`) because Next.js inlines NEXT_PUBLIC_ values at build time.
 *
 * WhatsApp is intentionally optional: if NEXT_PUBLIC_WHATSAPP_NUMBER is unset,
 * every WhatsApp affordance disappears rather than rendering a broken link.
 */

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@datahub.co.tz";

/** Digits only, including country code, e.g. "255712345678". */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
).replace(/[^0-9]/g, "");

/** Human-readable form for display, e.g. "+255 712 345 678". */
export const WHATSAPP_DISPLAY =
  process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ??
  (WHATSAPP_NUMBER ? `+${WHATSAPP_NUMBER}` : "");

const WHATSAPP_GREETING =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  "Hello DataHub, I saw your post and I would like to talk about dashboards / automation for my business.";

/**
 * wa.me deep link with a pre-filled first message. Empty string when no number
 * is configured — callers guard on WHATSAPP_NUMBER before rendering.
 */
export const WHATSAPP_HREF = WHATSAPP_NUMBER
  ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GREETING)}`
  : "";
