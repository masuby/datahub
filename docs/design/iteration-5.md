# Iteration 5 — calmer chrome, centred layout, own icons, metal buttons, new type, a live dashboard

Owner's feedback (Daniel, 11 Oct 2026), with nine reference images:

> keep the hand as liquid metal … reduce the underlying small line like
> pointing, and those that appear when i pass to the sub headers, they make
> the work look unprofessional. then put texts and other icon centered … we
> need to also use center so many things become centered, especially in
> small screens. also reduce that gap there between navbar and the headers.
> use that icon as the dashboard icon. also those button has to be a glass
> buttons like (similar to the hand), (u can reduce the font size there to
> make them fit well (that will be well shining), remove background to all
> of the icons, then insert them there. also use the font I have given you
> there in sample, or you can find the best of the best font style that will
> fit there perfect as well

And, later the same day:

> [the closing "Which report takes your team longest?" band] … there is no
> need for that anymore (we have a start conversation button on top, which
> is enough, so that whole section can be removed). then in the Homepage
> Dashboard … we can create a PC like shining (similar to what they did on
> github), then we put a dashboard we have created, and we make the
> dashboard live, by putting numbers on the right hand moving up (scrolling
> themselves), then box fields (4 of them with numbers on left side), then
> bar charts, line graph and donut circle on left side (the right side take
> like just 1/4 but the 3/4 will show the analytics things) (we don't need
> to make too much sense on the numbers but to make things attractive there,
> so they catch attention)

This brief **overrides** spec.md and the earlier iteration briefs where they
disagree. Unchanged: the hero (approved; its hand stays liquid metal), the
phone menu's structure, bilingual EN + `/sw`, both themes, the strict nonce
CSP, the lead pipeline (`/api/contact` keys, honeypot, `?ref=`), sample-only
dashboards, the motion/perf gates (reduced motion, Save-Data, low-end
devices, hidden tab, off screen).

## A. No more "pointing" lines

Remove every short decorative line and every underline that appears on
hover:

- Header nav: no active-page underline, no hover underline. The current page
  is marked by colour (`text-fg`, others `text-muted`) and keeps
  `aria-current="page"`. Hover = colour only.
- The header's scroll-progress thread: removed.
- Language switch: no underline under the current language; it is marked by
  colour/weight (and keeps its accessible state).
- Section headers: the R2 section rule with its 48px thread is gone (no
  horizontal rule above section headers at all).
- The short `thread` accents before home-section labels and in the closing
  band: gone.
- Hover threads on rows (contact rows, service-page rows) and `link-thread`
  hover underlines on standalone links (footer lists, "See all →" links,
  breadcrumbs): gone; hover = colour (and the arrow's nudge where there is
  one).
- Links **inside running text** (a sentence in a paragraph, the form's
  privacy note) still need a non-colour cue: a static, quiet 1px underline
  (`text-decoration`, offset ~3px, rule-strong colour, accent on hover), no
  animation.
- Keep functional indicators: the form fields' focus line, focus rings, the
  dashboards' selected-tab state (restyle it as a pill/segment rather than an
  underline), chart marks.

## B. Centre

- Section headers centre at every width: eyebrow, then title, then lead,
  stacked and centred; lead max ~40rem. No more eyebrow-in-left-column grid.
- Home tiles: icon on top, title and one line below, all centred, at every
  width; the vertical hairlines between tiles stay on desktop. On phones
  the tiles stack, centred.
- Phones (< 640px) and tablets: the hero's text block (headline, sub-line,
  buttons) centres; the mark sits centred below it. Desktop hero unchanged.
- Footer on phones: centred (brand, columns, social row, legal line).
- Page bodies: short items (cards, steps, team cards, contact options,
  service summaries) centre. Long reading text stays left-aligned for
  readability: FAQ answers, the privacy notice, form fields and labels, the
  dashboards' figure notes, any paragraph longer than ~3 lines.

## C. Smaller gap under the navbar

The first section of every inner page (/services, /dashboards, /process,
/security, /team, /faq, /contact, /privacy, service pages) starts close to
the header: top padding about `clamp(1.5rem, 1rem + 2vw, 3rem)` instead of
the full `--section-y`. Section-to-section rhythm elsewhere is unchanged.

## D. The owner's icons

The owner supplied six 3D icons; their backgrounds are removed (cut out by
the orchestrator, 384×384 RGBA PNG, in `src/assets/icons/`):

| file | use |
|---|---|
| `dashboards.png` (glass tile with bars and arrow) | dashboards — services row, the dashboards section, /services |
| `automation.png` (gear; replaced the cycle icon on the owner's request, §L) | reporting automation |
| `agent.png` (robot) | AI agents |
| `security.png` (shield with lock and tick) | security |
| `process.png` (notepad) | process |

The same thing gets the same icon everywhere it has one. They replace the
Fluent Emoji icons entirely; delete `src/assets/fluent-3d/` and the Fluent
credit (and its THIRD_PARTY entry). The team keeps its avatars. Icons are
decorative (`alt=""`), served by next/image, with a soft brand glow
(`drop-shadow`) that suits each theme, and no layout shift.

## E. Buttons: liquid-metal glass, like the hand

The primary button ("Start a conversation" in the header, hero, contact
form submit, mobile menu) becomes a **liquid-metal glass** pill that shines
like the hero's hand:

- A 1.5–2px **liquid-metal rim**: a chrome conic gradient in the brand's
  metal colours (white, ice, sky, royal, deep navy — the `--metal-*`
  tokens) that slowly flows around the pill (≈8–10 s a turn), animated with
  a compositor-only transform (rotate a pseudo-element; no per-frame
  repaint), static when motion is reduced or paused.
- A deep royal glass body (the current CSS glass tiers) so the white label
  keeps ≥ 4.5:1 everywhere, with a top specular highlight and an occasional
  soft sheen that sweeps across (compositor transform, motion-gated).
- Smaller label: about 0.875rem (14px), semibold, a touch of tracking;
  height ~44px (default) / ~40px (compact) so it sits comfortably in the
  header.
- Hover: the rim brightens; press scales 0.97 (motion allowed only). Focus
  ring unchanged. Forced colours: system button colours, no metal.
- Light and dark themes both tuned. The liquid-glass-react refraction tier
  may stay as it is (it already sleeps by default).

## F. Type: Poppins + Lato

The owner's sample (images/15.png) is **Poppins** (headings, geometric,
single-storey a) over **Lato** (body). Adopt them, self-hosted through
`next/font/google` (CSP keeps `font-src 'self'`):

- `--font-display` = Poppins, weights 500/600/700. Headings 600 with gentle
  tracking (about -0.02em; no more -0.04em), the brand wordmark 700, UI
  labels (nav, buttons, tile titles) 500/600.
- `--font-sans` = Lato 400/700 for body text. Lato has no 500/600: anything
  set `font-medium`/`font-semibold` in Lato must be checked (use 400/700, or
  move UI labels to the display face).
- Geist Mono stays for eyebrows and figures.
- Poppins is wider than Outfit: re-check every headline size (hero, page
  titles, h2) at 320–1920px; nothing may overflow or wrap badly in EN or SW.
- The words that write themselves (hero, footer) trace real outlines:
  regenerate `glyphs.ts`, `glyphs-upper.ts` and the advance metrics from
  `assets/fonts/Poppins-SemiBold.ttf` (OFL; licence in
  `assets/fonts/OFL-Poppins.txt`) with `scripts/make-glyphs.mjs`, and make
  the hero headline weight match those outlines (600).
- Posters and the OG image keep their Outfit TTFs (they are already
  published).

## G. The closing band is removed

The closing section on every page ("Which report takes your team
longest?" / "Start a conversation" / "Prefer WhatsApp? …") is removed
everywhere; the header's button, the mobile action rail and the floating
WhatsApp button carry the call to action. Nothing else may depend on it
(check the action rail, check-claims, anchors).

## H. The home page's dashboards section: a live, shining screen

Replace the home dashboards teaser with a **device showcase** in the spirit
of github.com's product shots:

- A large rounded "screen" (laptop/monitor-like frame: thick rounded bezel
  with a fine light rim) with a **shining glow** rising behind its top edge
  — a brand royal→sky (a hint of violet allowed) radial light with a few
  tiny stars/dots — on the page background. Works in both themes (light
  theme: a light screen and a softer glow; dark: a dark screen and a strong
  glow).
- Inside, a dashboard DataHub could have built (sample data, clearly
  stamped "Sample data" / "Data ya mfano"):
  - **Left ¾ — analytics:** a row of **4 KPI boxes** (label, big number,
    small delta), then a **bar chart**, a **line graph** and a **donut**.
  - **Right ¼ — a live feed:** a column of numbers/entries (e.g. amounts,
    branch names, times) that **scroll upward by themselves**, endlessly.
  - It feels live: KPI numbers tick now and then, bars and the line ease to
    new values, the donut's arcs shift, a "Live" dot pulses. The numbers
    need not mean much; they must look plausible (TZS, %, counts) and
    attractive.
- Motion is compositor-friendly (transforms/opacity; SVG updates at a low
  rate, ≤ 1 per second), and stops when off screen, in a hidden tab, with
  reduced motion (one still, complete frame), or on Save-Data/low-end
  devices. Server HTML renders a complete still dashboard (no layout shift,
  no empty boxes before JS).
- Accessible: the screen is one figure with a short accessible name
  ("Sample dashboard, live demo"); the moving parts are `aria-hidden`, so
  screen readers do not hear the ticking; a pause control is not needed if
  motion follows the site's motion setting.
- Phones: the frame scales; KPIs 2×2, then the line graph and donut; the
  feed becomes a short strip (or is hidden). Tablets and up: the ¾ / ¼
  split.
- Keep the section header (centred) and the "Explore the sample dashboards
  →" link to /dashboards. The dashboards 3D icon may crown the header.
- Bilingual labels (EN / SW).

## Checks before it ships

`npm run build`, `node scripts/check-claims.mjs` (updated if a claim
changed), every inline script nonced, no console errors, both themes, EN and
SW, 320 / 390 / 768 / 1024 / 1440 / 1920px, reduced motion, keyboard focus
visible, text contrast ≥ 4.5:1 (large ≥ 3:1).

---

# Iteration 5b — same day, after seeing localhost:3200

> Perfect, now I see no reason for having a Dashboard tab (remove it
> completely), then use that [gear icon] in automation instead, then to
> reduce the length of the footer, we can delete that part [the bottom row:
> "© 2026 DataHub · Dashboards on this site use sample data." and "Follow
> us" with the four icons], then the icons we put them at the contact
> section there, remove "Dar es Salaam, Tanzania" there and put the social
> icons, this will make our footer somehow short (best) … then the top
> navbar (I have seen they have no glass (you can make them be like that so
> when active they become cyan like (the colour we're using, but in glass
> like the Start a conversation are)))

## I. The Dashboards page is gone

"Tab" is the owner's word for a navigation item. The live showcase on the
home page (§H) replaces the sample-dashboards page:

- Remove "Dashboards" from the header nav, the phone menu, the footer, the
  sitemap, and every internal link to `/dashboards` (hero secondary link,
  service pages, the showcase's own link). Where a link still makes sense,
  point it at the home page's showcase (`/#dashboards`, `/sw#dashboards`)
  or the dashboards **service** page (`/services/dashboards`) — the service
  page stays.
- Delete the page (`src/app/[lang]/dashboards`) and the code only it used
  (the four sample views, the dash kit, its strings), unless something that
  stays still uses a part (check service pages and the home showcase).
- `/dashboards` and `/sw/dashboards` permanently redirect (308) to the home
  page's showcase (`/#dashboards`, `/sw#dashboards`), keeping `?ref=`/UTM
  query strings, so links already shared don't 404. The home page's
  showcase section has `id="dashboards"`; `LegacyHash` must not forward
  `#dashboards` anywhere.
- The menu's and pages' chapter numbers (eyebrows "02 — …", the phone
  menu's 01–08) are renumbered so they run without a gap, EN and SW.
- check-claims, the 404 handling, JSON-LD/metadata and anything listing
  pages are updated.

## J. A shorter footer

- Delete the footer's bottom row: the copyright/sample-data line, "Follow
  us" with its icons, and "Back to top". (Keep a quiet "© 2026 DataHub"
  inside the brand column only where it adds no height.)
- In the footer's **Contact** column, replace "Dar es Salaam, Tanzania"
  with the four social icons (Instagram, Facebook, TikTok, LinkedIn, real
  colours, same links/env vars as today, ≥ 44px touch targets on phones).
  The address stays on the contact page and in the structured data.
- No stray marks under the footer links (the owner saw a small tick under
  the e-mail address: a left-over thread underline).
- Phones: the footer stays centred (§B).

## K. Glass navigation

- Header nav items are glass, like the Start-a-conversation button: at rest
  plain text; on hover a faint clear-glass pill appears; the **current
  page** sits in a **cyan (brand sky) liquid-glass pill** — tinted sky
  glass, top sheen, light rim (a subtle version of the button's metal rim is
  welcome) — with a dark navy label in both themes (≥ 4.5:1).
- The language switch's current language and the theme toggle use the same
  glass language (current = small cyan glass pill; toggle = clear glass
  circle on hover), so the whole bar is consistent.
- Compositor-friendly; no underlines; `aria-current` kept; focus ring
  visible; reduced transparency → opaque sky; forced colours → system
  colours.
- The phone menu keeps its structure (owner's earlier decision).

## L. Automation icon

`src/assets/icons/automation.png` is now the owner's gear (17.webp,
checkerboard removed). Same file name, so the map in `home-art.ts` stands.
