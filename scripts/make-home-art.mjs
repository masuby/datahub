/**
 * Builds the team avatars of the home page's tiles (iteration-3 §C) in
 * src/assets/team-avatars/. The tiles' 3D icons are the owner's own
 * (src/assets/icons/, iteration-5 §D), placed by hand: nothing here makes
 * them.
 *
 * Avatars: one 540px square (from x = 100, y = 105) of each aligned 740×990
 * portrait in public/team/ (eye line at y = 360, face centred on x = 370),
 * resized to 192×192, transparency kept, written as a new PNG from raw
 * pixels (no metadata).
 *
 * Run with: node scripts/make-home-art.mjs [repo folder]
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [repo = path.join(HERE, "..")] = process.argv.slice(2);

const TEAM = ["daniel-masubi", "kanuda-sasi", "yohana-mussa"];

const PNG = { compressionLevel: 9, adaptiveFiltering: true };

const avatarDir = path.join(repo, "src", "assets", "team-avatars");
mkdirSync(avatarDir, { recursive: true });

for (const name of TEAM) {
  const { data, info } = await sharp(path.join(repo, "public", "team", `${name}.png`))
    .extract({ left: 100, top: 105, width: 540, height: 540 })
    .resize(192, 192, { kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  await sharp(data, { raw: info }).png(PNG).toFile(path.join(avatarDir, `${name}.png`));
  console.log(`team-avatars/${name}.png`);
}
