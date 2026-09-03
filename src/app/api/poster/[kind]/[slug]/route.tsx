import { ImageResponse } from "next/og";
import { getPoster, posterSize, type PosterKind, type Poster } from "@/lib/posters";

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

const BG = "#0a0f1d";
const SURFACE = "#0f1626";
const FG = "#e7edf6";
const MUTED = "#94a3b8";
const ACCENT = "#22d3ee";
const ACCENT_2 = "#34d399";
const BORDER = "#1e293b";
const GRAD = `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_2} 100%)`;

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
      {card("BEFORE", bad, "#f87171")}
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: `${padY}px ${padX}px`,
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 66,
              height: 66,
              borderRadius: 18,
              background: GRAD,
              color: BG,
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", fontSize: 42, fontWeight: 700 }}>
            <span style={{ color: FG }}>Data</span>
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

        {/* The address. Every poster carries it — that is the whole point. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: `2px solid ${BORDER}`,
            paddingTop: 28,
          }}
        >
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
      </div>
    ),
    { ...size },
  );
}
