#!/usr/bin/env node
/**
 * Generates the two "liquid metal" maps the hero's mark is drawn from (the D
 * and the hand, separately, so the hand keeps its CSS wave), and the boxes
 * they cover in the mark's 100×100 viewBox:
 *
 *   src/assets/metal/metal-d.webp
 *   src/assets/metal/metal-hand.webp
 *   src/components/brand/metal-maps.ts
 *
 *   node scripts/make-metal-maps.mjs
 *
 * Paper Shaders' LiquidMetal (@paper-design/shaders, Apache-2.0) does not
 * shade an image directly: it first turns the shape into a map — red: how
 * far each pixel is from the shape's edge (a Poisson solve), green: the
 * shape's own alpha — with `toProcessedLiquidMetal()`. In the browser that
 * runs on the main thread (an SVG is even blown up to 4096 px first, a
 * multi-second long task on a phone) and, for blob: URLs, it fetch()es,
 * which the site's connect-src 'self' refuses. The map depends only on the
 * artwork, so it is made here, once, with the library's own algorithm
 * (ported line for line from liquid-metal.js, v0.0.81: the same 512 px
 * working size, 40 red-black SOR iterations, ω = 1.9), and the client hands
 * the finished map straight to the shader. WebP near-lossless (~38 KB for
 * both; PNG would be ~85 KB): the map's values move by a level or two, never
 * across the shape's edge.
 *
 * Reads the mark's path data from src/components/brand/mark-paths.ts; never
 * the network. Re-run it if the artwork ever changes.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "..");
const PATHS = readFileSync(resolve(ROOT, "src/components/brand/mark-paths.ts"), "utf8");
const OUT_DIR = resolve(ROOT, "src/assets/metal");
const OUT_TS = resolve(ROOT, "src/components/brand/metal-maps.ts");

/** Pixels per viewBox unit: the mark is at most 380 CSS px, drawn at <= 1.5 dpr. */
const DENSITY = 6;
/** Room round each shape (viewBox units) for the shader's edge blur. */
const PAD = 2;
/** The library's working size for the solve (POISSON_CONFIG_OPTIMIZED). */
const WORKING = 512;
const ITERATIONS = 40;
const OMEGA = 1.9;
const C = 0.01;

function pathData(name) {
  const m = new RegExp(`export const ${name} = "([^"]+)"`).exec(PATHS);
  if (!m) throw new Error(`${name} not found in mark-paths.ts`);
  return m[1];
}

/** Bounding box of a path's points (only M/C/L with absolute pairs here). */
function bbox(d) {
  const nums = d.match(/-?\d*\.?\d+/g).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]);
    x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]);
    y1 = Math.max(y1, nums[i + 1]);
  }
  return { x0, y0, x1, y1 };
}

async function makeMap(d, file, below = 0) {
  const b = bbox(d);
  // Whole pixels: the box is snapped outwards to the pixel grid.
  const box = {
    x: Math.floor((b.x0 - PAD) * DENSITY) / DENSITY,
    y: Math.floor((b.y0 - PAD) * DENSITY) / DENSITY,
  };
  box.w = Math.ceil((b.x1 + PAD - box.x) * DENSITY) / DENSITY;
  box.h = Math.ceil((b.y1 + PAD + below - box.y) * DENSITY) / DENSITY;
  const W = Math.round(box.w * DENSITY);
  const H = Math.round(box.h * DENSITY);

  // The shape's own alpha at full size (anti-aliased by librsvg).
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${box.x} ${box.y} ${box.w} ${box.h}"><path d="${d}" fill="#000"/></svg>`;
  const original = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer();

  // The working copy, as the library draws it: min dimension 512.
  const scale = WORKING / Math.min(W, H);
  const w = Math.round(W * scale);
  const h = Math.round(H * scale);
  const shape = await sharp(Buffer.from(svg)).resize(w, h).ensureAlpha().raw().toBuffer();

  const shapeMask = new Uint8Array(w * h);
  for (let i = 0, idx = 0; i < shape.length; i += 4, idx++) shapeMask[idx] = shape[i + 3] === 0 ? 0 : 1;
  const interior = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!shapeMask[idx]) continue;
      const boundary =
        x === 0 || x === w - 1 || y === 0 || y === h - 1 ||
        !shapeMask[idx - 1] || !shapeMask[idx + 1] || !shapeMask[idx - w] || !shapeMask[idx + w] ||
        !shapeMask[idx - w - 1] || !shapeMask[idx - w + 1] || !shapeMask[idx + w - 1] || !shapeMask[idx + w + 1];
      if (!boundary) interior.push(idx);
    }
  }
  const n = interior.length;
  const nb = new Int32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const idx = interior[i];
    const x = idx % w;
    const y = Math.floor(idx / w);
    nb[i * 4] = x < w - 1 && shapeMask[idx + 1] ? idx + 1 : -1;
    nb[i * 4 + 1] = x > 0 && shapeMask[idx - 1] ? idx - 1 : -1;
    nb[i * 4 + 2] = y > 0 && shapeMask[idx - w] ? idx - w : -1;
    nb[i * 4 + 3] = y < h - 1 && shapeMask[idx + w] ? idx + w : -1;
  }
  const red = [];
  const black = [];
  for (let i = 0; i < n; i++) {
    const idx = interior[i];
    if (((idx % w) + Math.floor(idx / w)) % 2 === 0) red.push(i);
    else black.push(i);
  }
  const u = new Float32Array(w * h);
  const sweep = (list) => {
    for (const i of list) {
      const idx = interior[i];
      let s = 0;
      for (let k = 0; k < 4; k++) {
        const j = nb[i * 4 + k];
        if (j >= 0) s += u[j];
      }
      u[idx] = OMEGA * ((C + s) / 4) + (1 - OMEGA) * u[idx];
    }
  };
  for (let it = 0; it < ITERATIONS; it++) {
    sweep(red);
    sweep(black);
  }
  let max = 0;
  for (const idx of interior) if (u[idx] > max) max = u[idx];

  // Working-size map: grey = 255 at the edge -> 0 at the deepest point;
  // transparent white outside. Upscaled to full size like the library's
  // high-quality drawImage (sharp premultiplies alpha while resizing).
  const temp = Buffer.alloc(w * h * 4);
  for (let idx = 0; idx < w * h; idx++) {
    const px = idx * 4;
    if (!shapeMask[idx]) {
      temp[px] = temp[px + 1] = temp[px + 2] = 255;
      temp[px + 3] = 0;
    } else {
      const gray = Math.round(255 * (1 - u[idx] / max));
      temp[px] = temp[px + 1] = temp[px + 2] = gray;
      temp[px + 3] = 255;
    }
  }
  const up = await sharp(temp, { raw: { width: w, height: h, channels: 4 } })
    .resize(W, H, { kernel: "cubic" })
    .raw()
    .toBuffer();

  // Final map, as the library packs it: R edge, G alpha, B 255, A 255.
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < out.length; i += 4) {
    const a = original[i + 3];
    if (a === 0) {
      out[i] = 255;
      out[i + 1] = 0;
    } else {
      out[i] = up[i + 3] === 0 ? 0 : up[i];
      out[i + 1] = a;
    }
    out[i + 2] = 255;
    out[i + 3] = 255;
  }
  const webp = await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .removeAlpha() // A is always 255
    .webp({ nearLossless: true, quality: 60, effort: 6 })
    .toBuffer();
  writeFileSync(resolve(OUT_DIR, file), webp);
  console.log(`${file}: ${W}x${H}, ${webp.length} bytes, box`, box);
  return { ...box, W, H };
}

mkdirSync(OUT_DIR, { recursive: true });
// Extra room below each shape (viewBox units). The shader converges its
// stripes towards the bottom edge of its image into a ring; with the palm
// sitting on that edge the ring lands in the palm. Moved below the shapes,
// it falls on transparent pixels (the hand's canvas is ~60% taller for it;
// the shader still sweeps a lens of light through the palm now and then).
const d = await makeMap(pathData("MARK_D"), "metal-d.webp", 8);
const hand = await makeMap(pathData("MARK_HAND"), "metal-hand.webp", 48);

const r = (v) => Math.round(v * 1000) / 1000;
writeFileSync(
  OUT_TS,
  `/**
 * Where the liquid-metal maps (src/assets/metal/*.webp, made by
 * scripts/make-metal-maps.mjs) sit in the mark's 100×100 viewBox: each map
 * covers its shape's box plus a little room for the shader's edge blur.
 * Generated - re-run the script, do not edit.
 */
export const METAL_BOX = {
  d: { x: ${r(d.x)}, y: ${r(d.y)}, w: ${r(d.w)}, h: ${r(d.h)} },
  hand: { x: ${r(hand.x)}, y: ${r(hand.y)}, w: ${r(hand.w)}, h: ${r(hand.h)} },
} as const;
`,
);
console.log("wrote", OUT_TS);
