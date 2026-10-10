import type { Locale } from "@/i18n/config";

/**
 * STUB — replaced by the dashboards build slice. Contract: the ink band used on
 * service pages ("See it in a sample", spec §7.4): server component, no tabs,
 * read-mode notes as static numbered lists. `service` picks the figures.
 */
export async function SampleBand({
  lang,
  service,
}: {
  lang: Locale;
  service: "dashboards" | "automation" | "ai-agents";
}) {
  void lang;
  void service;
  return null;
}
