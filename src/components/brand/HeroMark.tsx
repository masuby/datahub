import type { CSSProperties } from "react";
import { MARK_D_REF, MARK_D_SPINE, MARK_HAND_REF, MARK_VIEWBOX } from "./mark-paths";
import { cn } from "@/lib/utils";
import styles from "./HeroMark.module.css";

/**
 * Light along the D: five dashes on the D's spine, each longer, wider and
 * fainter than the next — a white core with a sky glow and a short tail.
 * [dash length (of the spine), width (viewBox units), colour, opacity]
 */
const COMET: [number, number, string, number][] = [
  [0.3, 8, "var(--comet-glow)", 0.1],
  [0.2, 6.2, "var(--comet-glow)", 0.2],
  [0.12, 4.4, "var(--comet-glow)", 0.42],
  [0.06, 2.8, "var(--comet-core)", 0.7],
  [0.026, 1.7, "var(--comet-core)", 1],
];

/**
 * How far every dash's head travels along the spine (pathLength 1): from the
 * top terminal (0) a little past the bottom one, where the light fades. Each
 * dash's offset runs from its length to its length − COMET_TRAVEL, so all the
 * heads move together and the core stays in front of its glow.
 */
const COMET_TRAVEL = 1.1;

/**
 * The hero's mark, alive.
 *
 * Entrance, once (CSS, no JavaScript): the D sweeps round from its top-left
 * terminal (1.1 s) and the hand rises into it (from 500 ms).
 *
 * Then, while the hero may move (`data-hero-motion="run"` on the section,
 * set by HeroLive): the hand waves about the wrist — two or three swings,
 * then a rest; a soft comet of light runs the D's spine from terminal to
 * terminal; a faint glow breathes around the D. With motion paused or the
 * hero off screen, the loops hold still; before they first run, without
 * JavaScript and under reduced motion, the mark is plain.
 *
 * Server-rendered and decorative (`aria-hidden`): the H1 carries the meaning.
 * The artwork is the logo's own path data, untouched, drawn with <use> from
 * <MarkSprite>, in three stacked SVGs: the glow round the D; the D with its
 * sweep mask (a CSS mask on an <svg> box, which every engine supports) and
 * the comet; the hand. The glow's breathing and the wave animate the <svg>
 * boxes themselves, so they run on the compositor; only the comet repaints.
 */
export function HeroMark({ id, className }: { id: string; className?: string }) {
  return (
    <div id={id} aria-hidden="true" className={cn("relative aspect-square", className)}>
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
        className={cn("absolute inset-0 block size-full overflow-visible", styles.sweep)}
        style={{ animation: "dh-sweep var(--dur-mark) var(--ease-thread) 100ms both" }}
        focusable="false"
      >
        <use href={MARK_D_REF} style={{ fill: "var(--mark-d)" }} />
        <g className={styles.comet}>
          {COMET.map(([len, width, color, opacity]) => (
            <path
              key={len}
              d={MARK_D_SPINE}
              pathLength={1}
              strokeWidth={width}
              strokeOpacity={opacity}
              style={{ "--len": len, "--to": +(len - COMET_TRAVEL).toFixed(3), stroke: color } as CSSProperties}
            />
          ))}
        </g>
      </svg>
      <svg
        viewBox={MARK_VIEWBOX}
        className={cn("absolute inset-0 block size-full overflow-visible", styles.wave)}
        focusable="false"
      >
        <use
          href={MARK_HAND_REF}
          className={styles.hand}
          style={{ fill: "var(--mark-hand)", animation: "dh-hand 700ms var(--ease-silk) 500ms both" }}
        />
      </svg>
    </div>
  );
}
