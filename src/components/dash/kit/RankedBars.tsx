import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { ChartArea, ChartSvg } from "./ChartSvg";
import { linear } from "./scales";
import styles from "../dash.module.css";

export type RankedRow = { key: string; name: string; value: number; valueText: string; share: string; growth: number };

/** Approximate advance of an 11px Geist Mono glyph with 0.02em tracking. */
const ADV = 11 * (0.6 + 0.02);
const GAP = 12;
/**
 * Three layouts, picked by the chart's own width with container queries
 * (.rkL0–.rkL2 in dash.module.css), each sized for the narrowest chart it
 * serves: below 400px (a 5/12 cell at 1024px is ~272px; a 360px phone 320px)
 * the share column steps aside; from 400px and from 640px it shows.
 */
const LAYOUTS = [
  { cls: "rkL0", w: 272, share: false },
  { cls: "rkL1", w: 400, share: true },
  { cls: "rkL2", w: 640, share: true },
] as const;

/**
 * Ranked horizontal bars with share and growth columns (Fig. 02.9). Columns
 * are measured from their text, not fixed fractions: the region names set the
 * bar start, growth and share sit in px from the right edge (a nested
 * <svg x="100%">, as SampleStamp does), and the value is end-anchored a fixed
 * px past the bar area's end. Without the share column it stays in the
 * readout and the table. Each row is one highlight group keyed by region,
 * shared with the map's rings and territories so hovering either lights both.
 * Growth is "▲ +14%"; a negative value would read "▼ −3%" in --warn (glyph +
 * sign + colour).
 */
export function RankedBars({
  ctx,
  id,
  label,
  summary,
  readoutId,
  rows,
  columns,
  reads,
  marks,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  readoutId: string;
  rows: readonly RankedRow[];
  columns: { region: string; sales: string; share: string; growth: string };
  reads: string[];
  marks: Mark[];
}) {
  const HEAD = 32;
  const PT = 44;
  const ROW = 26;
  const height = PT + rows.length * ROW + 6;
  const cy = (i: number) => PT + ROW * i + ROW / 2;
  const growthText = (g: number) => `${g >= 0 ? "▲ +" : "▼ −"}${Math.abs(g)}%`;
  const width = (texts: string[]) => Math.ceil(Math.max(...texts.map((t) => t.length)) * ADV);

  const nameW = width([columns.region, ...rows.map((r) => r.name)]);
  const valueW = width(rows.map((r) => r.valueText));
  const growthW = width([columns.growth, ...rows.map((r) => growthText(r.growth))]);
  const shareW = width([columns.share, ...rows.map((r) => r.share)]);
  /** Share column's end, px left of the right edge. */
  const shareEnd = growthW + GAP;
  /** The value ends this many px right of the bar area's end. */
  const valueOff = valueW + 8;
  const valueAt = `translate(${valueOff} 0)`;
  const max = Math.max(...rows.map((r) => r.value));

  const layouts = LAYOUTS.map((l) => {
    const BL = ((nameW + GAP) / l.w) * 100;
    const right = valueOff + GAP + (l.share ? shareW + shareEnd : growthW);
    const BR = Math.floor(100 - (right / l.w) * 100);
    return { ...l, BL, BR, x: linear(0, max, BL, BR) };
  });

  return (
    <ChartArea
      ctx={ctx}
      label={label}
      readoutId={readoutId}
      className={styles.ranked}
      cross={{ axis: "y", pos: rows.map((_, i) => cy(i)), reads, keys: rows.map((r) => r.key), idle: 0 }}
    >
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height}>
        <g aria-hidden="true" style={{ fill: "var(--fg-subtle)" }}>
          <text x={0} y={HEAD}>
            {columns.region}
          </text>
          <svg x="100%" overflow="visible">
            <text x={0} y={HEAD} textAnchor="end">
              {columns.growth}
            </text>
          </svg>
          <line x1="0%" x2="100%" y1={HEAD + 6} y2={HEAD + 6} strokeWidth={1} style={{ stroke: "var(--rule-input)" }} />
        </g>
        {layouts.map((l) => (
          <g key={l.cls} className={styles[l.cls]}>
            {/* Numeric header: right-aligned over the values it names. */}
            <text x={`${l.BR}%`} y={HEAD} textAnchor="end" transform={valueAt} style={{ fill: "var(--fg-subtle)" }}>
              {columns.sales}
            </text>
            {l.share && (
              <svg x="100%" overflow="visible">
                <text x={-shareEnd} y={HEAD} textAnchor="end" style={{ fill: "var(--fg-subtle)" }}>
                  {columns.share}
                </text>
              </svg>
            )}
            {rows.map((r, i) => (
              <g key={r.key} data-k={r.key}>
                <rect
                  x={`${l.BL}%`}
                  width={`${l.x(r.value) - l.BL}%`}
                  y={cy(i) - 6}
                  height={12}
                  className="a-draw-x"
                  style={{ fill: "var(--s1)", transformBox: "fill-box", animationDelay: `${Math.min(i, 6) * 40}ms` }}
                />
                <text x={`${l.BR}%`} y={cy(i) + 4} textAnchor="end" transform={valueAt} style={{ fill: "var(--fg)" }}>
                  {r.valueText}
                </text>
                {l.share && (
                  <svg x="100%" overflow="visible">
                    <text x={-shareEnd} y={cy(i) + 4} textAnchor="end" style={{ fill: "var(--fg-muted)" }}>
                      {r.share}
                    </text>
                  </svg>
                )}
              </g>
            ))}
          </g>
        ))}
        {rows.map((r, i) => {
          const up = r.growth >= 0;
          return (
            <g key={r.key} data-k={r.key}>
              <text x={0} y={cy(i) + 4} style={{ fill: "var(--fg-muted)" }}>
                {r.name}
              </text>
              <svg x="100%" overflow="visible">
                <text x={0} y={cy(i) + 4} textAnchor="end" style={{ fill: up ? "var(--fg)" : "var(--warn)" }}>
                  {growthText(r.growth)}
                </text>
              </svg>
            </g>
          );
        })}
      </ChartSvg>
      {layouts.map((l) => (
        <div key={l.cls} className={styles[l.cls]}>
          {marks.map((m, k) => (
            <ReadMarker
              key={m.n}
              ctx={ctx}
              n={m.n}
              noteId={m.noteId}
              order={k}
              left={Math.min(l.x(rows[m.i].value) + 4, l.BR - 3)}
              top={cy(m.i)}
            />
          ))}
        </div>
      ))}
    </ChartArea>
  );
}
