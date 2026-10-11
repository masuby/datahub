import type { DashCtx, Mark } from "../context";
import { ChartArea, ChartSvg, Markers, XLabels, YGrid } from "./ChartSvg";
import { band, linear, ticks } from "./scales";

/**
 * Columns from a zero baseline (Fig. 02.11 run times). Plain rects, 2px-ish
 * gaps, no radius. One column can be flagged (--warn + glyph + word), and an
 * optional dashed reference (the median) is labelled at its right end.
 * Columns grow from the baseline with a 40ms stagger.
 */
export function Bars({
  ctx,
  id,
  summary,
  values,
  xLabels,
  max,
  step,
  unit,
  flagIndex,
  flagLabel,
  reference,
  marks,
  height = 240,
}: {
  ctx: DashCtx;
  id: string;
  summary: string;
  values: readonly number[];
  xLabels: string[];
  max: number;
  step: number;
  unit: string;
  flagIndex?: number;
  flagLabel?: string;
  reference?: { value: number; label: string };
  marks: Mark[];
  height?: number;
}) {
  const PT = 34;
  const PB = height - 26;
  const y = linear(0, max, PB, PT);
  const b = band(values.length, 5, 100, 0.28);
  const xs = values.map((_, i) => b.centre(i));

  return (
    <ChartArea>
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height}>
        <YGrid
          values={ticks(0, max, step)}
          y={y}
          label={(v) => String(v)}
          unit={unit}
          avoid={reference ? y(reference.value) : undefined}
        />
        <g>
          {values.map((v, i) => (
            <rect
              key={i}
              x={`${b.start(i)}%`}
              width={`${b.width}%`}
              y={y(v)}
              height={PB - y(v)}
              className="a-grow-y"
              style={{
                fill: i === flagIndex ? "var(--warn)" : "var(--s1)",
                animationDelay: `${Math.min(i, 9) * 40}ms`,
              }}
            />
          ))}
        </g>
        {reference && (
          <g>
            <line
              x1="0%"
              x2="100%"
              y1={y(reference.value)}
              y2={y(reference.value)}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              style={{ stroke: "var(--s-ref)" }}
            />
            <text x="100%" y={y(reference.value) - 6} textAnchor="end" style={{ fill: "var(--fg-muted)" }} aria-hidden="true">
              {reference.label}
            </text>
          </g>
        )}
        {flagIndex !== undefined && flagLabel && (
          <text
            x={`${xs[flagIndex]}%`}
            y={y(values[flagIndex]) - 8}
            textAnchor="middle"
            style={{ fill: "var(--warn)" }}
            aria-hidden="true"
          >
            △ {flagLabel}
          </text>
        )}
        <XLabels xs={xs} labels={xLabels} y={height - 6} thin={values.length > 9} />
      </ChartSvg>
      <Markers marks={marks} at={(i) => [xs[i], y(values[i]) - 14]} />
    </ChartArea>
  );
}
