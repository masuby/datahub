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
  // The footer's band below 1024px: the plate with its sink in the middle, where the mark is centred.
  "plate-band": { W: 780, H: 216, N: 18, tol: 0.8, sinkX: 0.5, sinkY: 0.4, leftY: 0.7, spreadIn: 0.8, spreadPinch: 0.3, spreadOut: 0.7, amp: 0.08, decision: -1 },
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

/**
 * `silkY` on a fixed grid of `samples + 1` evenly spaced x, for a renderer
 * that draws every filament every frame (the canvas). Everything that does
 * not change with time or order is worked out once; the two drifting waves
 * use sin(a ± ωt) = sin a·cos ωt ± cos a·sin ωt, so `at(t)` takes the four
 * time terms once per frame and a point then costs a few multiplications
 * instead of three sines and an exponential. The same numbers as `silkY`,
 * term for term (to floating-point rounding), so a canvas drawn from it
 * still lies exactly on the static SVG.
 */
export function silkSampler(p: SilkPreset, samples: number) {
  const n = samples + 1;
  const cy0 = new Float64Array(n);
  const spread0 = new Float64Array(n);
  const after = new Float64Array(n);
  const turb = new Float64Array(n);
  const land = new Float64Array(n);
  for (let s = 0; s < n; s++) {
    const x = s / samples;
    const into = ss(0, p.sinkX, x);
    after[s] = ss(p.sinkX, Math.min(1, p.sinkX + 0.12), x);
    const pinch = Math.exp(-(((x - p.sinkX) / 0.09) ** 2));
    cy0[s] = lerp(p.leftY, p.sinkY, into);
    spread0[s] = lerp(lerp(p.spreadIn, p.spreadPinch, into), p.spreadOut, after[s]) - 0.04 * pinch;
    turb[s] = 1 - ss(0.25, p.sinkX, x);
    land[s] = ss(p.sinkX + 0.06, 0.96, x);
  }
  const offset = new Float64Array(p.N);
  const fold = new Float64Array(p.N);
  // Per filament and sample: sine and cosine of each wave's phase at t = 0,
  // and the third wave, which does not drift.
  const s1 = new Float64Array(p.N * n);
  const c1 = new Float64Array(p.N * n);
  const s2 = new Float64Array(p.N * n);
  const c2 = new Float64Array(p.N * n);
  const w3 = new Float64Array(p.N * n);
  for (let i = 0; i < p.N; i++) {
    const u = p.N === 1 ? 0.5 : i / (p.N - 1);
    offset[i] = u - 0.5;
    fold[i] = 0.06 * Math.sin(3 * Math.PI * u);
    for (let s = 0; s < n; s++) {
      const x = s / samples;
      const j = i * n + s;
      s1[j] = Math.sin(5.1 * x + 6.3 * u);
      c1[j] = Math.cos(5.1 * x + 6.3 * u);
      s2[j] = Math.sin(9.7 * x - 4.1 * u);
      c2[j] = Math.cos(9.7 * x - 4.1 * u);
      w3[j] = 0.15 * Math.sin(17.3 * x + 11.6 * u);
    }
  }
  let ct1 = 1;
  let st1 = 0;
  let ct2 = 1;
  let st2 = 0;
  return {
    /** Sets the time (s) for the following `y` calls. */
    at(t: number) {
      ct1 = Math.cos(0.11 * t);
      st1 = Math.sin(0.11 * t);
      ct2 = Math.cos(0.07 * t);
      st2 = Math.sin(0.07 * t);
    },
    /** silkY(p, i, s / samples, t, k). */
    y(i: number, s: number, k: number): number {
      const j = i * n + s;
      const dy = 0.55 * (s1[j] * ct1 + c1[j] * st1) + 0.3 * (s2[j] * ct2 - c2[j] * st2) + w3[j];
      const cy = lerp(cy0[s], p.sinkY, k);
      const spread = lerp(spread0[s], p.spreadOut, k);
      const y = p.H * (cy + (offset[i] + fold[i] * (1 - after[s])) * spread) + p.H * p.amp * turb[s] * (1 - k) * dy;
      return i === p.decision ? lerp(y, p.H - 0.75, land[s]) : y;
    },
  };
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

/**
 * A few dots of the hero's dot field that twinkle, around the mark and the
 * silk (iteration-2 §B; drawn by the desktop canvas with the lights, on the
 * field's grid): [x, y] as fractions of the field, delay and period in s.
 */
export const TWINKLES: readonly (readonly [number, number, number, number])[] = [
  [0.58, 0.16, 0, 4.2],
  [0.66, 0.8, 1.3, 5.1],
  [0.71, 0.09, 2.2, 3.8],
  [0.88, 0.2, 0.6, 4.6],
  [0.94, 0.62, 3.1, 5.4],
  [0.61, 0.44, 1.9, 4.9],
  [0.97, 0.36, 2.7, 3.9],
  [0.84, 0.86, 0.3, 4.4],
  [0.53, 0.66, 3.6, 5.6],
  [0.76, 0.28, 4.2, 4.1],
  [0.45, 0.07, 2.5, 5.2],
  [0.9, 0.08, 1.1, 4.7],
];

/** 0..1 brightness of a twinkle at time t: dark until `delay`, then up, a short hold and down, every `period`. */
export function twinkleAt(t: number, delay: number, period: number): number {
  if (t < delay) return 0;
  const f = ((t - delay) % period) / period;
  if (f < 0.45) return ss(0, 0.45, f);
  if (f < 0.6) return lerp(1, 0.9, ss(0.45, 0.6, f));
  return 0.9 * (1 - ss(0.6, 1, f));
}

/**
 * How much of the hero's dot field shows at (x, y), fractions of the field:
 * the field's own mask (Hero.module.css .field), strongest round the mark,
 * fading to the edges and quieter towards the text.
 */
export function fieldAlpha(x: number, y: number): number {
  const d = Math.hypot((x - 0.76) / 0.7, (y - 0.46) / 0.85);
  const near = d < 0.35 ? lerp(1, 0.7, d / 0.35) : d < 0.78 ? lerp(0.7, 0, (d - 0.35) / 0.43) : 0;
  const side = x <= 0.38 ? 0.45 : x >= 0.62 ? 1 : lerp(0.45, 1, (x - 0.38) / 0.24);
  return near * side;
}

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
