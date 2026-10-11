import type { Locale } from "@/i18n/config";

/** The visitor's last explicit language choice. Only a click on the switch writes it. */
export const LANG_STORAGE_KEY = "dh-lang";
/** "dismissed" once the language hint has been closed. */
export const HINT_STORAGE_KEY = "dh-lang-hint";
/** On <html> while the language hint is to show; globals.css makes room for it. */
export const HINT_FLAG = "data-lang-hint";

/**
 * The language hint's decision, as an inline script run before first paint
 * (LangHint renders it, with the request's CSP nonce, ahead of <main>).
 *
 * Shown on English pages when the visitor last chose Kiswahili, or on a
 * first visit from a browser set to Kiswahili; on Kiswahili pages when they
 * last chose English; never once dismissed, and never without storage (it
 * could not stay dismissed). The answer goes on <html> as HINT_FLAG, so the
 * page's first section is laid out with room for the hint from the start:
 * it starts close under the header (iteration-5 §C), too close for a 45px
 * line to overlay without covering its eyebrow, and making room only once
 * React had decided would push the page down after it was drawn.
 */
export function langHintScript(lang: Locale): string {
  const show =
    lang === "en"
      ? `var n=(navigator.languages&&navigator.languages[0])||navigator.language||"";var show=s==="sw"||(s===null&&n.toLowerCase().indexOf("sw")===0);`
      : `var show=s==="en";`;
  return `(function(){try{if(localStorage.getItem("${HINT_STORAGE_KEY}")==="dismissed")return;var s=localStorage.getItem("${LANG_STORAGE_KEY}");${show}if(show)document.documentElement.setAttribute("${HINT_FLAG}","")}catch(e){}})()`;
}
