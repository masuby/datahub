import "server-only";
import type { Locale } from "./config";
import type { Widen } from "./dict";

/**
 * Dictionaries are loaded on the server only. Client components receive just
 * the sub-tree they render, as props, so the browser never downloads the
 * language it is not showing.
 *
 * English is the source shape; Kiswahili is `satisfies Dictionary`, so a
 * missing, extra or misspelled key fails the build instead of rendering blank.
 */
export type Dictionary = Widen<typeof import("./dictionaries/en").default>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  sw: () => import("./dictionaries/sw").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

/**
 * Fills `{slot}` placeholders. Translations never concatenate fragments in
 * code — word order differs between English and Kiswahili — so every variable
 * part of a sentence is a named slot in the dictionary string.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
