import type { CSSProperties } from "react";
import { MARK_D_REF, MARK_HAND_REF, MARK_VIEWBOX } from "./mark-paths";
import { METAL_BOX } from "./metal-maps";
import { HeroComet } from "@/components/hero/HeroComet";
import type { LiveScope } from "@/components/hero/HeroLive";
import { cn } from "@/lib/utils";
import styles from "./HeroMark.module.css";

/** A metal map's box in the mark's 100×100 viewBox, as percentages of the mark. */
function boxStyle(b: { x: number; y: number; w: number; h: number }): CSSProperties {
  return { left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` };
}

/**
 * The hero's mark, alive.
 *
 * Entrance, once (CSS, no JavaScript): the D sweeps round from its top-left
 * terminal (1.1 s) and the hand rises into it (from 500 ms).
 *
 * Then, while its part of the page may move (`data-hero-motion="run"` on
 * the hero section, `data-footer-motion="run"` on the footer's stage, set
 * by LiveGate; `scope` says which part it is in): the hand waves about the
 * wrist — two or three swings, then a rest; a faint glow breathes around
 * the D. And a soft comet of light runs the D's spine from terminal to
 * terminal (HeroComet, on the same gates). With motion paused or the part
 * off screen, the loops hold still;
 * before they first run, without JavaScript, under reduced motion and on a
 * frugal device (Save-Data, low-end), the mark is plain.
 *
 * Liquid metal (`metal`, the hero's two marks only; HeroShaders, where the
 * device can afford WebGL): once the entrance is over, the D and the hand
 * are drawn again in liquid metal on two canvases inside the empty
 * `[data-metal-host]` boxes below — the hand's inside the waving box, so it
 * keeps its wave — and crossfade in over the flat shapes (`data-metal="live"`
 * on the root). The flat SVG stays in the DOM underneath: it is the server
 * HTML, the no-JS and print art, and what returns if the GPU context is
 * lost. While the metal shows, the comet rests (the metal's own light runs
 * along the D).
 *
 * Server-rendered and decorative (`aria-hidden`): the H1 carries the meaning.
 * The artwork is the logo's own path data, untouched, drawn with <use> from
 * <MarkSprite>, in stacked layers: the glow round the D; the D with its
 * sweep mask (a CSS mask on an <svg> box, which every engine supports); the
 * metal D; the comet; the hand and the metal hand. Everything that loops
 * animates only transform and opacity of its own box, so it all runs on the
 * compositor.
 */
export function HeroMark({
  id,
  scope = "hero",
  metal = false,
  className,
}: {
  id: string;
  scope?: LiveScope;
  /** Carry the liquid-metal boxes (the hero's marks only; the footer's stays flat). */
  metal?: boolean;
  className?: string;
}) {
  return (
    <div id={id} aria-hidden="true" className={cn("relative aspect-square", styles.root, className)}>
      {/* Invisible until the loops run, so it needs no sweep mask: by then
          the D has drawn itself. */}
      <svg
        viewBox={MARK_VIEWBOX}
        className={cn("absolute inset-0 block size-full overflow-visible", styles.halo)}
        focusable="false"
      >
        <use href={MARK_D_REF} strokeWidth={6} strokeOpacity={0.08} />
        <use href={MARK_D_REF} strokeWidth={3} strokeOpacity={0.16} />
      </svg>
      <svg
        viewBox={MARK_VIEWBOX}
        className={cn("absolute inset-0 block size-full overflow-visible", styles.sweep, styles.flat)}
        style={{ animation: "dh-sweep var(--dur-mark) var(--ease-thread) 100ms both" }}
        focusable="false"
      >
        <use href={MARK_D_REF} style={{ fill: "var(--mark-d)" }} />
      </svg>
      {metal && <div data-metal-host="d" className={styles.metal} style={boxStyle(METAL_BOX.d)} />}
      <HeroComet scope={scope} yieldToMetal={metal} />
      <div className={styles.wave}>
        <svg viewBox={MARK_VIEWBOX} className={cn("absolute inset-0 block size-full overflow-visible", styles.flat)} focusable="false">
          <use
            href={MARK_HAND_REF}
            className={styles.hand}
            style={{ fill: "var(--mark-hand)", animation: "dh-hand 700ms var(--ease-silk) 500ms both" }}
          />
        </svg>
        {metal && <div data-metal-host="hand" className={styles.metal} style={boxStyle(METAL_BOX.hand)} />}
      </div>
    </div>
  );
}
