import type { CSSProperties } from "react";
import { localePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { heroExtra } from "@/i18n/extra/hero";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { ButtonPrimary } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { HeroMark } from "@/components/brand/HeroMark";
import { SilkField } from "@/components/silk/SilkField";
import { HeroLive } from "@/components/hero/HeroLive";
import { HeroShaders } from "@/components/hero/HeroShaders";
import { HeroWords } from "@/components/hero/HeroWords";
import { OUTFIT_ADVANCE, OUTFIT_UPM } from "@/components/hero/outfit-metrics";
import { PRESETS } from "@/lib/silk";
import { cn } from "@/lib/utils";
import { HeroPause, HeroSilk } from "./HeroMotion";
import styles from "./Hero.module.css";

const DESKTOP = PRESETS["hero-desktop"];

/** .t-display tracking (-0.04em), applied after every character. */
const TRACKING = -0.04;

/**
 * Width of a line of the headline in em, from Outfit 700's advances, plus a
 * little for ink beyond the last advance. The headline sizes itself so its
 * widest line (the first line or the longest word) fits its column, down to
 * a 320px phone: the word line never wraps.
 */
function lineEm(text: string): number {
  let em = 0.08;
  for (const ch of text) em += (OUTFIT_ADVANCE[ch] ?? 0.6 * OUTFIT_UPM) / OUTFIT_UPM + TRACKING;
  return em;
}

/**
 * 00 Hero (spec §6.1, iteration-2 §B): what DataHub is, in five seconds,
 * with the brand board alive — data arrives as silk and points of light,
 * flows into the waving hand of the mark, and leaves as the straight
 * hairline the hero stands on.
 *
 * Back to front on desktop: the wash (CSS), the dot field, the silk layer
 * (static SVG, then the Canvas2D drift — with its travelling lights and a
 * few twinkling dots of the field — when the device can afford it), a soft
 * glow behind the mark, the mark at the silk's sink, the text, the pause
 * control, the floor rule the decision filament lands on. Phones stack the
 * text on plain background, then a 300px band with the field, the silk and
 * the mark.
 *
 * The services are not listed here: the home page's next section does that
 * (iteration-2 §D, no claim twice).
 *
 * The LCP element is server-rendered text: the H1's first line on desktop,
 * the one-sentence lead on phones. The H1's first line is static; its
 * second is one word that writes itself (HeroWords) — the first word as
 * plain text until the browser is idle. The H1's accessible name is
 * constant: every word, in one sentence.
 */
export async function Hero({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const h = t.hero;
  const x = heroExtra[lang];
  const motionLabels = { pause: t.motion.pause, resume: t.motion.resume };
  const fitEm = Math.max(lineEm(x.title.line1), ...x.title.words.map(lineEm)).toFixed(3);

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      data-glass-zone=""
      // While the hero moves, the buttons keep their CSS glass (GlassSurface).
      data-glass-quiet=""
      className={cn("relative isolate flex flex-col", styles.hero)}
    >
      <HeroLive sectionId="top" />
      <HeroShaders sectionId="top" />
      {/* Stage: everything above the floor rule. Its bottom is the rule. */}
      <div className={cn("relative flex flex-1 flex-col", styles.stage, styles.scope)}>
        {/* Mesh gradient host (HeroShaders): empty, and stays so without WebGL. */}
        <div aria-hidden="true" data-mesh-host="lg" className={cn("pointer-events-none absolute inset-0 hidden lg:block", styles.mesh)} />
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 hidden lg:block", styles.field)} />
        <div
          aria-hidden="true"
          className={cn("silk-layer pointer-events-none absolute inset-0 hidden lg:block", styles.safe, styles.still)}
        >
          {/* Stretched (not sliced) onto the layer, so the sink lands on the
              mark and the decision filament lands on the floor rule at every
              aspect ratio; strokes stay 1px (non-scaling-stroke). */}
          <svg
            viewBox={`0 0 ${DESKTOP.W} ${DESKTOP.H}`}
            preserveAspectRatio="none"
            className="block size-full"
            focusable="false"
          >
            <SilkField preset="hero-desktop" />
          </svg>
        </div>
        <HeroSilk
          preset="hero-desktop"
          fit="fill"
          media="(min-width: 1024px)"
          lights
          className={cn("silk-layer pointer-events-none absolute inset-0 hidden lg:block", styles.safe, styles.live)}
        />
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 hidden lg:block", styles.glowClip)}>
          <div className={cn("absolute", styles.glow, styles.markLg)} />
        </div>
        <div aria-hidden="true" className={cn("pointer-events-none absolute hidden lg:block", styles.markLg)}>
          <HeroMark id="hero-mark-lg" metal className="size-full" />
        </div>

        <Container className="relative z-10 flex-1">
          <Grid className={styles.text}>
            <h1
              id="hero-title"
              className={cn("col-span-4 text-fg sm:col-span-8 lg:col-span-8", styles.title)}
              style={{ "--fit-em": fitEm } as CSSProperties}
            >
              <span className="sr-only">{x.title.name}</span>
              {/* The first line may wrap (it fits as sized, but not always under
                  a reader's own letter and word spacing, WCAG 1.4.12); the
                  word line cannot, so the slot alone is nowrap. */}
              <span aria-hidden="true" className={cn("t-display block", styles.display)}>
                <span className="block">{x.title.line1}</span>
                <span className="block">
                  <HeroWords words={x.title.words} />
                </span>
              </span>
            </h1>
            <p className="t-lead col-span-4 mt-6 sm:col-span-7 lg:col-span-6">{x.lead}</p>
            <div className="col-span-4 mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-8">
              <ButtonPrimary href={localePath(lang, "/contact")} id="hero-cta" glass="zone">
                {h.ctaPrimary}
              </ButtonPrimary>
              <LinkArrow href={localePath(lang, "/dashboards")}>{h.ctaSecondary}</LinkArrow>
            </div>
          </Grid>
        </Container>

        {/* Pause control: bottom-right of the silk layer, 16px above the rule,
            ending left of the decision filament's drop to the rule (§6.1). */}
        <div className={cn("absolute bottom-4 z-10 hidden lg:block", styles.pause)}>
          <HeroPause labels={motionLabels} />
        </div>
      </div>

      {/* Mobile and tablet: the band — field, silk and mark — with no text over it. */}
      <div className="lg:hidden">
        <div className={cn("relative h-[300px] overflow-hidden", styles.band, styles.scope)}>
          <div aria-hidden="true" data-mesh-host="sm" className={cn("pointer-events-none absolute inset-0", styles.mesh, styles.meshBand)} />
          <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", styles.field, styles.fieldBand)} />
          <div aria-hidden="true" className={cn("silk-layer pointer-events-none absolute inset-0", styles.still)}>
            <SilkField preset="hero-mobile" className="block size-full" />
          </div>
          <HeroSilk
            preset="hero-mobile"
            fit="slice"
            media="(max-width: 1023.98px)"
            className={cn("silk-layer pointer-events-none absolute inset-0", styles.live)}
          />
          <div aria-hidden="true" className={cn("pointer-events-none absolute", styles.glow, styles.markSm)} />
          <div aria-hidden="true" className={cn("pointer-events-none absolute", styles.markSm)}>
            <HeroMark id="hero-mark-sm" metal className="size-full" />
          </div>
        </div>
        <Container className="flex min-h-11 justify-end">
          <HeroPause labels={motionLabels} />
        </Container>
      </div>

      {/* Desktop floor: the full-bleed R2 the decision filament lands on. */}
      <span aria-hidden="true" className={cn("rule-section hidden shrink-0 lg:block", styles.landing)} />
    </section>
  );
}
