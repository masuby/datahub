import type { DashCtx, Mark } from "../context";
import { ChartArea, ChartSvg, Markers, XLabels, YGrid } from "./ChartSvg";
import { band, linear, ticks } from "./scales";

/**
 * Two series side by side per period (Fig. 02.7 disbursed vs repaid), --s1
 * and --s2 from a zero baseline. The two series are named in a typographic
 * key at the top-left, one entry per line: a 12px stroke of the series
 * colour, then the word (paired bars are too narrow to carry their names).
 *
 * Series 2, not 3: --s3 has the same luminance as --s1 in both themes
 * (1.07:1 light, 1.00:1 dark), so the key could not tell them apart; --s2
 * differs by 2.90:1 (royal / navy) and 1.96:1 plus hue (sky / azure).
 */
export function PairedBars({
  ctx,
  id,
  label,
  summary,
  readoutId,
  a,
  b: bValues,
  names,
  xLabels,
  max,
  step,
  unit,
  reads,
  marks,
  height = 250,
}: {
  ctx: DashCtx;
  id: string;
  label: string;
  summary: string;
  readoutId: string;
  a: readonly number[];
  b: readonly number[];
  names: [string, string];
  xLabels: string[];
  max: number;
  step: number;
  unit: string;
  reads: string[];
  marks: Mark[];
  height?: number;
}) {
  // The key: one line per series, stacked at the top-left so a long
  // Kiswahili name ("Mikopo iliyotolewa") never runs into the other entry;
  // the second line sits below the stamp's band (0–18px) on the right.
  const KEY_Y = 12;
  const KEY_STEP = 16;
  const PT = KEY_Y + KEY_STEP + 22;
  const PB = height - 26;
  const y = linear(0, max, PB, PT);
  const g = band(a.length, 5, 100, 0.3);
  const gap = g.width * 0.06;
  const w = (g.width - gap) / 2;
  const xs = a.map((_, i) => g.centre(i));
  const last = a.length - 1;
  const colours = ["var(--s1)", "var(--s2)"];

  return (
    <ChartArea ctx={ctx} label={label} readoutId={readoutId} cross={{ axis: "x", pos: xs, reads, idle: last }}>
      <ChartSvg ctx={ctx} titleId={`${id}-title`} summary={summary} height={height} crosshair={[PT - 6, PB]}>
        <YGrid values={ticks(0, max, step)} y={y} label={(v) => String(v)} unit={unit} />
        {[a, bValues].map((series, s) => (
          <g key={s}>
            {series.map((v, i) => (
              <rect
                key={i}
                data-k={i}
                x={`${g.start(i) + s * (w + gap)}%`}
                width={`${w}%`}
                y={y(v)}
                height={PB - y(v)}
                className="a-grow-y"
                style={{ fill: colours[s], animationDelay: `${(i * 2 + s) * 40}ms` }}
              />
            ))}
          </g>
        ))}
        <g aria-hidden="true">
          {names.map((name, s) => (
            <g key={name}>
              <line
                x1={0}
                x2={12}
                y1={KEY_Y + s * KEY_STEP - 4}
                y2={KEY_Y + s * KEY_STEP - 4}
                strokeWidth={2}
                style={{ stroke: colours[s] }}
              />
              <text x={18} y={KEY_Y + s * KEY_STEP} style={{ fill: "var(--fg-muted)" }}>
                {name}
              </text>
            </g>
          ))}
        </g>
        <XLabels xs={xs} labels={xLabels} y={height - 6} />
      </ChartSvg>
      <Markers ctx={ctx} marks={marks} at={(i) => [xs[i], y(Math.max(a[i], bValues[i])) - 10]} />
    </ChartArea>
  );
}
