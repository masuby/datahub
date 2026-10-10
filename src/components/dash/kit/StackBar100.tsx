import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { ChartArea, ChartSvg } from "./ChartSvg";

/**
 * One 100% bar (Fig. 02.5 ageing, Fig. 02.6 product mix) filled with the
 * five-step ramp. With four or five parts, several only 1–2% wide, the parts
 * are named in a key under the bar: one line per part, a short stroke of its
 * colour, the name, and the value right-aligned. Key and segment highlight
 * together on hover/focus: over the bar the segment under the pointer is
 * picked by x, over the key the row by y. Long Kiswahili names have the full
 * width to run.
 */
export function StackBar100({
  ctx,
  id,
  label,
  summary,
  readoutId,
  segments,
  ramp,
  reads,
  marks,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  readoutId: string;
  /** name, display value, share (sums to 100) */
  segments: readonly { name: string; value: string; share: number }[];
  /** CSS colour per segment, e.g. "var(--ramp-1)". */
  ramp: readonly string[];
  reads: string[];
  marks: Mark[];
}) {
  const BAR_Y = 34;
  const BAR_H = 28;
  const KEY_Y = BAR_Y + BAR_H + 42;
  const STEP = 22;
  const height = KEY_Y + STEP * (segments.length - 1) + 10;
  const GAP = 0.3;

  const geo = segments.map((s, i) => {
    const start = segments.slice(0, i).reduce((a, p) => a + p.share, 0);
    return { start, centre: start + s.share / 2 };
  });
  const keyY = (i: number) => KEY_Y + STEP * i;

  return (
    <ChartArea
      ctx={ctx}
      label={label}
      readoutId={readoutId}
      cross={{
        axis: "y",
        pos: segments.map((_, i) => keyY(i) - 4),
        band: { y: [BAR_Y - 4, BAR_Y + BAR_H + 4], starts: geo.map((g) => g.start) },
        reads,
        idle: 0,
      }}
    >
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height}>
        {segments.map((s, i) => {
          const g = geo[i];
          const inset = (i ? GAP / 2 : 0) + (i < segments.length - 1 ? GAP / 2 : 0);
          return (
            <g key={s.name}>
              <rect
                data-k={i}
                x={`${g.start + (i ? GAP / 2 : 0)}%`}
                width={`${Math.max(s.share - inset, 0.25)}%`}
                y={BAR_Y}
                height={BAR_H}
                className="a-draw-x"
                style={{ fill: ramp[i], transformBox: "fill-box", animationDelay: `${i * 60}ms` }}
              />
              <g data-k={i}>
                <rect x={0} y={keyY(i) - 7} width={12} height={6} style={{ fill: ramp[i] }} />
                <text x={20} y={keyY(i)} style={{ fill: "var(--fg-muted)" }}>
                  {s.name}
                </text>
                <text x="100%" y={keyY(i)} textAnchor="end" style={{ fill: "var(--fg)" }}>
                  {s.value}
                </text>
              </g>
            </g>
          );
        })}
      </ChartSvg>
      {marks.map((m, k) => (
        <ReadMarker
          key={m.n}
          ctx={ctx}
          n={m.n}
          noteId={m.noteId}
          order={k}
          left={Math.min(Math.max(geo[m.i].centre, 4), 96)}
          top={BAR_Y + BAR_H + 15}
        />
      ))}
    </ChartArea>
  );
}
