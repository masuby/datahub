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

export { fill } from "./fill";
