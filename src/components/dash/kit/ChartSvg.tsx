import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DashCtx, Mark } from "../context";
import { ReadMarker } from "../ReadMarker";
import { SampleStamp } from "../SampleStamp";
import styles from "../dash.module.css";

/**
 * Crosshair / highlight contract with the DashboardShowcase island. The
 * island reads these data attributes; nothing else is shared with it.
 *
 *   axis  "x"  nearest point by pointer x (line and column charts)
 *         "y"  nearest row by pointer y (horizontal bars)
 *         "pt" nearest dot in 2-D within 40px (map rings)
 *   pos   along-axis positions: x in %, or y in px (y in % when yPct)
 *   dots  optional "x,y" of the crosshair dot / ring centre per point
 *   reads readout sentence per point; idle = the point shown at rest
 *   keys  highlight key per point; marks carry data-k = key (default index)
 *   band  optional 100% bar: pointer y (px) inside [top, bottom] picks the
 *         segment whose start (x %, ascending) is the last one left of it
 */
export type CrossSpec = {
  axis: "x" | "y" | "pt";
  pos: number[];
  dots?: (readonly [number, number])[];
  yPct?: boolean;
  reads: string[];
  keys?: string[];
  band?: { y: readonly [number, number]; starts: number[] };
  idle: number;
};

/** Focusable chart area carrying the island contract; plain wrapper when static. */
export function ChartArea({
  ctx,
  cross,
  label,
  readoutId,
  className,
  style,
  children,
}: {
  ctx: DashCtx;
  cross?: CrossSpec;
  label: string;
  readoutId?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const live = ctx.live && cross;
  return (
    <div
      className={cn(styles.chart, className)}
      style={style}
      {...(live
        ? {
            tabIndex: 0,
            role: "group",
            "aria-label": label,
            "aria-describedby": [`${ctx.idp}-keys`, readoutId].filter(Boolean).join(" "),
            "data-cross": cross.axis,
            "data-pos": cross.pos.map((p) => p.toFixed(2)).join(" "),
            "data-dots": cross.dots?.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" "),
            "data-yu": cross.yPct ? "%" : "px",
            "data-reads": JSON.stringify(cross.reads),
            "data-keys": cross.keys?.join(" "),
            "data-band": cross.band?.y.join(" "),
            "data-bx": cross.band?.starts.map((p) => p.toFixed(2)).join(" "),
            "data-idle": cross.idle,
          }
        : null)}
    >
      {children}
    </div>
  );
}

/**
 * Outer chart SVG: no viewBox, x in %, y in px, fixed height. Carries the
 * <title> (figure summary), the SAMPLE stamp and the crosshair marks.
 */
export function ChartSvg({
  ctx,
  titleId,
  summary,
  height,
  crosshair,
  children,
}: {
  ctx: DashCtx;
  titleId: string;
  summary: string;
  height: number;
  /** Vertical crosshair span [top, bottom] in px; omit for charts without one. */
  crosshair?: [number, number];
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
      {crosshair && (
        <>
          <line
            data-xl=""
            className={styles.xh}
            x1="0%"
            x2="0%"
            y1={crosshair[0]}
            y2={crosshair[1]}
            strokeWidth={1}
            style={{ stroke: "var(--fg-subtle)" }}
          />
          <circle data-xd="" className={styles.xh} cx="0%" cy={0} r={4} style={{ fill: "var(--fg)" }} />
        </>
      )}
      <SampleStamp text={ctx.t.stamp} />
    </svg>
  );
}

/** Read markers over a chart: x in %, y in px; above the point unless near the top. */
export function Markers({
  ctx,
  marks,
  at,
}: {
  ctx: DashCtx;
  marks: Mark[];
  at: (i: number) => readonly [number, number];
}) {
  return (
    <>
      {marks.map((m, k) => {
        const [x, y] = at(m.i);
        const top = y < 60 ? y + 24 : y - 24;
        const left = Math.min(Math.max(x, 3), 97);
        return <ReadMarker key={m.n} ctx={ctx} n={m.n} noteId={m.noteId} order={k} left={left} top={top} />;
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
