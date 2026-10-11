/**
 * Builds the pictures of the home page's tiles (iteration-3 §C) in
 * src/assets/: the six Microsoft Fluent Emoji 3D icons (MIT) and the three
 * team avatars. See docs/design/THIRD_PARTY.md.
 *
 * Icons: fetch the upstream PNGs from the pinned commit into an empty folder
 * first (the URLs are in THIRD_PARTY.md). Each one must match the SHA-256
 * recorded below, so a changed upstream file stops the run instead of
 * reaching the site. It is decoded to raw pixels and written as a new PNG:
 * nothing of the source file but its pixels survives (no metadata).
 *
 * Avatars: one 540px square (from x = 100, y = 105) of each aligned 740×990
 * portrait in public/team/ (eye line at y = 360, face centred on x = 370),
 * resized to 192×192, transparency kept.
 *
 * Run with: node scripts/make-home-art.mjs <downloads folder> [repo folder]
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const [downloads, repo = path.join(HERE, "..")] = process.argv.slice(2);
if (!downloads) {
  console.error("usage: node scripts/make-home-art.mjs <downloads folder> [repo folder]");
  process.exit(1);
}

/** Upstream file → file in src/assets/fluent-3d, with the upstream SHA-256 (fluentui-emoji@1ffb34c). */
const ICONS = [
  ["bar_chart_3d.png", "bar-chart.png", "0d83833e992b128aa00b85220fc2f777516bbdeb92e9e1e019a7b715ecc6ef97"],
  ["chart_increasing_3d.png", "chart-increasing.png", "dd5e6b29aa4067c5a4d9e152119497832d70e094b380998e5f5b0c51abbb3a64"],
  ["gear_3d.png", "gear.png", "415296d4fadabc2e0f6593143ea632948fef20a1cd73fbbc3dbda571f0421988"],
  ["robot_3d.png", "robot.png", "3f9b5a00b53c8bddda36b6a3f68d00718d9d7d8c04f986a3248e55ae93a7961b"],
  ["spiral_notepad_3d.png", "spiral-notepad.png", "647fd6d44d8596c0b76f1a65815fb9f6baa6b1ac0df5c19c3915c5e1d6919e8a"],
  ["shield_3d.png", "shield.png", "3c1cc1b14f8dd43e8532f9fb751769cd68382a9f25c012b0549e352a8d953a94"],
];

const TEAM = ["daniel-masubi", "kanuda-sasi", "yohana-mussa"];

const PNG = { compressionLevel: 9, adaptiveFiltering: true };

const iconDir = path.join(repo, "src", "assets", "fluent-3d");
const avatarDir = path.join(repo, "src", "assets", "team-avatars");
mkdirSync(iconDir, { recursive: true });
mkdirSync(avatarDir, { recursive: true });

for (const [src, dst, sha] of ICONS) {
  const bytes = readFileSync(path.join(downloads, src));
  const got = createHash("sha256").update(bytes).digest("hex");
  if (got !== sha) throw new Error(`${src}: SHA-256 ${got}, expected ${sha}`);
  const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== 256 || info.height !== 256) throw new Error(`${src}: ${info.width}×${info.height}, expected 256×256`);
  await sharp(data, { raw: info }).png(PNG).toFile(path.join(iconDir, dst));
  console.log(`fluent-3d/${dst}`);
}

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
