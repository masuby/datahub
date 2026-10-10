#!/usr/bin/env node
/**
 * Generates the two data files the hero headline needs from the Outfit 700
 * font the posters already use (assets/fonts/Outfit-700.ttf):
 *
 *   glyphs.ts         the outlines of a–z, for the word that writes itself
 *                     (the client draws each letter's outline with a pen of
 *                     light, so it needs the real contours, not the text)
 *   outfit-metrics.ts advance widths of printable ASCII, so the server can
 *                     size the headline to fit its column without measuring
 *
 *   node scripts/make-glyphs.mjs
 *
 * Reads the font from disk, never the network. Only the generated TypeScript
 * is imported by the site.
 *
 * Outfit is a variable font and its instances keep overlapping contours (the
 * stem of an "a" is a rectangle laid over the bowl). Filled, that is
 * invisible; stroked, the hidden edges would show as lines inside the
 * letter. So every contour segment is split where it meets another contour,
 * only the pieces on the boundary of the filled shape are kept, and those are
 * chained back into closed loops: the original quadratic curves, no overlaps.
 * Each loop starts at its topmost point, where a hand would start writing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const FONT = resolve(here, "../assets/fonts/Outfit-700.ttf");
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

/* ── TrueType reader: just the tables we need ─────────────────────────── */

function readFont(file) {
  const buf = readFileSync(file);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const u16 = (o) => dv.getUint16(o);
  const i16 = (o) => dv.getInt16(o);
  const u32 = (o) => dv.getUint32(o);
  const tables = {};
  for (let i = 0; i < u16(4); i++) {
    const o = 12 + i * 16;
    tables[String.fromCharCode(buf[o], buf[o + 1], buf[o + 2], buf[o + 3])] = u32(o + 8);
  }
  const upm = u16(tables.head + 18);
  const longLoca = i16(tables.head + 50) === 1;
  const numHMetrics = u16(tables.hhea + 34);

  // cmap: Windows Unicode BMP subtable (format 4).
  const cmap = new Map();
  for (let i = 0; i < u16(tables.cmap + 2); i++) {
    const rec = tables.cmap + 4 + i * 8;
    if (u16(rec) !== 3 || u16(rec + 2) !== 1) continue;
    const st = tables.cmap + u32(rec + 4);
    if (u16(st) !== 4) continue;
    const segX2 = u16(st + 6);
    const ends = st + 14;
    const starts = ends + segX2 + 2;
    const deltas = starts + segX2;
    const ranges = deltas + segX2;
    for (let s = 0; s < segX2 / 2; s++) {
      const first = u16(starts + s * 2);
      const end = u16(ends + s * 2);
      const delta = i16(deltas + s * 2);
      const ro = u16(ranges + s * 2);
      for (let c = first; c <= end && c !== 0xffff; c++) {
        if (ro === 0) {
          cmap.set(c, (c + delta) & 0xffff);
        } else {
          const gi = u16(ranges + s * 2 + ro + (c - first) * 2);
          cmap.set(c, gi === 0 ? 0 : (gi + delta) & 0xffff);
        }
      }
    }
  }
  const glyphOf = (ch) => cmap.get(ch.codePointAt(0)) ?? 0;
  const advance = (g) => u16(tables.hmtx + Math.min(g, numHMetrics - 1) * 4);
  const loca = (g) => (longLoca ? u32(tables.loca + g * 4) : u16(tables.loca + g * 2) * 2);

  /** Contours of glyph g as arrays of { x, y, on } (font units, y up). */
  function contours(g) {
    const start = loca(g);
    if (loca(g + 1) === start) return [];
    const o = tables.glyf + start;
    const nc = i16(o);
    if (nc < 0) {
      // Composite: transformed copies of other glyphs.
      const out = [];
      let p = o + 10;
      for (;;) {
        const flags = u16(p);
        const gi = u16(p + 2);
        p += 4;
        let dx;
        let dy;
        if (flags & 1) {
          dx = i16(p);
          dy = i16(p + 2);
          p += 4;
        } else {
          dx = (buf[p] << 24) >> 24;
          dy = (buf[p + 1] << 24) >> 24;
          p += 2;
        }
        let [a, b, c, d] = [1, 0, 0, 1];
        const f2 = (q) => i16(q) / 16384;
        if (flags & 8) {
          a = d = f2(p);
          p += 2;
        } else if (flags & 0x40) {
          a = f2(p);
          d = f2(p + 2);
          p += 4;
        } else if (flags & 0x80) {
          [a, b, c, d] = [f2(p), f2(p + 2), f2(p + 4), f2(p + 6)];
          p += 8;
        }
        for (const ct of contours(gi))
          out.push(ct.map((q) => ({ x: a * q.x + c * q.y + dx, y: b * q.x + d * q.y + dy, on: q.on })));
        if (!(flags & 0x20)) break;
      }
      return out;
    }
    const endPts = Array.from({ length: nc }, (_, i) => u16(o + 10 + i * 2));
    const nPts = endPts[nc - 1] + 1;
    let p = o + 12 + nc * 2 + u16(o + 10 + nc * 2);
    const flags = [];
    while (flags.length < nPts) {
      const f = buf[p++];
      flags.push(f);
      if (f & 8) for (let r = buf[p++]; r > 0; r--) flags.push(f);
    }
    const coords = (shortBit, sameBit) => {
      const out = [];
      let v = 0;
      for (const f of flags) {
        if (f & shortBit) {
          const d = buf[p++];
          v += f & sameBit ? d : -d;
        } else if (!(f & sameBit)) {
          v += i16(p);
          p += 2;
        }
        out.push(v);
      }
      return out;
    };
    const xs = coords(2, 16);
    const ys = coords(4, 32);
    const out = [];
    let s = 0;
    for (const e of endPts) {
      const pts = [];
      for (let i = s; i <= e; i++) pts.push({ x: xs[i], y: ys[i], on: (flags[i] & 1) === 1 });
      out.push(pts);
      s = e + 1;
    }
    return out;
  }
  return { upm, glyphOf, advance, contours };
}

/* ── Geometry ─────────────────────────────────────────────────────────── */

const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const cross = (a, b, p) => (b.x - a.x) * (p.y - a.y) - (p.x - a.x) * (b.y - a.y);

/** TrueType points (quadratic, implied on-curve midpoints) -> L/Q segments, y flipped to screen space. */
function toSegments(pts) {
  const P = (q) => ({ x: q.x, y: -q.y });
  const n = pts.length;
  const si = pts.findIndex((q) => q.on);
  const start = si < 0 ? P({ x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }) : P(pts[si]);
  const i0 = si < 0 ? 0 : si + 1;
  const segs = [];
  let cur = start;
  let ctrl = null;
  for (let c = 0; c < n; c++) {
    const idx = (i0 + c) % n;
    if (si >= 0 && idx === si) break;
    const q = pts[idx];
    if (q.on) {
      const b = P(q);
      segs.push(ctrl ? { t: "Q", a: cur, c: ctrl, b } : { t: "L", a: cur, b });
      cur = b;
      ctrl = null;
    } else {
      const cq = P(q);
      if (ctrl) {
        const mid = { x: (ctrl.x + cq.x) / 2, y: (ctrl.y + cq.y) / 2 };
        segs.push({ t: "Q", a: cur, c: ctrl, b: mid });
        cur = mid;
      }
      ctrl = cq;
    }
  }
  if (ctrl) segs.push({ t: "Q", a: cur, c: ctrl, b: start });
  else if (dist(cur, start) > 1e-9) segs.push({ t: "L", a: cur, b: start });
  return segs;
}

function at(s, t) {
  if (s.t === "L") return { x: s.a.x + (s.b.x - s.a.x) * t, y: s.a.y + (s.b.y - s.a.y) * t };
  const u = 1 - t;
  return {
    x: u * u * s.a.x + 2 * u * t * s.c.x + t * t * s.b.x,
    y: u * u * s.a.y + 2 * u * t * s.c.y + t * t * s.b.y,
  };
}
function deriv(s, t) {
  if (s.t === "L") return { x: s.b.x - s.a.x, y: s.b.y - s.a.y };
  return {
    x: 2 * (1 - t) * (s.c.x - s.a.x) + 2 * t * (s.b.x - s.c.x),
    y: 2 * (1 - t) * (s.c.y - s.a.y) + 2 * t * (s.b.y - s.c.y),
  };
}
/** The part of s between t0 and t1, as a segment of the same kind. */
function sub(s, t0, t1) {
  const a = at(s, t0);
  const b = at(s, t1);
  if (s.t === "L") return { t: "L", a, b };
  const d = deriv(s, t0);
  const k = (t1 - t0) / 2;
  return { t: "Q", a, c: { x: a.x + d.x * k, y: a.y + d.y * k }, b };
}

const STEPS = 48;
const flat = (s) => Array.from({ length: STEPS + 1 }, (_, k) => at(s, k / STEPS));

function windingAt(contours, p) {
  let w = 0;
  for (const segs of contours)
    for (const s of segs) {
      const f = flat(s);
      for (let k = 0; k < STEPS; k++) {
        const a = f[k];
        const b = f[k + 1];
        if (a.y <= p.y) {
          if (b.y > p.y && cross(a, b, p) > 0) w++;
        } else if (b.y <= p.y && cross(a, b, p) < 0) w--;
      }
    }
  return w;
}

function crossings(s, o) {
  const fs = flat(s);
  const fo = flat(o);
  const ts = [];
  for (let i = 0; i < STEPS; i++) {
    const p = fs[i];
    const r = { x: fs[i + 1].x - p.x, y: fs[i + 1].y - p.y };
    for (let j = 0; j < STEPS; j++) {
      const q = fo[j];
      const v = { x: fo[j + 1].x - q.x, y: fo[j + 1].y - q.y };
      const den = r.x * v.y - r.y * v.x;
      if (Math.abs(den) < 1e-12) continue;
      const u = ((q.x - p.x) * v.y - (q.y - p.y) * v.x) / den;
      const w = ((q.x - p.x) * r.y - (q.y - p.y) * r.x) / den;
      if (u >= 0 && u <= 1 && w >= 0 && w <= 1) ts.push((i + u) / STEPS);
    }
  }
  return ts;
}

/** Parameter of the point of s nearest to v, and how far it is. */
function nearest(s, v) {
  const f = flat(s);
  let best = { t: 0, d: Infinity };
  for (let k = 0; k < STEPS; k++) {
    const a = f[k];
    const dx = f[k + 1].x - a.x;
    const dy = f[k + 1].y - a.y;
    const u = Math.max(0, Math.min(1, ((v.x - a.x) * dx + (v.y - a.y) * dy) / (dx * dx + dy * dy || 1e-12)));
    const d = Math.hypot(a.x + dx * u - v.x, a.y + dy * u - v.y);
    if (d < best.d) best = { t: (k + u) / STEPS, d };
  }
  return best;
}

const area = (loop) => {
  let a = 0;
  for (const s of loop) for (let k = 0; k < 8; k++) {
    const p = at(s, k / 8);
    const q = at(s, (k + 1) / 8);
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
};

/** Boundary of the nonzero fill of overlapping contours, as closed loops of the original segments. */
function removeOverlaps(contours) {
  const pieces = [];
  contours.forEach((segs, ci) => {
    segs.forEach((s, si) => {
      const ts = [];
      contours.forEach((other, oi) =>
        other.forEach((o, oj) => {
          const n = segs.length;
          if (oi === ci && (oj === si || oj === (si + 1) % n || oj === (si + n - 1) % n)) return;
          ts.push(...crossings(s, o));
          // T-junctions and shared edges: split where another contour's vertex touches s.
          for (const v of [o.a, o.b]) {
            const hit = nearest(s, v);
            if (hit.d < 0.6) ts.push(hit.t);
          }
        }),
      );
      const cuts = [0];
      for (const t of ts.filter((t) => t > 1e-3 && t < 1 - 1e-3).sort((a, b) => a - b))
        if (t - cuts[cuts.length - 1] > 2e-3) cuts.push(t);
      if (cuts.length > 1 && 1 - cuts[cuts.length - 1] < 2e-3) cuts.pop();
      cuts.push(1);
      for (let k = 0; k < cuts.length - 1; k++) {
        const piece = sub(s, cuts[k], cuts[k + 1]);
        // On the boundary when exactly one side of it is filled (majority of three probes).
        let votes = 0;
        for (const tm of [0.3, 0.5, 0.7]) {
          const m = at(piece, tm);
          const d = deriv(piece, tm);
          const len = Math.hypot(d.x, d.y) || 1;
          const nx = (-d.y / len) * 1.5;
          const ny = (d.x / len) * 1.5;
          const a = windingAt(contours, { x: m.x + nx, y: m.y + ny }) !== 0;
          const b = windingAt(contours, { x: m.x - nx, y: m.y - ny }) !== 0;
          if (a !== b) votes++;
        }
        if (votes >= 2) pieces.push(piece);
      }
    });
  });
  // Coincident edges from two contours: keep one.
  const kept = [];
  for (const p of pieces) {
    const mp = at(p, 0.5);
    if (!kept.some((q) => dist(q.a, p.a) < 1 && dist(q.b, p.b) < 1 && dist(at(q, 0.5), mp) < 1)) kept.push(p);
  }
  // Chain end-to-start into closed loops (every piece keeps its contour's direction).
  const used = new Array(kept.length).fill(false);
  const loops = [];
  for (let i = 0; i < kept.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const loop = [kept[i]];
    let closed = false;
    for (;;) {
      const end = loop[loop.length - 1].b;
      if (loop.length > 1 && dist(end, loop[0].a) < 2.5) {
        loop[loop.length - 1].b = loop[0].a;
        closed = true;
        break;
      }
      let best = -1;
      let bd = 2.5;
      kept.forEach((q, j) => {
        if (!used[j] && dist(end, q.a) < bd) {
          bd = dist(end, q.a);
          best = j;
        }
      });
      if (best < 0) break;
      used[best] = true;
      kept[best].a = end;
      loop.push(kept[best]);
    }
    // Slivers left over from coincident edges are open or have no area: drop them.
    if (closed && Math.abs(area(loop)) > 200) loops.push(loop);
  }
  return loops.map((loop) => {
    // Merge consecutive collinear lines, then start at the topmost point.
    const out = [];
    for (const s of loop) {
      const prev = out[out.length - 1];
      if (prev && prev.t === "L" && s.t === "L" && Math.abs(cross(prev.a, prev.b, s.b)) < 0.5 * dist(prev.a, s.b)) {
        prev.b = s.b;
      } else out.push(s);
    }
    let top = 0;
    out.forEach((s, k) => {
      const a = s.a;
      const b = out[top].a;
      if (a.y < b.y - 0.5 || (Math.abs(a.y - b.y) <= 0.5 && a.x < b.x)) top = k;
    });
    return [...out.slice(top), ...out.slice(0, top)];
  });
}

function toPath(loops) {
  const r = (v) => Math.round(v);
  const P = (p) => `${r(p.x)} ${r(p.y)}`;
  return loops
    .map((loop) => {
      let d = `M${P(loop[0].a)}`;
      loop.forEach((s, i) => {
        if (s.t === "Q") d += `Q${P(s.c)} ${P(s.b)}`;
        else if (i < loop.length - 1) d += `L${P(s.b)}`;
      });
      return `${d}Z`;
    })
    .join("");
}

/* ── Output ───────────────────────────────────────────────────────────── */

const font = readFont(FONT);
const glyphs = {};
for (const ch of LETTERS) {
  const loops = removeOverlaps(font.contours(font.glyphOf(ch)).map(toSegments));
  glyphs[ch] = toPath(loops);
}
const advances = {};
for (let c = 32; c < 127; c++) {
  const ch = String.fromCharCode(c);
  const g = font.glyphOf(ch);
  if (g) advances[ch] = font.advance(g);
}

const banner = (what) =>
  `// GENERATED by scripts/make-glyphs.mjs from assets/fonts/Outfit-700.ttf\n` +
  `// (SIL Open Font License). Do not edit by hand; re-run the script.\n//\n${what}\n`;

writeFileSync(
  resolve(here, "../src/components/hero/glyphs.ts"),
  banner(
    "// Outfit 700 outlines of a–z, overlaps removed, in font units (y down,\n" +
      "// baseline at 0, origin at the glyph's pen position). Every loop starts at\n" +
      "// its topmost point. Drawn by word-writer.ts.",
  ) +
    `\nexport const GLYPH_UPM = ${font.upm};\n\nexport const GLYPHS: Readonly<Record<string, string>> = {\n` +
    Object.entries(glyphs)
      .map(([ch, d]) => `  ${ch}: "${d}",`)
      .join("\n") +
    "\n};\n",
);

writeFileSync(
  resolve(here, "../src/components/hero/outfit-metrics.ts"),
  banner("// Outfit 700 advance widths of printable ASCII, in font units.") +
    `\nexport const OUTFIT_UPM = ${font.upm};\n\nexport const OUTFIT_ADVANCE: Readonly<Record<string, number>> = ${JSON.stringify(advances)};\n`,
);

console.log(`glyphs.ts: ${LETTERS.length} glyphs, ${Object.values(glyphs).join("").length} bytes of path data`);
