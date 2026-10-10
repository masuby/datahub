#!/usr/bin/env node
/**
 * Verifies the claims the site makes about itself in its security section.
 *
 * Usage: node scripts/check-claims.mjs <base-url>      e.g. http://localhost:3100
 *
 * Run it against a PRODUCTION build (`next build && next start`): development
 * deliberately relaxes the CSP for hot reload. Exits non-zero on any failure,
 * so a page can never state something about itself that has stopped being true.
 *
 *   - No cookies: no Set-Cookie on any page or on the contact API.
 *   - CSP: script-src carries a nonce and 'strict-dynamic', never
 *     'unsafe-inline'; connect-src, img-src and font-src stay first-party.
 *   - Every inline <script> carries that request's nonce.
 *   - No <script src> or stylesheet from another origin.
 *   - Campaign links (?ref=) and the poster images still respond.
 *   - Every page, in both languages, has exactly one <h1>.
 *   - Every 404 (unknown page, unknown service, stray file name) is the
 *     server-rendered page in the visitor's language, not an empty shell.
 *   - Every top-level entry of public/ is still served as a file (src/proxy.ts
 *     keeps a list of them).
 *   - The contact form: JSON only (a disguised media type is refused), no
 *     cross-site posts, and "a few messages per network address" holds even
 *     when a client invents a new X-Forwarded-For for every request.
 */

import { readdirSync, statSync } from "node:fs";

const base = (process.argv[2] ?? "http://localhost:3100").replace(/\/$/, "");
const SITE_HOSTS = new Set(["www.datahub.co.tz", "datahub.co.tz", new URL(base).host]);

const PAGES = [
  "/",
  "/?ref=wa_status",
  "/sw",
  "/sw?ref=qr",
  "/services",
  "/sw/services",
  "/services/dashboards",
  "/services/automation",
  "/services/ai-agents",
  "/sw/services/dashboards",
  "/dashboards",
  "/sw/dashboards",
  "/process",
  "/sw/process",
  "/security",
  "/sw/security",
  "/team",
  "/sw/team",
  "/faq",
  "/sw/faq",
  "/contact",
  "/contact?ref=qr",
  "/sw/contact",
  "/privacy",
  "/sw/privacy",
];

let failures = 0;
const fail = (where, msg) => {
  failures++;
  console.log(`  FAIL  ${where}: ${msg}`);
};
const pass = (where, msg) => console.log(`  ok    ${where}: ${msg}`);

function directive(csp, name) {
  const d = csp.split(";").map((s) => s.trim()).find((s) => s.startsWith(`${name} `) || s === name);
  return d ? d.slice(name.length).trim() : null;
}

for (const path of PAGES) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  const where = path;
  if (res.status !== 200) {
    fail(where, `status ${res.status}`);
    continue;
  }
  if (res.headers.get("set-cookie")) fail(where, `Set-Cookie present: ${res.headers.get("set-cookie")}`);

  const csp = res.headers.get("content-security-policy") ?? "";
  const script = directive(csp, "script-src") ?? "";
  const nonce = script.match(/'nonce-([^']+)'/)?.[1];
  if (!nonce) fail(where, "script-src has no nonce");
  if (!script.includes("'strict-dynamic'")) fail(where, "script-src lacks 'strict-dynamic'");
  if (script.includes("'unsafe-inline'") || script.includes("'unsafe-eval'")) fail(where, `script-src too loose: ${script}`);
  for (const [name, expected] of [
    ["connect-src", "'self'"],
    ["img-src", "'self' data: blob:"],
    ["font-src", "'self' data:"],
    ["object-src", "'none'"],
    ["frame-ancestors", "'none'"],
  ]) {
    const got = directive(csp, name);
    if (got !== expected) fail(where, `${name} is "${got}", expected "${expected}"`);
  }

  const html = await res.text();
  const scripts = [...html.matchAll(/<script\b([^>]*)>/gi)].map((m) => m[1]);
  for (const attrs of scripts) {
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    if (src) {
      const u = new URL(src, base);
      if (!SITE_HOSTS.has(u.host)) fail(where, `external script ${src}`);
      continue;
    }
    const n = attrs.match(/\bnonce="([^"]+)"/)?.[1];
    if (n !== nonce) fail(where, `inline <script${attrs.slice(0, 60)}> without the request nonce`);
  }
  for (const m of html.matchAll(/<link\b[^>]*rel="(stylesheet|preload|modulepreload)"[^>]*href="([^"]+)"/gi)) {
    const u = new URL(m[2], base);
    if (!SITE_HOSTS.has(u.host)) fail(where, `external ${m[1]} ${m[2]}`);
  }
  if (/<iframe\b/i.test(html)) fail(where, "contains an <iframe>");
  const h1s = html.match(/<h1\b/gi)?.length ?? 0;
  if (h1s !== 1) fail(where, `${h1s} <h1> elements, expected exactly 1`);
  if (/\b(google-analytics|googletagmanager|facebook\.net|hotjar|clarity\.ms)\b/i.test(html)) {
    fail(where, "references a tracking script host");
  }
  pass(where, `200, one h1, ${scripts.length} scripts, all nonced or first-party, no cookies`);
}

// The contact API must not set cookies either, on any path a visitor can hit.
for (const [method, body] of [
  ["GET", undefined],
  ["POST", JSON.stringify({ name: "x" })], // 422: validation path, nothing stored
]) {
  const res = await fetch(`${base}/api/contact`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body,
  });
  if (res.headers.get("set-cookie")) fail(`/api/contact ${method}`, "Set-Cookie present");
  else pass(`/api/contact ${method}`, `status ${res.status}, no cookies`);
}

// Posters are fetched by the social-media automation; their URLs must not move.
for (const p of ["/api/poster/post/01-hours-to-seconds", "/api/poster/status/01-still-doing-manually?format=jpg"]) {
  const res = await fetch(`${base}${p}`);
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200 || !type.startsWith("image/")) fail(p, `status ${res.status} type ${type}`);
  else pass(p, `${res.status} ${type}`);
}

// 404s: server-rendered, in the right language, never indexed.
for (const [path, lang] of [
  ["/nope", "en-TZ"],
  ["/sw/nope", "sw-TZ"],
  ["/services/nope", "en-TZ"],
  ["/services/Dashboards", "en-TZ"],
  ["/sw/services/nope", "sw-TZ"],
  ["/index.html", "en-TZ"],
  ["/sw/index.html", "sw-TZ"],
  ["/brand", "en-TZ"],
  ["/team/privacy", "en-TZ"],
  ["/team/nope", "en-TZ"],
  ["/sw/faq/nope", "sw-TZ"],
  ["/brand/services/dashboards", "en-TZ"],
  ["/icon.png", "en-TZ"],
  ["/apple-icon", "en-TZ"],
  ["/opengraph-image.png", "en-TZ"],
  ["/manifest.webmanifest", "en-TZ"],
]) {
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  const html = await res.text();
  const problems = [];
  if (res.status !== 404) problems.push(`status ${res.status}`);
  if (html.includes("__next_error__")) problems.push("empty client-rendered shell");
  if (!html.includes(`<html lang="${lang}"`)) problems.push(`no <html lang="${lang}">`);
  if (!/<h1\b/.test(html)) problems.push("no heading in the HTML");
  if (!/<meta name="robots" content="noindex/.test(html)) problems.push("not noindex");
  if (/<meta name="robots" content="index/.test(html)) problems.push("also says index");
  if (problems.length) fail(`404 ${path}`, problems.join(", "));
  else pass(`404 ${path}`, `404, server-rendered, ${lang}, noindex`);
}

// Static files: every top-level entry of public/ must still be served.
const publicDir = new URL("../public/", import.meta.url);
for (const name of readdirSync(publicDir)) {
  if (name.startsWith(".")) continue;
  const isDir = statSync(new URL(name, publicDir)).isDirectory();
  const file = isDir ? `${name}/${readdirSync(new URL(`${name}/`, publicDir))[0]}` : name;
  const res = await fetch(`${base}/${file}`, { redirect: "manual" });
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200 || type.startsWith("text/html")) {
    fail(`/${file}`, `status ${res.status} type ${type} (missing from PUBLIC_DIRS / PUBLIC_FILES in src/proxy.ts?)`);
  } else pass(`/${file}`, `${res.status} ${type}`);
}

// The favicon browsers ask for unprompted.
{
  const res = await fetch(`${base}/favicon.ico`);
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200 || !type.startsWith("image/")) fail("/favicon.ico", `status ${res.status} type ${type}`);
  else pass("/favicon.ico", `${res.status} ${type}`);
}

// A client cannot choose the language of a 404 with its own x-locale header.
{
  const res = await fetch(`${base}/api/nope`, { headers: { "x-locale": "sw" } });
  const html = await res.text();
  if (html.includes('<html lang="sw-TZ"')) fail("x-locale from the client", "the 404 spoke the language the client asked for");
  else pass("x-locale from the client", "ignored");
}

// Contact: exact JSON media type, same-site only.
{
  const body = JSON.stringify({ name: "x" });
  const disguised = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "content-type": "text/plain;a=application/json" },
    body,
  });
  if (disguised.status !== 415) fail("/api/contact disguised type", `status ${disguised.status}, expected 415`);
  else pass("/api/contact disguised type", "415");
  const cross = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", "sec-fetch-site": "cross-site" },
    body,
  });
  if (cross.status !== 403) fail("/api/contact cross-site", `status ${cross.status}, expected 403`);
  else pass("/api/contact cross-site", "403");
}

// Rate limit: a client cannot reset it by inventing X-Forwarded-For values.
// X-Real-IP stands in for the proxy in front (nginx and Vercel set it); a
// random one per run keeps this test from using up the budget of the machine
// running it.
{
  const realIp = `198.18.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
  const statuses = [];
  for (let i = 0; i < 7; i++) {
    const res = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": realIp,
        "x-forwarded-for": `203.0.113.${i + 1}, ${realIp}`,
      },
      body: JSON.stringify({ name: "x" }),
    });
    statuses.push(res.status);
  }
  if (!statuses.includes(429)) fail("/api/contact rate limit", `no 429 in ${statuses.join(" ")} with a new X-Forwarded-For each time`);
  else pass("/api/contact rate limit", statuses.join(" "));
}

console.log(failures ? `\n${failures} claim(s) failed.` : "\nAll claims hold.");
process.exit(failures ? 1 : 0);
