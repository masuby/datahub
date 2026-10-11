# Iteration 2 — pages, a living hero, light dashboards, fewer words

Owner's brief (Daniel, 10 Oct 2026), in his words where it matters:

- "The single page website is becoming too long, make other tab navigate to
  their pages."
- "Reduce the amount of texts (many words become confusing)."
- "In 'From data to decisions', make decisions change to Insights then to
  Automations, then to Analytics … like writing themselves, in a beautiful
  magical way."
- "The Dashboard part … is not picking up the white mode."
- "Remove 'DataHub · Data consultancy · Dar es Salaam' — it makes our work
  look AI-generated."
- "In the hero make the Hand and the D … be live, like waving to people, and
  along the D some beautiful light flowing there."
- "Add some background features like I used to have" (the old site had a
  dot-matrix grid with soft glows) "or something else that makes it a
  universal-level website."

Everything in docs/design/spec.md still holds unless this file changes it:
the no-box law (hairlines only — no rectangle closed on four sides, no card
shadows, no blurred or rounded containers), the light-blue/blue palette, both
themes, English at the root and Kiswahili under /sw, the strict nonce CSP (no
un-nonced inline script, no third-party origin), motion that respects
prefers-reduced-motion and the site's own pause control, and the lead
pipeline (POST /api/contact payload, honeypot, ?ref= attribution via
RefKeeper, /api/poster URLs).

---

## A. Pages and navigation

Each navigation item becomes its own page, in both languages:

| Route (en / sw)             | Content                                                   |
|-----------------------------|-----------------------------------------------------------|
| `/` · `/sw`                 | Short home (below)                                        |
| `/services` · `/sw/services`| The three services (existing Services section) + the hours estimator |
| `/dashboards` · `/sw/dashboards` | The sample dashboards showcase                       |
| `/process` · `/sw/process`  | How we work                                               |
| `/security` · `/sw/security`| Security + the "proof on this page" colophon              |
| `/team` · `/sw/team`        | The team                                                  |
| `/faq` · `/sw/faq`          | FAQ (the FAQPage JSON-LD moves here from the home page)   |
| `/contact` · `/sw/contact`  | Contact form and details                                  |

Existing `/services/[slug]` and `/privacy` stay.

Every page: Header, `<main id="main">`, Footer, ActionRail, like the existing
pages; `export const dynamic = "force-dynamic"` (the per-request nonce);
metadata with the shared `shareCard()` from src/lib/seo.ts, canonical, and
hreflang alternates (en-TZ, sw-TZ, x-default). Exactly one `<h1>` per page —
the page's main section heading is the h1 (SectionHeader gains a heading-level
option). Section headers on standalone pages show their eyebrow number (the
site's chapter numbers stay as they are) but no "/ 08" total.

**Home** (short — about three screens on a phone):

1. Hero (section B).
2. What we do: the three services, one short line each, each linking to its
   service page; "All services →" to /services.
3. A dashboard teaser: the View 1 KPI strip and the revenue chart, with
   "Explore the sample dashboards →" to /dashboards. It carries one credit
   line (the figure's, not the plate's second one). On phones (below 640px)
   it is the revenue chart and its credit line only: the KPI strip, the
   figure summary, "View as table", the stamp line and the footnote stay on
   /dashboards, so the home stays about three screens long. The section's
   notice, the entity line and the stamp inside the chart still mark it as
   sample data.
4. Three short reasons in one row (security first → /security, a team in
   Dar es Salaam → /team, a clear process → /process).
5. A closing call to action: one line, "Start a conversation" → /contact,
   and the WhatsApp line.

**Navigation**: the header items, the mobile menu, the footer and the action
rail link to pages. The active page is marked with `aria-current="page"` and
the existing thread underline. Header CTA and action-rail CTA → /contact. Hero
CTAs → /contact and /dashboards (section B owns the hero markup). Service
pages end with a short call-to-action band linking to /contact instead of the
full contact form. The hours estimator's "Add this to my message" stores the
message (sessionStorage) and goes to /contact, where the form picks it up.
The sitemap lists every page in both languages with alternates;
scripts/check-claims.mjs checks every new page.

## B. The hero

- **Remove** the eyebrow line ("DataHub · Data consultancy · Dar es Salaam").
- **Headline**: "From data to" on the first line; the second line is one word
  that writes itself, then moves on: decisions → insights → automations →
  analytics → (again). Kiswahili: "Kutoka data hadi" + maamuzi → maarifa →
  otomatiki → uchambuzi.
  - *The writing*: letter by letter, left to right, each letter's outline is
    drawn as a glowing sky-blue line led by a small bright "pen" light; the
    accent gradient (royal → sky) then floods each letter behind the pen; the
    word holds with a slow sheen; then it lifts away as fine sparks (right to
    left) and the next word writes. About 4–5 s per word.
  - The server HTML shows the first word as normal text (first paint, LCP,
    no JavaScript). The accessible name of the h1 is constant: "From data to
    decisions, insights, automations and analytics" (sr-only), the animated
    word is aria-hidden.
  - Reduced motion or the motion pause: the current word stays, written.
    Stops when the hero is off screen or the tab is hidden.
  - No layout shift: the word line reserves the width of the longest word in
    that language and never wraps.
- **The mark is alive**:
  - The hand waves — a friendly wave about the wrist (±12°, two or three
    swings in ~1.6 s, then rest ~4 s), after the existing entrance.
  - Light flows along the D — a soft comet (white core, sky glow, short
    tail) travelling the D's spine from terminal to terminal, continuously
    (~3 s a pass, brief rest), with a faint breathing glow on the D.
  - Same motion rules as above.
- **Background**, both themes: bring back the dot-matrix field of the old
  site in the new palette — a fine dot grid, faded toward the edges and kept
  quiet behind the text, a few dots twinkling, and small points of light
  travelling along the silk filaments into the hand (data flowing into the
  mark). A soft royal/sky glow behind the mark. Desktop draws the moving
  light inside the existing silk canvas loop; phones get the static field
  and silk, as today. Light theme: dots navy at low alpha, glows lighter.

## C. Dashboards follow the theme

The dashboards section and the service pages' sample bands were forced dark.
They follow the visitor's theme now: light in light mode, dark in dark mode —
every chart colour, label, marker, stamp, crosshair, map dot, table and
read-mode note from theme tokens, at WCAG AA contrast in both themes.

## D. Fewer words (after A–C)

Cut the words on every page by roughly half, in both languages, without
losing a fact: headlines up to ~8 words, leads one sentence (~20 words),
body paragraphs at most two sentences, FAQ answers at most two sentences, no
claim repeated across sections. Every statement the site makes about itself
(the security colophon, the privacy notice) stays true to the code. Team
titles exactly as given. Kiswahili is rewritten to match, keeping the
reviewed terminology.
