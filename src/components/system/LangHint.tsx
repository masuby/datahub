import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { LangHintLine } from "./LangSwitch";

/**
 * One dismissible line under the header suggesting the other language (§6.12).
 *
 * Shown on English pages when the visitor last chose Kiswahili, or on a first
 * visit from a browser set to Kiswahili; on Kiswahili pages when they last
 * chose English. Dismissal is kept in localStorage["dh-lang-hint"]. Renders
 * nothing on the server: the decision needs the visitor's browser.
 */
export async function LangHint({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).langHint;
  const toSw = lang === "en";
  return (
    <LangHintLine
      lang={lang}
      text={toSw ? t.toSw : t.toEn}
      linkText={toSw ? t.toSwLink : t.toEnLink}
      dismissLabel={t.dismiss}
    />
  );
}
