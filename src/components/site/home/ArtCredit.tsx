import type { Locale } from "@/i18n/config";
import { pagesExtra } from "@/i18n/extra/pages";
import { cn } from "@/lib/utils";
import { LIQUID_GLASS_LICENSE, PAPER_SHADERS_NOTICE } from "./home-art";
import styles from "./home.module.css";

/** A licence's paragraphs, its hard line breaks undone so they reflow at any width. */
const paragraphs = (text: string) => text.split("\n\n").map((p) => p.replace(/\n/g, " "));

/** Each work the site ships, with the notice its licence asks to travel with it. */
const CREDITS = [
  { name: "Glass buttons: liquid-glass-react (MIT)", text: paragraphs(LIQUID_GLASS_LICENSE) },
  { name: "Liquid metal and gradient: Paper Shaders (Apache-2.0)", text: paragraphs(PAPER_SHADERS_NOTICE) },
];

/**
 * The credits the licences of the site's open-source parts ask for (the
 * glass buttons' refraction, the liquid-metal and gradient shaders), on the
 * page that serves them: a quiet disclosure at the foot of the tile sections
 * ("+ Credits and licences"), centred like the tiles, that opens on each
 * notice — word for word, so in English on /sw as well (lang="en"), and
 * left-aligned, as reading text is. The 3D icons are the owner's own and
 * need no credit. Native <details>: no script, no file of its own.
 *
 * The + / − is drawn on an aria-hidden span: the summary's name stays
 * "Credits and licences" ("Shukrani na leseni"), the same open or closed,
 * and screen readers announce the state from <details> itself. (Generated
 * content on the summary itself would be read as part of its name.)
 */
export function ArtCredit({ lang, className }: { lang: Locale; className?: string }) {
  const c = pagesExtra[lang].home.credit;
  return (
    <details className={cn(styles.credit, className)}>
      <summary className="t-data">
        <span aria-hidden="true" className={styles.sign} />
        {c.summary}
      </summary>
      <div className={styles.licence}>
        <p className="t-data text-muted">{c.note}</p>
        {CREDITS.map((credit) => (
          <div key={credit.name} lang="en" className="t-data mt-3 space-y-3 text-muted">
            <p className="text-fg">{credit.name}</p>
            {credit.text.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}
