/**
 * Renders every campaign poster and writes it next to its caption.
 *
 * Requires the dev server (npm run dev). Fetches /api/poster/<kind>/<slug> for
 * each entry in src/lib/posters.ts and saves the PNG to
 * marketing/<posts|status>/<slug>/poster.png — so a poster always lands in the
 * same folder as the caption it belongs to.
 *
 * Run with: npm run posters
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const BASE = process.env.POSTER_BASE ?? "http://localhost:3000";

// The route is TypeScript, so read the slugs out of the source rather than
// importing it — this script runs in plain Node.
const src = await fs.readFile(path.join(ROOT, "src", "lib", "posters.ts"), "utf8");
const entries = [...src.matchAll(/kind:\s*"(post|status)",\s*\n\s*slug:\s*"([^"]+)"/g)].map(
  (m) => ({ kind: m[1], slug: m[2] }),
);

if (entries.length === 0) {
  console.error("No posters found in src/lib/posters.ts — did the format change?");
  process.exit(1);
}

console.log(`rendering ${entries.length} posters from ${BASE}\n`);

let ok = 0;
const failed = [];

for (const { kind, slug } of entries) {
  const url = `${BASE}/api/poster/${kind}/${slug}`;
  const dir = path.join(ROOT, "marketing", kind === "post" ? "posts" : "status", slug);
  const out = path.join(dir, "poster.png");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000) throw new Error(`suspiciously small (${buf.length}B)`);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(out, buf);
    console.log(
      `  ok  ${kind.padEnd(6)} ${slug.padEnd(26)} ${(buf.length / 1024).toFixed(0)}KB`,
    );
    ok++;
  } catch (err) {
    console.error(`  FAIL ${kind} ${slug}: ${err.message}`);
    failed.push(`${kind}/${slug}`);
  }
}

console.log(`\n${ok}/${entries.length} written`);
if (failed.length) {
  console.error("failed: " + failed.join(", "));
  process.exit(1);
}
