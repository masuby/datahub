/**
 * Builds the founder avatar for the About section.
 *
 * The source is a studio passport photo on a saturated blue backdrop that
 * gradients from light (corners) to strong (centre). A flat colour-distance key
 * fails on that gradient, so this uses a blue-dominance key instead:
 *
 *     d = B - max(R, G)
 *
 * Backdrop blue scores high on d regardless of how light or dark that part of
 * the gradient is. Skin scores negative (red-dominant) and the white patterned
 * shirt scores near zero, so both survive untouched. The ramp between the two
 * thresholds feathers hair edges rather than leaving a hard alias, and residual
 * blue spill on those semi-transparent pixels is neutralised.
 *
 * Run with: npm run avatar
 */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = String.raw`C:\Users\Daniel\Desktop\code\Masubi\Me\test\DOCUMENTS\Daniel Masubi Passport size.png`;
const OUT = path.join(HERE, "..", "public", "daniel-masubi.png");

/** Fully transparent at or above this blue dominance. */
const KEY_OUT = 52;
/** Fully opaque at or below this. Between the two, alpha ramps linearly. */
const KEY_IN = 20;

const src = sharp(SRC);
const meta = await src.metadata();
console.log(`source: ${meta.width}x${meta.height} ${meta.format}`);

const { data, info } = await src
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels: C } = info;

let cleared = 0;
let feathered = 0;
for (let p = 0; p < W * H; p++) {
  const i = p * C;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const d = b - Math.max(r, g);

  if (d <= KEY_IN) continue; // clearly subject

  let alpha;
  if (d >= KEY_OUT) {
    alpha = 0;
    cleared++;
  } else {
    alpha = Math.round((1 - (d - KEY_IN) / (KEY_OUT - KEY_IN)) * 255);
    feathered++;
    // Neutralise blue spill so edges don't glow against a dark background.
    data[i + 2] = Math.round((r + g) / 2);
  }
  data[i + 3] = alpha;
}

const pct = ((cleared / (W * H)) * 100).toFixed(1);
console.log(`keyed out: ${cleared} px (${pct}%), feathered: ${feathered} px`);

// Square crop centred horizontally; the head already sits high in the frame so
// no vertical bias is needed once we take the full height.
const side = Math.min(W, H);
const left = Math.round((W - side) / 2);
const top = Math.round((H - side) / 2);

await sharp(data, { raw: { width: W, height: H, channels: C } })
  .extract({ left, top, width: side, height: side })
  .resize(640, 640, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const out = await sharp(OUT).metadata();
console.log(`wrote ${OUT} — ${out.width}x${out.height} alpha=${out.hasAlpha}`);
