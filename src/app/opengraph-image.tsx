import { ImageResponse } from "next/og";

/**
 * Social link-preview card (1200×630).
 *
 * This is what WhatsApp, Facebook, Instagram and LinkedIn render when someone
 * pastes datahub.co.tz — the whole campaign depends on that card looking like a
 * real company. Kept to inline styles and solid colours because the renderer
 * (Satori) supports only a subset of CSS: no gradients on text, no external
 * assets, no Tailwind classes.
 */

export const runtime = "nodejs";
export const alt =
  "DataHub — dashboards, automated reporting and custom software, Tanzania";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0f1d";
const FG = "#e7edf6";
const MUTED = "#94a3b8";
const ACCENT = "#22d3ee";
const ACCENT_2 = "#34d399";
const BORDER = "#1e293b";

export default async function Image() {
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
          padding: "72px 80px",
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
              width: 60,
              height: 60,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_2} 100%)`,
              color: BG,
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            D
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700 }}>
            <span style={{ color: FG }}>Data</span>
            <span style={{ color: ACCENT }}>Hub</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.12,
              color: FG,
              letterSpacing: "-0.02em",
            }}
          >
            We turn your data into
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.12,
              color: ACCENT,
              letterSpacing: "-0.02em",
            }}
          >
            dashboards, insights &amp; automation.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              color: MUTED,
            }}
          >
            Reports that took hours, generated in seconds.
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid ${BORDER}`,
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: MUTED }}>
            Tanzania · working with teams everywhere
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              color: ACCENT_2,
            }}
          >
            datahub.co.tz
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
