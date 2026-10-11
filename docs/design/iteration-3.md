# Iteration 3 — footer, social, WhatsApp, multi-choice, a new home rhythm

Owner's feedback on the preview (Daniel, 11 Oct 2026), in his words where it
matters:

- "The footer white mode is not working, also remove those preferences there."
- "Add my floating WhatsApp icon."
- "Add 4 social media icons at the bottom and at the top (find their real
  coloured icons): Instagram, Facebook, TikTok, LinkedIn. Just put them now,
  I will give you links later."
- "In interests someone can choose many options, not limited to one."
- The footer's big "From Data to Decisions": "make that part dynamic, add
  dots in the background, make the word change as well, but there put a pen
  icon writing itself (Decisions, Insights, Automations, Analytics), our
  waving hand as well."
- "The hero part is so fantastic for sure. But the following part needs a
  different style — you can even remove line separators that stay
  horizontal. You can download real avatar-like icons from the internet and
  put them there, where you separate them vertically (or whatever suits)."

Everything in spec.md, iteration-2.md still holds unless changed here (both
themes, English root + Kiswahili /sw, strict nonce CSP, motion rules incl.
the pause control, lead pipeline). Where this brief relaxes the no-box law it
says so explicitly.

## A. Footer, social icons, floating WhatsApp

- **The footer follows the theme** (light in light mode), like the dashboards
  now do. No forced-dark band.
- **Remove the Preferences row** (language, theme, motion). Language and
  theme stay in the header. Because the footer now moves, it gets its own
  small pause control (the shared motion store), as the hero has.
- **The living wordmark**: "From Data to" + one word that writes itself —
  Decisions → Insights → Automations → Analytics (sw: Maamuzi → Maarifa →
  Otomatiki → Uchambuzi), Title Case as the brand board sets the slogan —
  using the hero's writer engine (real Outfit outlines; add capitals to the
  generated glyphs), **with a visible pen nib icon** that rides the writing
  edge (the hero keeps its point of light). A dot-matrix field behind it, and
  the mark with its waving hand beside it. Runs only while in view, under the
  same device tiers, kill switch, reduced-motion and pause rules as the hero.
- **Social icons** — Instagram, Facebook, TikTok, LinkedIn — in their real
  brand colours (Instagram gradient, Facebook blue, TikTok's black/white mark
  with its cyan and red edges, LinkedIn blue), legible in both themes, in the
  header (top) and the footer (bottom), and in the mobile menu. Glyphs from
  Simple Icons (CC0), embedded as path data. Links come later: keep them in
  one config (src/lib/social.ts, overridable by NEXT_PUBLIC_SOCIAL_* env
  vars); while a link is missing the icon is shown but not a link.
- **Floating WhatsApp button**, on every page: the official WhatsApp green
  (#25D366) circle with the white glyph, "Chat with us" / "Ongea nasi" beside
  it on wide screens, bottom-right, above everything, opening the page's
  language-aware WhatsApp link; on phones it must not cover the mobile action
  rail (merge with it or sit above it). The logos are brand marks, so the
  no-box law does not apply to them.

## B. "Interested in" — any number of choices

Checkboxes instead of radio buttons; the visitor may tick several. The POST
payload keeps the `service` key: its value becomes a comma-separated list of
the allowed values (a single value stays valid, so nothing breaks), validated
server-side, stored as is, and shown as a readable list in the notification
email.

## C. A different rhythm after the hero

The sections after the hero on the home page — "What we do", the dashboard
teaser frame and the three reasons — get a new style: no horizontal row
rules. The three services sit side by side, separated by vertical hairlines,
each with a large, real 3D icon (Microsoft Fluent Emoji 3D, MIT licence —
e.g. bar chart, gear, robot), a title, one line and an arrow; gentle depth on
hover. The reasons row follows the same pattern (e.g. a clipboard or notepad
for the process, a shield for security) — and for "a team in Dar es Salaam"
the three real team portraits as overlapping avatars. Phones stack them with
space, not rules. Downloaded images are re-encoded (metadata stripped), kept
in src/assets/ and served through next/image (AVIF/WebP, first-party).
