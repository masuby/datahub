#!/usr/bin/env node
/**
 * Posts one day's campaign content to Facebook, Instagram — and prepares the
 * WhatsApp Status pack, which cannot be posted by any API and never will be.
 *
 * Usage:
 *   node scripts/social-post.mjs --slot=feed
 *   node scripts/social-post.mjs --slot=status --dry-run
 *   node scripts/social-post.mjs --slot=feed --slug=05-built-in-tanzania
 *   node scripts/social-post.mjs --slot=status --date=2026-09-14
 *
 * What each slot does
 *   feed   → Facebook Page photo post + Instagram feed post (1080x1350)
 *   status → Instagram Story (1080x1920) + an email to you with the poster
 *            attached and the caption ready to copy, for WhatsApp Status
 *
 * Every channel is optional. A channel whose environment variables are missing
 * is skipped with a note, so Facebook can go live weeks before Instagram does.
 * Nothing here throws away a post silently: a channel either posts, is skipped
 * for a stated reason, or fails loudly with Meta's own error text.
 *
 * Environment
 *   META_PAGE_ID, META_PAGE_TOKEN        Facebook Page
 *   META_IG_USER_ID                      Instagram (uses META_PAGE_TOKEN)
 *   META_GRAPH_VERSION                   optional, default v21.0
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL   status email
 *   SITE_URL                             optional, default from queue.json
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(import.meta.dirname, "..");
const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";
const GRAPH = `https://graph.facebook.com/${GRAPH_VERSION}`;

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);
const DRY = Boolean(args["dry-run"]);

const log = (...m) => console.log(...m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ dates */

/**
 * Today in the campaign's timezone as a plain YYYY-MM-DD string. The runner is
 * UTC and Tanzania is UTC+3, so a naive `new Date()` puts the 20:00 EAT status
 * run on the wrong calendar day for three hours every evening.
 */
function todayIn(timezone) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const DAY_MS = 86_400_000;
const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DAY_MS);
const weekdayOf = (date) => new Date(`${date}T00:00:00Z`).getUTCDay();

/**
 * How many *posting* days have elapsed since the anchor — rest days excluded.
 *
 * This must not be a plain calendar-day count. With 14 status posters and a
 * seven-day week, a calendar index means the same two rotation slots land on
 * the Sunday rest day forever, and those two posters are never published at
 * all. Counting only the days that actually post keeps every poster in the
 * cycle regardless of how the rotation length and the week divide.
 */
function postingDaysSince(anchorDate, date, restDays) {
  const elapsed = daysBetween(anchorDate, date);
  const perWeek = 7 - restDays.length;
  const weeks = Math.floor(elapsed / 7);
  let index = weeks * perWeek;
  for (let d = weeks * 7; d < elapsed; d++) {
    const weekday = new Date(Date.parse(`${anchorDate}T00:00:00Z`) + d * DAY_MS).getUTCDay();
    if (!restDays.includes(weekday)) index++;
  }
  return index;
}

/* --------------------------------------------------------------- captions */

/**
 * Pulls one `## Heading` section out of a caption.md, stopping at the next
 * heading or `---` rule. The files are hand-written prose, so this stays
 * deliberately forgiving about spacing and the em dash in the headings.
 */
function section(markdown, test) {
  const out = [];
  let capturing = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^##\s/.test(line)) {
      capturing = test.test(line);
      continue;
    }
    if (!capturing) continue;
    if (/^---\s*$/.test(line)) {
      capturing = false;
      continue;
    }
    out.push(line);
  }
  return out.join("\n").trim();
}

async function loadCaption(kind, slug) {
  const dir = kind === "post" ? "posts" : "status";
  const file = path.join(ROOT, "marketing", dir, slug, "caption.md");
  const md = await readFile(file, "utf8");

  const english = section(md, /English/i);
  const hashtags = section(md, /Hashtags/i);
  if (!english) throw new Error(`No English section found in ${file}`);
  return { english, hashtags, file };
}

/**
 * Instagram has no clickable link in a caption, so the copy says "link in bio".
 * On Facebook that sentence is a dead end — the URL works there, and carries
 * its own ?ref= so the lead lands in the database attributed to Facebook.
 */
function captionFor(channel, { english, hashtags }, siteUrl) {
  let body = english;
  if (channel === "facebook") {
    body = body
      .replace(/[^\n]*link in bio[^\n]*/gi, `${siteUrl}/?ref=facebook`)
      .replace(/[^\n]*link ipo kwenye bio[^\n]*/gi, `${siteUrl}/?ref=facebook`);
  }
  return hashtags ? `${body}\n\n${hashtags}` : body;
}

/* ------------------------------------------------------------- graph api  */

async function graph(endpoint, params, method = "POST") {
  const body = new URLSearchParams(params);
  const url = method === "GET" ? `${GRAPH}${endpoint}?${body}` : `${GRAPH}${endpoint}`;
  const res = await fetch(url, method === "GET" ? {} : { method: "POST", body });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`${endpoint} returned ${res.status} with a non-JSON body`);
  }
  if (!res.ok || json.error) {
    const e = json.error ?? {};
    throw new Error(
      `${endpoint} failed (${res.status}): ${e.message ?? "unknown"}` +
        (e.code ? ` [code ${e.code}${e.error_subcode ? `/${e.error_subcode}` : ""}]` : ""),
    );
  }
  return json;
}

async function postToFacebook({ pageId, token, imageUrl, caption }) {
  const r = await graph(`/${pageId}/photos`, {
    url: imageUrl,
    message: caption,
    access_token: token,
  });
  return `https://www.facebook.com/${r.post_id ?? r.id}`;
}

/**
 * Instagram publishes in two steps: create a container, then publish it. The
 * container is created asynchronously — Meta fetches the image from our URL —
 * so publishing immediately can fail on a cold cache. Poll until FINISHED.
 */
async function postToInstagram({ igUserId, token, imageUrl, caption, story }) {
  const container = await graph(`/${igUserId}/media`, {
    image_url: imageUrl,
    ...(story ? { media_type: "STORIES" } : { caption }),
    access_token: token,
  });

  for (let attempt = 0; attempt < 15; attempt++) {
    const s = await graph(`/${container.id}`, { fields: "status_code,status", access_token: token }, "GET");
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") {
      throw new Error(`Instagram container ${s.status_code}: ${s.status ?? ""}`);
    }
    await sleep(4000);
  }

  const published = await graph(`/${igUserId}/media_publish`, {
    creation_id: container.id,
    access_token: token,
  });
  return `https://www.instagram.com/p/${published.id}`;
}

/* ------------------------------------------------------- whatsapp handoff */

/**
 * WhatsApp Status has no API. Not in the Business API, not in the Cloud API,
 * not on any roadmap Meta has published — Status is a client-only feature, and
 * every tool claiming otherwise drives an unofficial client and gets numbers
 * banned. So the automation does the only honest thing: it puts the poster and
 * the exact text in your inbox, and you spend twenty seconds posting it.
 */
async function emailStatusPack({ slug, caption, imageUrl, siteUrl }) {
  const { default: nodemailer } = await import("nodemailer");

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  // Attach the PNG rather than link it: on a phone, "save image from email" is
  // one long-press, while a link is a browser trip you will skip on a bad day.
  const png = Buffer.from(await (await fetch(imageUrl)).arrayBuffer());

  await transport.sendMail({
    from: `"DataHub campaign" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `WhatsApp Status for today — ${slug}`,
    text: [
      "Long-press the attached image to save it, then copy the text below.",
      "",
      "--- copy from here ---",
      caption,
      "--- to here ---",
      "",
      `Poster: ${imageUrl}`,
      `Site: ${siteUrl}/?ref=wa_status`,
      "",
      "Post it to WhatsApp Status. Twenty seconds. The Instagram Story for the",
      "same poster has already gone out automatically.",
    ].join("\n"),
    attachments: [{ filename: `${slug}.png`, content: png }],
  });
}

/* -------------------------------------------------------------------- run */

async function main() {
  const queue = JSON.parse(await readFile(path.join(ROOT, "marketing", "queue.json"), "utf8"));
  const slot = args.slot;
  if (slot !== "feed" && slot !== "status") {
    throw new Error("Pass --slot=feed or --slot=status");
  }

  const config = queue[slot];
  const timezone = queue.timezone || "Africa/Dar_es_Salaam";
  const siteUrl = (process.env.SITE_URL || queue.siteUrl).replace(/\/$/, "");
  const date = typeof args.date === "string" ? args.date : todayIn(timezone);
  const kind = slot === "feed" ? "post" : "status";

  log(`\nDataHub campaign — ${slot} slot for ${date} (${timezone})`);
  if (DRY) log("DRY RUN — nothing will be posted or emailed.\n");

  if (!config.enabled) return log(`Slot "${slot}" is disabled in queue.json. Nothing to do.`);

  const elapsed = daysBetween(config.anchorDate, date);
  if (elapsed < 0) return log(`Campaign starts ${config.anchorDate}. Nothing to do yet.`);

  if (slot === "status" && (config.restDays ?? []).includes(weekdayOf(date))) {
    return log("Rest day. Nothing to post — this is deliberate, the campaign has to survive past October.");
  }
  if (slot === "feed" && elapsed % (config.everyDays ?? 3) !== 0) {
    const next = (config.everyDays ?? 3) - (elapsed % (config.everyDays ?? 3));
    return log(`Not a feed day. Next one in ${next} day(s).`);
  }

  // Which poster: an explicit --slug wins, otherwise walk the rotation. Slot
  // rotations wrap, so the campaign never runs out of content and stops.
  const index =
    slot === "feed"
      ? Math.floor(elapsed / (config.everyDays ?? 3))
      : postingDaysSince(config.anchorDate, date, config.restDays ?? []);
  const slug = typeof args.slug === "string" ? args.slug : config.rotation[index % config.rotation.length];
  const cycle = Math.floor(index / config.rotation.length) + 1;

  const caption = await loadCaption(kind, slug);
  const jpeg = `${siteUrl}/api/poster/${kind}/${slug}?format=jpg`;
  const png = `${siteUrl}/api/poster/${kind}/${slug}`;

  log(`Poster: ${slug}  (rotation pass ${cycle})`);
  log(`Image:  ${jpeg}\n`);

  const channels = config.channels ?? [];
  const done = [];
  const skipped = [];
  const failed = [];

  const attempt = async (name, needed, fn) => {
    if (!channels.includes(name)) return;
    const missing = needed.filter((v) => !process.env[v]);
    if (missing.length) return skipped.push(`${name} — not configured (${missing.join(", ")})`);
    if (DRY) return done.push(`${name} — would post (dry run)`);
    try {
      done.push(`${name} — ${await fn()}`);
    } catch (err) {
      failed.push(`${name} — ${err.message}`);
    }
  };

  await attempt("facebook", ["META_PAGE_ID", "META_PAGE_TOKEN"], () =>
    postToFacebook({
      pageId: process.env.META_PAGE_ID,
      token: process.env.META_PAGE_TOKEN,
      imageUrl: jpeg,
      caption: captionFor("facebook", caption, siteUrl),
    }),
  );

  await attempt("instagram", ["META_IG_USER_ID", "META_PAGE_TOKEN"], () =>
    postToInstagram({
      igUserId: process.env.META_IG_USER_ID,
      token: process.env.META_PAGE_TOKEN,
      imageUrl: jpeg,
      caption: captionFor("instagram", caption, siteUrl),
    }),
  );

  await attempt("instagram_story", ["META_IG_USER_ID", "META_PAGE_TOKEN"], () =>
    postToInstagram({
      igUserId: process.env.META_IG_USER_ID,
      token: process.env.META_PAGE_TOKEN,
      imageUrl: jpeg,
      story: true,
    }),
  );

  await attempt("whatsapp_email", ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "NOTIFY_EMAIL"], async () => {
    await emailStatusPack({ slug, caption: caption.english, imageUrl: png, siteUrl });
    return `pack emailed to ${process.env.NOTIFY_EMAIL}`;
  });

  for (const line of done) log(`  ok      ${line}`);
  for (const line of skipped) log(`  skip    ${line}`);
  for (const line of failed) log(`  FAILED  ${line}`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = await import("node:fs/promises");
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      [
        `### ${slot} — ${slug} (${date})`,
        "",
        ...done.map((l) => `- ok — ${l}`),
        ...skipped.map((l) => `- skipped — ${l}`),
        ...failed.map((l) => `- **failed** — ${l}`),
        "",
      ].join("\n"),
    );
  }

  // A failure must fail the job — a silently broken campaign is the whole
  // failure mode this automation exists to prevent.
  if (failed.length) process.exit(1);
  if (!done.length) log("\nNothing posted: no channel is configured yet. See marketing/AUTOMATION.md.");
}

main().catch((err) => {
  console.error(`\nsocial-post failed: ${err.message}`);
  process.exit(1);
});
