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
  /**
   * Static SVG only: how far (px, before rounding) a drawn curve may stray
   * from the function. Smaller is truer and heavier.
   */
  tol: number;
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
  "hero-desktop": { W: 1440, H: 900, N: 40, tol: 0.75, sinkX: 0.8, sinkY: 0.46, leftY: 0.86, spreadIn: 0.3, spreadPinch: 0.1, spreadOut: 0.34, amp: 0.09, decision: 19 },
  "hero-mobile": { W: 390, H: 300, N: 24, tol: 0.6, sinkX: 0.5, sinkY: 0.5, leftY: 0.6, spreadIn: 0.7, spreadPinch: 0.2, spreadOut: 0.6, amp: 0.1, decision: 11 },
  plate: { W: 1440, H: 420, N: 22, tol: 1, sinkX: 0.85, sinkY: 0.4, leftY: 0.7, spreadIn: 0.8, spreadPinch: 0.3, spreadOut: 0.7, amp: 0.08, decision: -1 },
  service: { W: 1440, H: 520, N: 28, tol: 0.9, sinkX: 0.88, sinkY: 0.45, leftY: 0.75, spreadIn: 0.6, spreadPinch: 0.18, spreadOut: 0.4, amp: 0.07, decision: -1 },
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
 * One filament as SVG path data: cubic Béziers with integer coordinates,
 * fitted to the function rather than sampled at fixed steps.
 *
 * Each segment is the cubic Hermite through its two ends with the function's
 * own slope there (control points a third of the way along, so x runs
 * linearly and the curve is a true y = f(x)). A segment is halved wherever it
 * strays more than `tol` px from the function — the pinch at the hand and the
 * decision filament's landing get short segments, the calm straight run after
 * the hand gets long ones. Truer than uniform sampling at a third fewer bytes.
 */
export function filamentPath(p: SilkPreset, i: number, t = 0, k = 0, tol = p.tol): string {
  const f = (x: number) => silkY(p, i, x, t, k);
  const slope = (x: number) => {
    const a = Math.max(0, x - 1e-4);
    const b = Math.min(1, x + 1e-4);
    return (f(b) - f(a)) / ((b - a) * p.W); // dy/dX in px per px
  };
  const r = Math.round;
  let d = `M0 ${r(f(0))}`;
  const seg = (xa: number, ya: number, ma: number, xb: number, yb: number, mb: number, depth: number) => {
    const w = (xb - xa) * p.W;
    const c1 = ya + (ma * w) / 3;
    const c2 = yb - (mb * w) / 3;
    let err = 0;
    for (const u of [0.2, 0.4, 0.5, 0.6, 0.8]) {
      const v = 1 - u;
      const y = v * v * v * ya + 3 * v * v * u * c1 + 3 * v * u * u * c2 + u * u * u * yb;
      err = Math.max(err, Math.abs(y - f(xa + u * (xb - xa))));
    }
    if (err > tol && depth < 8) {
      const xm = (xa + xb) / 2;
      const ym = f(xm);
      const mm = slope(xm);
      seg(xa, ya, ma, xm, ym, mm, depth + 1);
      seg(xm, ym, mm, xb, yb, mb, depth + 1);
      return;
    }
    const X = (x: number) => r(x * p.W);
    d += `C${X(xa + (xb - xa) / 3)} ${r(c1)} ${X(xb - (xb - xa) / 3)} ${r(c2)} ${X(xb)} ${r(yb)}`;
  };
  // Start from eight even spans so no feature hides between two probes.
  const BASE = 8;
  for (let s = 0; s < BASE; s++) {
    const xa = s / BASE;
    const xb = (s + 1) / BASE;
    seg(xa, f(xa), slope(xa), xb, f(xb), slope(xb), 0);
  }
  return d;
}

/**
 * Points of light travelling along the filaments into the hand: data flowing
 * into the mark (iteration-2 §B; desktop canvas only). Pure, like `silkY`:
 * light j runs a loop of its own length and, each time round, picks another
 * filament and starting point. Light 0 rides the decision filament past the
 * hand and down onto the hero's bottom rule. `x` is normalised along the
 * field, `alpha` fades it in as it leaves and out as it reaches the hand.
 */
export type SilkLight = { i: number; x: number; alpha: number };

const hash = (a: number) => {
  const v = Math.sin(a * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

export function silkLights(p: SilkPreset, t: number, count = 10): SilkLight[] {
  const out: SilkLight[] = [];
  for (let j = 0; j < count; j++) {
    const period = 6.5 + hash(j + 1) * 4;
    const clock = t + hash(j + 7) * period;
    const lap = Math.floor(clock / period);
    const u = clock / period - lap;
    const decision = j === 0 && p.decision >= 0;
    let i = decision ? p.decision : Math.floor(hash(j * 31 + lap * 7.3) * p.N);
    if (!decision && i === p.decision) i = (i + 1) % p.N;
    const from = decision ? 0.3 : 0.04 + hash(j * 13 + lap) * 0.3;
    const to = decision ? 0.96 : p.sinkX + 0.015;
    const alpha = Math.min(1, u / 0.15) * (1 - Math.max(0, (u - 0.85) / 0.15));
    out.push({ i, x: from + (to - from) * u, alpha });
  }
  return out;
}
