import { MARK_D_REF, MARK_D_SPINE, MARK_HAND_REF, MARK_VIEWBOX } from "./mark-paths";
import { HeroProbe } from "@/components/site/HeroMotion";
import { cn } from "@/lib/utils";
import styles from "./HeroMark.module.css";

/** End of MARK_D_SPINE (the D's bottom terminal): where the ring plays. */
const SPINE_END = { x: 70, y: 92.6 };

/**
 * The hero's mark, drawn once: the D sweeps round from its top-left terminal
 * (1.1 s), the hand rises into it (from 500 ms), and after hydration a probe
 * dot travels the D's spine and a ring plays once where it ends.
 *
 * Server-rendered and decorative (`aria-hidden`): the H1 carries the meaning.
 * All motion is CSS keyframes defined `from` only, so with animations off
 * (reduced motion) the final mark simply shows and the dot never appears.
 *
 * The artwork is the logo's own path data, untouched, drawn with <use> from
 * <MarkSprite> (rendered once by the layout). The D and the hand sit
 * in two stacked SVGs so the D's sweep mask is a CSS mask on an <svg> box,
 * which every engine supports (CSS masks on SVG children are patchier).
 * `id` must be unique on the page; the probe effect finds its parts by it.
 */
export function HeroMark({ id, className }: { id: string; className?: string }) {
  const spineId = `${id}-spine`;
  return (
    <div id={id} aria-hidden="true" className={cn("relative aspect-square", className)}>
      <svg
        viewBox={MARK_VIEWBOX}
        className={cn("absolute inset-0 block size-full overflow-visible", styles.sweep)}
        style={{ animation: "dh-sweep var(--dur-mark) var(--ease-thread) 100ms both" }}
        focusable="false"
      >
        <use href={MARK_D_REF} style={{ fill: "var(--mark-d)" }} />
      </svg>
      <svg viewBox={MARK_VIEWBOX} className="absolute inset-0 block size-full overflow-visible" focusable="false">
        <defs>
          <path id={spineId} d={MARK_D_SPINE} fill="none" />
        </defs>
        <use
          href={MARK_HAND_REF}
          className={styles.hand}
          style={{ fill: "var(--mark-hand)", animation: "dh-hand 700ms var(--ease-silk) 500ms both" }}
        />
        <circle
          data-ring=""
          className={styles.ring}
          cx={SPINE_END.x}
          cy={SPINE_END.y}
          r={7}
          fill="none"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ stroke: "var(--sky)" }}
        />
        <circle data-probe="" className={styles.probe} r={2.2} style={{ fill: "var(--sky)" }}>
          <animateMotion
            dur="1.3s"
            begin="indefinite"
            fill="freeze"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="spline"
            keySplines=".65 0 .35 1"
          >
            <mpath href={`#${spineId}`} />
          </animateMotion>
        </circle>
      </svg>
      <HeroProbe markId={id} />
    </div>
  );
}
