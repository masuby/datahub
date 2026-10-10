import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildCsp } from "@/lib/csp";
import { isServiceSlug } from "@/lib/service-slugs";

/**
 * Two jobs, in this order:
 *
 * 1. Locale routing. English keeps the root URLs — every poster, QR code and
 *    WhatsApp Status links to `/?ref=...`, so those URLs must not move.
 *    Kiswahili lives under `/sw`. Both render from `app/[lang]`: an un-prefixed
 *    page request is rewritten to `/en/...` (the address bar does not change),
 *    and a literal `/en/...` is redirected to the root so English has exactly
 *    one URL per page. Kept in sync with src/i18n/config.ts — Proxy is bundled
 *    separately from the app, so it deliberately imports nothing from it except
 *    src/lib/csp.ts and src/lib/service-slugs.ts, which themselves import
 *    nothing.
 *
 *    Every URL that is not a page gets the server-rendered global 404
 *    (app/global-not-found.tsx) only if it matches no route at all. Two kinds
 *    of URL would otherwise match one and 404 from inside the [lang] layout,
 *    which Next 16 draws only in the browser: an unknown service slug
 *    (/services/<x> matches services/[slug]) and a one-segment path with a dot
 *    (/index.html matches [lang] with lang "index.html"). Both are sent to a
 *    path no route matches instead.
 *
 * 2. Per-request Content-Security-Policy. Production uses a strict nonce-based
 *    policy with 'strict-dynamic' — only scripts carrying the request nonce (and
 *    scripts they load) may execute. No 'unsafe-inline' for scripts. Next.js
 *    stamps its own scripts with the nonce it reads from the request's CSP
 *    header; our inline scripts (theme bootstrap, JSON-LD) read `x-nonce`.
 *    Development relaxes script-src because Turbopack/React Refresh inject
 *    eval-based and un-nonced inline scripts.
 */

const PREFIXED_LOCALES = ["sw"];
const DEFAULT_LOCALE = "en";

/**
 * Top-level entries of public/: folders whose files are served, and files
 * at its root. Any other path is a page (or a 404). scripts/check-claims.mjs
 * fails if public/ gains an entry that is missing here.
 */
const PUBLIC_DIRS = new Set(["brand", "team"]);
const PUBLIC_FILES = new Set(["/daniel-masubi.png"]);

/**
 * Files the app/ conventions serve (icon.svg, apple-icon.png,
 * opengraph-image.tsx, robots.ts, sitemap.ts, favicon.ico). Exact paths
 * only: a prefix rule also let /icon.png or /opengraph-image.png through,
 * to match [lang] and 404 inside it.
 */
const APP_FILES = new Set([
  "/icon.svg",
  "/apple-icon.png",
  "/opengraph-image",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
]);

/** A path that matches no route, so the global 404 answers it on the server. */
const UNMATCHED = "/_not-found-page";

/** Requests that are not pages: they get the CSP, never a locale. */
function isNonPage(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    APP_FILES.has(pathname) ||
    PUBLIC_FILES.has(pathname) ||
    // A file inside a public/ folder: a name with an extension, right inside
    // it. /team, /team/privacy or /brand/services/x are not files.
    (PUBLIC_DIRS.has(pathname.split("/")[1] ?? "") && /^\/[^/]+\/[^/]+\.[A-Za-z0-9]+$/.test(pathname))
  );
}

/**
 * A locale-less page path that would match a route only to 404 inside it:
 * an unknown service slug, or a single segment with a dot in it.
 */
function isDeadEnd(rest: string): boolean {
  const service = /^\/services\/([^/]+)\/?$/.exec(rest);
  if (service) return !isServiceSlug(service[1]);
  return /^\/[^/]*\.[^/]*$/.test(rest);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A literal /en prefix: send it to the one canonical English URL.
  if (pathname === `/${DEFAULT_LOCALE}` || pathname.startsWith(`/${DEFAULT_LOCALE}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const isDev = process.env.NODE_ENV !== "production";
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce, isDev);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js reads this to apply the nonce to its scripts.
  requestHeaders.set("content-security-policy", csp);

  // Only this proxy decides which language a 404 speaks; a client's own
  // x-locale is dropped on every request, not only on pages.
  requestHeaders.delete("x-locale");

  let response: NextResponse;
  if (isNonPage(pathname)) {
    response = NextResponse.next({ request: { headers: requestHeaders } });
  } else {
    const prefixed = PREFIXED_LOCALES.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    );
    // The global 404 (app/global-not-found.tsx) receives no params; this tells
    // it which language to speak.
    // Always `set`: the headers were copied from the client, and a visitor
    // must not be able to choose this value themselves.
    requestHeaders.set("x-locale", prefixed ?? DEFAULT_LOCALE);
    const rest = prefixed ? pathname.slice(prefixed.length + 1) : pathname;
    if (isDeadEnd(rest)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${prefixed ?? DEFAULT_LOCALE}${UNMATCHED}`;
      response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    } else if (prefixed) {
      response = NextResponse.next({ request: { headers: requestHeaders } });
    } else {
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
      response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }
  }

  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  // Runs on prefetches too: they must be rewritten to /en/... like any other
  // page request, or a <Link> prefetch of an English page would 404.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
