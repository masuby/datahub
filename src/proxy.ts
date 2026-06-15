import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-request Content-Security-Policy.
 *
 * Production uses a strict nonce-based policy with 'strict-dynamic' — only
 * scripts carrying the request nonce (and scripts they load) may execute. No
 * 'unsafe-inline' for scripts. Next.js automatically stamps its own scripts with
 * the nonce it reads from the request's CSP header.
 *
 * Development relaxes script-src (unsafe-inline/eval + ws: for HMR) because
 * Turbopack/React Refresh inject eval-based and un-nonced inline scripts.
 */
export function proxy(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = crypto.randomUUID().replace(/-/g, "");

  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSrc}`,
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js reads this to apply the nonce to its scripts.
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Run on all routes except static assets and the image optimizer.
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
