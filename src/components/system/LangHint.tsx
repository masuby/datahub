import { headers } from "next/headers";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { langHintScript } from "./lang-hint";
import { FirstLoadOnly, LangHintLine } from "./LangSwitch";

/**
 * One dismissible line under the header suggesting the other language (§6.12).
 *
 * Shown on English pages when the visitor last chose Kiswahili, or on a first
 * visit from a browser set to Kiswahili; on Kiswahili pages when they last
 * chose English. Dismissal is kept in localStorage["dh-lang-hint"]. The
 * decision needs the visitor's browser: a small inline script makes it before
 * first paint (lang-hint.ts) and marks <html>, so the page is laid out with
 * room for the line; the line itself appears once React is running. The
 * script carries the per-request CSP nonce, as ThemeScript does, and is only
 * in the page as first loaded: a later page change keeps the mark on <html>.
 */
export async function LangHint({ lang }: { lang: Locale }) {
  const t = (await getDictionary(lang)).langHint;
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const toSw = lang === "en";
  return (
    <>
      <FirstLoadOnly>
        <script
          nonce={nonce}
          // React does not serialise `nonce` to the client tree, so the attribute
          // always differs between server HTML and client render.
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: langHintScript(lang) }}
        />
      </FirstLoadOnly>
      <LangHintLine
        lang={lang}
        text={toSw ? t.toSw : t.toEn}
        linkText={toSw ? t.toSwLink : t.toEnLink}
        dismissLabel={t.dismiss}
      />
    </>
  );
}
