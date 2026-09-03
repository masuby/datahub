/**
 * Builds the images Google Business Profile actually wants for a business with
 * no public premises: a square logo, a 16:9 cover, and a square profile
 * portrait.
 *
 * Deliberately does NOT produce a "storefront" image. DataHub has no storefront,
 * and uploading a generated or stock building would misrepresent the business —
 * which is a suspension risk, not a stylistic choice.
 *
 * The cover is derived from the site's own OpenGraph card so the profile, the
 * social previews and the site all carry the same artwork.
 *
 * Run with: npm run gbp   (dev server must be running for the cover step)
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(HERE, "..", "marketing", "google-business");
const PUBLIC = path.join(HERE, "..", "public");

const BG = "#0a0f1d";
const SRC_OG = process.env.OG_SOURCE ?? "http://localhost:3000/opengraph-image";

await fs.mkdir(OUT_DIR, { recursive: true });

/* ---------------------------------------------------------------- logo ---- */
// Google wants a square logo, 720x720 minimum. Rendered from the site's own
// icon.svg at 1024 so it stays crisp wherever Google scales it.
const logoSvg = await fs.readFile(path.join(HERE, "..", "src", "app", "icon.svg"));
const logoOut = path.join(OUT_DIR, "logo-1024.png");
await sharp(logoSvg, { density: 384 })
  .resize(1024, 1024, { fit: "contain", background: BG })
  .png({ compressionLevel: 9 })
  .toFile(logoOut);
console.log("logo    ->", logoOut);

/* --------------------------------------------------------------- cover ---- */
// 16:9, 1024x576 minimum. The OG card is 1200x630 (1.9:1), so it is fitted onto
// a brand-coloured 16:9 canvas rather than cropped — cropping would cut the
// site address off the bottom, which is the whole point of the image.
try {
  const res = await fetch(SRC_OG);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const og = Buffer.from(await res.arrayBuffer());

  const W = 1920;
  const H = 1080;
  const inner = await sharp(og)
    .resize(Math.round(W * 0.92), null, { fit: "inside" })
    .toBuffer();

  const coverOut = path.join(OUT_DIR, "cover-1920x1080.png");
  await sharp({
    create: { width: W, height: H, channels: 4, background: BG },
  })
    .composite([{ input: inner, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(coverOut);
  console.log("cover   ->", coverOut);
} catch (err) {
  console.warn(
    `cover   -> SKIPPED (${err.message}). Start the dev server (npm run dev) ` +
      `or set OG_SOURCE=https://www.datahub.co.tz/opengraph-image`,
  );
}

/* ------------------------------------------------------------- portrait ---- */
// The "team" / owner photo. Composited onto the brand background because the
// keyed source is transparent and Google renders on white.
const portraitOut = path.join(OUT_DIR, "profile-720.png");
await sharp({
  create: { width: 720, height: 720, channels: 4, background: BG },
})
  .composite([
    {
      input: await sharp(path.join(PUBLIC, "daniel-masubi.png"))
        .resize(720, 720, { fit: "cover" })
        .toBuffer(),
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(portraitOut);
console.log("profile ->", portraitOut);
