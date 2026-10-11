import { MARK_D_SPINE } from "@/components/brand/mark-paths";

/**
 * The light along the D (iteration-2 §B): a soft comet — white core, sky
 * glow, short tail — that runs the D's spine from terminal to terminal, then
 * rests.
 *
 * It is built to cost the main thread next to nothing: four pre-drawn
 * glows (HeroComet), each moved along the spine by a transform and faded by
 * opacity — the two properties the compositor animates on its own. The
 * spine is sampled here once, into keyframes; the browser does the rest.
 * (Its first version animated stroke-dashoffset on five paths, which
 * restyled and repainted on the main thread at the display's full rate.)
 */

/**
 * One glow of the comet, in viewBox units (the mark is 100 × 100): how far
 * behind the head it runs along the spine, its length along the spine and
 * width across it, its peak opacity, and whether it is white (the core)
 * or sky (the glow). A glow is a soft ellipse turned along the spine; the
 * tail is two of them, longer, thinner and fainter towards its end. Few on
 * purpose: every animated element is restyled in each frame the page draws
 * for other reasons (the silk, the word), composited or not.
 */
export type CometGlow = { lag: number; long: number; wide: number; alpha: number; core?: boolean };

/** Back to front: the tail, the glow round the head, the white core and its short streak. */
export const COMET_GLOWS: CometGlow[] = [
  { lag: 17, long: 26, wide: 5.2, alpha: 0.42 },
  { lag: 6.5, long: 15, wide: 7.2, alpha: 0.6 },
  { lag: 0, long: 12, wide: 9.4, alpha: 0.85 },
  { lag: 2.5, long: 11, wide: 3, alpha: 1, core: true },
];

/**
 * The rhythm, as shares of a 3.6 s cycle: the head runs the spine over the
 * first 84% (slow at both terminals), the light fades in by 8% and out from
 * 63% to 72% — gone just as the head passes the bottom terminal — then it
 * rests unseen until the cycle ends.
 */
const CYCLE = 3600;
const TRAVEL = 0.84;
const IN = 0.08;
const OUT_FROM = 0.63;
const OUT_TO = 0.72;
/** How far the head goes, in spine lengths: a little past the bottom terminal. */
const REACH = 1.1;

/**
 * A pass (ms): the part of the cycle where the comet can be seen, the only
 * part that is animated. The rest is a plain wait with nothing running, and
 * the first pass waits for the D's entrance.
 */
export const COMET_PASS = CYCLE * OUT_TO;
export const COMET_REST = CYCLE - COMET_PASS;
export const COMET_DELAY = 1600;
/** A glow fades over this many units as it leaves a terminal or reaches the other. */
const EDGE = 3;
/** Keyframes per pass: the spine's curves become chords ~3 units long. */
const SAMPLES = 64;

type Spine = { pts: Float64Array; cum: Float64Array; len: number };
let spine: Spine | null = null;

/** The spine (absolute M, L and C only), flattened into a polyline. */
function flatten(d: string): Spine {
  const tok = d.match(/[MLC]|-?\d+(?:\.\d+)?/g) ?? [];
  const pts: number[] = [];
  let k = 0;
  let cmd = "M";
  const num = () => Number(tok[k++]);
  while (k < tok.length) {
    if (/^[MLC]$/.test(tok[k])) cmd = tok[k++];
    if (cmd === "C") {
      const x0 = pts[pts.length - 2];
      const y0 = pts[pts.length - 1];
      const [ax, ay, bx, by, x, y] = [num(), num(), num(), num(), num(), num()];
      for (let i = 1; i <= 32; i++) {
        const t = i / 32;
        const u = 1 - t;
        pts.push(
          u * u * u * x0 + 3 * u * u * t * ax + 3 * u * t * t * bx + t * t * t * x,
          u * u * u * y0 + 3 * u * u * t * ay + 3 * u * t * t * by + t * t * t * y,
        );
      }
    } else {
      pts.push(num(), num());
    }
  }
  const n = pts.length / 2;
  const cum = new Float64Array(n);
  for (let i = 1; i < n; i++)
    cum[i] = cum[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]);
  return { pts: Float64Array.from(pts), cum, len: cum[n - 1] };
}

/** Point and heading (degrees) at arc length s along the spine. */
function along(sp: Spine, s: number): [number, number, number] {
  const n = sp.cum.length;
  let i = 1;
  while (i < n - 1 && sp.cum[i] < s) i++;
  const u = Math.min(1, Math.max(0, (s - sp.cum[i - 1]) / (sp.cum[i] - sp.cum[i - 1] || 1)));
  const x0 = sp.pts[i * 2 - 2];
  const y0 = sp.pts[i * 2 - 1];
  const dx = sp.pts[i * 2] - x0;
  const dy = sp.pts[i * 2 + 1] - y0;
  return [x0 + dx * u, y0 + dy * u, (Math.atan2(dy, dx) * 180) / Math.PI];
}

/** cubic-bezier(0.45, 0.05, 0.55, 0.95): the pace of a pass, slow at both terminals. */
function pace(x: number): number {
  const [x1, y1, x2, y2] = [0.45, 0.05, 0.55, 0.95];
  const bez = (t: number, a: number, b: number) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, x1, x2) < x) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, y1, y2);
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const round = (v: number) => Math.round(v * 100) / 100;

/**
 * Keyframes for one glow over one pass: its centre moved along the spine by
 * translate (in % of its own box, so the comet scales with the mark),
 * turned along it, and faded in and out. Every glow shares the same clock,
 * so the head and its tail stay together. The pass ends unseen.
 */
export function cometKeyframes(glow: CometGlow): Keyframe[] {
  const sp = (spine ??= flatten(MARK_D_SPINE));
  const frames: Keyframe[] = [];
  let heading = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const at = (i / SAMPLES) * OUT_TO;
    const s = pace(at / TRAVEL) * REACH * sp.len - glow.lag;
    const [x, y, deg] = along(sp, Math.min(sp.len, Math.max(0, s)));
    // Unwrap the heading so a turn never spins the long way round.
    heading = i === 0 ? deg : heading + ((((deg - heading) % 360) + 540) % 360) - 180;
    const fade = smooth(0, IN, at) * (1 - smooth(OUT_FROM, OUT_TO, at));
    const edge = smooth(0, EDGE, s) * (1 - smooth(sp.len - EDGE, sp.len, s));
    frames.push({
      offset: i / SAMPLES,
      transform: `translate(${round((x / glow.long) * 100)}%, ${round((y / glow.wide) * 100)}%) rotate(${round(heading)}deg)`,
      opacity: round(glow.alpha * fade * edge),
    });
  }
  return frames;
}
