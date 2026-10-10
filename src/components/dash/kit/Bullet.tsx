import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { ChartArea, ChartSvg } from "./ChartSvg";
import { linear } from "./scales";

/** Approximate advance of an 11px Geist Mono glyph with 0.02em tracking. */
const ADV = 11 * (0.6 + 0.02);
/** Narrowest chart this figure gets: a full-width plate on a 360px phone. */
const W_MIN = 320;

/**
 * Horizontal bullet bars against a 100% target (Fig. 02.2 branches, sorted).
 * Rows below the watch threshold are --warn and carry △ beside the value, so
 * the status never rests on colour alone. One dashed target line at 100.
 */
export function Bullet({
  ctx,
  id,
  label,
  summary,
  readoutId,
  rows,
  watchBelow,
  max = 110,
  targetLabel,
  reads,
  marks,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  readoutId: string;
  rows: readonly { name: string; value: number }[];
  watchBelow: number;
  max?: number;
  targetLabel: string;
  reads: string[];
  marks: Mark[];
}) {
  const PT = 34;
  const ROW = 28;
  const height = PT + rows.length * ROW + 26;
  // The name column is sized from the longest name ("Zanzibar Stone Town")
  // on the narrowest chart (a 360px phone: 320px), never less than 38%.
  const nameW = Math.max(...rows.map((r) => r.name.length)) * ADV;
  const BL = Math.max(38, ((nameW + 12) / W_MIN) * 100);
  const BR = 88;
  const x = linear(0, max, BL, BR);
  const cy = (i: number) => PT + ROW * i + ROW / 2;
  const bottom = PT + rows.length * ROW;

  return (
    <ChartArea
      ctx={ctx}
      label={label}
      readoutId={readoutId}
      cross={{ axis: "y", pos: rows.map((_, i) => cy(i)), reads, idle: rows.length - 1 }}
    >
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height}>
        <line
          x1={`${BL}%`}
          x2={`${BL}%`}
          y1={PT - 4}
          y2={bottom}
          strokeWidth={1}
          style={{ stroke: "var(--rule-input)" }}
        />
        {rows.map((r, i) => {
          const watch = r.value < watchBelow;
          return (
            <g key={r.name}>
              <text x="0%" y={cy(i) + 4} style={{ fill: "var(--fg-muted)" }}>
                {r.name}
              </text>
              <rect
                data-k={i}
                x={`${BL}%`}
                width={`${x(r.value) - BL}%`}
                y={cy(i) - 7}
                height={14}
                className="a-draw-x"
                style={{
                  fill: watch ? "var(--warn)" : "var(--s1)",
                  transformBox: "fill-box",
                  animationDelay: `${i * 40}ms`,
                }}
              />
              <text x="100%" y={cy(i) + 4} textAnchor="end" style={{ fill: watch ? "var(--warn)" : "var(--fg)" }}>
                {watch ? "△ " : ""}
                {r.value}%
              </text>
            </g>
          );
        })}
        <line
          x1={`${x(100)}%`}
          x2={`${x(100)}%`}
          y1={PT - 4}
          y2={bottom + 4}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          style={{ stroke: "var(--s-ref)" }}
        />
        <g aria-hidden="true">
          <text x={`${BL}%`} y={height - 6} textAnchor="middle">
            0
          </text>
          <text x={`${x(100)}%`} y={height - 6} textAnchor="middle" style={{ fill: "var(--fg-muted)" }}>
            {targetLabel} 100%
          </text>
        </g>
      </ChartSvg>
      {marks.map((m, k) => (
        <ReadMarker
          key={m.n}
          ctx={ctx}
          n={m.n}
          noteId={m.noteId}
          order={k}
          left={Math.min(x(rows[m.i].value) + 5, 94)}
          top={cy(m.i)}
        />
      ))}
    </ChartArea>
  );
}
