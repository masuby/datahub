import type { Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { cn } from "@/lib/utils";
import { FLUENT_EMOJI_LICENSE, LIQUID_GLASS_LICENSE, PAPER_SHADERS_NOTICE } from "./home-art";
import styles from "./home.module.css";

/** A licence's paragraphs, its hard line breaks undone so they reflow at any width. */
const paragraphs = (text: string) => text.split("\n\n").map((p) => p.replace(/\n/g, " "));

/** Each work the site ships, with the notice its licence asks to travel with it. */
const CREDITS = [
  { name: "3D icons: Microsoft Fluent Emoji (MIT)", text: paragraphs(FLUENT_EMOJI_LICENSE) },
  { name: "Glass buttons: liquid-glass-react (MIT)", text: paragraphs(LIQUID_GLASS_LICENSE) },
  { name: "Liquid metal and gradient: Paper Shaders (Apache-2.0)", text: paragraphs(PAPER_SHADERS_NOTICE) },
];

/**
 * The credits the licences of the site's open-source parts ask for (the 3D
 * icons, the glass buttons' refraction, the liquid-metal and gradient
 * shaders), on the page that serves them: a quiet disclosure at the foot of
 * the tile sections ("+ Credits and licences") that opens on each notice —
 * word for word, so in English on /sw as well (lang="en"). Native
 * <details>: no script, no file of its own.
 */
export function ArtCredit({ lang, className }: { lang: Locale; className?: string }) {
  const c = pagesExtra[lang].home.credit;
  return (
    <details className={cn(styles.credit, className)}>
      <summary className="t-data">{c.summary}</summary>
      <p className="t-data text-muted">{c.note}</p>
      {CREDITS.map((credit) => (
        <div key={credit.name} lang="en" className={cn("t-data mt-3 space-y-3", styles.licence)}>
          <p className="text-fg">{credit.name}</p>
          {credit.text.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      ))}
    </details>
  );
}
