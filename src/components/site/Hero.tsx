import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { ButtonPrimary } from "@/components/ui/Button";
import { LinkArrow } from "@/components/ui/LinkArrow";
import { HeroMark } from "@/components/brand/HeroMark";
import { SilkField } from "@/components/silk/SilkField";
import { PRESETS } from "@/lib/silk";
import { cn } from "@/lib/utils";
import { ServiceIndex } from "./ServiceIndex";
import { HeroPause, HeroSilk } from "./HeroMotion";
import styles from "./Hero.module.css";

const DESKTOP = PRESETS["hero-desktop"];

/**
 * 00 Hero (spec §6.1): say what DataHub is in five seconds and draw the
 * brand sentence — data arrives as silk, flows into the open hand of the
 * mark, and leaves as the straight hairline the service index stands on.
 *
 * Back to front on desktop: the wash (CSS), the silk layer (static SVG, then
 * the Canvas2D drift crossfading in when the device can afford it), the mark
 * at the silk's sink, the text block, the pause control, the service index.
 * Mobile stacks the text on plain background, then a 300px silk band with
 * the mark, then the index as rows.
 *
 * The H1 is the LCP element: server-rendered text, never animated.
 */
export async function Hero({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const h = t.hero;
  // "to " / "hadi " — the dictionary carries the trailing space.
  const line2Before = h.title.line2Before;
  const motionLabels = { pause: t.motion.pause, resume: t.motion.resume };

  return (
    <section id="top" aria-labelledby="hero-title" className={cn("relative isolate flex flex-col", styles.hero)}>
      {/* Stage: everything above the service index. Its bottom is the index rule. */}
      <div className={cn("relative flex flex-1 flex-col", styles.stage, styles.scope)}>
        <div
          aria-hidden="true"
          className={cn("silk-layer pointer-events-none absolute inset-0 hidden lg:block", styles.safe, styles.still)}
        >
          {/* Stretched (not sliced) onto the layer, so the sink lands on the
              mark and the decision filament lands on the index rule at every
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
          className={cn("silk-layer pointer-events-none absolute inset-0 hidden lg:block", styles.safe, styles.live)}
        />
        <div aria-hidden="true" className={cn("pointer-events-none absolute hidden lg:block", styles.markLg)}>
          <HeroMark id="hero-mark-lg" className="size-full" />
        </div>

        <Container className="relative z-10 flex-1">
          <Grid className={styles.text}>
            {/* Six words: §2.2 caps uppercase eyebrows at three, so this one is
                sentence case in .t-small (the dictionary string already is). */}
            <p className="t-small col-span-4 text-accent sm:col-span-8 lg:col-span-8">{h.eyebrow}</p>
            <h1 id="hero-title" className="col-span-4 mt-6 text-fg sm:col-span-8 lg:col-span-8">
              <span className="t-display block">
                {h.title.line1}
                <br />
                {line2Before}
                <em className="text-accent-display not-italic">{h.title.accent}</em>
              </span>
              <span className="t-sub mt-6 block">{h.title.sub}</span>
            </h1>
            <p className="t-lead col-span-4 mt-6 sm:col-span-7 lg:col-span-6">{h.lead}</p>
            <div className="col-span-4 mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-8">
              <ButtonPrimary href="#contact" id="hero-cta" data-hash-link>
                {h.ctaPrimary}
              </ButtonPrimary>
              <LinkArrow href="#dashboards" arrow="↓" data-hash-link>
                {h.ctaSecondary}
              </LinkArrow>
            </div>
          </Grid>
        </Container>

        {/* Pause control: bottom-right of the silk layer, 16px above the rule,
            ending left of the decision filament's drop to the rule (§6.1). */}
        <div className={cn("absolute bottom-4 z-10 hidden lg:block", styles.pause)}>
          <HeroPause labels={motionLabels} />
        </div>
      </div>

      {/* Mobile and tablet: the silk band, no text over it. */}
      <div className="lg:hidden">
        <div className={cn("relative h-[300px] overflow-hidden", styles.band, styles.scope)}>
          <div aria-hidden="true" className={cn("silk-layer pointer-events-none absolute inset-0", styles.still)}>
            <SilkField preset="hero-mobile" className="block size-full" />
          </div>
          <HeroSilk
            preset="hero-mobile"
            fit="slice"
            media="(max-width: 1023.98px)"
            className={cn("silk-layer pointer-events-none absolute inset-0", styles.live)}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-[168px] -translate-x-1/2 -translate-y-1/2"
          >
            <HeroMark id="hero-mark-sm" className="size-full" />
          </div>
        </div>
        <Container className="flex min-h-11 justify-end">
          <HeroPause labels={motionLabels} />
        </Container>
      </div>

      <ServiceIndex lang={lang} />
    </section>
  );
}
