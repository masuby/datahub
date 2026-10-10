import type { Locale } from "@/i18n/config";

/** STUB — replaced by the chrome build slice. Contract: server component, sticky header incl. MobileMenu; nav targets `${localePath(lang, '/')}#<id>`. */
export async function Header({ lang }: { lang: Locale }) {
  void lang;
  return null;
}
