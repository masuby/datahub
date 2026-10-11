/**
 * The numbers on the home page's live dashboard (Showcase.tsx), all made up:
 * they need only look plausible (iteration-5 §H). Each part — the line, the
 * KPIs, the bars, the donut — is a pure function of its version, the count
 * of its own changes, and partsAt maps the tick (the count of seconds since
 * the screen started moving) to every part's version. So the server draws
 * tick 0, hydration finds the same picture, and any tick can be drawn
 * without the ones before it. Values that need a fixed width keep their
 * number of digits over hours of ticking (tabular figures then hold every
 * box still).
 */

/** A repeatable value in [0, 1) for the integer `i` on channel `ch` (a 32-bit hash). */
function noise(i: number, ch: number): number {
  let h = Math.imul(i ^ 0x2c1b3c6d, 0x85ebca6b) ^ Math.imul(ch + 0x9e37, 0xc2b2ae35);
  h ^= h >>> 15;
  h = Math.imul(h, 0x27d4eb2d);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** "48210" -> "48,210" (the same in both languages). */
function group(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* ── The schedule ───────────────────────────────────────────────────── */

/**
 * Each part's version at `tick` (one tick a second). The parts take turns,
 * so a tick starts one change and the frames between ticks have little to
 * move: every animation that starts costs the main thread a few frames,
 * and each of those restyles everything else that is running. The line
 * moves on even ticks; on odd ticks, in turn, a KPI, the bars, the next
 * KPI, the donut. So the line moves every 2 s, a KPI every 4 s (each of the
 * four every 16 s), the bars and the donut every 8 s; the clock counts
 * every second. Tick 0 is version 0 of everything.
 */
export function partsAt(tick: number): { line: number; kpis: number; bars: number; donut: number } {
  /** Odd ticks so far: each starts the next change in the turn. */
  const odd = Math.floor((tick + 1) / 2);
  return {
    line: Math.floor(tick / 2),
    kpis: Math.floor((odd + 1) / 2),
    bars: Math.floor((odd + 2) / 4),
    donut: Math.floor(odd / 4),
  };
}

/* ── The line: collections per minute ───────────────────────────────── */

/** Points across the line graph; one more slides in at every version. */
export const LINE_POINTS = 20;

/** The line's value at point `i`, in [0.1, 0.9]: two slow waves and some noise. */
function pointAt(i: number): number {
  const v = 0.5 + 0.17 * Math.sin(i * 0.42) + 0.1 * Math.sin(i * 1.27 + 2) + (noise(i, 1) - 0.5) * 0.16;
  return Math.min(0.9, Math.max(0.1, v));
}

/** Height in the plot's 0–100 box (y down) of a value in [0, 1]. */
const plotY = (v: number) => 92 - v * 84;

/**
 * The line at version `step`: points from two before the left edge to one
 * past the right one (x in % of the plot, LINE_POINTS - 1 steps across
 * it), as a smooth curve (Catmull-Rom as cubic Béziers) and the area under
 * it, and the head, the newest point, sitting on the right edge. The points off
 * either edge keep the visible curve the same shape when it moves one step
 * left: every visible bend has both its neighbours drawn.
 */
export function lineAt(step: number): { line: string; area: string; head: number; value: string } {
  const dx = 100 / (LINE_POINTS - 1);
  const pts: [number, number][] = [];
  for (let k = -2; k <= LINE_POINTS; k++) pts.push([k * dx, plotY(pointAt(step + k))]);
  const f = (n: number) => n.toFixed(2);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d +=
      `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  const last = pts[pts.length - 1][0];
  const headValue = pointAt(step + LINE_POINTS - 1);
  return {
    line: d,
    area: `${d}L${f(last)} 100L${f(pts[0][0])} 100Z`,
    head: plotY(headValue),
    // TZS 2.0–6.8 mn a minute.
    value: (2 + headValue * 6).toFixed(1),
  };
}

/* ── The bars: disbursed by region ──────────────────────────────────── */

export const REGIONS = ["Dar", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Tanga"] as const;
const REGION_BASE = [0.9, 0.62, 0.72, 0.5, 0.56, 0.42];

/** Each region's bar at `version`, as a share of the plot's height, and the tallest. */
export function barsAt(version: number): { heights: number[]; top: number } {
  const heights = REGION_BASE.map((b, r) => Math.min(0.97, b * (0.78 + 0.3 * noise(version, 10 + r))));
  return { heights, top: heights.indexOf(Math.max(...heights)) };
}

/* ── The donut: repayment channels ──────────────────────────────────── */

/**
 * Mobile money, bank and cash at `version`: the first two boundaries (as
 * turns) and the three shares in whole percent. Mobile money stays within
 * 55–62% and bank within 20–26%, which the donut's drawing relies on (see
 * Donut in Showcase.tsx).
 */
export function donutAt(version: number): { e1: number; e2: number; pct: [number, number, number] } {
  const mobile = 0.55 + 0.07 * noise(version, 20);
  const bank = 0.2 + 0.06 * noise(version, 21);
  const m = Math.round(mobile * 100);
  const b = Math.round(bank * 100);
  return { e1: mobile, e2: mobile + bank, pct: [m, b, 100 - m - b] };
}

/* ── The KPIs ───────────────────────────────────────────────────────── */

export type Kpi = { value: string; delta: string; up: boolean };

/**
 * The four KPIs at `version`. They take turns: KPI j changes at versions
 * j + 1, j + 5 … (its own version), so each change moves one number.
 */
export function kpisAt(kpis: number): { collected: Kpi; borrowers: Kpi; rate: Kpi; loans: Kpi } {
  const version = (j: number) => Math.floor((kpis + 3 - j) / 4);
  const a = version(0);
  const b = version(1);
  const c = version(2);
  const d = version(3);
  // TZS mn, from 412.6, rising; folds back into 400–990 (three digits) after a long watch.
  const collected = 400 + ((12.6 + a * 0.9 + noise(a, 2) * 0.8) % 590);
  const rate = (v: number) => 96.2 + noise(v, 5) * 1.4;
  // Against the previous value, never shown as a flat 0.0.
  const rateDelta = Math.round((rate(c) - rate(c - 1)) * 10) / 10 || 0.1;
  return {
    collected: { value: collected.toFixed(1), delta: `${(2.4 + noise(a, 3) * 1.8).toFixed(1)}%`, up: true },
    borrowers: {
      value: group(48210 + b * 3 + Math.floor(noise(b, 4) * 4)),
      delta: String(126 + ((b * 3) % 800)),
      up: true,
    },
    rate: {
      value: `${rate(c).toFixed(1)}%`,
      delta: Math.abs(rateDelta).toFixed(1),
      up: rateDelta >= 0,
    },
    loans: {
      value: group(1284 + d * 2 + Math.floor(noise(d, 6) * 2)),
      delta: String(12 + Math.floor(noise(d, 7) * 30)),
      up: true,
    },
  };
}

/** The screen's clock: 09:41:00 at tick 0, a second a tick. */
export function clockAt(tick: number): string {
  const s = 9 * 3600 + 41 * 60 + tick;
  const two = (n: number) => String(n).padStart(2, "0");
  return `${two(Math.floor(s / 3600) % 24)}:${two(Math.floor(s / 60) % 60)}:${two(s % 60)}`;
}

/* ── The feed: repayments as they arrive ────────────────────────────── */

/** One repayment: amount (TZS), branch town, channel (index into the donut's), time. */
export type FeedEntry = { amount: string; town: string; channel: 0 | 1 | 2; time: string };

/** Oldest first: the feed scrolls up, so the newest arrive at the bottom. */
export const FEED: readonly FeedEntry[] = [
  { amount: "250,000", town: "Kariakoo", channel: 0, time: "09:40:12" },
  { amount: "1,200,000", town: "Arusha", channel: 1, time: "09:40:16" },
  { amount: "85,000", town: "Mwanza", channel: 0, time: "09:40:21" },
  { amount: "430,000", town: "Dodoma", channel: 2, time: "09:40:25" },
  { amount: "60,000", town: "Moshi", channel: 0, time: "09:40:29" },
  { amount: "2,750,000", town: "Mbeya", channel: 1, time: "09:40:34" },
  { amount: "120,000", town: "Tanga", channel: 0, time: "09:40:38" },
  { amount: "315,000", town: "Morogoro", channel: 2, time: "09:40:43" },
  { amount: "95,000", town: "Iringa", channel: 0, time: "09:40:47" },
  { amount: "640,000", town: "Zanzibar", channel: 1, time: "09:40:52" },
  { amount: "180,000", town: "Kigoma", channel: 0, time: "09:40:56" },
  { amount: "52,000", town: "Sinza", channel: 0, time: "09:41:00" },
];
