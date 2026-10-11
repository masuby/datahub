import { MARK_D_REF, MARK_HAND_REF, MARK_VIEWBOX } from "./mark-paths";
import { HeroComet } from "@/components/hero/HeroComet";
import { cn } from "@/lib/utils";
import styles from "./HeroMark.module.css";

/**
 * The hero's mark, alive.
 *
 * Entrance, once (CSS, no JavaScript): the D sweeps round from its top-left
 * terminal (1.1 s) and the hand rises into it (from 500 ms).
 *
 * Then, while the hero may move (`data-hero-motion="run"` on the section,
 * set by HeroLive): the hand waves about the wrist — two or three swings,
 * then a rest; a faint glow breathes around the D. And a soft comet of light
 * runs the D's spine from terminal to terminal (HeroComet, on the same
 * gates). With motion paused or the hero off screen, the loops hold still;
 * before they first run, without JavaScript, under reduced motion and on a
 * frugal device (Save-Data, low-end), the mark is plain.
 *
 * Server-rendered and decorative (`aria-hidden`): the H1 carries the meaning.
 * The artwork is the logo's own path data, untouched, drawn with <use> from
 * <MarkSprite>, in stacked layers: the glow round the D; the D with its
 * sweep mask (a CSS mask on an <svg> box, which every engine supports); the
 * comet; the hand. Everything that loops animates only transform and
 * opacity of its own box, so it all runs on the compositor.
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
      </svg>
      <HeroComet />
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
