import type { NextConfig } from "next";

/**
 * Static security headers. The Content-Security-Policy is intentionally NOT here
 * — it is set per-request (with a fresh nonce) in src/proxy.ts.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // The poster route reads the Outfit TTFs and the CTO portrait from disk at
  // request time. Tracing cannot follow a runtime path.join, so without this
  // they are left out of the serverless bundle and the route 500s (or draws
  // an empty portrait) in production while working perfectly in dev.
  outputFileTracingIncludes: {
    "/api/poster/\\[kind\\]/\\[slug\\]": ["./assets/fonts/**/*", "./public/team/daniel-masubi-avatar.png"],
    // The OG image renders the wordmark in Outfit, read from disk the same way.
    "/opengraph-image": ["./assets/fonts/**/*"],
  },
  // Produces a minimal standalone server bundle for Docker.
  output: "standalone",
  poweredByHeader: false,
  // The 404 is app/global-not-found.tsx: the root layout sits under [lang],
  // where a segment not-found.tsx is only drawn client-side (see that file).
  experimental: { globalNotFound: true },
  reactStrictMode: true,
  // Team portraits are transparent PNGs; served as AVIF/WebP they are a
  // fraction of the bytes on the phones most visitors arrive on.
  // Next 16 only serves quality 75 unless others are allowed explicitly; the
  // portraits ask for 80 so skin and fabric texture survive compression.
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 80] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
