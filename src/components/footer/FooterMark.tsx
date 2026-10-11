import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { chromeExtra } from "@/i18n/extra/chrome";
import { HeroMark } from "@/components/brand/HeroMark";
import { SilkField } from "@/components/silk/SilkField";
import { LiveGate } from "@/components/hero/HeroLive";
import { HeroWords } from "@/components/hero/HeroWords";
import { DISPLAY_ADVANCE, DISPLAY_UPM } from "@/components/hero/font-metrics";
import { MotionToggle } from "@/components/system/MotionToggle";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { PRESETS } from "@/lib/silk";
import { cn } from "@/lib/utils";
import styles from "./FooterMark.module.css";

const PLATE = PRESETS.plate;
const BAND = PRESETS["plate-band"];

/** .t-footer-mark tracking (-0.03em), applied after every character. */
const TRACKING = -0.03;

/**
 * Width of a line of the wordmark in em, from Poppins 600's advances, plus a
 * little for ink beyond the last advance (as the hero sizes its headline).
 */
function lineEm(text: string): number {
  let em = 0.08;
  for (const ch of text) em += (DISPLAY_ADVANCE[ch] ?? 0.6 * DISPLAY_UPM) / DISPLAY_UPM + TRACKING;
  return em;
}

/**
 * The footer's living wordmark (iteration-3 §A): "From Data to" and one word
 * that writes itself — Decisions, Insights, Automations, Analytics — in
 * Title Case, with a pen nib riding the writing edge. Behind it, the hero's
 * dot field and a still silk plate whose filaments flow into the mark, at
 * the plate's sink, waving.
 *
 * The same parts as the hero, on the same gates: LiveGate (scope "footer")
 * watches this stage, so the word (HeroWords with a nib), the wave, the D's
 * glow and its comet, and the field's twinkling dots run only while the
 * stage is on screen, the tab is visible and motion is allowed — never under
 * reduced motion, the pause control, Save-Data or (the CSS loops) on a
 * low-end device; the writer's tiers and kill switch hold as in the hero.
 * Because the footer now moves, it has its own pause control, sharing the
 * hero's store.
 *
 * Desktop: one stage — the decoration fills it, the mark at the silk's sink
 * on the right, the wordmark at the bottom left. Below 1024px: a band with
 * the silk and the mark at its centre (as the hero's band), then the
 * wordmark, centred like the rest of the footer there (iteration-5 §B). At
 * every width the dot field runs behind
 * the wordmark too, and the pause control sits under the wordmark (centred,
 * or at its left edge on desktop), away from the floating WhatsApp button.
 *
 * Server HTML: the first word as text (no JavaScript needed), sized so its
 * longest line fits the column and never wraps. The paragraph's accessible
 * name is the whole slogan, constant while the word changes.
 */
export async function FooterMark({ lang }: { lang: Locale }) {
  const t = await getDictionary(lang);
  const x = chromeExtra[lang].wordmark;
  const fitEm = Math.max(lineEm(x.line1), ...x.words.map(lineEm)).toFixed(3);

  return (
    <div id="footer-stage" className={cn("relative isolate", styles.stage)}>
      <LiveGate scope="footer" targetId="footer-stage" />
      <div aria-hidden="true" className={cn("pointer-events-none", styles.deco)}>
        <div className={cn("absolute inset-0", styles.field)} />
        {/* Stretched, so the sink lands on the mark at every aspect ratio;
            strokes stay 1px (non-scaling-stroke). The plate on desktop, its
            centred band below 1024px. */}
        <div className={cn("silk-layer absolute inset-x-0 top-0 hidden lg:block", styles.silk)}>
          <svg viewBox={`0 0 ${PLATE.W} ${PLATE.H}`} preserveAspectRatio="none" className="block size-full" focusable="false">
            <SilkField preset="plate" />
          </svg>
        </div>
        <div className={cn("silk-layer absolute inset-x-0 top-0 lg:hidden", styles.silkBand)}>
          <svg viewBox={`0 0 ${BAND.W} ${BAND.H}`} preserveAspectRatio="none" className="block size-full" focusable="false">
            <SilkField preset="plate-band" />
          </svg>
        </div>
        <div className={cn("absolute", styles.glow)} />
        <span className={cn(styles.twinkle, styles.twinkleA)} />
        <span className={cn(styles.twinkle, styles.twinkleB)} />
        <span className={cn(styles.twinkle, styles.twinkleC)} />
        <div className={cn("absolute", styles.mark)}>
          <HeroMark id="footer-mark" scope="footer" className="size-full" />
        </div>
      </div>

      <Container className={cn("relative", styles.text)}>
        <Grid>
          <p
            className={cn("t-footer-mark col-span-4 text-fg sm:col-span-8 lg:col-span-8", styles.title)}
            style={{ "--fit-em": fitEm } as CSSProperties}
          >
            <span className="sr-only">{x.name}</span>
            <span aria-hidden="true" className={cn("block", styles.display)}>
              <span className="block">{x.line1}</span>
              <span className="block">
                <HeroWords words={x.words} scope="footer" pen="nib" />
              </span>
            </span>
          </p>
        </Grid>
        {/* In the muted tone rather than the eyebrow's subtle one: on desktop a
            silk thread crosses the label, and it must keep 4.5:1 over it. */}
        <div className={styles.pause}>
          <MotionToggle
            variant="hero"
            labels={{ pause: t.motion.pause, resume: t.motion.resume }}
            className="text-muted"
          />
        </div>
      </Container>
    </div>
  );
}
