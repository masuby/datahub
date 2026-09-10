# Automating the campaign

Setup takes about 30 minutes, once. After that the campaign posts itself and
asks you for 20 seconds a day.

---

## What can actually be automated

Read this part before anything else, because one of these four answers is going
to disappoint you and it is better to know now than after an afternoon of work.

| Channel | Automatic? | Why |
| --- | --- | --- |
| **Facebook Page** | Yes | Graph API, `pages_manage_posts`. Fully supported. |
| **Instagram feed** | Yes | Content Publishing API. Needs a Business/Creator account. |
| **Instagram Story** | Yes | Same API, `media_type=STORIES`. |
| **WhatsApp Status** | **No** | There is no API for Status. Not in the WhatsApp Business API, not in the Cloud API, not anywhere. Status is a phone-client feature. |
| Personal Facebook profile | **No** | Meta removed publishing to personal timelines in 2018. Only Pages. |

**On WhatsApp Status specifically:** every tool that advertises "WhatsApp Status
automation" works by driving an unofficial client (`whatsapp-web.js`, Baileys,
and similar). They break whenever WhatsApp ships an update, and using one is
grounds for your number being banned. Your number is on your CV, your posters
and your Google Business Profile. It is not worth it.

So the automation does the honest thing instead: at 20:00 every posting day it
emails you the poster as an attachment with the exact caption underneath. On
your phone that is long-press → save → open WhatsApp → paste → post. Twenty
seconds, and the Instagram Story for the same poster has already gone out on
its own.

---

## How it works

```
marketing/queue.json        which poster goes out, on which day, to which channel
        │
        ▼
.github/workflows/social.yml    two crons: 08:00 EAT feed · 20:00 EAT status
        │
        ▼
scripts/social-post.mjs
        │
        ├── Facebook Page ──── graph.facebook.com/{page}/photos
        ├── Instagram feed ─── create container → publish
        ├── Instagram Story ── create container (STORIES) → publish
        └── Email to you ───── poster attached + caption, for WhatsApp Status
                │
                ▼
        image comes from  datahub.co.tz/api/poster/{kind}/{slug}?format=jpg
```

Three things worth knowing about this design:

**The queue is a rotation, not a calendar.** `posting-schedule.md` runs out on
30 September. `queue.json` does not — each slot walks its list and wraps around.
That is deliberate: the most common way a campaign dies is that the schedule
ends and nobody notices for three weeks.

**Meta fetches the image; nothing is uploaded.** Instagram's API takes an
`image_url` and downloads it itself. Your poster endpoint already serves live
PNGs over HTTPS, so there is no storage, no CDN and no upload step anywhere in
this pipeline.

**Instagram requires JPEG.** It rejects PNG containers. `?format=jpg` was added
to the poster route for exactly this. Facebook is happy with either.

---

## Setup

### 1 — Facebook Page and Instagram Business account (5 min)

You need a Facebook **Page** (a business page, not your profile) and an
Instagram **Business** or **Creator** account, linked to each other.

1. Create the Page at [facebook.com/pages/create](https://www.facebook.com/pages/create) if you do not have one. Name it **DataHub**, category *Information Technology Company*, website `https://www.datahub.co.tz`.
2. In the Instagram app: **Settings → Account type and tools → Switch to professional account → Business**.
3. Still in Instagram: **Settings → Account type and tools → Sharing to other apps → Facebook** → connect it to the DataHub Page.

Confirm the link worked: on the Facebook Page go to **Settings → Linked
accounts → Instagram**. It should show your account.

### 2 — Create a Meta app (5 min)

1. Go to [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create app**.
2. Use case: **Other** → type: **Business**.
3. Name it `DataHub Poster`. Attach it to a Business Portfolio if it asks.
4. In **App settings → Basic**, copy the **App ID** and **App secret**.

**Leave the app in Development mode.** You will see a "Live" toggle at the top —
do not touch it. In Development mode an app can act on Pages and Instagram
accounts belonging to people who have a role on it. You are the admin, and both
accounts are yours, so it works indefinitely. Switching to Live would put you
into App Review, which for `instagram_content_publish` means a screencast, a
privacy policy and a wait of one to three weeks — all of it unnecessary for
posting to your own accounts.

### 3 — Get a Page token that never expires (10 min)

This is the fiddly part. Do it in order.

**a. Short-lived user token.** Open the
[Graph API Explorer](https://developers.facebook.com/tools/explorer). Select your
app in the top-right. Click **Add a permission** and tick all six:

```
pages_show_list
pages_read_engagement
pages_manage_posts
instagram_basic
instagram_content_publish
business_management
```

Click **Generate access token**, approve the dialog, and copy the token. It is
valid for one hour — that is fine, it is about to be exchanged.

**b. Exchange it for a 60-day user token.** In a terminal:

```bash
curl -s "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

**c. Get the Page token from that long-lived user token.** This is the step that
matters: a Page token derived from a *long-lived* user token does not expire at
all.

```bash
curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
```

The response lists your Pages. From the DataHub one, copy `id` (that is
`META_PAGE_ID`) and `access_token` (that is `META_PAGE_TOKEN`).

**d. Get the Instagram user ID:**

```bash
curl -s "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=PAGE_TOKEN"
```

The `instagram_business_account.id` is `META_IG_USER_ID`.

**e. Prove the token is permanent.** Paste it into the
[Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken).
It must say **Expires: Never** and **Type: Page**. If it says anything else, the
user token you used at step (c) was still the short-lived one — redo (b).

### 4 — Put the secrets in GitHub (5 min)

Repository → **Settings → Secrets and variables → Actions → New repository
secret**. Add:

| Secret | Value |
| --- | --- |
| `META_PAGE_ID` | from step 3c |
| `META_PAGE_TOKEN` | from step 3c |
| `META_IG_USER_ID` | from step 3d |
| `SMTP_HOST` | `smtp.purelymail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `hello@datahub.co.tz` |
| `SMTP_PASS` | your Purelymail password |
| `NOTIFY_EMAIL` | `daniel@datahub.co.tz` |

Secrets are encrypted and are never printed in logs, including in a public
repository. The workflow does not run on pull requests, so a fork cannot reach
them.

Optionally add a **variable** (not a secret) `META_GRAPH_VERSION` if you ever
need to pin a newer Graph API version than the `v21.0` default.

### 5 — Test before trusting it

Locally, without posting anything:

```bash
npm run social -- --slot=status --dry-run
```

That resolves today's poster and prints exactly what it would do. Then from
GitHub: **Actions → Campaign → Run workflow**, slot `status`, dry run **checked**.
Read the summary. When it looks right, run it again with dry run **unchecked** —
that posts one real Story and sends you one real email.

Only after a successful real run should you consider the crons live.

---

## What your day looks like after this

**08:00**, every third day — a feed post goes to Instagram and the Facebook Page
without you.

**20:00**, every day except Sunday — an Instagram Story goes out, and an email
lands in `daniel@datahub.co.tz` with the poster attached. You post it to
WhatsApp Status. That is the only manual step in the whole system.

**Sunday** — nothing. That is in the rules for a reason.

---

## Adding new posters

1. Add the copy to `src/lib/posters.ts`.
2. Create `marketing/status/15-your-slug/caption.md` following the existing format — the parser looks for a `## ... English` heading and an optional `## Hashtags` heading.
3. Append `"15-your-slug"` to the right `rotation` array in `marketing/queue.json`.
4. Deploy. The poster endpoint renders it live; nothing else to do.

---

## When something breaks

**"The image format is not supported"** — Instagram was given a PNG. Check the
URL in the log ends with `?format=jpg`.

**Error code 190** — the token is invalid or was revoked. This happens if you
change your Facebook password or remove the app. Redo step 3.

**Error code 4 or 32** — rate limit. Instagram allows 25 API-published posts per
rolling 24 hours; you use at most two. If you hit this, something is looping.

**"Media container ERROR"** — Meta could not fetch the image. Open the poster URL
in a browser; if the site is down or the slug is wrong, that is the cause.

**Nothing ran at all** — GitHub disables scheduled workflows in a repository with
no commits for 60 days. Check Actions for a banner. The weekly Claude routine
commits, which prevents this.

**The post went out at the wrong time** — GitHub's scheduler is best-effort and
runs late under load. It is not adjustable. If exact timing ever matters, move
the cron to Vercel.

---

## Cost

Nothing. GitHub Actions is free for public repositories, the Graph API is free,
the poster endpoint runs on the Vercel deployment you already pay nothing for,
and the email goes through the Purelymail account you already bought.
