import { linear, linePath } from "./scales";

/**
 * 60×16 trend line for a table cell (officer PAR30, 12 months): --s1 stroke,
 * a dot on the last point. Decorative: the table row carries the numbers.
 */
export function Sparkline({
  values,
  tone = "var(--s1)",
  className,
}: {
  values: readonly number[];
  tone?: string;
  className?: string;
}) {
  const W = 60;
  const H = 16;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const x = linear(0, values.length - 1, 1.5, W - 2.5);
  const y = linear(lo, hi, H - 2, 2);
  const pts = values.map((v, i) => [x(i), y(v)] as const);
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true" className={className}>
      <path d={linePath(pts)} fill="none" strokeWidth={1.25} strokeLinejoin="round" style={{ stroke: tone }} />
      <circle cx={lx} cy={ly} r={1.75} style={{ fill: tone }} />
    </svg>
  );
}
