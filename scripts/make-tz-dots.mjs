#!/usr/bin/env node
/**
 * Generates src/lib/tz-dots.ts: the dot-matrix map of Tanzania used by the
 * sample "Sales by region" dashboard (Fig. 02.8).
 *
 *   node scripts/make-tz-dots.mjs <admin0.geojson> <lakes.geojson> [out.ts]
 *
 * Inputs are Natural Earth files (public domain), read from disk; the script
 * never touches the network and nothing reads the GeoJSON at build or run
 * time. Only the generated TypeScript is committed.
 *
 *   admin0  Tanzania admin-0 at 1:10m (mainland + Unguja, Pemba, Mafia)
 *   lakes   ne_50m_lakes (Victoria, Tanganyika, Nyasa, Rukwa and Manyara
 *           are cut out of the land so they read as empty space)
 *
 * Projection (spec §8.3): x = (lon - 29.3) * cos(6.4°) * s,
 * y = (-0.95 - lat) * s, s = 40. Dots sit on a 0.25° grid and are drawn as
 * zero-length round-cap segments, one <path> per sales territory. No border
 * lines of any kind are produced.
 *
 * Territories: each mainland dot belongs to its nearest sample hub (distance
 * in degrees, longitude scaled by cos 6.4°), so the whole country is split
 * into nine sales territories. Unguja and Pemba belong to the Zanzibar hub;
 * Zanzibar never claims mainland dots. Hub coordinates must match
 * src/lib/sample-data.ts.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [landPath, lakesPath, outArg] = process.argv.slice(2);
if (!landPath || !lakesPath) {
  console.error("usage: node scripts/make-tz-dots.mjs <admin0.geojson> <lakes.geojson> [out.ts]");
  process.exit(1);
}
const outPath = resolve(outArg ?? "src/lib/tz-dots.ts");

const LON0 = 29.3;
const LON1 = 40.6;
const LAT0 = -0.95;
const LAT1 = -11.8;
const K = Math.cos((6.4 * Math.PI) / 180);
const S = 40;
const STEP = 0.25;
const LAKES = ["Lake Victoria", "Lake Tanganyika", "Lake Malawi", "Lake Rukwa", "Lake Manyara"];

/** Sample hubs [key, lat, lon] — keep in step with sample-data.ts. */
const HUBS = [
  ["dar", -6.79, 39.21],
  ["arusha", -3.37, 36.68],
  ["mwanza", -2.52, 32.9],
  ["dodoma", -6.16, 35.75],
  ["mbeya", -8.9, 33.46],
  ["kilimanjaro", -3.35, 37.34],
  ["zanzibar", -6.16, 39.19],
  ["morogoro", -6.82, 37.66],
  ["tanga", -5.07, 39.1],
];
const KEYS = HUBS.map((h) => h[0]);

const read = (p) => JSON.parse(readFileSync(resolve(p), "utf8"));

/** All polygons (arrays of rings) of a GeoJSON object. */
function polygons(geo) {
  const out = [];
  const walk = (g) => {
    if (!g) return;
    if (g.type === "FeatureCollection") g.features.forEach(walk);
    else if (g.type === "Feature") walk(g.geometry);
    else if (g.type === "Polygon") out.push(g.coordinates);
    else if (g.type === "MultiPolygon") g.coordinates.forEach((c) => out.push(c));
  };
  walk(geo);
  return out;
}

function inRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
/** Even-odd over the outer ring and its holes. */
const inPolygon = (poly, x, y) => inRing(poly[0], x, y) && !poly.slice(1).some((h) => inRing(h, x, y));

function ringArea(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return Math.abs(a / 2);
}
function centroid(ring) {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const f = ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    a += f;
    cx += (ring[j][0] + ring[i][0]) * f;
    cy += (ring[j][1] + ring[i][1]) * f;
  }
  return [cx / (3 * a), cy / (3 * a)];
}

const land = polygons(read(landPath)).sort((a, b) => ringArea(b[0]) - ringArea(a[0]));
if (land.length === 0) throw new Error("no polygons in " + landPath);
const mainland = land[0];
// Islands big enough to matter at this scale: Unguja, Pemba, Mafia.
const islands = land.slice(1).filter((p) => ringArea(p[0]) > 0.02);

const lakeGeo = read(lakesPath);
const lakes = (lakeGeo.features ?? [])
  .filter((f) => LAKES.includes(f.properties?.name))
  .flatMap((f) => polygons(f));
const foundLakes = new Set((lakeGeo.features ?? []).map((f) => f.properties?.name));
for (const name of LAKES) if (!foundLakes.has(name)) throw new Error(`lake not found: ${name}`);

const project = (lat, lon) => [(lon - LON0) * K * S, (LAT0 - lat) * S];
const dist = (lat, lon, hLat, hLon) => Math.hypot((lon - hLon) * K, lat - hLat);

function territory(lat, lon, island) {
  if (island) {
    // Unguja and Pemba are Zanzibar; Mafia sits with the nearest mainland hub.
    if (lat > -6.6) return "zanzibar";
  }
  let best = "dar";
  let bestD = Infinity;
  for (const [key, hLat, hLon] of HUBS) {
    if (key === "zanzibar") continue;
    const d = dist(lat, lon, hLat, hLon);
    if (d < bestD) {
      bestD = d;
      best = key;
    }
  }
  return best;
}

const dots = Object.fromEntries(KEYS.map((k) => [k, []]));
let count = 0;
const islandHits = islands.map(() => 0);

for (let lat = LAT0 - STEP / 2; lat > LAT1; lat -= STEP) {
  for (let lon = LON0 + STEP / 2; lon < LON1; lon += STEP) {
    if (lakes.some((p) => inPolygon(p, lon, lat))) continue;
    const islandIdx = islands.findIndex((p) => inPolygon(p, lon, lat));
    if (islandIdx < 0 && !inPolygon(mainland, lon, lat)) continue;
    if (islandIdx >= 0) islandHits[islandIdx]++;
    dots[territory(lat, lon, islandIdx >= 0)].push(project(lat, lon));
    count++;
  }
}
// An island the grid misses still gets one dot, at its centroid.
islands.forEach((p, i) => {
  if (islandHits[i] > 0) return;
  const [lon, lat] = centroid(p[0]);
  dots[territory(lat, lon, true)].push(project(lat, lon));
  count++;
});

const r1 = (v) => Math.round(v * 10) / 10;
const toPath = (pts) =>
  pts
    .sort((a, b) => a[1] - b[1] || a[0] - b[0])
    .map(([x, y]) => `M${r1(x)} ${r1(y)}h0`)
    .join("");

const width = Math.ceil((LON1 - LON0) * K * S);
const height = Math.ceil((LAT0 - LAT1) * S);

const body = `// GENERATED by scripts/make-tz-dots.mjs from Natural Earth 1:10m admin-0 and
// 1:50m lakes (public domain). Do not edit by hand; re-run the script.
//
// Dot matrix of Tanzania's land at ${STEP}° spacing (${count} dots), lakes left
// empty, Unguja, Pemba and Mafia included, no border lines. One path of
// zero-length round-cap segments per sample sales territory.

export type TzTerritory = ${KEYS.map((k) => JSON.stringify(k)).join(" | ")};

export const TZ_DOTS_WIDTH = ${width};
export const TZ_DOTS_HEIGHT = ${height};
export const TZ_DOTS_COUNT = ${count};
/** Stroke width that turns each zero-length segment into a dot (viewBox units). */
export const TZ_DOT_SIZE = 3.2;

/** Same projection the dots use: lat/lon (south negative) to viewBox units. */
export function projectTZ(lat: number, lon: number): [number, number] {
  return [(lon - ${LON0}) * ${K.toFixed(6)} * ${S}, (${LAT0} - lat) * ${S}];
}

export const TZ_DOTS: Record<TzTerritory, string> = {
${KEYS.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(toPath(dots[k]))},`).join("\n")}
};
`;

writeFileSync(outPath, body);
console.log(
  `wrote ${outPath}: ${count} dots, ${width}x${height}; ` +
    KEYS.map((k) => `${k} ${dots[k].length}`).join(", "),
);
