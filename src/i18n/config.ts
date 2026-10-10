/**
 * Locale routing.
 *
 * English keeps the root URLs (`/`, `/services/dashboards`) because every
 * poster, QR code and WhatsApp Status already links there with a `?ref=` tag,
 * and those links must keep working and keep attributing. Kiswahili lives
 * under `/sw`. Internally both render from `app/[lang]`: src/proxy.ts rewrites
 * an un-prefixed request to `/en/...` and redirects a literal `/en/...` back to
 * the root, so there is exactly one URL per page per language.
 */

export const LOCALES = ["en", "sw"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value);

/** BCP 47 tags — `<html lang>`, hreflang and OpenGraph locale. */
export const LANG_TAG: Record<Locale, string> = { en: "en-TZ", sw: "sw-TZ" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_TZ", sw: "sw_TZ" };

/** Native names: the toggle offers each language in its own words. */
export const LOCALE_NAME: Record<Locale, string> = { en: "English", sw: "Kiswahili" };

/**
 * Public path of a page in a locale. `path` is the locale-free path and must
 * start with "/". `localePath("sw", "/services/dashboards")` -> `/sw/services/dashboards`.
 */
export function localePath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Strips a locale prefix from a public pathname: `/sw/services/x` -> `/services/x`. */
export function stripLocale(pathname: string): string {
  for (const l of LOCALES) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** The locale a public pathname belongs to. */
export function localeOf(pathname: string): Locale {
  for (const l of LOCALES) {
    if (l !== DEFAULT_LOCALE && (pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return l;
  }
  return DEFAULT_LOCALE;
}
