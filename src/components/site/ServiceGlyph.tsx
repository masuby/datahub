import { cn } from "@/lib/utils";

/**
 * Service glyphs for the 01 index: 64×40 line drawings, 1.25px strokes in
 * --accent-display, every stroke `pathLength=1` so it can be drawn with the
 * shared `dh-draw` keyframe.
 *
 * At rest the strokes are fully drawn (dasharray 1, offset 0). When the row
 * they sit in (`.group`) is hovered or keyboard-focused, each stroke replays
 * `dh-draw` with a 60ms stagger. Reduced motion: the global rule removes the
 * animation and the glyph simply stays drawn.
 *
 *   dashboards  a sparkline rising to a target tick
 *   automation  three flow lines merging into one
 *   ai-agents   three connected nodes, one marked with a check (human approval)
 */

export type GlyphKind = "dashboards" | "automation" | "ai-agents";

type Stroke =
  | { el: "path"; d: string }
  | { el: "circle"; cx: number; cy: number; r: number };

const GLYPHS: Record<GlyphKind, Stroke[]> = {
  dashboards: [
    { el: "path", d: "M2 35 L13 28 L22 31 L33 21 L42 24 L56 10" },
    { el: "path", d: "M50 6 H62" },
    { el: "path", d: "M56 3 V9" },
    { el: "path", d: "M2 38.5 H62" },
  ],
  automation: [
    { el: "path", d: "M2 7 C 18 7, 24 20, 38 20" },
    { el: "path", d: "M2 20 H38" },
    { el: "path", d: "M2 33 C 18 33, 24 20, 38 20" },
    { el: "path", d: "M38 20 H62" },
    { el: "path", d: "M57 15.5 L62 20 L57 24.5" },
  ],
  "ai-agents": [
    { el: "circle", cx: 10, cy: 30, r: 5 },
    { el: "circle", cx: 32, cy: 10, r: 5 },
    { el: "circle", cx: 54, cy: 30, r: 5 },
    { el: "path", d: "M13.7 26.6 L28.3 13.4" },
    { el: "path", d: "M35.7 13.4 L50.3 26.6" },
    { el: "path", d: "M15 30 H49" },
    { el: "path", d: "M51.4 30.2 L53.4 32.2 L57 27.6" },
  ],
};

/** Replays the draw when the enclosing row is hovered or keyboard-focused. */
const DRAW_ON_ROW =
  "group-hover:[animation:dh-draw_var(--dur-draw)_var(--ease-thread)_both] group-focus-visible:[animation:dh-draw_var(--dur-draw)_var(--ease-thread)_both]";

export function ServiceGlyph({
  kind,
  label,
  className,
}: {
  kind: GlyphKind;
  /** Accessible description from the dictionary (`services.items.*.glyphLabel`). */
  label: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 40"
      width="64"
      height="40"
      role="img"
      aria-label={label}
      focusable="false"
      className={cn("block shrink-0 overflow-visible text-accent-display", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {GLYPHS[kind].map((s, i) => {
        const common = {
          pathLength: 1,
          strokeDasharray: 1,
          strokeDashoffset: 0,
          className: DRAW_ON_ROW,
          style: { animationDelay: `${Math.min(i, 6) * 60}ms` },
        };
        return s.el === "path" ? (
          <path key={i} d={s.d} {...common} />
        ) : (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...common} />
        );
      })}
    </svg>
  );
}
