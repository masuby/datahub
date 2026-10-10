import type { Locale } from "@/i18n/config";

/** STUB — replaced by the hero build slice. Contract: section 00 incl. ServiceIndex, HeroMark, SilkField/SilkCanvas. */
export async function Hero({ lang }: { lang: Locale }) {
  void lang;
  return <section id="top" aria-label="DataHub" />;
}
