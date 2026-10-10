import type { DashCtx, Mark } from "../context";
import { ChartArea, ChartSvg, Markers, XLabels, YGrid } from "./ChartSvg";
import { linear, linePath, points, ticks } from "./scales";
import styles from "../dash.module.css";

/**
 * Line (+ optional area) against a dashed reference: the revenue target
 * (Fig. 02.1) or the PAR30 limit with a hatched breach zone above it
 * (Fig. 02.4). 2px series in --s1, area --s-fill, reference 1.5px dashed
 * --s-ref. The series and the reference are labelled at their right ends
 * (≥640px; the readout line carries the same values on phones).
 */
export function LineArea({
  ctx,
  id,
  label,
  summary,
  readoutId,
  values,
  xLabels,
  min = 0,
  max,
  step,
  tickDecimals,
  unit,
  area = false,
  seriesLabel,
  reference,
  breachAbove = false,
  reads,
  marks,
  height = 240,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  readoutId: string;
  values: readonly number[];
  xLabels: string[];
  min?: number;
  max: number;
  step: number;
  tickDecimals: number;
  unit: string;
  area?: boolean;
  seriesLabel: string;
  reference: { value: number; label: string };
  /** Hatch the zone above the reference (a limit) instead of treating it as a target. */
  breachAbove?: boolean;
  reads: string[];
  marks: Mark[];
  height?: number;
}) {
  const PT = 34;
  const PB = height - 26;
  const L = 3;
  const R = 84;
  const y = linear(min, max, PB, PT);
  const xs = points(values.length, L, R);
  const last = values.length - 1;
  const yRef = y(reference.value);
  const yLast = y(values[last]);
  // Inner viewBox coordinates (0..100 both ways) for the stretched path SVG.
  const inner = values.map((v, i) => [xs[i], ((y(v) - PT) / (PB - PT)) * 100] as const);
  const line = linePath(inner);
  // The area stops at the top edge of the 1px zero baseline, so the axis sits
  // on --bg (3.48:1 light) instead of half under the fill (2.87:1).
  const floor = (100 - 50 / (PB - PT)).toFixed(2);
  const areaPath = `${line}L${xs[last].toFixed(2)} ${floor}L${xs[0].toFixed(2)} ${floor}Z`;
  const hatchId = `${id}-hatch`;
  const tickValues = ticks(min, max, step);
  const tickText = (v: number) => v.toFixed(tickDecimals);
  const refAbove = yLast > yRef;
  const refLabelY = refAbove ? yRef - 6 : yRef + 14;
  const seriesLabelY = Math.abs(yLast + 4 - refLabelY) < 14 ? (refAbove ? yLast + 16 : yLast - 8) : yLast + 4;

  return (
    <ChartArea
      ctx={ctx}
      label={label}
      readoutId={readoutId}
      cross={{
        axis: "x",
        pos: xs,
        dots: values.map((v, i) => [xs[i], y(v)] as const),
        reads,
        idle: last,
      }}
    >
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height} crosshair={[PT - 6, PB]}>
        {breachAbove && (
          <>
            <defs>
              <pattern id={hatchId} patternUnits="userSpaceOnUse" width={6} height={6} patternTransform="rotate(45)">
                <line x1={0} y1={0} x2={0} y2={6} strokeWidth={3} style={{ stroke: "var(--s-hatch)" }} />
              </pattern>
            </defs>
            <rect x="0%" width="100%" y={PT} height={Math.max(0, yRef - PT)} fill={`url(#${hatchId})`} />
          </>
        )}
        <YGrid layer="lines" values={tickValues} y={y} label={tickText} />
        <line
          x1="0%"
          x2="100%"
          y1={yRef}
          y2={yRef}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          style={{ stroke: "var(--s-ref)" }}
        />
        <svg
          x="0%"
          y={PT}
          width="100%"
          height={PB - PT}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          overflow="visible"
          aria-hidden="true"
          className={styles.reveal}
        >
          {area && <path d={areaPath} style={{ fill: "var(--s-fill)" }} stroke="none" />}
          <path
            d={line}
            fill="none"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ stroke: "var(--s1)" }}
          />
        </svg>
        <circle cx={`${xs[last]}%`} cy={yLast} r={3.5} className={styles.fadeLate} style={{ fill: "var(--s1)" }} />
        {/* Tick labels over the fill and the hatch, on a --bg halo. */}
        <YGrid layer="labels" values={tickValues} y={y} label={tickText} unit={unit} avoid={yRef} />
        <g aria-hidden="true" className="max-sm:hidden">
          <text x={`${R + 2.5}%`} y={seriesLabelY} style={{ fill: "var(--fg)" }}>
            {seriesLabel}
          </text>
          <text x="100%" y={refLabelY} textAnchor="end" style={{ fill: "var(--fg-muted)" }}>
            {reference.label}
          </text>
        </g>
        <XLabels xs={xs} labels={xLabels} y={height - 6} thin={values.length > 9} />
      </ChartSvg>
      <Markers ctx={ctx} marks={marks} at={(i) => [xs[i], y(values[i])]} />
    </ChartArea>
  );
}
