import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { MARK_D, MARK_HAND } from "@/components/brand/mark-paths";
import { filamentPath, sheenBucket, silkSheen, type SilkPreset } from "@/lib/silk";
import { SITE_URL } from "@/lib/seo";
import en from "@/i18n/dictionaries/en";
import sw from "@/i18n/dictionaries/sw";

/**
 * Social link-preview card (1200×630) — what WhatsApp, Facebook, Instagram and
 * LinkedIn render when someone pastes datahub.co.tz, in either language.
 *
 * The brand board, flattened: deep ink ground, silk filaments flowing into the
 * mark on its white tile, the wordmark ("Data" royal-lifted, "Hub" sky) and the
 * tagline in both languages. Rendered by Satori, which supports only a subset
 * of CSS, so the artwork is SVG data URIs placed with <img> and the colours are
 * literals (the site's ink-surface tokens and the three brand blues).
 */

export const runtime = "nodejs";
export const alt = en.alt.og;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#030A1C";
const FG = "#EAF1FF";
const MUTED = "#A7B6D3";
const RULE = "#1B2C55";
const NAVY = "#022970";
const ROYAL = "#036BFB";
const ROYAL_LIFT = "#3D8BFF";
const SKY = "#68D4FB";

/** Where the silk converges and the mark sits (normalised). */
const SINK = { x: 0.78, y: 0.47 };
const TILE = 184;

/**
 * Outfit TTFs (Satori cannot read the WOFF2 next/font emits). Read once per
 * process; 500 doubles as 400 because Satori needs a face for the default
 * weight. next.config.ts must trace assets/fonts for this route.
 */
type Weight = 400 | 500 | 600 | 700 | 800;
let fontCache: { name: string; data: Buffer; weight: Weight; style: "normal" }[] | null = null;

async function brandFonts() {
  if (fontCache) return fontCache;
  const dir = path.join(process.cwd(), "assets", "fonts");
  const load = async (file: string, weight: Weight) => ({
    name: "Outfit",
    data: await readFile(path.join(dir, file)),
    weight,
    style: "normal" as const,
  });
  fontCache = await Promise.all([
    load("Outfit-500.ttf", 400),
    load("Outfit-500.ttf", 500),
    load("Outfit-600.ttf", 600),
    load("Outfit-700.ttf", 700),
    load("Outfit-800.ttf", 800),
  ]);
  return fontCache;
}

const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** The mark on its white rounded tile, exactly as the brand board shows it on dark. */
function markTile(): string {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 128 128">` +
      `<rect x="-14" y="-14" width="128" height="128" rx="30" fill="#FFFFFF"/>` +
      `<path fill="${ROYAL}" d="${MARK_D}"/><path fill="${NAVY}" d="${MARK_HAND}"/>` +
      `</svg>`,
  );
}

/** Royal → sky, by position in the bundle (the ink-surface silk colours). */
function mix(u: number): string {
  const a = [0x03, 0x6b, 0xfb];
  const b = [0x68, 0xd4, 0xfb];
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * u).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * A few silk filaments from src/lib/silk.ts at t = 0, sized to the card. Each
 * stroke fades to a fifth of its strength across the text on the left (the
 * same text-safe rule as the site's hero), at full strength by the mark.
 */
function silk(): string {
  const p: SilkPreset = {
    W: size.width,
    H: size.height,
    N: 22,
    tol: 0.5,
    sinkX: SINK.x,
    sinkY: SINK.y,
    leftY: 0.92,
    spreadIn: 0.46,
    spreadPinch: 0.11,
    spreadOut: 0.5,
    amp: 0.08,
    decision: -1,
  };
  const maxAlpha = 0.55;
  const defs: string[] = [];
  const paths: string[] = [];
  for (let i = 0; i < p.N; i++) {
    const u = i / (p.N - 1);
    const colour = mix(u);
    const a = maxAlpha * Math.max(0.35, sheenBucket(silkSheen(u, 0)));
    defs.push(
      `<linearGradient id="f${i}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${p.W}" y2="0">` +
        `<stop offset="0" stop-color="${colour}" stop-opacity="${(a * 0.2).toFixed(3)}"/>` +
        `<stop offset="0.5" stop-color="${colour}" stop-opacity="${(a * 0.2).toFixed(3)}"/>` +
        `<stop offset="0.68" stop-color="${colour}" stop-opacity="${a.toFixed(3)}"/>` +
        `</linearGradient>`,
    );
    paths.push(`<path d="${filamentPath(p, i)}" fill="none" stroke="url(#f${i})" stroke-width="1.6"/>`);
  }
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${p.W}" height="${p.H}" viewBox="0 0 ${p.W} ${p.H}">` +
      `<defs>${defs.join("")}</defs>${paths.join("")}</svg>`,
  );
}

export default async function Image() {
  const fonts = await brandFonts();
  const host = new URL(SITE_URL).host.replace(/^www\./, "");
  const sinkLeft = Math.round(size.width * SINK.x - TILE / 2);
  const sinkTop = Math.round(size.height * SINK.y - TILE / 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: INK,
          backgroundImage: `radial-gradient(circle at ${SINK.x * 100}% ${SINK.y * 100}%, rgba(2, 41, 112, 0.85) 0%, rgba(2, 41, 112, 0) 46%)`,
          fontFamily: "Outfit",
          color: FG,
        }}
      >
        {/* Rendered by Satori into a PNG, not a DOM: a plain <img> is correct. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={silk()} width={size.width} height={size.height} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markTile()} width={TILE} height={TILE} alt="" style={{ position: "absolute", left: sinkLeft, top: sinkTop }} />

        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 128,
            paddingBottom: 64,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 136, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.045em" }}>
              <span style={{ color: ROYAL_LIFT }}>Data</span>
              <span style={{ color: SKY }}>Hub</span>
            </div>
            <div style={{ display: "flex", marginTop: 34, fontSize: 40, fontWeight: 600, letterSpacing: "-0.015em", color: FG }}>
              {en.brand.tagline}
            </div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 40, fontWeight: 500, letterSpacing: "-0.015em", color: MUTED }}>
              {sw.brand.tagline}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* R2: a hairline whose first 48px is the 2px royal→sky thread. */}
            <div style={{ display: "flex", position: "relative", height: 2, alignItems: "center" }}>
              <div style={{ display: "flex", width: "100%", height: 1, backgroundColor: RULE }} />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 48,
                  height: 2,
                  backgroundImage: `linear-gradient(90deg, ${ROYAL}, ${SKY})`,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              <span style={{ color: SKY }}>{host}</span>
              <span style={{ color: MUTED }}>{en.footer.contact.location}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
