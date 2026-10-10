import type { Locale } from "@/i18n/config";

/** STUB — replaced by the process-security build slice. Contract: section 04, id=process. */
export async function Process({ lang }: { lang: Locale }) {
  void lang;
  return <section id="process" />;
}
