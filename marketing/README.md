# DataHub — Marketing

Everything needed to run the DataHub campaign on Instagram, Facebook and
WhatsApp. One poster, one caption, one link — repeated until people in Dar know
the name.

---

## The two cadences

| Channel | What | How often |
| --- | --- | --- |
| **Instagram feed + Facebook page** | A full post: poster + long caption | **Every 3 days** |
| **WhatsApp Status + Instagram Story** | One poster, one line of text | **Almost every day** |

Feed posts build the record a stranger scrolls back through. Status posts keep
you in front of the people who already have your number. They are different
jobs — do not skip Status because you posted to the feed.

---

## Folder layout

```
marketing/
├── README.md              ← this file
├── posting-schedule.md    ← the dated calendar; tick posts off as you go
├── brand/                 ← colours, fonts, logo rules for making posters
├── posts/                 ← FEED posts (every 3 days)
│   └── 01-hours-to-seconds/
│       ├── caption.md     ← EN + SW caption, hashtags, the exact link
│       └── poster.png     ← you add this (1080×1350)
└── status/                ← STATUS / STORY posts (near-daily)
    └── 01-.../
        ├── caption.md
        └── poster.png     ← you add this (1080×1920)
```

**Rule: the poster lives in the same folder as its caption.** They must never
drift apart. When a post is published, add a `— posted YYYY-MM-DD` line at the
bottom of its `caption.md` so you always know what has already gone out.

---

## Poster sizes

| Where | Size | Notes |
| --- | --- | --- |
| Instagram feed / Facebook | **1080 × 1350** (4:5) | Takes the most vertical space in the feed |
| WhatsApp Status / IG Story | **1080 × 1920** (9:16) | Keep text out of the top and bottom 250px — the UI covers it |

---

## Every poster must carry the site

Bottom of every poster, in the accent colour, large enough to read on a cracked
phone screen at arm's length:

```
www.datahub.co.tz
```

That is the entire point of the campaign. A poster without the address is a
wasted post.

---

## Tagged links — how you find out what actually works

Never post the bare URL. Add a `?ref=` tag so the lead notification email tells
you which channel sent it. The site reads the tag, stores it on the lead, and
the email you receive shows a **"Came from"** line.

| Where you are posting | Link to use |
| --- | --- |
| Instagram bio | `https://www.datahub.co.tz/?ref=ig_bio` |
| Instagram Story (link sticker) | `https://www.datahub.co.tz/?ref=ig_story` |
| Facebook post | `https://www.datahub.co.tz/?ref=facebook` |
| WhatsApp Status | `https://www.datahub.co.tz/?ref=wa_status` |
| WhatsApp direct message | `https://www.datahub.co.tz/?ref=wa_dm` |
| LinkedIn | `https://www.datahub.co.tz/?ref=linkedin` |

Tags must be lowercase letters, numbers, `_` or `-` only — anything else is
rejected by the server and the lead saves with no source.

**Instagram feed captions cannot contain a clickable link.** For those, write
"link in bio" and keep `?ref=ig_bio` in your bio. Stories and Facebook and
WhatsApp Status all take real links.

---

## After 30 days, ask the numbers one question

Run this against the database and look at nothing else:

```sql
SELECT source, COUNT(*) FROM leads GROUP BY source ORDER BY 2 DESC;
```

Whichever channel is at the top gets double the effort next month. Whichever is
at zero gets dropped. Do not argue with it.

---

## When a lead arrives

You get an email with their name, phone, company, what they want, and where they
came from. **Reply within one business day** — the site promises that.

For Tanzanian leads, reply on WhatsApp first, email second. Ask one question:
*"What report is eating the most of your team's time right now?"* That single
question scopes the whole job.
