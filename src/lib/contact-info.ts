import type { Locale } from "@/i18n/config";

/**
 * Single source of truth for the public contact details shown on the site.
 *
 * These are read from NEXT_PUBLIC_* env vars so they can be changed without a
 * code edit — but they must be referenced as full literals (not
 * `process.env[key]`) because Next.js inlines NEXT_PUBLIC_ values at build time.
 *
 * An empty value counts as unset (`||`, not `??`). The Docker build passes
 * every one of these, as "" when it is not set (docker-compose.yml's
 * `${VAR:-}`, then the Dockerfile's ENV), so with `??` a self-hosted build
 * lost each default below: no address, no number shown, no greeting.
 *
 * WhatsApp is intentionally optional: if NEXT_PUBLIC_WHATSAPP_NUMBER is unset,
 * every WhatsApp affordance disappears rather than rendering a broken link.
 */

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@datahub.co.tz";

/** Digits only, including country code, e.g. "255712345678". */
export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
).replace(/[^0-9]/g, "");

/** Human-readable form for display, e.g. "+255 712 345 678". */
export const WHATSAPP_DISPLAY =
  process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY ||
  (WHATSAPP_NUMBER ? `+${WHATSAPP_NUMBER}` : "");

/**
 * The first message pre-filled in the visitor's WhatsApp, in the language of
 * the page they tapped it on: a visitor reading in Kiswahili should not be
 * handed an English sentence at the moment they write to us.
 */
const WHATSAPP_GREETING: Record<Locale, string> = {
  en:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Hello DataHub, I saw your post and I would like to talk about dashboards / automation for my business.",
  sw:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE_SW ||
    "Habari DataHub, nimeona chapisho lenu na ningependa kuzungumza kuhusu dashibodi au otomatiki kwa biashara yangu.",
};

/**
 * wa.me deep link with the pre-filled first message for `lang`. Empty string
 * when no number is configured — callers guard on WHATSAPP_NUMBER before
 * rendering, or render nothing for "".
 */
export function whatsappHref(lang: Locale): string {
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GREETING[lang])}`
    : "";
}
