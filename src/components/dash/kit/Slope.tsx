import type { DashCtx, Mark } from "../context";
import { ChartArea, ChartSvg, Markers } from "./ChartSvg";
import { linear } from "./scales";

/**
 * Two-point slope chart (Fig. 02.12: monthly pack by hand vs automated),
 * on a linear scale from zero so the drop reads at its true size.
 */
export function Slope({
  ctx,
  id,
  label,
  summary,
  before,
  after,
  marks,
  height = 220,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  before: { label: string; value: number; display: string };
  after: { label: string; value: number; display: string };
  marks: Mark[];
  height?: number;
}) {
  const PT = 44;
  const PB = height - 34;
  const max = Math.max(before.value, after.value);
  const y = linear(0, max, PB, PT);
  const X0 = 22;
  const X1 = 78;
  const pts = [
    [X0, y(before.value)],
    [X1, y(after.value)],
  ] as const;

  return (
    <ChartArea ctx={ctx} label={label}>
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height}>
        <line x1="0%" x2="100%" y1={PB} y2={PB} strokeWidth={1} style={{ stroke: "var(--rule-input)" }} />
        {[X0, X1].map((x) => (
          <line
            key={x}
            x1={`${x}%`}
            x2={`${x}%`}
            y1={PT - 10}
            y2={PB}
            strokeWidth={1}
            strokeDasharray="1 3"
            style={{ stroke: "var(--rule)" }}
          />
        ))}
        <line
          x1={`${pts[0][0]}%`}
          y1={pts[0][1]}
          x2={`${pts[1][0]}%`}
          y2={pts[1][1]}
          pathLength={1}
          strokeWidth={2}
          strokeLinecap="round"
          className="a-draw"
          style={{ stroke: "var(--s1)" }}
        />
        {pts.map(([x, py], i) => (
          <circle key={i} cx={`${x}%`} cy={py} r={4} style={{ fill: i ? "var(--s1)" : "var(--s2)" }} />
        ))}
        <text
          x={`${X0}%`}
          dx={-10}
          y={pts[0][1] + 5}
          textAnchor="end"
          className="t-kpi"
          style={{ fill: "var(--fg)", fontSize: 20, fontFamily: "var(--font-display)" }}
        >
          {before.display}
        </text>
        <text
          x={`${X1}%`}
          dx={10}
          y={pts[1][1] - 8}
          className="t-kpi"
          style={{ fill: "var(--fg)", fontSize: 20, fontFamily: "var(--font-display)" }}
        >
          {after.display}
        </text>
        <g aria-hidden="true">
          <text x={`${X0}%`} y={height - 10} textAnchor="middle">
            {before.label}
          </text>
          <text x={`${X1}%`} y={height - 10} textAnchor="middle">
            {after.label}
          </text>
        </g>
      </ChartSvg>
      <Markers ctx={ctx} marks={marks} at={(i) => pts[i] ?? pts[1]} />
    </ChartArea>
  );
}
