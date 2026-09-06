import QRCode from "qrcode";

/**
 * Decorative and functional artwork for the posters.
 *
 * Both pieces are produced as SVG data URIs and placed with <img>. That is the
 * one reliable way to get vector artwork into Satori: it supports <img> with a
 * data URI, but its inline-SVG and CSS-pattern support is partial enough that
 * a hand-built network of dots and lines would not survive it.
 */

const BG = "#0a0f1d";
const ACCENT = "#22d3ee";
const ACCENT_2 = "#34d399";

function toDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Deterministic PRNG (mulberry32) so a poster's net is stable across runs. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A "net": scattered nodes joined to their near neighbours. Echoes the animated
 * dot field on the website, frozen. Seeded by slug so every poster gets its own
 * arrangement while `npm run posters` stays reproducible.
 *
 * Kept faint on purpose — it sits *behind* headline text, so contrast with the
 * background must stay low enough that Geist at 66-88px still reads cleanly.
 */
export function netSvgDataUri(seed: string, width: number, height: number): string {
  const rand = seededRandom(seed);
  const count = Math.round((width * height) / 26000); // ~56 on 4:5, ~80 on 9:16
  const linkDistance = 210;

  const nodes = Array.from({ length: count }, () => ({
    x: rand() * width,
    y: rand() * height,
    r: 2.2 + rand() * 2.6,
    emerald: rand() < 0.3,
  }));

  const lines: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < linkDistance) {
        // Closer pairs draw slightly stronger, which reads as depth.
        const o = (0.22 * (1 - d / linkDistance)).toFixed(3);
        lines.push(
          `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(1)}" x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(1)}" stroke="${ACCENT}" stroke-opacity="${o}" stroke-width="1.4"/>`,
        );
      }
    }
  }

  const dots = nodes.map(
    (n) =>
      `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(1)}" fill="${n.emerald ? ACCENT_2 : ACCENT}" fill-opacity="0.42"/>`,
  );

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    lines.join("") +
    dots.join("") +
    `</svg>`;

  return toDataUri(svg);
}

/** Where a scan lands. The ref tag makes QR scans show up in lead attribution. */
export const QR_TARGET = "https://www.datahub.co.tz/?ref=qr";

/**
 * QR code as an SVG data URI. Dark modules on a light tile: inverted (light-on-
 * dark) codes are not reliably read by every phone camera, so the tile is the
 * one deliberately light element on the poster. Error correction "M" keeps the
 * code compact while tolerating the compression social platforms apply.
 */
export async function qrSvgDataUri(url: string = QR_TARGET): Promise<string> {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: BG, light: "#ffffff" },
  });
  return toDataUri(svg);
}
