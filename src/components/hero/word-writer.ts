import { GLYPHS, GLYPH_UPM } from "./glyphs";
import { frameGeneration, onFrames } from "./frame-clock";

/**
 * The hero word that writes itself (iteration-2 §B): decisions → insights →
 * automations → analytics → again.
 *
 * Each word, letter by letter, left to right: the letter's outline is drawn
 * as a glowing line led by a small bright pen light; the royal→sky fill
 * floods up behind the pen; the word holds while a slow sheen crosses it;
 * then, right to left, each letter comes apart into fine sparks that rise
 * and fade, and the next word writes.
 *
 * The outlines are the real Poppins 600 contours (glyphs.ts), placed exactly
 * where the browser laid out the same letters in the slot's hidden copy of
 * every word. So the canvas word sits on the text word to within a pixel
 * (the browser snaps the text and the canvas to the pixel grid each its own
 * way; outlines and advances match the served font exactly), and the
 * two hand over without a jump: the text shows first (server HTML, no
 * JavaScript) and again whenever the writer is frozen.
 *
 * Everything drawn is a pure function of (word, time) — the sparks are
 * seeded, not simulated — so freezing, resuming and resizing need no state
 * beyond the clock. Nothing runs while frozen; the caller freezes it off
 * screen, in a hidden tab, under reduced motion and while motion is paused.
 * It draws on the hero's frame clock (frame-clock.ts), in the silk's frames.
 *
 * It only ever draws the words it was given, over the text it measured: if
 * anything rewrites that text — a browser translating the page — it stops
 * for good and the (translated) text word stays.
 *
 * The footer's wordmark (iteration-3 §A) writes with the same engine, its
 * Title Case words with the capitals' outlines (glyphs-upper.ts, which the
 * caller fetches and passes in only for words that have one, so the hero
 * never loads them), and a pen nib instead of the hero's point of light: the nib rides the writing edge,
 * lifts as it hops from one letter to the next, and rises away once the
 * word is written.
 */

/**
 * How much the writer draws: "full" on a desktop-class device, "lite" on a
 * touch or low-end one (HeroWords decides).
 */
export type WriterTier = "full" | "lite";

/**
 * What leads the line: "light", the hero's small bright point; "nib", a
 * fountain-pen nib with a smaller light at its tip (the footer's).
 */
export type WriterPen = "light" | "nib";

export type Writer = {
  /** Play, or freeze and show the current word as text. */
  setRunning(run: boolean): void;
  /** Re-read the colour tokens (theme change). */
  repaint(): void;
  destroy(): void;
};

/* ── Timing (seconds) ─────────────────────────────────────────────────── */

/** Pen time per letter: a base plus a share of the outline's length (in em). */
const DRAW_BASE = 0.1;
const DRAW_PER_EM = 0.034;
/** The next letter starts when this much of the current one is drawn. */
const OVERLAP = 0.62;
/** Pen glide from one letter to the next. */
const HOP = 0.07;
/** The fill starts this far into a letter's outline and rises for FLOOD. */
const FLOOD_AT = 0.5;
const FLOOD = 0.42;
/** After the fill, the outline's glow fades over DECAY. */
const DECAY = 0.45;
/** The written word holds; a sheen starts just after the glow has gone. */
const HOLD = 1.8;
const SHEEN_AT = 0.5;
const SHEEN = 1.2;
/** Exit: letters come apart right to left, EXIT_STEP apart, each over EXIT. */
const EXIT_STEP = 0.065;
const EXIT = 0.5;
const GAP = 0.06;
const SPARK_LIFE = 1.0;

/* ── Look (in em of the headline's font size) ─────────────────────────── */

const W_GLOW = 0.09;
const W_MID = 0.034;
const W_CORE = 0.012;
const TRAIL = 0.5;
const PEN_HALO = 0.19;
const PEN_CORE = 0.028;
const SHEEN_W = 0.75;
const LIFT = 0.06;
/**
 * The nib: its length and width, the angle it is held at (up and to the
 * right of the line, as a right hand holds a pen; canvas y points down),
 * how far it sways while writing, how far it lifts away when it arrives and
 * leaves, and how far it rises as it hops between letters.
 */
const NIB_LEN = 0.56;
const NIB_W = 0.2;
const NIB_ANGLE = (-50 * Math.PI) / 180;
const NIB_SWAY = (4 * Math.PI) / 180;
const NIB_AWAY = 0.35;
const NIB_HOP = 0.1;
/** A letter comes apart through many small soft holes; some of them send up a spark. */
const HOLE = 0.075;
const HOLES_PER_GLYPH = 80;

/**
 * Per tier: the shortest frame interval (ms), the share of each letter's
 * holes used (fewer, larger holes cover the same ink), one spark per this
 * many holes, and the kill switch's budget: the longest a drawn frame may
 * take (median, ms) over any window of KILL_WINDOW of them, timed from the
 * start of the frame's callbacks until the browser has rendered it — the
 * page's own restyle, paint and commit count, and the silk's drawing in the
 * frames the two share, not just this canvas's drawing.
 */
const TIERS: Record<WriterTier, { frameMs: number; holes: number; sparkEvery: number; budgetMs: number }> = {
  // At most 60 fps, also on 120 Hz screens. Over budget, it steps down to
  // lite. The letters coming apart decide it: every frame, each of them is
  // cut by up to 80 soft holes. With the CPU slowed to half this site's
  // development desktop (about a mid-range laptop), those frames take
  // 13–19 ms even without the silk, past a 60 Hz frame, so such a laptop
  // writes the lite word; the budget is right, the dissolve is costly.
  full: { frameMs: 1000 / 60, holes: 1, sparkEvery: 2, budgetMs: 10 },
  // 30 fps, the spec's canvas rate and frame budget (§4.5), in step with the silk.
  lite: { frameMs: 1000 / 30, holes: 0.5, sparkEvery: 4, budgetMs: 22 },
};

/**
 * The canvas follows the display's pixel ratio, like the text it lies on,
 * up to this many device pixels (the silk's buffer cap, spec §4.5): sharp at
 * 3x and under browser zoom, bounded at extreme ratios.
 */
const MAX_PIXELS = 1600 * 1000;

/**
 * Kill switch: drawn frames are timed in windows of this many, from the
 * first one until a whole word has gone round (the sheen, every letter
 * coming apart, the next word's outlines and fill), so the costliest phases
 * are measured, not just the cheap ones. A window over budget steps the
 * full tier down to the lite one (timed afresh), and stops the lite one;
 * the text word stays. A window only holds frames taken while the same
 * loops share the clock (frameGeneration): when the silk starts or stops,
 * on its own kill switch too, the window starts again, so the two kill
 * switches never both fire on the same shared frames.
 */
const KILL_WINDOW = 30;

/* ── Glyph geometry (font units, shared by every word) ────────────────── */

type Loop = { pts: Float32Array; cum: Float32Array; len: number };
type Glyph = { d: string; loops: Loop[]; outer: number; box: [number, number, number, number]; seeds: Float32Array };

const glyphCache = new Map<string, Glyph>();

/** Parses the generated path data (absolute M, L, Q, Z) into flattened loops. */
function flatten(d: string): Loop[] {
  const loops: Loop[] = [];
  const tokens = d.match(/[MLQZ]|-?\d+(?:\.\d+)?/g) ?? [];
  let pts: number[] = [];
  let x = 0;
  let y = 0;
  let k = 0;
  const num = () => Number(tokens[k++]);
  const close = () => {
    if (pts.length < 4) return;
    pts.push(pts[0], pts[1]);
    const n = pts.length / 2;
    const cum = new Float32Array(n);
    for (let i = 1; i < n; i++)
      cum[i] = cum[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1]);
    loops.push({ pts: Float32Array.from(pts), cum, len: cum[n - 1] });
    pts = [];
  };
  while (k < tokens.length) {
    const cmd = tokens[k++];
    if (cmd === "M") {
      close();
      x = num();
      y = num();
      pts.push(x, y);
    } else if (cmd === "L") {
      x = num();
      y = num();
      pts.push(x, y);
    } else if (cmd === "Q") {
      const cx = num();
      const cy = num();
      const bx = num();
      const by = num();
      const len = Math.hypot(cx - x, cy - y) + Math.hypot(bx - cx, by - cy);
      const steps = Math.max(2, Math.min(10, Math.ceil(len / 28)));
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        const u = 1 - t;
        pts.push(u * u * x + 2 * u * t * cx + t * t * bx, u * u * y + 2 * u * t * cy + t * t * by);
      }
      x = bx;
      y = by;
    } else if (cmd === "Z") {
      close();
    }
  }
  close();
  return loops;
}

/** Small deterministic PRNG (mulberry32): the same sparks every time. */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Outlines beyond a–z (the capitals, glyphs-upper.ts), when the words need them. */
type ExtraGlyphs = Readonly<Record<string, string>> | undefined;

function glyph(ch: string, probe: CanvasRenderingContext2D, extra: ExtraGlyphs): Glyph | null {
  const hit = glyphCache.get(ch);
  if (hit) return hit;
  const d = GLYPHS[ch] ?? extra?.[ch];
  if (!d) return null;
  const loops = flatten(d);
  let outer = 0;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  loops.forEach((l, i) => {
    if (l.len > loops[outer].len) outer = i;
    for (let p = 0; p < l.pts.length; p += 2) {
      x0 = Math.min(x0, l.pts[p]);
      x1 = Math.max(x1, l.pts[p]);
      y0 = Math.min(y0, l.pts[p + 1]);
      y1 = Math.max(y1, l.pts[p + 1]);
    }
  });
  // Where sparks leave from: points inside the letter, by rejection sampling.
  const path = new Path2D(d);
  const rand = prng(ch.charCodeAt(0) * 7919);
  const seeds: number[] = [];
  for (let tries = 0; seeds.length < HOLES_PER_GLYPH * 2 && tries < 2000; tries++) {
    const sx = x0 + rand() * (x1 - x0);
    const sy = y0 + rand() * (y1 - y0);
    if (probe.isPointInPath(path, sx, sy)) seeds.push(sx, sy);
  }
  const g: Glyph = { d, loops, outer, box: [x0, y0, x1, y1], seeds: Float32Array.from(seeds) };
  glyphCache.set(ch, g);
  return g;
}

/* ── A word laid out on the canvas (CSS px) ───────────────────────────── */

type Spark = {
  x: number;
  y: number;
  t0: number;
  life: number;
  vx: number;
  vy: number;
  r: number;
  wob: number;
  f: number;
  ph: number;
  hot: boolean;
};

type Letter = {
  path: Path2D;
  loops: Loop[];
  outer: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Timeline: outline start and duration, fill start, exit start. */
  w: number;
  d: number;
  f: number;
  e: number;
  /** Where the letter comes apart: x, y, time, for every hole. */
  holes: Float32Array;
  sparks: Spark[];
};

type Word = {
  letters: Letter[];
  /** The fill gradient spans the word's own box, exactly as on the text. */
  gx0: number;
  gx1: number;
  top: number;
  bottom: number;
  em: number;
  fillEnd: number;
  exitStart: number;
  end: number;
};

/**
 * Poppins' ascent (hhea = typo = 1050 of 1000, USE_TYPO_METRICS set), in em:
 * the baseline sits this far below the top of a letter's text box.
 * measure() asks the served font where the browser reports it; this is the
 * fallback.
 */
const ASCENT = 1.05;

type Palette = {
  from: string;
  to: string;
  ink: string;
  line: string;
  pen: string;
  halo: string;
  spark: string;
  sheen: string;
  /** The nib: tip and heel of its body, the light along its edge, its slit. */
  nib: string;
  nibTo: string;
  nibEdge: string;
  nibSlit: string;
  glow: number;
  blend: GlobalCompositeOperation;
};

const rgb = (hex: string) => {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  const n = m ? parseInt(m[1], 16) : 0x68d4fb;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};
const rgba = (hex: string, a: number) => {
  const [r, g, b] = rgb(hex);
  return `rgb(${r} ${g} ${b} / ${Math.max(0, Math.min(1, a)).toFixed(3)})`;
};

/** The --word-* tokens (globals.css), read from the slot so they follow the theme. */
function readPalette(el: Element): Palette {
  const cs = getComputedStyle(el);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const glow = parseFloat(cs.getPropertyValue("--word-glow"));
  return {
    from: v("--word-from", "#036bfb"),
    to: v("--word-to", "#68d4fb"),
    ink: v("--word-ink", "#68d4fb"),
    line: v("--word-line", "#ffffff"),
    pen: v("--word-pen", "#ffffff"),
    halo: v("--word-halo", "#68d4fb"),
    spark: v("--word-spark", "#ffffff"),
    sheen: v("--word-sheen", "#ffffff"),
    nib: v("--word-nib", "#022970"),
    nibTo: v("--word-nib-to", "#036bfb"),
    nibEdge: v("--word-nib-edge", "#68d4fb"),
    nibSlit: v("--word-nib-slit", "#f6f9fe"),
    glow: Number.isFinite(glow) ? glow : 1,
    blend: v("--word-blend", "source-over") === "lighter" ? "lighter" : "source-over",
  };
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Point at arc length s of a flattened loop. */
function pointAt(l: Loop, s: number): [number, number] {
  const n = l.cum.length;
  if (s <= 0) return [l.pts[0], l.pts[1]];
  if (s >= l.len) return [l.pts[(n - 1) * 2], l.pts[(n - 1) * 2 + 1]];
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (l.cum[mid] < s) lo = mid;
    else hi = mid;
  }
  const u = (s - l.cum[lo]) / (l.cum[hi] - l.cum[lo] || 1);
  return [
    l.pts[lo * 2] + (l.pts[hi * 2] - l.pts[lo * 2]) * u,
    l.pts[lo * 2 + 1] + (l.pts[hi * 2 + 1] - l.pts[lo * 2 + 1]) * u,
  ];
}

/** Adds the part [a, b] (arc length) of a loop to the current path. */
function tracePart(g: CanvasRenderingContext2D, l: Loop, a: number, b: number) {
  if (b <= a) return;
  const [sx, sy] = pointAt(l, a);
  g.moveTo(sx, sy);
  for (let i = 1; i < l.cum.length; i++) {
    if (l.cum[i] <= a) continue;
    if (l.cum[i] >= b) break;
    g.lineTo(l.pts[i * 2], l.pts[i * 2 + 1]);
  }
  const [ex, ey] = pointAt(l, b);
  g.lineTo(ex, ey);
}

/** A soft round sprite: colour at the centre fading to nothing at the edge. */
function sprite(color: string, stops: [number, number][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const h = c.getContext("2d");
  if (h) {
    const grad = h.createRadialGradient(32, 32, 0, 32, 32, 32);
    for (const [at, a] of stops) grad.addColorStop(at, rgba(color, a));
    h.fillStyle = grad;
    h.fillRect(0, 0, 64, 64);
  }
  return c;
}

export function createWriter({
  slot,
  canvas,
  words,
  tier,
  pen = "light",
  capitals,
}: {
  /** Holds one `[data-i]` span per word (the hidden copies the letters are measured from). */
  slot: HTMLElement;
  /** Laid over the slot, larger than it on every side (sparks rise above the line). */
  canvas: HTMLCanvasElement;
  words: readonly string[];
  tier: WriterTier;
  pen?: WriterPen;
  /** The outlines of A–Z (glyphs-upper.ts), for words with capitals; without them such words are not written. */
  capitals?: Readonly<Record<string, string>>;
}): Writer | null {
  const ctx = canvas.getContext("2d");
  const layerCanvas = document.createElement("canvas");
  const layerCtx = layerCanvas.getContext("2d");
  const probeCtx = document.createElement("canvas").getContext("2d");
  if (!ctx || !layerCtx || !probeCtx || words.length < 2) return null;
  for (const w of words) for (const ch of w) if (!glyph(ch, probeCtx, capitals)) return null;
  const g = ctx;
  const lg = layerCtx;
  const probe = probeCtx;
  /** The tier now: the kill switch can step full down to lite. */
  let level = tier;
  let { frameMs, holes: holeShare, sparkEvery, budgetMs } = TIERS[level];
  /** Fewer holes are larger, so a letter still comes apart completely. */
  let holeR = HOLE / Math.sqrt(holeShare);

  let palette = readPalette(slot);
  let halo = sprite(palette.halo, [
    [0, 1],
    [0.22, 0.55],
    [0.55, 0.14],
    [1, 0],
  ]);
  const disc = sprite("#000000", [
    [0, 1],
    [0.55, 0.85],
    [1, 0],
  ]);
  let layout: Word[] = [];
  let dpr = 1;
  /** The nib's outline, for the font size it was built at. */
  let nibPath: Path2D | null = null;
  let nibEm = 0;

  let k = 0; // current word
  let tau = 0; // seconds into it
  let live = false;
  let dead = false;
  let stopClock: (() => void) | null = null;
  let last = 0;
  /** Kill switch: still timing; the window's frame times; the frame being rendered; the clock's generation the window shares; the word timing began on; a whole word seen since. */
  let timing = true;
  const frameTimes: number[] = [];
  let frameStart = 0;
  let frameGen = -1;
  let timedFrom = -1;
  let cycled = false;
  // A message posted from a frame is handled once the browser has rendered it.
  const rendered = new MessageChannel();
  rendered.port1.onmessage = () => {
    if (dead || !frameStart) return;
    const took = performance.now() - frameStart;
    frameStart = 0;
    // A loop joined or left the clock since the window began (the silk
    // started or stopped, on its own kill switch too): time afresh.
    if (frameGeneration() !== frameGen) {
      frameTimes.length = 0;
      return;
    }
    frameTimes.push(took);
    if (frameTimes.length < KILL_WINDOW) return;
    const median = frameTimes.sort((a, b) => a - b)[KILL_WINDOW >> 1];
    frameTimes.length = 0;
    if (median > budgetMs) {
      if (level === "full") stepDown();
      else die();
      return;
    }
    // A whole word has been timed: stop at the end of this window.
    if (cycled) timing = false;
  };
  /** The last frame drawn was a still one: until something moves, skip. */
  let settled = false;

  /**
   * Every word's copy still holds exactly that word, as one text node. False
   * once a page translator (or anything else) has rewritten it: the writer
   * would draw the original word over the hidden new text or, finding no
   * text node, draw nowhere.
   */
  function textIntact(): boolean {
    const spans = slot.querySelectorAll<HTMLElement>("[data-i]");
    return words.every((word, i) => {
      const node = spans[i]?.firstChild;
      return spans[i]?.childNodes.length === 1 && node?.nodeType === Node.TEXT_NODE && node.textContent === word;
    });
  }

  /** Reads where the browser put every letter of every word; builds the timelines. */
  function measure() {
    const c = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    dpr = Math.min(ratio, Math.sqrt(MAX_PIXELS / Math.max(1, c.width * c.height)));
    canvas.width = Math.max(1, Math.round(c.width * dpr));
    canvas.height = Math.max(1, Math.round(c.height * dpr));
    const cs = getComputedStyle(slot);
    const em = parseFloat(cs.fontSize) || 16;
    const s = em / GLYPH_UPM;
    // The ascent of the font the browser actually laid the words out in.
    probe.font = `${cs.fontWeight} ${em}px ${cs.fontFamily}`;
    const reported = probe.measureText("d").fontBoundingBoxAscent;
    const ascent = Number.isFinite(reported) && reported > 0 ? reported : ASCENT * em;
    const spans = slot.querySelectorAll<HTMLElement>("[data-i]");
    const range = document.createRange();
    let maxW = 0;
    let maxH = 0;
    layout = words.map((word, wi) => {
      const span = spans[wi];
      const text = span?.firstChild;
      const box = span?.getBoundingClientRect();
      const letters: Letter[] = [];
      let t = 0.08;
      let top = Infinity;
      let bottom = -Infinity;
      for (let i = 0; i < word.length; i++) {
        const gl = glyph(word[i], probe, capitals)!;
        let ox = 0;
        let base = 0;
        if (text && text.nodeType === Node.TEXT_NODE && i < (text.textContent ?? "").length) {
          range.setStart(text, i);
          range.setEnd(text, i + 1);
          const r = range.getBoundingClientRect();
          ox = r.left - c.left;
          base = r.top - c.top + ascent;
        }
        const path = new Path2D();
        path.addPath(new Path2D(gl.d), new DOMMatrix([s, 0, 0, s, ox, base]));
        const loops = gl.loops.map((l) => {
          const pts = new Float32Array(l.pts.length);
          for (let p = 0; p < pts.length; p += 2) {
            pts[p] = ox + l.pts[p] * s;
            pts[p + 1] = base + l.pts[p + 1] * s;
          }
          return { pts, cum: l.cum.map((v) => v * s), len: l.len * s };
        });
        const [bx0, by0, bx1, by1] = gl.box;
        const L: Letter = {
          path,
          loops,
          outer: gl.outer,
          x0: ox + bx0 * s,
          y0: base + by0 * s,
          x1: ox + bx1 * s,
          y1: base + by1 * s,
          w: t,
          d: DRAW_BASE + (gl.loops[gl.outer].len / GLYPH_UPM) * DRAW_PER_EM,
          f: 0,
          e: 0,
          holes: new Float32Array(0),
          sparks: [],
        };
        L.f = t + L.d * FLOOD_AT;
        top = Math.min(top, L.y0);
        bottom = Math.max(bottom, L.y1);
        maxW = Math.max(maxW, L.x1 - L.x0);
        maxH = Math.max(maxH, L.y1 - L.y0);
        letters.push(L);
        t += L.d * OVERLAP;
      }
      const lastL = letters[letters.length - 1];
      const fillEnd = lastL.f + FLOOD;
      const exitStart = fillEnd + HOLD;
      const n = letters.length;
      letters.forEach((L, i) => {
        L.e = exitStart + (n - 1 - i) * EXIT_STEP;
        // The dissolve runs through the letter right to left; each hole opens
        // as it passes, and some of them send up a spark.
        const gl = glyph(word[i], probe, capitals)!;
        const rand = prng((wi + 1) * 1009 + i * 97);
        const span = L.x1 - L.x0 || 1;
        const count = Math.round((gl.seeds.length / 2) * holeShare);
        L.holes = new Float32Array(count * 3);
        for (let j = 0; j < count; j++) {
          const sx = L.x0 + (gl.seeds[j * 2] - gl.box[0]) * s;
          const sy = L.y0 + (gl.seeds[j * 2 + 1] - gl.box[1]) * s;
          const t0 = L.e + EXIT * 0.7 * ((L.x1 - sx) / span) + rand() * 0.08;
          L.holes.set([sx, sy, t0], j * 3);
          if (j % sparkEvery !== 0) continue;
          L.sparks.push({
            x: sx,
            y: sy,
            t0,
            life: 0.45 + rand() * (SPARK_LIFE - 0.45),
            vx: (rand() - 0.3) * 0.4 * em,
            vy: -(0.25 + rand() * 0.8) * em,
            r: (0.006 + rand() ** 2 * 0.024) * em,
            wob: rand() * 0.035 * em,
            f: 5 + rand() * 7,
            ph: rand() * Math.PI * 2,
            hot: rand() > 0.55,
          });
        }
      });
      return {
        letters,
        gx0: box ? box.left - c.left : letters[0].x0,
        gx1: box ? box.right - c.left : lastL.x1,
        top,
        bottom,
        em,
        fillEnd,
        exitStart,
        end: exitStart + (n - 1) * EXIT_STEP + EXIT + GAP,
      };
    });
    // One scratch layer, big enough for any letter, for the dissolve.
    const pad = 0.2 * em;
    layerCanvas.width = Math.ceil((maxW + 2 * pad) * dpr);
    layerCanvas.height = Math.ceil((maxH + 2 * pad) * dpr);
    settled = false;
  }

  /* ── Drawing ───────────────────────────────────────────────────────── */

  function gradient(c: CanvasRenderingContext2D, W: Word) {
    const fill = c.createLinearGradient(W.gx0, 0, W.gx1, 0);
    fill.addColorStop(0, palette.from);
    fill.addColorStop(1, palette.to);
    return fill;
  }

  /** A letter coming apart: drawn on the scratch layer, sparks punch soft holes, then it lifts and fades. */
  function drawDissolving(W: Word, L: Letter, x: number) {
    const em = W.em;
    const pad = 0.2 * em;
    const ox = L.x0 - pad;
    const oy = L.y0 - pad;
    lg.setTransform(1, 0, 0, 1, 0, 0);
    lg.globalCompositeOperation = "source-over";
    lg.globalAlpha = 1;
    lg.clearRect(0, 0, layerCanvas.width, layerCanvas.height);
    lg.setTransform(dpr, 0, 0, dpr, -ox * dpr, -oy * dpr);
    lg.fillStyle = gradient(lg, W);
    lg.fill(L.path);
    // It warms towards the spark colour as it goes.
    lg.globalCompositeOperation = "source-atop";
    lg.globalAlpha = 0.55 * x;
    lg.fillStyle = palette.halo;
    lg.fillRect(ox, oy, L.x1 - L.x0 + 2 * pad, L.y1 - L.y0 + 2 * pad);
    lg.globalCompositeOperation = "destination-out";
    lg.globalAlpha = 1;
    for (let j = 0; j < L.holes.length; j += 3) {
      const h = tau - L.holes[j + 2] + 0.04;
      if (h <= 0) continue;
      const r = Math.min(1, h / 0.18) * holeR * em;
      lg.drawImage(disc, L.holes[j] - r, L.holes[j + 1] - r, r * 2, r * 2);
    }
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1 - x * x * x;
    g.drawImage(layerCanvas, Math.round(ox * dpr), Math.round((oy - LIFT * em * x) * dpr));
    g.restore();
  }

  function drawFills(W: Word) {
    const em = W.em;
    const fill = gradient(g, W);
    for (const L of W.letters) {
      const p = clamp01((tau - L.f) / FLOOD);
      if (p <= 0) continue;
      const x = clamp01((tau - L.e) / EXIT);
      if (x >= 1) continue;
      if (x > 0) {
        drawDissolving(W, L, x);
        continue;
      }
      g.fillStyle = fill;
      if (p >= 1) {
        g.fill(L.path);
        continue;
      }
      // Flood: the fill rises from the letter's foot behind the pen, with a
      // soft surface and a thin line of light on it.
      const e = easeOut(p);
      const soft = 0.14 * em;
      const level = L.y1 - e * (L.y1 - L.y0 + soft);
      const a = Math.min(1, p * 2.2);
      g.save();
      g.beginPath();
      g.rect(L.x0 - em, level, L.x1 - L.x0 + 2 * em, L.y1 - level + em);
      g.clip();
      g.globalAlpha = a;
      g.fill(L.path);
      g.restore();
      g.save();
      g.beginPath();
      g.rect(L.x0 - em, level - soft, L.x1 - L.x0 + 2 * em, soft);
      g.clip();
      g.globalAlpha = a * 0.4;
      g.fill(L.path);
      g.restore();
      g.save();
      g.clip(L.path);
      g.globalAlpha = a * (1 - p) * palette.glow;
      g.globalCompositeOperation = palette.blend;
      g.strokeStyle = palette.ink;
      g.lineWidth = 0.022 * em;
      g.beginPath();
      g.moveTo(L.x0 - em, level);
      g.lineTo(L.x1 + em, level);
      g.stroke();
      g.restore();
    }
    g.globalAlpha = 1;
  }

  function drawSheen(W: Word) {
    const u = (tau - W.fillEnd - SHEEN_AT) / SHEEN;
    if (u <= 0 || u >= 1) return;
    const em = W.em;
    const w = SHEEN_W * em;
    const cx = W.gx0 - w + easeInOut(u) * (W.gx1 - W.gx0 + 2 * w);
    // A slanted band of light, painted only where the letters are.
    const band = g.createLinearGradient(cx - w, W.top, cx + w, W.top + w * 0.6);
    const peak = 0.55 * Math.sin(Math.PI * u) ** 0.5;
    band.addColorStop(0, rgba(palette.sheen, 0));
    band.addColorStop(0.5, rgba(palette.sheen, peak));
    band.addColorStop(1, rgba(palette.sheen, 0));
    g.save();
    g.globalCompositeOperation = "source-atop";
    g.fillStyle = band;
    g.fillRect(W.gx0 - em, W.top - em, W.gx1 - W.gx0 + 2 * em, W.bottom - W.top + 2 * em);
    g.restore();
  }

  function drawOutlines(W: Word) {
    const em = W.em;
    g.lineJoin = "round";
    g.lineCap = "round";
    g.globalCompositeOperation = palette.blend;
    for (const L of W.letters) {
      if (tau < L.w) continue;
      const filled = L.f + FLOOD;
      const glow = tau < filled ? 1 : 1 - easeOut(clamp01((tau - filled) / DECAY));
      if (glow <= 0.002) continue;
      const q = easeInOut(clamp01((tau - L.w) / L.d));
      const a = glow * palette.glow;
      const passes: [number, string, number][] = [
        [W_GLOW, palette.ink, 0.16],
        [W_MID, palette.ink, 0.5],
        [W_CORE, palette.line, 0.95],
      ];
      for (const [width, color, strength] of passes) {
        g.beginPath();
        for (const l of L.loops) tracePart(g, l, 0, l.len * q);
        g.strokeStyle = color;
        g.lineWidth = width * em;
        g.globalAlpha = Math.min(1, a * strength);
        g.stroke();
      }
      // The hot trail just behind the pen.
      if (q < 1) {
        const l = L.loops[L.outer];
        const head = l.len * q;
        for (let s = 0; s < 3; s++) {
          g.beginPath();
          tracePart(g, l, Math.max(0, head - TRAIL * em * (1 - s / 3)), head);
          g.strokeStyle = s === 2 ? palette.line : palette.ink;
          g.lineWidth = (s === 2 ? 0.02 : 0.05) * em;
          g.globalAlpha = Math.min(1, a * (0.22 + s * 0.22));
          g.stroke();
        }
      }
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  }

  function penAt(L: Letter): [number, number] {
    const l = L.loops[L.outer];
    return pointAt(l, l.len * easeInOut(clamp01((tau - L.w) / L.d)));
  }

  function drawPen(W: Word) {
    const ls = W.letters;
    if (tau < ls[0].w) return;
    const lastL = ls[ls.length - 1];
    const end = lastL.w + lastL.d;
    const fade = tau < end ? Math.min(1, (tau - ls[0].w) / 0.12) : 1 - clamp01((tau - end) / 0.25);
    if (fade <= 0) return;
    let i = 0;
    while (i + 1 < ls.length && ls[i + 1].w <= tau) i++;
    let [x, y] = penAt(ls[i]);
    let hop = 0;
    if (i > 0 && tau < ls[i].w + HOP) {
      // Glide from where the previous letter's pen is now to this letter's start.
      const u = easeInOut((tau - ls[i].w) / HOP);
      const [px, py] = penAt(ls[i - 1]);
      x = px + (x - px) * u;
      y = py + (y - py) * u;
      hop = Math.sin(Math.PI * u);
    }
    const em = W.em;
    if (pen === "nib") {
      drawNib(x, y, fade, (1 - fade) * NIB_AWAY + hop * NIB_HOP, em);
      return;
    }
    const r = PEN_HALO * em;
    g.globalCompositeOperation = palette.blend;
    g.globalAlpha = Math.min(1, fade * palette.glow);
    g.drawImage(halo, x - r, y - r, r * 2, r * 2);
    g.globalAlpha = fade;
    g.fillStyle = palette.pen;
    g.beginPath();
    g.arc(x, y, PEN_CORE * em, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  }

  /** The nib's outline at this font size: tip at the origin, heel along +x. */
  function nibOutline(em: number): Path2D {
    if (nibPath && nibEm === em) return nibPath;
    const L = NIB_LEN * em;
    const h = (NIB_W * em) / 2;
    const p = new Path2D();
    // From the tip the flanks swell out to the shoulders, then run straight to the heel.
    p.moveTo(0, 0);
    p.quadraticCurveTo(0.2 * L, 0.84 * h, 0.55 * L, h);
    p.lineTo(L, h);
    p.lineTo(L, -h);
    p.lineTo(0.55 * L, -h);
    p.quadraticCurveTo(0.2 * L, -0.84 * h, 0, 0);
    p.closePath();
    nibPath = p;
    nibEm = em;
    return p;
  }

  /**
   * The nib, its tip at (x, y): `fade` its opacity, `lift` how far (in em) it
   * stands off the line along its own axis. A small light marks the point
   * where it touches the line, and goes out as the nib lifts.
   */
  function drawNib(x: number, y: number, fade: number, lift: number, em: number) {
    const a = NIB_ANGLE + NIB_SWAY * Math.sin(tau * 5.1);
    const L = NIB_LEN * em;
    const h = (NIB_W * em) / 2;
    const touch = 1 - clamp01(lift / 0.06);
    if (touch > 0) {
      const r = PEN_HALO * 0.6 * em;
      g.globalCompositeOperation = palette.blend;
      g.globalAlpha = Math.min(1, fade * touch * palette.glow);
      g.drawImage(halo, x - r, y - r, r * 2, r * 2);
      g.globalCompositeOperation = "source-over";
    }
    g.save();
    g.translate(x + Math.cos(a) * lift * em, y + Math.sin(a) * lift * em);
    g.rotate(a);
    g.globalAlpha = fade;
    const body = g.createLinearGradient(0, 0, L, 0);
    body.addColorStop(0, palette.nib);
    body.addColorStop(1, palette.nibTo);
    g.fillStyle = body;
    g.fill(nibOutline(em));
    // Light along the upper flank, then the slit and its breather hole.
    g.globalAlpha = fade * 0.7;
    g.strokeStyle = palette.nibEdge;
    g.lineWidth = 0.012 * em;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0.06 * L, -0.06 * h);
    g.quadraticCurveTo(0.2 * L, -0.84 * h, 0.55 * L, -h);
    g.lineTo(0.96 * L, -h);
    g.stroke();
    g.globalAlpha = fade;
    g.strokeStyle = palette.nibSlit;
    g.fillStyle = palette.nibSlit;
    g.lineWidth = 0.014 * em;
    g.beginPath();
    g.moveTo(0.04 * L, 0);
    g.lineTo(0.5 * L, 0);
    g.stroke();
    g.beginPath();
    g.arc(0.5 * L, 0, 0.032 * em, 0, Math.PI * 2);
    g.fill();
    g.restore();
    g.globalAlpha = 1;
  }

  function drawSparks(W: Word, t: number) {
    g.globalCompositeOperation = palette.blend;
    for (const L of W.letters) {
      if (t < L.e) continue;
      for (const s of L.sparks) {
        const a = t - s.t0;
        if (a < 0 || a > s.life) continue;
        const u = a / s.life;
        const x = s.x + s.vx * a + s.wob * Math.sin(s.f * a + s.ph);
        const y = s.y + s.vy * a - 0.3 * W.em * a * a;
        g.globalAlpha = Math.min(1, (1 - u) ** 1.5 * (0.75 + 0.25 * Math.sin(23 * a + s.ph)) * palette.glow);
        g.fillStyle = s.hot ? palette.spark : palette.halo;
        g.beginPath();
        g.arc(x, y, s.r * (1 - 0.45 * u), 0, Math.PI * 2);
        g.fill();
      }
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  }

  function draw() {
    const W = layout[k];
    if (!W) return;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.width, canvas.height);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFills(W);
    drawSheen(W);
    drawOutlines(W);
    drawPen(W);
    // The previous word's last sparks are still rising as this one starts.
    const prev = layout[(k + layout.length - 1) % layout.length];
    if (prev !== W && tau < SPARK_LIFE) drawSparks(prev, tau + prev.end);
    drawSparks(W, tau);
  }

  /** While the word just holds (no glow, no sheen, no sparks), nothing changes. */
  function still(W: Word) {
    const sheen = W.fillEnd + SHEEN_AT;
    return tau >= W.fillEnd + DECAY && tau < W.exitStart && (tau < sheen || tau >= sheen + SHEEN) && tau > SPARK_LIFE;
  }

  /* ── Hand-over between the text word and the canvas ────────────────── */

  function setLive(on: boolean) {
    if (live === on) return;
    live = on;
    slot.dataset.live = on ? "true" : "false";
  }

  /* ── Clock ─────────────────────────────────────────────────────────── */

  function frame(now: number, began: number) {
    const dt = last ? Math.min(now - last, 100) / 1000 : 0;
    last = now;
    tau += dt;
    while (layout.length && tau >= layout[k].end) {
      tau -= layout[k].end;
      k = (k + 1) % layout.length;
      // The text under the canvas follows the word, for print (which hides
      // the canvas) and for the hand-over.
      if (live) slot.dataset.shown = String(k);
    }
    const W = layout[k];
    if (!W) return;
    const isStill = still(W);
    if (settled && isStill) return;
    try {
      draw();
    } catch {
      die();
      return;
    }
    settled = isStill;
    if (!live) {
      slot.dataset.shown = String(k);
      setLive(true);
    }
    if (timing) {
      if (!frameStart) {
        if (!frameTimes.length) frameGen = frameGeneration();
        frameStart = began;
        rendered.port2.postMessage(0);
      }
      // The word after the one timing began on has been written and filled.
      if (k !== timedFrom && tau >= W.fillEnd + DECAY) cycled = true;
    }
  }

  function stop() {
    stopClock?.();
    stopClock = null;
    last = 0;
    // The current word stays, written, as text.
    slot.dataset.shown = String(k);
    setLive(false);
  }

  /** For good: the text word stays, and nothing keeps watching the headline. */
  function die() {
    dead = true;
    stop();
    release();
  }

  /** Too costly here at full rate: carry on as the lite tier, timed afresh. */
  function stepDown() {
    level = "lite";
    ({ frameMs, holes: holeShare, sparkEvery, budgetMs } = TIERS[level]);
    holeR = HOLE / Math.sqrt(holeShare);
    try {
      measure(); // the holes and sparks, at the lite tier's share
      // measure() clears the canvas: restore the frame before it is shown,
      // not at the lite tier's next slot (the word would blink out).
      if (live) draw();
    } catch {
      die();
      return;
    }
    frameTimes.length = 0;
    frameStart = 0;
    cycled = false;
    timedFrom = k;
    if (stopClock) {
      stopClock();
      stopClock = onFrames(frameMs, frame);
    }
  }

  function start() {
    if (stopClock || dead) return;
    // Pick up in the hold of the word the text shows: the same pixels, so the
    // hand-over cannot be seen; the sheen then crosses it and it moves on.
    tau = layout[k] ? layout[k].fillEnd + DECAY : 0;
    settled = false;
    last = 0;
    // Resuming skips the rest of a word: until a whole one has been timed,
    // count from the word shown now.
    if (!cycled) timedFrom = k;
    stopClock = onFrames(frameMs, frame);
  }

  /** Measures again (a new size, a new pixel ratio) and repaints a frozen frame. */
  function remeasure() {
    if (dead) return;
    if (!textIntact()) {
      die();
      return;
    }
    try {
      measure();
      if (live) draw();
    } catch {
      die();
    }
  }

  const ro = new ResizeObserver(remeasure);
  // A translator swaps the words' text nodes; the slot need not resize.
  const mo = new MutationObserver(() => {
    if (!dead && !textIntact()) die();
  });
  // Zoom, or a move to another screen, changes the pixel ratio, often
  // without a resize: one query for the current ratio, renewed each time.
  let ratioQuery: MediaQueryList | null = null;
  function watchRatio() {
    ratioQuery?.removeEventListener("change", onRatio);
    try {
      ratioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      ratioQuery.addEventListener("change", onRatio);
    } catch {
      ratioQuery = null;
    }
  }
  function onRatio() {
    watchRatio();
    remeasure();
  }

  /** Lets go of the slot, the screen and the frame timings (a stray record or message still finds `dead`). */
  function release() {
    ro.disconnect();
    mo.disconnect();
    rendered.port1.onmessage = null;
    ratioQuery?.removeEventListener("change", onRatio);
    ratioQuery = null;
  }

  if (!textIntact()) return null;
  try {
    measure();
  } catch {
    return null;
  }
  ro.observe(slot);
  // Its line too: where the words are centred in the slot (the hero below
  // 1024px), crossing that width moves them inside a slot of the same size.
  if (slot.parentElement) ro.observe(slot.parentElement);
  mo.observe(slot, { childList: true, characterData: true, subtree: true });
  watchRatio();

  return {
    setRunning(run) {
      if (run) start();
      else stop();
    },
    repaint() {
      palette = readPalette(slot);
      halo = sprite(palette.halo, [
        [0, 1],
        [0.22, 0.55],
        [0.55, 0.14],
        [1, 0],
      ]);
      settled = false;
      if (live && !stopClock) draw();
    },
    destroy() {
      release();
      stopClock?.();
      stopClock = null;
      dead = true;
      setLive(false);
    },
  };
}
