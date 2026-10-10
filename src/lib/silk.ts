/**
 * The silk field — the brand board's luminous blue threads, as one pure,
 * deterministic function.
 *
 * The same function renders twice: as a static server SVG (tier 0, zero JS,
 * what every visitor sees first and what reduced-motion visitors keep) and as
 * a Canvas2D animation (tier 1, desktop-class devices only). Because both read
 * `silkY`, the canvas can crossfade in over the SVG without anything moving.
 *
 * The story it draws: data arrives as loose silk on the left, flows into the
 * open hand of the mark (the "sink"), and leaves as straight parallel lines —
 * the same hairlines that structure every page. One filament, the "decision",
 * lands exactly on the hero's bottom rule.
 *
 * Coordinates: x is normalised 0..1 across the field; the result is in pixels
 * of the preset's W×H box. `t` is time in seconds, `k` (0..1) is "order":
 * 0 = silk, 1 = straightened into rules (driven by scroll and pointer).
 */

export type SilkPreset = {
  W: number;
  H: number;
  /** Number of filaments. */
  N: number;
  /** Points sampled per filament for the static SVG. */
  samples: number;
  sinkX: number;
  sinkY: number;
  leftY: number;
  spreadIn: number;
  spreadPinch: number;
  spreadOut: number;
  amp: number;
  /** Index of the decision filament, or -1 for none. */
  decision: number;
};

export const PRESETS = {
  "hero-desktop": { W: 1440, H: 900, N: 40, samples: 24, sinkX: 0.8, sinkY: 0.46, leftY: 0.86, spreadIn: 0.3, spreadPinch: 0.1, spreadOut: 0.34, amp: 0.09, decision: 19 },
  "hero-mobile": { W: 390, H: 300, N: 24, samples: 18, sinkX: 0.5, sinkY: 0.5, leftY: 0.6, spreadIn: 0.7, spreadPinch: 0.2, spreadOut: 0.6, amp: 0.1, decision: 11 },
  plate: { W: 1440, H: 420, N: 32, samples: 24, sinkX: 0.85, sinkY: 0.4, leftY: 0.7, spreadIn: 0.8, spreadPinch: 0.3, spreadOut: 0.7, amp: 0.08, decision: -1 },
  service: { W: 1440, H: 520, N: 28, samples: 20, sinkX: 0.88, sinkY: 0.45, leftY: 0.75, spreadIn: 0.6, spreadPinch: 0.18, spreadOut: 0.4, amp: 0.07, decision: -1 },
} satisfies Record<string, SilkPreset>;

export type SilkPresetName = keyof typeof PRESETS;

const ss = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** y (px) of filament i at normalised x, time t (s), order k in [0,1]. */
export function silkY(p: SilkPreset, i: number, x: number, t: number, k: number): number {
  const u = p.N === 1 ? 0.5 : i / (p.N - 1);
  const into = ss(0, p.sinkX, x); // 0 at left edge -> 1 at sink
  const after = ss(p.sinkX, Math.min(1, p.sinkX + 0.12), x); // 0 before sink -> 1 shortly after
  const pinch = Math.exp(-(((x - p.sinkX) / 0.09) ** 2));
  let cy = lerp(p.leftY, p.sinkY, into);
  let spread = lerp(lerp(p.spreadIn, p.spreadPinch, into), p.spreadOut, after) - 0.04 * pinch;
  const turb = 1 - ss(0.25, p.sinkX, x); // silk lives on the left
  const dy =
    0.55 * Math.sin(5.1 * x + 6.3 * u + 0.11 * t) +
    0.3 * Math.sin(9.7 * x - 4.1 * u - 0.07 * t) +
    0.15 * Math.sin(17.3 * x + 11.6 * u);
  const fold = 0.06 * Math.sin(3 * Math.PI * u); // the silk "bunching"
  // order k: straighten everything towards evenly spaced parallel rules
  cy = lerp(cy, p.sinkY, k);
  spread = lerp(spread, p.spreadOut, k);
  let y = p.H * (cy + (u - 0.5 + fold * (1 - after)) * spread) + p.H * p.amp * turb * (1 - k) * dy;
  if (i === p.decision) {
    // decision filament lands on the bottom rule
    const land = ss(p.sinkX + 0.06, 0.96, x);
    y = lerp(y, p.H - 0.75, land);
  }
  return y;
}

/** 0..1 brightness of filament u at time t: a travelling sheen across the bundle. */
export const silkSheen = (u: number, t: number) =>
  0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * (u * 1.6 - t / 14)), 6);

/** Number of opacity buckets: the canvas batches one stroke() per bucket. */
export const SHEEN_BUCKETS = 6;
export const sheenBucket = (b: number) =>
  Math.min(SHEEN_BUCKETS - 1, Math.floor(b * SHEEN_BUCKETS)) / (SHEEN_BUCKETS - 1);

/**
 * Catmull-Rom through the sampled points, emitted as cubic Béziers with
 * integer coordinates — smooth curves at a fraction of the bytes a polyline
 * would need for the same fidelity.
 */
export function filamentPath(p: SilkPreset, i: number, t = 0, k = 0, samples = p.samples): string {
  const pts: [number, number][] = [];
  for (let s = 0; s <= samples; s++) {
    const x = s / samples;
    pts.push([x * p.W, silkY(p, i, x, t, k)]);
  }
  const r = Math.round;
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let s = 0; s < pts.length - 1; s++) {
    const p0 = pts[Math.max(0, s - 1)];
    const p1 = pts[s];
    const p2 = pts[s + 1];
    const p3 = pts[Math.min(pts.length - 1, s + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}
