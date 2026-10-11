import "server-only";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { dashExtra } from "@/i18n/extra/dashboards";
import type { DashCtx } from "./context";

/** Builds the rendering context for a service page's sample figures (server only). */
export async function makeDashCtx(lang: Locale, idp: string): Promise<DashCtx> {
  const dict = await getDictionary(lang);
  return {
    lang,
    t: dict.dash,
    x: dashExtra[lang],
    figurePrefix: dict.alt.figurePrefix,
    idp,
  };
}
