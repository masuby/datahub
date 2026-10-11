import type { Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { cn } from "@/lib/utils";
import { FLUENT_EMOJI_LICENSE } from "./home-art";
import styles from "./home.module.css";

/** The licence's paragraphs, its hard line breaks undone so they reflow at any width. */
const LICENSE_PARAGRAPHS = FLUENT_EMOJI_LICENSE.split("\n\n").map((p) => p.replace(/\n/g, " "));

/**
 * The credit the 3D icons' MIT licence asks for, on the page that serves
 * them: a quiet disclosure at the foot of the tile sections ("+ 3D icons:
 * Microsoft Fluent Emoji, MIT licence") that opens on the copyright and
 * permission notice — word for word, so in English on /sw as well
 * (lang="en"). Native <details>: no script, no file of its own.
 */
export function ArtCredit({ lang, className }: { lang: Locale; className?: string }) {
  const c = pagesExtra[lang].home.credit;
  return (
    <details className={cn(styles.credit, className)}>
      <summary className="t-data">{c.summary}</summary>
      <p className="t-data text-muted">{c.note}</p>
      <div lang="en" className={cn("t-data mt-3 space-y-3", styles.licence)}>
        {LICENSE_PARAGRAPHS.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>
    </details>
  );
}
