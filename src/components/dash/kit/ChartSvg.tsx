import type { CSSProperties, ReactNode } from "react";
import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { SampleStamp } from "../SampleStamp";
import styles from "../dash.module.css";

/** The box a chart and its read markers share (the markers are placed over it). */
export function ChartArea({ style, children }: { style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={styles.chart} style={style}>
      {children}
    </div>
  );
}

/**
 * Outer chart SVG: no viewBox, x in %, y in px, fixed height. Carries the
 * <title> (figure summary) and the SAMPLE stamp.
 */
export function ChartSvg({
  ctx,
  titleId,
  summary,
  height,
  children,
}: {
  ctx: DashCtx;
  titleId: string;
  summary: string;
  height: number;
  children: ReactNode;
}) {
  return (
    <svg
      className={styles.svg}
      width="100%"
      height={height}
      style={{ height }}
      role="img"
      aria-labelledby={titleId}
    >
      <title id={titleId}>{`${ctx.figurePrefix} ${summary}`}</title>
      {children}
      <SampleStamp text={ctx.t.stamp} />
    </svg>
  );
}

/** Read markers over a chart: x in %, y in px; above the point unless near the top. */
export function Markers({ marks, at }: { marks: Mark[]; at: (i: number) => readonly [number, number] }) {
  return (
    <>
      {marks.map((m, k) => {
        const [x, y] = at(m.i);
        const top = y < 60 ? y + 24 : y - 24;
        const left = Math.min(Math.max(x, 3), 97);
        return <ReadMarker key={m.n} n={m.n} order={k} left={left} top={top} />;
      })}
    </>
  );
}

/** Y gridlines (dotted R5) with labels sitting above each line at the left. */
export function YGrid({
  values,
  y,
  label,
  unit,
  avoid,
  layer,
}: {
  values: number[];
  y: (v: number) => number;
  label: (v: number) => string;
  unit?: string;
  /** y (px) of a labelled reference line; tick labels that would touch it are dropped. */
  avoid?: number;
  /**
   * Draw only the lines or only the labels, so a chart can paint a fill
   * between them. The labels layer carries a --bg halo, so labels over an
   * area fill or a breach hatch still read on --bg (5.45:1 light) and not
   * on the fill (4.47:1) or a light hatch stripe (4.05:1).
   */
  layer?: "lines" | "labels";
}) {
  const top = values[values.length - 1];
  const suffix = unit ? (unit.startsWith("%") ? unit : ` ${unit}`) : "";
  return (
    <g aria-hidden="true">
      {values.map((v, i) => (
        <g key={v}>
          {layer !== "labels" && (
            <line
              x1="0%"
              x2="100%"
              y1={y(v)}
              y2={y(v)}
              strokeWidth={1}
              strokeDasharray={i === 0 ? undefined : "1 3"}
              style={{ stroke: i === 0 ? "var(--rule-input)" : "var(--rule)" }}
            />
          )}
          {layer !== "lines" && (avoid === undefined || Math.abs(y(v) - 5 - avoid) > 11) && (
            <text x="0%" y={y(v) - 5} className={layer === "labels" ? styles.halo : undefined}>
              {label(v)}
              {v === top ? suffix : ""}
            </text>
          )}
        </g>
      ))}
    </g>
  );
}

/** X labels centred under each point; every other one hides on small screens when dense. */
export function XLabels({ xs, labels, y, thin = false }: { xs: number[]; labels: string[]; y: number; thin?: boolean }) {
  return (
    <g aria-hidden="true">
      {labels.map((l, i) => (
        <text
          key={i}
          x={`${xs[i]}%`}
          y={y}
          textAnchor="middle"
          className={thin && i % 2 === 1 && i !== labels.length - 1 ? "max-sm:hidden" : undefined}
        >
          {l}
        </text>
      ))}
    </g>
  );
}
