import type { Locale } from "./config";

/**
 * Per-section dictionaries.
 *
 * Every section owns one file in src/i18n/dictionaries/ that exports its
 * strings for both languages through `defineDict`. The English object defines
 * the shape; the Kiswahili object is type-checked against it, so a missing,
 * extra or misspelled key is a compile error rather than a blank on the page.
 *
 * Dictionaries are imported by Server Components only. A Client Component
 * receives the strings for the current locale as props, so the browser never
 * downloads the language it is not showing.
 */

/** Literal types widened: the Kiswahili text need only match the shape. */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends readonly (infer U)[]
      ? readonly Widen<U>[]
      : T extends object
        ? { readonly [K in keyof T]: Widen<T[K]> }
        : T;

export type Localized<T> = Record<Locale, Widen<T>>;

export function defineDict<const E>(dict: { en: E; sw: NoInfer<Widen<E>> }): Localized<E> {
  return dict as Localized<E>;
}
