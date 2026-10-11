import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { fill, getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { SOCIAL_PROFILES, type SocialId } from "@/lib/social";
import { cn } from "@/lib/utils";
import { BRAND_GLYPH_VIEWBOX, INSTAGRAM_GRADIENT_ID, socialRef } from "./social-glyphs";
import styles from "./SocialLinks.module.css";

/**
 * Hit area and glyph size: the header's compact row (a little tighter from
 * 1024 to 1279px, where the header is fullest), the footer's, the mobile menu's.
 */
const SIZES = {
  header: { box: "size-9 lg:size-8 xl:size-9", glyph: "size-[18px]" },
  footer: { box: "size-11", glyph: "size-[22px]" },
  menu: { box: "size-12", glyph: "size-6" },
} as const;

/**
 * DataHub's four social profiles — Instagram, Facebook, TikTok, LinkedIn —
 * as their brand marks in their own colours (iteration-3 §A): in the header,
 * the footer and the mobile menu. The marks are logos, so the no-box law
 * does not apply to them.
 *
 * Each links to the profile set in src/lib/social.ts, in a new tab, named
 * "DataHub on Instagram" (in the page's language). A profile with no address
 * yet still shows its icon, as an image named "Instagram: link coming soon",
 * not as a link that goes nowhere.
 *
 * The glyphs are drawn from <SocialSprite> (rendered once by the layout).
 */
export async function SocialLinks({
  lang,
  size,
  className,
}: {
  lang: Locale;
  size: keyof typeof SIZES;
  className?: string;
}) {
  const t = await getDictionary(lang);
  const x = chromeExtra[lang].social;
  const s = SIZES[size];
  const box = cn("inline-flex items-center justify-center", s.box);

  return (
    <ul aria-label={x.label} className={cn("flex items-center", className)}>
      {SOCIAL_PROFILES.map((p) => (
        <li key={p.id} className="flex">
          {p.href ? (
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${fill(x.profile, { network: p.name })} ${t.a11y.opensNewTab}`}
              className={cn(box, styles.link)}
            >
              <SocialGlyph id={p.id} className={s.glyph} />
            </a>
          ) : (
            <span role="img" aria-label={fill(x.pending, { network: p.name })} className={box}>
              <SocialGlyph id={p.id} className={s.glyph} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

const fillOf = (color: string): CSSProperties => ({ fill: color });

/**
 * One network's mark on the 24×24 grid. TikTok's is three copies of its
 * note: cyan up and to the left, red down and to the right, the note itself
 * on top in black (light theme) or white (dark).
 *
 * Facebook's "f" and LinkedIn's "in" are cut out of their blue shapes, so
 * on their own they would show the page through: a dark "f" in dark mode.
 * In both logos they are white, so a white shape lies under each, inset a
 * little so no white fringe shows round the blue's softened edge.
 */
function SocialGlyph({ id, className }: { id: SocialId; className?: string }) {
  const href = socialRef(id);
  return (
    <svg
      viewBox={BRAND_GLYPH_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      className={cn("block overflow-visible", styles.glyph, className)}
    >
      {id === "instagram" && <use href={href} style={fillOf(`url(#${INSTAGRAM_GRADIENT_ID})`)} />}
      {id === "facebook" && (
        <>
          <circle cx="12" cy="12" r="11.6" className={styles.underlay} />
          <use href={href} style={fillOf("var(--brand-facebook)")} />
        </>
      )}
      {id === "linkedin" && (
        <>
          <rect x="1.2" y="1.2" width="21.6" height="21.6" rx="1.5" className={styles.underlay} />
          <use href={href} style={fillOf("var(--brand-linkedin)")} />
        </>
      )}
      {id === "tiktok" && (
        <>
          <use href={href} transform="translate(-0.75 -0.6)" style={fillOf("var(--brand-tiktok-cyan)")} />
          <use href={href} transform="translate(0.75 0.6)" style={fillOf("var(--brand-tiktok-red)")} />
          <use href={href} style={fillOf("var(--brand-tiktok)")} />
        </>
      )}
    </svg>
  );
}
