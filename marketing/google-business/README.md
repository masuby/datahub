# Google Business Profile — DataHub

Regenerate these any time with `npm run gbp` (the cover pulls from the live
OpenGraph card, so it stays in sync with the site).

---

## Do not upload a storefront photo

Google's "Add a storefront photo" step assumes premises a customer can walk
into. DataHub has none. Uploading a generated, stock or borrowed building photo
misrepresents the business, and **misrepresentation is one of the fastest ways
to get a profile suspended.** Appeals are slow, and a suspended profile means no
presence in the map pack at all.

**Skip that step.** It is optional.

Instead, set DataHub up as a **service-area business**:

- When asked "Do you want to add a location customers can visit?" → **No**
- Set the **service area** to Dar es Salaam and Tanzania
- Your address is used for verification only and stays hidden from the public

This is the correct configuration for a consultancy, and it also keeps a home
address off the public internet.

---

## What to upload instead

| Slot | File | Notes |
| --- | --- | --- |
| **Logo** | `logo-1024.png` | 1024×1024. Google requires square, 720×720 minimum. |
| **Cover** | `cover-1920x1080.png` | 16:9. The image Google shows largest — same artwork as the site's social card. |
| **Team / owner** | `profile-720.png` | Your portrait. People hire people; this is worth more than any graphic. |
| **At work** | *(take these yourself)* | See below. |

### Photos worth taking yourself

These beat anything generated, because they are real and Google rewards genuine
recent photos:

1. Your actual desk or workspace mid-session — screens with a dashboard open.
2. A screen showing a real report or dashboard you built. **Blur or replace any
   client names and real figures first.**
3. You working on the Arduino/Raspberry Pi bench — it reads as a real engineer's
   workshop, which is exactly the impression you want.

Add a few over time rather than all at once. Profiles with photos added
regularly perform better than ones filled in a single day and never touched.

---

## Profile fields

| Field | Value |
| --- | --- |
| Business name | `DataHub` — the legal name only. Do **not** append keywords like "Data Analytics Tanzania"; that is a guideline violation and a common suspension cause. |
| Primary category | `Software Company` |
| Secondary | `Business Management Consultant`, `Computer Consultant` |
| Service area | Dar es Salaam · Tanzania |
| Phone | Your WhatsApp number, matching the site exactly |
| Website | `https://www.datahub.co.tz` |
| Appointment link | `https://www.datahub.co.tz/#contact` |
| Services | Add three, matching the site: **Dashboards & Business Intelligence**, **Reporting Automation**, **AI Agent Design** — and link each to its page under `/services/`. |

Keep the name, phone and website **byte-identical** to the website and to any
directory listing. Inconsistent details across sources ("NAP consistency") is one
of the strongest negative signals in local ranking.

---

## After it is verified

1. Post an update every couple of weeks — reuse captions from `marketing/posts/`.
2. **Ask your first satisfied client for a review.** Reviews are the single
   biggest differentiator in the local pack, and almost no Tanzanian software
   consultancy has any. Five genuine reviews would put you ahead of most.
3. Never buy reviews. Google detects clustered fake reviews and suspends for it.
