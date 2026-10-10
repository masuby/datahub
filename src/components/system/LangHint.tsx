import type { Locale } from "@/i18n/config";

/** STUB — replaced by the chrome build slice. Contract: client-only one-line language suggestion; renders nothing on the server. */
export async function LangHint({ lang }: { lang: Locale }) {
  void lang;
  return null;
}
