import type { Locale } from "@/i18n/config";

/**
 * Number formatting for the sample dashboards and the hours estimator.
 *
 * Hand-rolled on purpose: Intl's compact notation renders "18B" / "18 bn" /
 * "bil 18" differently across browsers and has no reliable Kiswahili data,
 * and server and client must produce byte-identical text. Kiswahili puts the
 * magnitude word before the number ("TZS bilioni 18.4").
 */

const MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  sw: ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ago", "Sep", "Okt", "Nov", "Des"],
};

/** Short month name; `month` is 0-based. */
export function monthShort(month: number, lang: Locale): string {
  return MONTHS[lang][((month % 12) + 12) % 12];
}

/** 48210 -> "48,210"; decimals kept as given. Comma thousands in both languages. */
export function formatNumber(value: number, decimals = 0): string {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${value < 0 ? "−" : ""}${grouped}${frac ? `.${frac}` : ""}`;
}

/** 4.6 -> "4.6%". */
export function formatPercent(value: number, decimals = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * TZS amounts.
 *   >= 1e9  en "TZS 18.4 bn"   sw "TZS bilioni 18.4"  (2 decimals below 10 bn when asked)
 *   >= 1e6  en "TZS 418 mn"    sw "TZS milioni 418"
 *   <  1e6  "TZS 412,000" in both
 */
export function formatTZS(value: number, lang: Locale, opts: { decimals?: number } = {}): string {
  const abs = Math.abs(value);
  if (abs >= 1e9) {
    const d = opts.decimals ?? 1;
    const n = formatNumber(value / 1e9, d);
    return lang === "sw" ? `TZS bilioni ${n}` : `TZS ${n} bn`;
  }
  if (abs >= 1e6) {
    const d = opts.decimals ?? 0;
    const n = formatNumber(value / 1e6, d);
    return lang === "sw" ? `TZS milioni ${n}` : `TZS ${n} mn`;
  }
  return `TZS ${formatNumber(Math.round(value))}`;
}

/** 288 -> en "288 h", sw "saa 288". */
export function formatHours(value: number, lang: Locale, decimals = 0): string {
  const n = formatNumber(value, decimals);
  return lang === "sw" ? `saa ${n}` : `${n} h`;
}

/** 38 -> en "38 s", sw "sek 38". */
export function formatSeconds(value: number, lang: Locale): string {
  const n = formatNumber(value);
  return lang === "sw" ? `sek ${n}` : `${n} s`;
}
