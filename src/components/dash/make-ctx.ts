import "server-only";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { dashExtra } from "@/i18n/extra/dashboards";
import type { DashCtx } from "./context";

/** Builds the rendering context for the sample dashboards (server only). */
export async function makeDashCtx(lang: Locale, idp: string, live: boolean): Promise<DashCtx> {
  const dict = await getDictionary(lang);
  return {
    lang,
    t: dict.dash,
    x: dashExtra[lang],
    a11y: dict.a11y,
    figurePrefix: dict.alt.figurePrefix,
    idp,
    live,
  };
}
