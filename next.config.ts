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
  // The poster route reads the Geist TTFs from disk at request time. Tracing
  // cannot follow a runtime path.join, so without this the fonts are left out
  // of the serverless bundle and the route 500s in production while working
  // perfectly in dev.
  outputFileTracingIncludes: {
    "/api/poster/\\[kind\\]/\\[slug\\]": ["./assets/fonts/**/*"],
  },
  // Produces a minimal standalone server bundle for Docker.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
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
