/**
 * Scales for the sample charts. No d3: three small functions.
 *
 * Charts use a mixed coordinate system so text never scales: the outer SVG has
 * no viewBox, x is in % of its width and y in px of its fixed height. Series
 * paths live in a nested `viewBox="0 0 100 100" preserveAspectRatio="none"`
 * SVG with non-scaling strokes, so the same numbers serve both.
 */

/** Maps [d0, d1] to [r0, r1]. */
export function linear(d0: number, d1: number, r0: number, r1: number) {
  const k = (r1 - r0) / (d1 - d0 || 1);
  return (v: number) => r0 + (v - d0) * k;
}

/** Evenly spaced points across [r0, r1] for n items (centres; one item sits in the middle). */
export function points(n: number, r0: number, r1: number): number[] {
  if (n <= 1) return [(r0 + r1) / 2];
  return Array.from({ length: n }, (_, i) => r0 + ((r1 - r0) * i) / (n - 1));
}

/** Band scale: n bands across [r0, r1] with an inner gap ratio; returns start + width per band. */
export function band(n: number, r0: number, r1: number, gap = 0.3) {
  const step = (r1 - r0) / n;
  const width = step * (1 - gap);
  return {
    step,
    width,
    start: (i: number) => r0 + step * i + (step - width) / 2,
    centre: (i: number) => r0 + step * i + step / 2,
  };
}

/** Ticks from 0 (or min) to max at a fixed step, inclusive. */
export function ticks(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let v = min; v <= max + step / 1e6; v += step) out.push(Math.round(v * 1e6) / 1e6);
  return out;
}

/** Nearest "nice" step for roughly `count` ticks over a span. */
export function niceStep(span: number, count = 5): number {
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const f = raw / mag;
  return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
}

/** Number with fixed decimals and no trailing noise ("2.50" -> "2.5" when trim). */
export function tickLabel(v: number, decimals: number): string {
  return v.toFixed(decimals);
}

/** SVG path for points given as [x%, y%] inside a 0..100 viewBox. */
export function linePath(pts: readonly (readonly [number, number])[]): string {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("");
}
