import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getPoster, posterSize, type PosterKind, type Poster } from "@/lib/posters";
import { markTileDataUri, netSvgDataUri, qrSvgDataUri } from "@/lib/poster-art";

/**
 * Renders a campaign poster as a PNG.
 *
 * Lives under /api so the existing robots.txt Disallow keeps it out of search
 * results — these are source images for social posts, not pages.
 *
 * Kept to flexbox, solid colours and plain divs because the renderer (Satori)
 * supports only a subset of CSS. The chart and card motifs below are built from
 * divs for that reason; no SVG, no external assets except the portrait.
 *
 * `npm run posters` walks every entry in src/lib/posters.ts and saves the
 * output next to its caption under marketing/.
 */

export const runtime = "nodejs";

/**
 * Outfit — the display face that matches the DataHub wordmark — loaded as TTF
 * because Satori supports TTF/OTF/WOFF but not WOFF2, which is all next/font
 * emits. Without this the renderer silently falls back to its bundled default
 * and every poster comes out in a typeface that is not the brand's. Outfit 500
 * is registered for weight 400 too: Satori needs a face for the default weight.
 *
 * Read once per process rather than per request.
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

// The website's dark-theme tokens and the brand blues (navy #022970, royal
// #036BFB, sky #68D4FB), so a poster and the page it links to look like one
// company. ROYAL_LIFT is royal raised for legibility on the dark ground.
const BG = "#030A1C";
const SURFACE = "#071430";
const FG = "#EAF1FF";
const MUTED = "#A7B6D3";
const ACCENT = "#68D4FB";
const ACCENT_2 = "#3D8BFF";
const BORDER = "#1B2C55";
const GRAD = `linear-gradient(135deg, ${ACCENT} 0%, #036BFB 100%)`;

/** Descending bars — reporting time collapsing from hours to seconds. */
function Bars() {
  const heights = [26, 44, 38, 66, 52, 88, 100];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 18,
        height: 210,
        marginTop: 8,
      }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: 74,
            height: `${h}%`,
            borderRadius: 12,
            background: GRAD,
            opacity: 0.35 + (h / 100) * 0.65,
          }}
        />
      ))}
    </div>
  );
}

/** Two stacked cards: the wrong way, then the right way. */
function Contrast({ bad, good }: { bad: string; good: string }) {
  // A coloured dot rather than a tick/cross glyph: the font Satori embeds has no
  // U+2713 or U+2715, so those render as tofu boxes. Colour plus the
  // BEFORE/AFTER label carries the same meaning with no font dependency.
  const card = (label: string, text: string, colour: string) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: SURFACE,
        border: `2px solid ${BORDER}`,
        borderRadius: 22,
        padding: "30px 34px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            display: "flex",
            width: 26,
            height: 26,
            borderRadius: 13,
            background: colour,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.12em",
            color: MUTED,
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 16,
          fontSize: 44,
          fontWeight: 700,
          color: FG,
        }}
      >
        {text}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {card("BEFORE", bad, "#FF8B8B")}
      {card("AFTER", good, ACCENT_2)}
    </div>
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const { kind, slug } = await params;
  const poster = getPoster(kind, slug);
  if (!poster) return new Response("Unknown poster", { status: 404 });

  const size = posterSize(kind as PosterKind);
  const isStatus = kind === "status";
  const variant: Poster["variant"] = poster.variant ?? "default";

  // WhatsApp and Instagram overlay their own UI across the top and bottom of a
  // 9:16 frame, so the safe area is inset far more aggressively there.
  const padX = 88;
  const padY = isStatus ? 250 : 92;
  const headlineSize = variant === "default" ? (isStatus ? 88 : 82) : 66;

  const origin = new URL(req.url).origin;

  // Seeded by slug: each poster gets its own net, and re-running the script
  // reproduces the same image byte for byte.
  const net = netSvgDataUri(`${kind}/${slug}`, size.width, size.height);
  const qr = await qrSvgDataUri();
  const qrSize = isStatus ? 200 : 176;

  const image = new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: `${padY}px ${padX}px`,
          fontFamily: "Outfit",
        }}
      >
        {/* Background net — full-bleed, behind everything. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={net}
          width={size.width}
          height={size.height}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        {/* A soft vignette so the net fades where the headline sits, keeping
            contrast high exactly where legibility matters most. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: size.width,
            height: size.height,
            background: `radial-gradient(ellipse at 30% 55%, ${BG} 0%, rgba(3,10,28,0.85) 38%, rgba(3,10,28,0) 75%)`,
          }}
        />

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* The mark sits on a white tile, exactly as on the brand board:
              navy on a dark poster would vanish. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markTileDataUri()} width={66} height={66} alt="" />
          <div style={{ display: "flex", fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span style={{ color: ACCENT_2 }}>Data</span>
            <span style={{ color: ACCENT }}>Hub</span>
          </div>
        </div>

        {/* Message */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {variant === "bars" && <Bars />}

          {variant === "portrait" && (
            // next/image cannot be used here: this tree is rendered by Satori
            // into a PNG, not by React into a DOM, so a plain <img> is correct.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${origin}/daniel-masubi.png`}
              width={260}
              height={260}
              alt=""
              style={{
                width: 260,
                height: 260,
                borderRadius: 130,
                objectFit: "cover",
                background: SURFACE,
                marginBottom: 34,
              }}
            />
          )}

          {poster.eyebrow && (
            <div
              style={{
                display: "flex",
                marginTop: variant === "bars" ? 44 : 0,
                marginBottom: 24,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: ACCENT,
              }}
            >
              {poster.eyebrow}
            </div>
          )}

          {variant === "stat" && poster.stat && (
            <div style={{ display: "flex", flexDirection: "column", marginBottom: 30 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 190,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: ACCENT_2,
                }}
              >
                {poster.stat.value}
              </div>
              <div style={{ display: "flex", marginTop: 14, fontSize: 34, color: MUTED }}>
                {poster.stat.label}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              fontSize: headlineSize,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: FG,
            }}
          >
            {poster.headline}
          </div>

          {variant === "contrast" && poster.contrast && (
            <div style={{ display: "flex", marginTop: 34 }}>
              <Contrast bad={poster.contrast.bad} good={poster.contrast.good} />
            </div>
          )}

          <div
            style={{
              display: "flex",
              marginTop: variant === "contrast" ? 30 : 30,
              fontSize: 34,
              lineHeight: 1.4,
              color: MUTED,
            }}
          >
            {poster.sub}
          </div>
        </div>

        {/* The address. Every poster carries it — that is the whole point.
            The QR beside it goes to the same place with ?ref=qr, so scans are
            attributed like any other channel. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${BORDER}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, color: MUTED }}>Visit</div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                fontSize: 46,
                fontWeight: 700,
                color: ACCENT_2,
              }}
            >
              www.datahub.co.tz
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: 12,
                borderRadius: 18,
                background: "#ffffff",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} width={qrSize} height={qrSize} alt="" />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "0.14em",
                color: MUTED,
              }}
            >
              SCAN
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await brandFonts() },
  );

  /**
   * Instagram's content-publishing API accepts JPEG only — it rejects a PNG
   * container outright — so the social automation asks for ?format=jpg.
   * Satori emits PNG and nothing else, hence the conversion here rather than a
   * second renderer. Facebook and the marketing folder keep using the PNG.
   */
  const format = new URL(req.url).searchParams.get("format");
  if (format !== "jpg" && format !== "jpeg") return image;

  const { default: sharp } = await import("sharp");
  const jpeg = await sharp(Buffer.from(await image.arrayBuffer()))
    .flatten({ background: BG })
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
