/**
 * The Content-Security-Policy, in one place.
 *
 * src/proxy.ts sends it on every request with a fresh nonce; the security
 * section prints `describeCsp()` so visitors can read the exact policy the
 * page enforces. Proxy is bundled separately from the app, so this file must
 * import nothing.
 *
 * Production: only scripts carrying the request nonce (and scripts they load)
 * may run — no 'unsafe-inline', no third-party origins of any kind.
 * Development relaxes script-src because Turbopack/React Refresh inject
 * eval-based and un-nonced inline scripts.
 */
export function buildCsp(nonce: string, isDev: boolean): string {
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
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
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * The production policy as visitors should read it: one directive per line,
 * with the per-request nonce redacted. The live nonce is never rendered.
 */
export function describeCsp(): string[] {
  return buildCsp("…", false).split("; ");
}
