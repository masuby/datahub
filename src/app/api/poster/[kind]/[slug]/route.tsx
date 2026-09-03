import { ImageResponse } from "next/og";
import { getPoster, posterSize, type PosterKind } from "@/lib/posters";

/**
 * Renders a campaign poster as a PNG.
 *
 * Lives under /api so the existing robots.txt Disallow keeps it out of search
 * results — these are source images for social posts, not pages.
 *
 * Kept to inline styles and solid colours because the renderer (Satori)
 * supports only a subset of CSS: no gradient text, no external assets.
 * `npm run posters` walks every entry in src/lib/posters.ts and saves the
 * output next to its caption under marketing/.
 */

export const runtime = "nodejs";

const BG = "#0a0f1d";
const FG = "#e7edf6";
const MUTED = "#94a3b8";
const ACCENT = "#22d3ee";
const ACCENT_2 = "#34d399";
const BORDER = "#1e293b";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const { kind, slug } = await params;
  const poster = getPoster(kind, slug);
  if (!poster) {
    return new Response("Unknown poster", { status: 404 });
  }

  const size = posterSize(kind as PosterKind);
  const isStatus = kind === "status";

  // WhatsApp and Instagram overlay their own UI across the top and bottom of a
  // 9:16 frame, so the safe area is inset far more aggressively there.
  const padX = 88;
  const padY = isStatus ? 260 : 96;
  const headlineSize = isStatus ? 88 : 82;

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
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_2} 100%)`,
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
          {poster.eyebrow && (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: ACCENT,
                marginBottom: 28,
              }}
            >
              {poster.eyebrow}
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
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 36,
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
            paddingTop: 30,
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
            Visit
          </div>
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
