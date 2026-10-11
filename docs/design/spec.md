# DataHub website rebuild: implementation spec

Status: final design call. Build from this file and `copy.en.md` (same folder). Where this spec and a proposal disagree, this spec wins. Where this spec is silent, choose the option that is lighter, quieter and has fewer boxes.

Later briefs in this folder (`iteration-2.md` to `iteration-5.md`) override this spec where they disagree (the newest wins). Iteration 5 in particular removed the `/dashboards` page (it redirects to the home page's live sample dashboard, §H/§I), the closing call-to-action band (§G) and every short decorative thread and hover underline (§A), centred the section headers (§B), and moved the type to Poppins over Lato (§F).

Repository: `C:\Users\Daniel\Desktop\code\Masubi\Desktop\My_project\Datahub` (Next 16.2.9, React 19.2, Tailwind v4). Read `node_modules/next/dist/docs/` before writing routing, metadata, font or image code (AGENTS.md). The brief's non-negotiables (lead pipeline, poster API, nonce CSP, SEO URLs, honesty, no live badges or tickers, mid-range Android performance, WCAG AA) apply to every line below.

---

## 0. Direction and grafts

**Chosen direction: Silk, built on Signal's engineering, with Editorial's "data resolves into rules" story.**

The aggregate scores were within one point (Signal 47.5, Silk 46.5, Editorial 46.5), which is a tie on the numbers. The tiebreak is the owner's stated priority, beauty and brand, and only Silk carries the new brand board (luminous deep-blue silk above a calm white field holding the mark). The engineering judge's objections to Silk were all about how it is rendered (always-on WebGL, backdrop blur, pointer listeners on `:root`, contrast over moving light). Those are fixed by changing the rendering, not the look. So the visual language is Silk; the runtime discipline is Signal's; the narrative is Editorial's.

**One sentence the whole site follows:** *data arrives as silk, flows into the open hand of the mark, and leaves as the straight hairlines that structure every page.* The hero draws that sentence. Every rule on the site is one of those straightened threads.

Grafts (each kept inside that one language):

| From | Graft | Where |
|---|---|---|
| Editorial | Filaments straighten as you scroll; the decision filament lands on the hero's bottom rule | Hero (§6.1) |
| Editorial | One deterministic TS function shared by the server SVG and the client Canvas2D. No WebGL | `src/lib/silk.ts` |
| Editorial | Ink band: dashboards sit on a dark surface in both themes | §6.3 |
| Editorial | `Fig. 02.n` numbering and a `Source:` credit line under every chart | Dashboards |
| Editorial | Strike-through that draws across each "Today" item | §6.6 |
| Editorial | D-arc loop as the form's sending state | Contact |
| Editorial | Mobile action rail (WhatsApp + CTA); `/privacy` under the PDPA 2022; `sessionStorage` ref fallback; `:lang(sw)` display scale, `&shy;`, key-parity test | various |
| Signal | Zero-JS server-rendered hero; keyframes defined `from` only; capability gates plus a frame-time kill switch | Hero |
| Signal | Probe dot travels the D arc once while the mark draws (SMIL, triggered from JS) | Hero mark |
| Signal | Read mode ("Explain this view") | Advanced feature A |
| Signal | TZS output and visible formula on the estimator; SAMPLE stamp and footnote drawn inside each chart SVG; dot-matrix map with no border lines; officer codes; Swahili month and money helpers; `src/lib/csp.ts` as single source; forced-colors and print styles; relabel `custom-software` instead of changing zod; H1 second line states what DataHub does | various |
| Silk | Fill-in-the-sentence estimator format | Advanced feature B |
| Silk | Thread accent (2px royal→sky), at most one "you are here" thread per section | Rules |
| Silk | Team line-up on a shared floor rule with hover spotlight (no overlap, equal sizes) | §6.7 |
| Silk | Pause-motion control (WCAG 2.2.2); text-safe zone with a numerically verified alpha cap; "Your data stays yours"; "What changed this week" panel; Swahili finance terms | various |

**Cut from all three:** WebGL, backdrop blur, text gradients, pointer-lit rules on `:root`, HUD ornament (crop marks, coordinates, registration crosshairs, `FIG. 00`, `S-01`/`T-01`/`V-01` codes), the header section readout, the contour field, the giant watermark numerals, the visible page graticule, overlapping portraits, any custom listbox, the drill-down cross-filter (too much client code; Read mode replaces it as the "advanced" dashboard feature).

---

## 1. Design tokens

### 1.1 Brand blues: who does what

| Blue | Light theme | Dark theme / ink surfaces | Never |
|---|---|---|---|
| Navy `#022970` | Mark hand, chart series 2, button hover fill, silk shadow folds | Radial wash fills only (hero, ink band) | Text or lines on dark (1.46:1) |
| Royal `#036BFB` | Primary button fill, mark D, accent rules and threads, display-size accent word, chart series 1 | Primary button fill, mark D | Small text on light at the raw value (4.42:1): use `--accent #0257D6` |
| Sky `#68D4FB` | Fills, glow and silk highlights only | Links, focus, accent word, chart series 1, silk light | Text on light (1.60:1) |

### 1.2 `src/app/globals.css` (replace the whole file's token layer)

```css
@import "tailwindcss";

/* Dark utilities are allowed only for rare one-offs; everything themes through tokens. */
@custom-variant dark (&:where(.dark, .dark *));

@property --sweep { syntax: "<angle>"; inherits: false; initial-value: 360deg; }

:root {
  color-scheme: light;

  /* Brand constants (never re-defined per theme) */
  --navy: #022970;
  --royal: #036BFB;
  --sky: #68D4FB;

  /* Surfaces */
  --bg: #F6F9FE;          /* porcelain page */
  --bg-elev: #FFFFFF;     /* header when scrolled, mobile menu sheet, native popups. Never cards. */
  --bg-sunk: #EAF1FC;     /* selected table row, active read-mode note, input autofill */
  --bg-ink: #040C21;      /* only consumed by .surface-ink */
  --header-bg: var(--bg); /* opaque since iteration 5: headlines and icons showed through 94% */

  /* Text */
  --fg: #061433;
  --fg-muted: #3B4B6B;
  --fg-subtle: #55668A;

  /* Lines */
  --rule: #D9E2F1;        /* R1 hairline: decorative, never the only cue */
  --rule-strong: #B7C6DF; /* R2 section rule, floor rule, column dividers in lists */
  --rule-input: #7486A8;  /* R3 form underline, slider track, radio ring: >= 3:1 */
  --thread: linear-gradient(90deg, var(--royal), var(--sky));

  /* Accent and action */
  --accent: #0257D6;          /* links and small accent text */
  --accent-display: #036BFB;  /* accent text >= 24px (or >= 19px at 700), accent rules */
  --action: #036BFB;
  --action-hover: #022970;
  --on-action: #FFFFFF;
  --on-action-hover: #FFFFFF;
  --focus: #036BFB;

  /* Status (always paired with a glyph and a word) */
  --error: #B42335;
  --warn: #9A5700;
  --ok: #0257D6;

  /* Charts */
  --s1: #036BFB;
  --s2: #022970;
  --s3: #0B7FBF;
  --s-ref: #55668A;                   /* target / reference line, dashed 4 4 */
  --s-fill: rgb(3 107 251 / 0.14);    /* area under series 1 */
  --s-hatch: rgb(180 35 53 / 0.18);   /* breach zone hatch */
  --ramp-1: #5B8FE0; --ramp-2: #2F74E6; --ramp-3: #036BFB; --ramp-4: #0A4DB8; --ramp-5: #022970;

  /* Brand lockup */
  --mark-d: #036BFB;
  --mark-hand: #022970;
  --wordmark-data: #036BFB;
  --wordmark-hub: #1FA2E0;  /* deeper sky for light backgrounds; logotype, WCAG-exempt. Owner to confirm. */

  /* Silk field (consumed by src/lib/silk.ts renderers) */
  --silk-wash: #CFE0FB;
  --silk-a: #022970;          /* filament colour at u = 0 */
  --silk-b: #036BFB;          /* filament colour at u = 1 */
  --silk-hi: #036BFB;         /* sheen highlight colour */
  --silk-decision: #036BFB;   /* the decision filament */
  --silk-max-alpha: 0.32;
  --silk-blend: source-over;
  --silk-safe-alpha: 0.2;     /* mask alpha inside the hero text zone (see §6.1) */

  --selection: rgb(3 107 251 / 0.18);

  /* Motion */
  --ease-silk: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-thread: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --dur-micro: 160ms;
  --dur-ui: 280ms;
  --dur-reveal: 700ms;
  --dur-draw: 900ms;
  --dur-mark: 1100ms;

  /* Layout */
  --gutter-x: 20px;
  --col-gap: 16px;
  --section-y: clamp(4.5rem, 2.6rem + 8vw, 9rem);
  --header-h: 56px;
}
@media (min-width: 640px)  { :root { --gutter-x: 32px; --col-gap: 24px; } }
@media (min-width: 1024px) { :root { --gutter-x: 48px; --header-h: 64px; } }

/* Dark theme, and the ink surface (dark tokens in either theme). */
.dark,
.surface-ink {
  color-scheme: dark;
  --bg: #030A1C;
  --bg-elev: #071430;
  --bg-sunk: #0B1D42;
  --bg-ink: #040C21;
  --header-bg: var(--bg-elev);

  --fg: #EAF1FF;
  --fg-muted: #A7B6D3;
  --fg-subtle: #8292B4;

  --rule: #14254A;
  --rule-strong: #23396A;
  --rule-input: #5B6E96;

  --accent: #68D4FB;
  --accent-display: #68D4FB;
  --action: #036BFB;
  --action-hover: #68D4FB;
  --on-action: #FFFFFF;
  --on-action-hover: #030A1C;
  --focus: #68D4FB;

  --error: #FF8B8B;
  --warn: #FFC266;
  --ok: #68D4FB;

  --s1: #68D4FB;
  --s2: #3D8BFF;
  --s3: #B8C7E6;
  --s-ref: #8292B4;
  --s-fill: rgb(104 212 251 / 0.16);
  --s-hatch: rgb(255 139 139 / 0.16);
  --ramp-1: #2E6FD8; --ramp-2: #3D8BFF; --ramp-3: #4FB4F8; --ramp-4: #8FDDFC; --ramp-5: #D5F3FF;

  --mark-d: #036BFB;
  --mark-hand: #EAF1FF;
  --wordmark-data: #036BFB;
  --wordmark-hub: #68D4FB;

  --silk-wash: #022970;
  --silk-a: #022970;
  --silk-b: #036BFB;
  --silk-hi: #68D4FB;
  --silk-decision: #68D4FB;
  --silk-max-alpha: 0.55;
  --silk-blend: lighter;

  --selection: rgb(104 212 251 / 0.30);
}

/* No-JS fallback only: ThemeScript always sets .light or .dark when JS runs.
   Keep these values IDENTICAL to the .dark block (a unit test diffs them). */
@media (prefers-color-scheme: dark) {
  :root:not(.light):not(.dark) { /* paste the .dark declarations verbatim */ }
}

.surface-ink {
  background:
    radial-gradient(60% 80% at 78% 40%, rgb(2 41 112 / 0.55), transparent 70%),
    var(--bg-ink);
  color: var(--fg);
}

html { background: var(--bg); color: var(--fg); scroll-padding-top: calc(var(--header-h) + 16px); scroll-padding-bottom: 88px; }
body { background: var(--bg); color: var(--fg); font-family: var(--font-sans), system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
::selection { background: var(--selection); color: var(--fg); }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; border-radius: 2px; }
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }

@theme inline {
  --color-bg: var(--bg);
  --color-elev: var(--bg-elev);
  --color-sunk: var(--bg-sunk);
  --color-fg: var(--fg);
  --color-muted: var(--fg-muted);
  --color-subtle: var(--fg-subtle);
  --color-rule: var(--rule);
  --color-rule-strong: var(--rule-strong);
  --color-rule-input: var(--rule-input);
  --color-accent: var(--accent);
  --color-accent-display: var(--accent-display);
  --color-action: var(--action);
  --color-action-hover: var(--action-hover);
  --color-on-action: var(--on-action);
  --color-on-action-hover: var(--on-action-hover);
  --color-focus: var(--focus);
  --color-error: var(--error);
  --color-warn: var(--warn);
  --color-ok: var(--ok);
  --color-navy: var(--navy);
  --color-royal: var(--royal);
  --color-sky: var(--sky);
  --color-s1: var(--s1);
  --color-s2: var(--s2);
  --color-s3: var(--s3);
  --color-s-ref: var(--s-ref);

  --font-display: var(--font-outfit);
  --font-sans: var(--font-manrope);
  --font-mono: var(--font-geist-mono);

  --ease-silk: var(--ease-silk);
  --ease-thread: var(--ease-thread);
}
```

Theme mechanism (one, consistently): the existing `src/components/system/ThemeScript.tsx` (nonce-carrying inline script, `localStorage["theme"]`). Change one thing: it must set **both** classes so the no-JS media fallback never fights an explicit choice: `r.classList.toggle("dark", d); r.classList.toggle("light", !d);`. Add `suppressHydrationWarning` to `<html>`. No cookies anywhere on the site (see §11 "no cookies" claim).

### 1.3 Contrast verification

Computed by `scratchpad/design/contrast.mjs` (WCAG 2.x relative luminance). 0 failures. Body text needs 4.5:1, large text and UI 3:1. Rows marked DECOR are hairlines that never carry meaning alone. The "hero-safe-worst" rows are the darkest/lightest background text can meet in the hero text zone given the alpha caps in §6.1 (dark: navy wash 30% + sky filaments 22%; light: wash 40% + royal filaments 12%). If any token changes, rerun the script and paste the new table here.

| Theme | Pair | FG | BG | Ratio | Min | Result | Use |
|---|---|---|---|---|---|---|---|
| light | fg on bg | `#061433` | `#F6F9FE` | 17.22 | 4.5 | PASS | body text |
| light | fg-muted on bg | `#3B4B6B` | `#F6F9FE` | 8.28 | 4.5 | PASS | secondary text |
| light | fg-subtle on bg | `#55668A` | `#F6F9FE` | 5.45 | 4.5 | PASS | captions, mono labels, axes |
| light | accent on bg | `#0257D6` | `#F6F9FE` | 5.96 | 4.5 | PASS | links, small accent text |
| light | error on bg | `#B42335` | `#F6F9FE` | 6.16 | 4.5 | PASS | error text |
| light | warn on bg | `#9A5700` | `#F6F9FE` | 5.32 | 4.5 | PASS | watch text in charts |
| light | fg on bg-elev | `#061433` | `#FFFFFF` | 18.17 | 4.5 | PASS | body text |
| light | fg-muted on bg-elev | `#3B4B6B` | `#FFFFFF` | 8.73 | 4.5 | PASS | secondary text |
| light | fg-subtle on bg-elev | `#55668A` | `#FFFFFF` | 5.75 | 4.5 | PASS | captions, mono labels, axes |
| light | accent on bg-elev | `#0257D6` | `#FFFFFF` | 6.29 | 4.5 | PASS | links, small accent text |
| light | error on bg-elev | `#B42335` | `#FFFFFF` | 6.50 | 4.5 | PASS | error text |
| light | warn on bg-elev | `#9A5700` | `#FFFFFF` | 5.62 | 4.5 | PASS | watch text in charts |
| light | fg on bg-sunk | `#061433` | `#EAF1FC` | 16.00 | 4.5 | PASS | body text |
| light | fg-muted on bg-sunk | `#3B4B6B` | `#EAF1FC` | 7.69 | 4.5 | PASS | secondary text |
| light | fg-subtle on bg-sunk | `#55668A` | `#EAF1FC` | 5.06 | 4.5 | PASS | captions, mono labels, axes |
| light | accent on bg-sunk | `#0257D6` | `#EAF1FC` | 5.54 | 4.5 | PASS | links, small accent text |
| light | error on bg-sunk | `#B42335` | `#EAF1FC` | 5.72 | 4.5 | PASS | error text |
| light | warn on bg-sunk | `#9A5700` | `#EAF1FC` | 4.95 | 4.5 | PASS | watch text in charts |
| light | accent-display on bg | `#036BFB` | `#F6F9FE` | 4.42 | 3 | PASS | large text (>=24px, or >=19px bold), accent rules |
| light | rule-input on bg | `#7486A8` | `#F6F9FE` | 3.48 | 3 | PASS | input underline, slider track (UI) |
| light | rule-input on bg-elev | `#7486A8` | `#FFFFFF` | 3.67 | 3 | PASS | input underline on elev (UI) |
| light | focus on bg | `#036BFB` | `#F6F9FE` | 4.42 | 3 | PASS | focus outline (UI) |
| light | focus on bg-elev | `#036BFB` | `#FFFFFF` | 4.67 | 3 | PASS | focus outline on elev (UI) |
| light | s1 on bg | `#036BFB` | `#F6F9FE` | 4.42 | 3 | PASS | chart mark (graphic) |
| light | s2 on bg | `#022970` | `#F6F9FE` | 12.81 | 3 | PASS | chart mark (graphic) |
| light | s3 on bg | `#0B7FBF` | `#F6F9FE` | 4.14 | 3 | PASS | chart mark (graphic) |
| light | s-ref on bg | `#55668A` | `#F6F9FE` | 5.45 | 3 | PASS | chart mark (graphic) |
| light | ramp1 on bg | `#5B8FE0` | `#F6F9FE` | 3.09 | 3 | PASS | chart mark (graphic) |
| light | ramp2 on bg | `#2F74E6` | `#F6F9FE` | 4.18 | 3 | PASS | chart mark (graphic) |
| light | ramp3 on bg | `#036BFB` | `#F6F9FE` | 4.42 | 3 | PASS | chart mark (graphic) |
| light | ramp4 on bg | `#0A4DB8` | `#F6F9FE` | 7.19 | 3 | PASS | chart mark (graphic) |
| light | ramp5 on bg | `#022970` | `#F6F9FE` | 12.81 | 3 | PASS | chart mark (graphic) |
| light | s1 on bg-elev | `#036BFB` | `#FFFFFF` | 4.67 | 3 | PASS | chart mark on elev |
| light | s2 on bg-elev | `#022970` | `#FFFFFF` | 13.52 | 3 | PASS | chart mark on elev |
| light | s3 on bg-elev | `#0B7FBF` | `#FFFFFF` | 4.37 | 3 | PASS | chart mark on elev |
| light | ramp1 on bg-elev | `#5B8FE0` | `#FFFFFF` | 3.26 | 3 | PASS | chart mark on elev |
| light | ramp5 on bg-elev | `#022970` | `#FFFFFF` | 13.52 | 3 | PASS | chart mark on elev |
| light | on-action on action | `#FFFFFF` | `#036BFB` | 4.67 | 4.5 | PASS | primary button label |
| light | on-action-hover on action-hover | `#FFFFFF` | `#022970` | 13.52 | 4.5 | PASS | primary button hover label |
| light | action on bg | `#036BFB` | `#F6F9FE` | 4.42 | 3 | PASS | button shape vs page (UI) |
| dark+ink | fg on bg | `#EAF1FF` | `#030A1C` | 17.41 | 4.5 | PASS | body text |
| dark+ink | fg-muted on bg | `#A7B6D3` | `#030A1C` | 9.66 | 4.5 | PASS | secondary text |
| dark+ink | fg-subtle on bg | `#8292B4` | `#030A1C` | 6.32 | 4.5 | PASS | captions, mono labels, axes |
| dark+ink | accent on bg | `#68D4FB` | `#030A1C` | 11.65 | 4.5 | PASS | links, small accent text |
| dark+ink | error on bg | `#FF8B8B` | `#030A1C` | 8.76 | 4.5 | PASS | error text |
| dark+ink | warn on bg | `#FFC266` | `#030A1C` | 12.37 | 4.5 | PASS | watch text in charts |
| dark+ink | fg on bg-elev | `#EAF1FF` | `#071430` | 16.08 | 4.5 | PASS | body text |
| dark+ink | fg-muted on bg-elev | `#A7B6D3` | `#071430` | 8.92 | 4.5 | PASS | secondary text |
| dark+ink | fg-subtle on bg-elev | `#8292B4` | `#071430` | 5.83 | 4.5 | PASS | captions, mono labels, axes |
| dark+ink | accent on bg-elev | `#68D4FB` | `#071430` | 10.77 | 4.5 | PASS | links, small accent text |
| dark+ink | error on bg-elev | `#FF8B8B` | `#071430` | 8.09 | 4.5 | PASS | error text |
| dark+ink | warn on bg-elev | `#FFC266` | `#071430` | 11.43 | 4.5 | PASS | watch text in charts |
| dark+ink | fg on bg-sunk | `#EAF1FF` | `#0B1D42` | 14.60 | 4.5 | PASS | body text |
| dark+ink | fg-muted on bg-sunk | `#A7B6D3` | `#0B1D42` | 8.10 | 4.5 | PASS | secondary text |
| dark+ink | fg-subtle on bg-sunk | `#8292B4` | `#0B1D42` | 5.30 | 4.5 | PASS | captions, mono labels, axes |
| dark+ink | accent on bg-sunk | `#68D4FB` | `#0B1D42` | 9.77 | 4.5 | PASS | links, small accent text |
| dark+ink | error on bg-sunk | `#FF8B8B` | `#0B1D42` | 7.34 | 4.5 | PASS | error text |
| dark+ink | warn on bg-sunk | `#FFC266` | `#0B1D42` | 10.37 | 4.5 | PASS | watch text in charts |
| dark+ink | fg on bg-ink | `#EAF1FF` | `#040C21` | 17.16 | 4.5 | PASS | body text |
| dark+ink | fg-muted on bg-ink | `#A7B6D3` | `#040C21` | 9.52 | 4.5 | PASS | secondary text |
| dark+ink | fg-subtle on bg-ink | `#8292B4` | `#040C21` | 6.22 | 4.5 | PASS | captions, mono labels, axes |
| dark+ink | accent on bg-ink | `#68D4FB` | `#040C21` | 11.48 | 4.5 | PASS | links, small accent text |
| dark+ink | error on bg-ink | `#FF8B8B` | `#040C21` | 8.63 | 4.5 | PASS | error text |
| dark+ink | warn on bg-ink | `#FFC266` | `#040C21` | 12.19 | 4.5 | PASS | watch text in charts |
| dark+ink | fg on wash-peak | `#EAF1FF` | `#021b4a` | 14.72 | 4.5 | PASS | body text |
| dark+ink | fg-muted on wash-peak | `#A7B6D3` | `#021b4a` | 8.17 | 4.5 | PASS | secondary text |
| dark+ink | fg-subtle on wash-peak | `#8292B4` | `#021b4a` | 5.34 | 4.5 | PASS | captions, mono labels, axes |
| dark+ink | accent on wash-peak | `#68D4FB` | `#021b4a` | 9.85 | 4.5 | PASS | links, small accent text |
| dark+ink | error on wash-peak | `#FF8B8B` | `#021b4a` | 7.41 | 4.5 | PASS | error text |
| dark+ink | warn on wash-peak | `#FFC266` | `#021b4a` | 10.46 | 4.5 | PASS | watch text in charts |
| dark+ink | accent-display on bg | `#68D4FB` | `#030A1C` | 11.65 | 3 | PASS | large text (>=24px, or >=19px bold), accent rules |
| dark+ink | rule-input on bg | `#5B6E96` | `#030A1C` | 3.87 | 3 | PASS | input underline, slider track (UI) |
| dark+ink | rule-input on bg-elev | `#5B6E96` | `#071430` | 3.57 | 3 | PASS | input underline on elev (UI) |
| dark+ink | focus on bg | `#68D4FB` | `#030A1C` | 11.65 | 3 | PASS | focus outline (UI) |
| dark+ink | focus on bg-elev | `#68D4FB` | `#071430` | 10.77 | 3 | PASS | focus outline on elev (UI) |
| dark+ink | s1 on bg | `#68D4FB` | `#030A1C` | 11.65 | 3 | PASS | chart mark (graphic) |
| dark+ink | s2 on bg | `#3D8BFF` | `#030A1C` | 5.95 | 3 | PASS | chart mark (graphic) |
| dark+ink | s3 on bg | `#B8C7E6` | `#030A1C` | 11.61 | 3 | PASS | chart mark (graphic) |
| dark+ink | s-ref on bg | `#8292B4` | `#030A1C` | 6.32 | 3 | PASS | chart mark (graphic) |
| dark+ink | ramp1 on bg | `#2E6FD8` | `#030A1C` | 4.12 | 3 | PASS | chart mark (graphic) |
| dark+ink | ramp2 on bg | `#3D8BFF` | `#030A1C` | 5.95 | 3 | PASS | chart mark (graphic) |
| dark+ink | ramp3 on bg | `#4FB4F8` | `#030A1C` | 8.66 | 3 | PASS | chart mark (graphic) |
| dark+ink | ramp4 on bg | `#8FDDFC` | `#030A1C` | 13.08 | 3 | PASS | chart mark (graphic) |
| dark+ink | ramp5 on bg | `#D5F3FF` | `#030A1C` | 17.00 | 3 | PASS | chart mark (graphic) |
| dark+ink | s1 on bg-elev | `#68D4FB` | `#071430` | 10.77 | 3 | PASS | chart mark on elev |
| dark+ink | s2 on bg-elev | `#3D8BFF` | `#071430` | 5.50 | 3 | PASS | chart mark on elev |
| dark+ink | s3 on bg-elev | `#B8C7E6` | `#071430` | 10.72 | 3 | PASS | chart mark on elev |
| dark+ink | ramp1 on bg-elev | `#2E6FD8` | `#071430` | 3.80 | 3 | PASS | chart mark on elev |
| dark+ink | ramp5 on bg-elev | `#D5F3FF` | `#071430` | 15.71 | 3 | PASS | chart mark on elev |
| dark+ink | on-action on action | `#FFFFFF` | `#036BFB` | 4.67 | 4.5 | PASS | primary button label |
| dark+ink | on-action-hover on action-hover | `#030A1C` | `#68D4FB` | 11.65 | 4.5 | PASS | primary button hover label |
| dark+ink | action on bg | `#036BFB` | `#030A1C` | 4.23 | 3 | PASS | button shape vs page (UI) |
| dark+ink | s1 on bg-ink | `#68D4FB` | `#040C21` | 11.48 | 3 | PASS | chart mark in ink band |
| dark+ink | s2 on bg-ink | `#3D8BFF` | `#040C21` | 5.87 | 3 | PASS | chart mark in ink band |
| dark+ink | s3 on bg-ink | `#B8C7E6` | `#040C21` | 11.44 | 3 | PASS | chart mark in ink band |
| dark+ink | ramp1 on bg-ink | `#2E6FD8` | `#040C21` | 4.06 | 3 | PASS | chart mark in ink band |
| dark+ink | ramp2 on bg-ink | `#3D8BFF` | `#040C21` | 5.87 | 3 | PASS | chart mark in ink band |
| dark+ink | fg on hero-safe-worst | `#EAF1FF` | `#193d61` | 9.85 | 4.5 | PASS | H1 / lead over night silk |
| dark+ink | fg-muted on hero-safe-worst | `#A7B6D3` | `#193d61` | 5.46 | 4.5 | PASS | lead over night silk |
| dark+ink | accent on hero-safe-worst | `#68D4FB` | `#193d61` | 6.59 | 4.5 | PASS | eyebrow / link over night silk |
| dark+ink | accent-display on hero-safe-worst | `#68D4FB` | `#193d61` | 6.59 | 3 | PASS | accent word (display) over night silk |
| light | fg on hero-safe-worst | `#061433` | `#cbdffd` | 13.42 | 4.5 | PASS | H1 / lead over day silk |
| light | fg-muted on hero-safe-worst | `#3B4B6B` | `#cbdffd` | 6.45 | 4.5 | PASS | lead over day silk |
| light | accent on hero-safe-worst | `#0257D6` | `#cbdffd` | 4.65 | 4.5 | PASS | eyebrow / link over day silk |
| light | accent-display on hero-safe-worst | `#036BFB` | `#cbdffd` | 3.45 | 3 | PASS | accent word (display) over day silk |
| dark+ink | fg-subtle on header-94% | `#8292B4` | `#07132f` | 5.88 | 4.5 | PASS | header mono text |
| light | rule on bg | `#D9E2F1` | `#F6F9FE` | 1.24 | n/a | DECOR | hairline; never the only carrier of meaning |
| light | rule-strong on bg | `#B7C6DF` | `#F6F9FE` | 1.64 | n/a | DECOR | hairline; never the only carrier of meaning |
| dark+ink | rule on bg | `#14254A` | `#030A1C` | 1.31 | n/a | DECOR | hairline; never the only carrier of meaning |
| dark+ink | rule-strong on bg | `#23396A` | `#030A1C` | 1.75 | n/a | DECOR | hairline; never the only carrier of meaning |
| light | brand sky on bg (reference) | `#68D4FB` | `#F6F9FE` | 1.60 | n/a | NEVER TEXT | fills / glow only in light |
| light | wordmark-hub on bg (logo) | `#1FA2E0` | `#F6F9FE` | 2.72 | n/a | EXEMPT | logotype (WCAG exempt) |
| dark+ink | brand navy on bg (reference) | `#022970` | `#030A1C` | 1.46 | n/a | NEVER INK | wash fill only in dark |

Derived: WASH_DARK=#021b4a SAFE_DARK=#193d61 SAFE_LIGHT=#cbdffd HEADER94=#07132f
FAILS: 0

---

## 2. Fonts and type scale

### 2.1 Fonts (`src/app/[lang]/layout.tsx`)

All three are present in this Next version's `next/font/google` data (checked in `font-data.json`). Self-hosted, so CSP stays `font-src 'self'`. Latin subset covers Kiswahili.

```ts
import { Outfit, Manrope, Geist_Mono } from "next/font/google";
const outfit  = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });              // variable 100–900, preload
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });            // variable 200–800, preload
const mono    = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false });
```

- **Outfit** (display): closest Google face to the wordmark (heavy geometric, single-storey "a"). Weights used: 300, 500, 600, 700, 800.
- **Manrope** (body/UI): double-storey "a", which keeps a-dense Kiswahili readable at 16px. Weights used: 400, 500, 600.
- **Geist Mono** (labels, data): kept from the current site; not preloaded. Weights used: 400, 500.
- Budget: total woff2 on the home page <= 120 KB. Keep `assets/fonts/` (Geist TTFs) untouched: `/api/poster` reads them from disk.

### 2.2 Type scale (put in `globals.css`, `@layer components`)

Fluid between 360px and 1440px. Use these classes; do not hand-roll sizes.

```css
@layer components {
  .t-display {
    --fs: clamp(2.75rem, 1rem + 7.6vw, 7.5rem);
    font-family: var(--font-display); font-weight: 700;
    font-size: calc(var(--fs) * var(--display-scale, 1));
    line-height: 0.95; letter-spacing: -0.04em; text-wrap: balance;
  }
  .t-sub {          /* second line inside the hero <h1> */
    font-family: var(--font-display); font-weight: 500;
    font-size: clamp(1.25rem, 1.05rem + 0.9vw, 1.875rem);
    line-height: 1.2; letter-spacing: -0.015em; color: var(--fg-muted); text-wrap: balance;
  }
  .t-h1-page {      /* service, privacy and 404 page <h1> */
    --fs: clamp(2.25rem, 1.2rem + 4.4vw, 4.5rem);
    font-family: var(--font-display); font-weight: 700;
    font-size: calc(var(--fs) * var(--display-scale, 1));
    line-height: 1; letter-spacing: -0.035em; text-wrap: balance;
  }
  .t-h2 {
    --fs: clamp(2.125rem, 1.4rem + 3.1vw, 4rem);
    font-family: var(--font-display); font-weight: 600;
    font-size: calc(var(--fs) * var(--display-scale, 1));
    line-height: 1.04; letter-spacing: -0.03em; text-wrap: balance;
  }
  .t-h3 {           /* service names in the index, success "Thank you." uses .t-h2 */
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(1.75rem, 1.35rem + 1.7vw, 2.75rem);
    line-height: 1.08; letter-spacing: -0.02em; text-wrap: balance;
  }
  .t-title {        /* team names, FAQ questions, figure titles, step names */
    font-family: var(--font-display); font-weight: 500;
    font-size: clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem);
    line-height: 1.25; letter-spacing: -0.01em; text-wrap: balance;
  }
  .t-kpi {
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(1.75rem, 1.4rem + 1.5vw, 2.5rem);
    line-height: 1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
  }
  .t-result {       /* estimator result, uses display face */
    font-family: var(--font-display); font-weight: 600;
    font-size: clamp(2.5rem, 1.6rem + 3.8vw, 4.75rem);
    line-height: 1; letter-spacing: -0.03em; font-variant-numeric: tabular-nums;
  }
  .t-lead {
    font-family: var(--font-sans); font-weight: 400;
    font-size: clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem);
    line-height: 1.5; letter-spacing: -0.005em; color: var(--fg-muted);
    max-width: 60ch; text-wrap: pretty;
  }
  .t-body {
    font-family: var(--font-sans); font-weight: 400;
    font-size: clamp(1rem, 0.98rem + 0.09vw, 1.0625rem);
    line-height: 1.65; max-width: 64ch; text-wrap: pretty;
  }
  .t-small { font-family: var(--font-sans); font-weight: 500; font-size: 0.875rem; line-height: 1.5; }
  .t-eyebrow {
    font-family: var(--font-mono); font-weight: 500; text-transform: uppercase;
    font-size: clamp(0.6875rem, 0.66rem + 0.12vw, 0.75rem);
    line-height: 1.3; letter-spacing: 0.14em; color: var(--fg-subtle);
  }
  .t-mono { font-family: var(--font-mono); font-weight: 400; font-size: 0.8125rem; line-height: 1.5; letter-spacing: 0.02em; }
  .t-data {
    font-family: var(--font-mono); font-weight: 400;
    font-size: clamp(0.6875rem, 0.66rem + 0.12vw, 0.75rem);
    line-height: 1.4; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; color: var(--fg-subtle);
  }
  .t-footer-mark {
    font-family: var(--font-display); font-weight: 800;
    font-size: clamp(3rem, 0.5rem + 12.2vw, 12rem);
    line-height: 0.86; letter-spacing: -0.045em;
  }
}
:lang(sw) { --display-scale: 0.94; }
html { hyphens: manual; }
```

Rules:
- Uppercase `.t-eyebrow` labels: three words at most. Longer labels go sentence case in `.t-small`.
- Kiswahili strings longer than 12 characters in display sizes carry `&shy;` hints in `sw.ts` (e.g. `Mawa\u00ADkala`).
- H1 fit (verified by arithmetic, then by screenshot test): "hadi maamuzi." ≈ 6.6em. At 1440px the display size is 120px → 792px, inside the 8-column text block (872px). At 1280px → 113px → 746px inside 781px. At 360px → 43px → 287px inside 320px. `:lang(sw)` takes 6% off. If a screenshot shows overflow at any width, lower the `1rem + 7.6vw` slope, never the max.

---

## 3. Structure without boxes

### 3.1 The law

Lines may run, cross at T-junctions and stop. **They never close into a rectangle around content.** Any element may carry at most two parallel rules (top+bottom or left+right), never three or four sides.

The only filled shapes on the site:
1. the primary button (royal pill);
2. chart marks (bars, dots, areas);
3. full-bleed surfaces that touch both viewport edges: `.surface-ink` bands (dashboards, footer), the header when scrolled, the mobile menu sheet;
4. `--bg-sunk` row tint for a selected table row or the active read-mode note (full row width, no edges).

No `border-radius` on containers. Radius exists only on: the primary button (9999px), radio dots and rings, the focus outline (2px), the probe dot. No `box-shadow` anywhere. No `backdrop-filter` anywhere.

### 3.2 Rule hierarchy (exact)

| Name | Spec | Where |
|---|---|---|
| **R1 hairline** | 1px `--rule`. On `min-resolution: 2dppx`, horizontal R1 may render as `transform: scaleY(0.5)` | Between rows (service index, FAQ, ledger, tables, team, contact lines), vertical column dividers (KPI strip, process, team, footer) |
| **R2 section rule** | 1px `--rule-strong`, full container width. Its first 48px is replaced by a 2px `--thread` segment sitting on the same baseline | Top of every section; the team floor rule; the bottom of the hero (top of the service index); booktabs top and bottom |
| **R3 input** | 1px `--rule-input` (>= 3:1) | Input and textarea underlines, slider tracks, radio rings, chart axis baselines |
| **Thread** | 2px `--thread`; on focus/hover it draws from the left with `scaleX` over `--dur-ui` | "You are here": active tab, focused field (replaces R3 underline), hovered/focused index row (over its top R1), active nav link, header scroll progress. **At most one live thread per section** besides the R2 opener |
| **R5 data** | Gridlines 1px dotted `--rule` (`stroke-dasharray: 1 3`); target line 1.5px dashed `--s-ref` (`4 4`) | Inside figures only |

`Rule` component renders R1/R2 as a `<hr>` (or `<div role="presentation">` when inside a grid) using `background` + `height`, never `border`, so the thread overlay can sit on it.

**Scroll-lit rules (zero JS):** inside `@supports (animation-timeline: view())`, every R2 gets a `::after` 120px sky highlight (`linear-gradient(90deg, transparent, rgb(104 212 251 / .55), transparent)`) that travels left→right as the rule crosses the viewport (`animation: rule-sheen linear both; animation-timeline: view(); animation-range: entry 20% cover 60%`). Unsupported browsers: no highlight. Reduced motion: none.

### 3.3 Grid and rhythm

- Container: `max-width: calc(1320px + 2 * var(--gutter-x)); padding-inline: var(--gutter-x); margin-inline: auto`. Side gutter 20 / 32 / 48 px at <640 / 640–1023 / >=1024.
- Columns: 4 (<640), 8 (640–1023), 12 (>=1024). Column gap `--col-gap` (16 / 24 px). Use CSS grid `grid-template-columns: repeat(N, minmax(0, 1fr))`.
- Section padding-block: `var(--section-y)` (72px → 144px). Gap between section header and content: `clamp(2.5rem, 1.8rem + 3vw, 4.5rem)`.
- Spacing scale (Tailwind spacing): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160 px.
- `content-visibility: auto; contain-intrinsic-size: auto 900px` on sections 03–08 (not on the hero, header or dashboards band).

### 3.4 Numbering (one system)

- Sections: `01`–`08`. Eyebrow format: `02 — Sample dashboards` (en dash with spaces, en) / `02 — Dashibodi za mfano` (sw). Right-side counter `02 / 08`, `aria-hidden`.
- Items inside a section: `01.1`, `01.2` … (services, process steps, team `06.1`…). FAQ: `Q 07.1`. Figures: `Fig. 02.1` / `Mchoro 02.1`. Read-mode markers: `1`, `2`, `3` in 24px rings.
- Every number carries information; no decorative codes.

### 3.5 Section header anatomy (`SectionHeader`)

```
R2 rule (thread first 48px) ───────────────────────────────────────────
02 — Sample dashboards                                   02 / 08
          [cols 4–12] H2 (.t-h2)
          [cols 4–10] lead (.t-lead), optional
```
Desktop: eyebrow in cols 1–3 on the same baseline as the H2's first line (align with `align-self: start; padding-top: .45em`). Counter right-aligned on the rule row. Mobile/tablet: eyebrow above the H2, counter on the eyebrow row's right. The eyebrow is a `<p>`; the H2 has the section `id`'s `aria-labelledby` target.

---

## 4. Motion

### 4.1 Principle

Things are **drawn, settled and lit**, never thrown. No bounce, float, tilt, parallax, marquee, pulse or loop, except: the hero silk (pausable, pauses off-screen) and the sending loader (only while a request is in flight).

### 4.2 Keyframes and utilities (`globals.css`)

All keyframes are defined with **`from` only** and `animation-fill-mode: both`, so with animations disabled every element simply shows its natural final state.

```css
@keyframes dh-rise     { from { opacity: 0; transform: translateY(16px); } }
@keyframes dh-fade     { from { opacity: 0; } }
@keyframes dh-draw-x   { from { transform: scaleX(0); } }           /* rules, threads, strike-through */
@keyframes dh-grow-y   { from { transform: scaleY(0); } }           /* bars */
@keyframes dh-draw     { from { stroke-dashoffset: 1; } }           /* SVG paths with pathLength="1" stroke-dasharray="1" */
@keyframes dh-sweep    { from { --sweep: 0deg; } }                  /* mark D reveal */
@keyframes dh-hand     { from { opacity: 0; transform: translateY(8%); } }
@keyframes dh-ring     { from { transform: scale(0.2); opacity: 0.9; } to { transform: scale(1); opacity: 0; } }
@keyframes dh-sending  { to { stroke-dashoffset: -1; } }            /* spine with stroke-dasharray=".22 .78" pathLength="1", infinite, 1.1s linear */
@keyframes dh-rule-sheen { from { background-position: -120px 0; } to { background-position: calc(100% + 120px) 0; } }

.a-rise   { animation: dh-rise var(--dur-reveal) var(--ease-silk) both; }
.a-fade   { animation: dh-fade var(--dur-reveal) var(--ease-silk) both; }
.a-draw-x { transform-origin: left; animation: dh-draw-x var(--dur-draw) var(--ease-thread) both; }
.a-grow-y { transform-origin: bottom; transform-box: fill-box; animation: dh-grow-y var(--dur-draw) var(--ease-silk) both; }
.a-draw   { stroke-dasharray: 1; animation: dh-draw var(--dur-draw) var(--ease-thread) both; }

/* Section-scoped: animations wait for <Reveal> */
.reveal-init { opacity: 0; transform: translateY(16px); }
.reveal-in   { opacity: 1; transform: none; transition: opacity var(--dur-reveal) var(--ease-silk), transform var(--dur-reveal) var(--ease-silk); }
.reveal-init :is(.a-rise,.a-fade,.a-draw-x,.a-grow-y,.a-draw) { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; }
  .reveal-init { opacity: 1; transform: none; }
}
@media (forced-colors: active) {
  .silk-layer, .rule-sheen::after { display: none; }
  .thread { background: CanvasText; }
}
@media print {
  .silk-layer, header, .action-rail, .lang-hint { display: none; }
  .surface-ink { background: none; color: #000; }
}
```

Stagger: `style={{ animationDelay }}` in 60ms steps, at most 6 steps (360ms). Durations: hover/focus colour 160ms; tab change, accordion, thread draw 280ms; section reveal 700ms; rules, chart lines, bars 900ms; mark sequence <= 1.6s total.

### 4.3 What moves (complete list)

1. Hero silk drift + scroll straightening + pointer calm (§6.1).
2. Hero mark: D sweep, hand rise, probe dot, terminal ring, once.
3. Section opener: R2 draws from the left (`a-draw-x`, 900ms), then eyebrow/H2 rise (`a-rise`, +120ms).
4. Index rows: on hover/focus a thread draws over the row's top R1, the arrow moves 6px right, the glyph strokes draw.
5. Ledger: strike-through draws across each "Today" item (`a-draw-x`, 60ms stagger).
6. Process: the thread fills along the step track (scroll-driven where `animation-timeline: view()` is supported, otherwise draws on reveal).
7. Charts: axes fade (200ms), series draw/grow (900ms, bars 40ms stagger), labels fade; replays when the dashboard tab changes. KPI values count up once per tab (800ms, `CountUp`, digits `aria-hidden` plus an sr-only final value).
8. Team: floor rule draws, then portraits rise 12px with fade (60ms stagger). Spotlight opacity on hover/focus.
9. Theme change: View Transition circular reveal from the toggle's centre, 450ms `--ease-silk`; silk canvas paused during the transition. Instant if unsupported or reduced motion.
10. Language switch: full navigation; `@view-transition { navigation: auto; }` gives a 200ms crossfade where supported.
11. Form: focus thread, error underline colour (no shake), sending loop.

### 4.4 Reduced motion, Save-Data, pause

- `prefers-reduced-motion: reduce`: silk canvas never mounts (static SVG stays), mark renders final with no probe, no reveals, charts final, CountUp shows final values, theme switch instant, `scroll-behavior: auto`.
- `navigator.connection.saveData === true`, `deviceMemory < 4`, or `hardwareConcurrency < 4` (where reported): same as reduced motion for the silk canvas only.
- **Pause control** (WCAG 2.2.2): text button in the hero's bottom-right, `Pause motion` / `Resume motion` (`aria-pressed`). Footer "Motion: On · Off". Stored in `localStorage["dh-motion"] = "off"` (try/catch). When off: canvas stops and stays on its current frame; nothing else in the list above is continuous, so nothing else changes.

### 4.5 Canvas budget (the only canvas on the site)

- Canvas2D, never WebGL. One canvas, hero only.
- Loaded with `next/dynamic` (`ssr: false`) inside a `requestIdleCallback` (2s timeout, `setTimeout` fallback). The LCP element is the H1 text.
- Backing store: `dpr = min(devicePixelRatio, 1.5)` on `(pointer: fine)`, `1` on touch; buffer capped at 1600×1000 device px.
- Frame cap: 30 fps everywhere (silk is slow; skip frames with a timestamp accumulator).
- Pause: `IntersectionObserver` (hero off-screen), `visibilitychange`, pause control, during theme View Transition.
- Kill switch: average frame time over the first 60 drawn frames > 22ms → stop the loop, keep the last frame. Context loss is impossible for 2D; on any exception, remove the canvas (the SVG underneath remains).
- Crossfade in over 600ms once the first frame is drawn (`opacity` 0→1 on the canvas; the SVG stays underneath and fades out after).
- Theme change: re-read the `--silk-*` custom properties from `getComputedStyle` on a `MutationObserver` of `<html class>`.

---

## 5. Component inventory

Shared primitives (create or rewrite):

| Component | File | One line |
|---|---|---|
| `Container` | `src/components/ui/Container.tsx` | Max-width wrapper per §3.3 (replace current `max-w-6xl`). |
| `Grid` | `src/components/ui/Grid.tsx` | 4/8/12-column grid with `--col-gap`; children place themselves with `col-start/col-span` classes. |
| `Rule` | `src/components/ui/Rule.tsx` | `variant: "hair" | "section" | "floor"`, `vertical?`, `animate?`; draws R1/R2 with thread start. |
| `SectionHeader` | `src/components/ui/SectionHeader.tsx` | Props `index`, `total`, `eyebrow`, `title`, `lead?`, `id`; renders §3.5. |
| `Section` | `src/components/ui/Section.tsx` | `<section id aria-labelledby>` + section padding + optional `ink` (adds `.surface-ink`, full bleed). |
| `Reveal` | `src/components/ui/Reveal.tsx` | Keep the current logic exactly (server-visible, macrotask, scroll fallback); only CSS offset changes to 16px. |
| `CountUp` | `src/components/ui/CountUp.tsx` | Keep; add `format(value)` prop, `aria-hidden` digits + sr-only final string, start on visibility. |
| `LinkArrow` | `src/components/ui/LinkArrow.tsx` | Text link + typographic arrow `→` (or `↓` for in-page); thread underline grows from left on hover/focus (`background-size` 0→100%, 280ms). |
| `ButtonPrimary` | `src/components/ui/Button.tsx` | Royal pill, 52px tall mobile / 56px desktop, padding-inline 28px, Manrope 600 16px, `--on-action`; hover `--action-hover` + `--on-action-hover`; renders `<a>` or `<button>`. At most one per viewport (header CTA excepted). |
| `ButtonText` | `src/components/ui/Button.tsx` | Secondary action: `LinkArrow` styling on a `<button>`; 48px min hit area. |
| `ThemeToggle` | `src/components/system/ThemeToggle.tsx` | Header icon button (half-filled 20px circle, rotates 180° on change), flips light↔dark, `aria-label` names the target. |
| `ThemeSettings` | `src/components/system/ThemeSettings.tsx` | Footer radio group System · Light · Dark. |
| `LangSwitch` | `src/components/system/LangSwitch.tsx` | `EN | SW` links (`hreflang`, `lang`), preserves query and hash, active one carries the thread underline. |
| `MotionToggle` | `src/components/system/MotionToggle.tsx` | Hero pause button and footer On/Off; shares one tiny store (`useSyncExternalStore` on localStorage + a custom event). |
| `ThemeScript` | `src/components/system/ThemeScript.tsx` | Keep; set both `.dark`/`.light` (§1.2). |
| `RefKeeper` | `src/components/system/RefKeeper.tsx` | On first load, copies sanitised `?ref`/`?utm_source` to `sessionStorage["dh-ref"]` (try/catch). Renders nothing. |
| `LangHint` | `src/components/system/LangHint.tsx` | One dismissible line under the header suggesting the other language (§9). |
| `BrandMark`, `BrandLockup` | `src/components/brand/BrandMark.tsx` | Keep as is (tokens already wired). |
| `HeroMark` | `src/components/brand/HeroMark.tsx` | Server SVG of the mark with sweep mask, hand, D spine path, probe dot and ring; a ~1KB client effect triggers the probe. |
| `SilkField` | `src/components/silk/SilkField.tsx` | Server component: renders the tier-0 SVG from `src/lib/silk.ts` for a given preset (`hero-desktop`, `hero-mobile`, `plate`, `service`). |
| `SilkCanvas` | `src/components/silk/SilkCanvas.tsx` | Client: tier-1 Canvas2D animation of the same function (§4.5, §6.1). |
| `csp` | `src/lib/csp.ts` | `buildCsp(nonce, isDev)` moved out of `proxy.ts` (proxy imports it) + `describeCsp()` for the colophon with the nonce redacted. Proxy must stay import-light: `csp.ts` imports nothing. |
| `format` | `src/lib/format.ts` | `formatTZS`, `formatNumber`, `formatPercent`, `monthShort` per locale (§8.2). |
| dictionaries | `src/i18n/dictionaries/en.ts`, `sw.ts`, `src/i18n/get-dictionary.ts` | `en` built from `copy.en.md`; `sw` typed `satisfies Dictionary` (same shape); `server-only`. |

Section components (`src/components/site/`):

| Component | File | One line |
|---|---|---|
| `Header` | `Header.tsx` | Sticky header (§6.0), replaces `Navbar.tsx`. |
| `MobileMenu` | `MobileMenu.tsx` | Full-screen sheet, focus trap, Esc, `main` inert. |
| `ActionRail` | `ActionRail.tsx` | Mobile-only fixed bar: WhatsApp + Start a conversation. Replaces `WhatsAppButton.tsx`. |
| `Hero` | `Hero.tsx` | §6.1. |
| `ServiceIndex` | `ServiceIndex.tsx` | The three hero bottom links. |
| `Services` | `Services.tsx` | §6.2 index rows + `ServiceGlyph` (same file). |
| `Dashboards` | `Dashboards.tsx` | §6.3 server shell; renders all four views server-side; mounts `DashboardShowcase` client island. |
| `HoursEstimator` | `HoursEstimator.tsx` | §6.4 client component (advanced feature B). |
| `Process` | `Process.tsx` | §6.5. |
| `WhyUs` | `WhyUs.tsx` | §6.6 ledger + security + colophon. |
| `Team` | `Team.tsx` | §6.7. |
| `Faq` | `Faq.tsx` | §6.8, keeps exporting the items for JSON-LD (now per locale from the dictionary). |
| `Contact`, `ContactForm` | `Contact.tsx`, `ContactForm.tsx` | §6.9. |
| `Footer` | `Footer.tsx` | §6.10. |

Dashboard kit (`src/components/dash/`): `DashboardShowcase.tsx` (client: tabs, read mode, crosshair, CountUp triggers), `Figure.tsx` (figure + caption + readout line + credit + `<details>` table), `KpiStrip.tsx`, `SampleStamp.tsx` (SVG `<g>`), `ReadMarker.tsx`, `kit/scales.ts` (linear, band, nice ticks), `kit/LineArea.tsx`, `kit/Bars.tsx`, `kit/Bullet.tsx`, `kit/StackBar100.tsx`, `kit/PairedBars.tsx`, `kit/Swimlane.tsx`, `kit/Sparkline.tsx`, `kit/DotMap.tsx`, `views/Overview.tsx`, `views/Loans.tsx`, `views/Sales.tsx`, `views/Operations.tsx`. Data: `src/lib/sample-data.ts` (header comment `// SAMPLE DATA — invented for illustration. Not client data.`). Map dots: `src/lib/tz-dots.ts` (generated). No chart library, no d3.

**Delete:** `Ticker.tsx`, `Founder.tsx`, `Navbar.tsx`, `WhatsAppButton.tsx`, `ui/SpotlightCard.tsx`, `ui/Tilt.tsx`, `ui/Decode.tsx`, `ui/AnimatedDots.tsx`, `ui/ScrollProgress.tsx` (folded into `Header`), and the CSS classes `.glass .glow-ring .aurora .bg-grid .bg-grid-fade .text-gradient .text-gradient-animate .accent-gradient .spotlight-card .btn-shine .marquee .ticker-mask .float .grow-bar .draw-path`.

---

## 6. Home page, section by section

Route: `src/app/[lang]/page.tsx` (`params: Promise<{ lang }>`; `export const dynamic = "force-dynamic"`). Move the current `app/page.tsx`, `app/services/*` and `app/layout.tsx` into `app/[lang]/` per the Next i18n guide; `api/`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, `icon.svg` stay at `app/` root. `src/proxy.ts` already rewrites unprefixed paths to `/en` and 308s `/en/*`; keep it. Add `app/[lang]/not-found.tsx`. `generateStaticParams` returns `[{lang:"en"},{lang:"sw"}]`; unknown `lang` → `notFound()`.

Order: Header · LangHint · 00 Hero · 01 Services · 02 Dashboards (ink) · 03 Estimator · 04 Process · 05 Why & security · 06 Team · 07 FAQ · 08 Contact · Footer (ink) · ActionRail (mobile). Section ids: `services`, `dashboards`, `estimator`, `process`, `security`, `team`, `faq`, `contact`.

### 6.0 Header

- **Purpose:** identity, navigation, language, theme, one CTA.
- **Desktop (>=1024):** 64px, `position: sticky; top: 0`. Transparent while `scrollY < 8`; then `background: var(--header-bg)` with an R1 bottom hairline. Left: `BrandLockup` (mark 28px). Centre: nav links Services · Dashboards · Process · Security · Team · FAQ (Manrope 500 14px, `--fg-muted`, hover `--fg`). The link of the section currently in view gets a thread underline sitting on the header's bottom hairline (IntersectionObserver, `aria-current="true"` not used for in-page; use `data-active`). Right: `LangSwitch`, `ThemeToggle`, compact `ButtonPrimary` (44px tall). Scroll progress: a 2px thread on the bottom hairline, `scaleX(progress)` driven by one passive scroll listener (rAF-throttled) or `animation-timeline: scroll(root)` where supported.
- **1024–1279:** drop "Process" and "Security" from the centre nav (they stay in the menu and footer).
- **Mobile (<1024):** 56px. Left: lockup (mark 24px). Right: `LangSwitch`, `ThemeToggle`, text button `Menu` (not a hamburger icon). Header never hides on scroll.
- **Moves:** background fade 160ms; progress thread; active underline 280ms.
- **Strings:** `a11y.skip`, `brand.*`, `nav.*`, `header.*`, `menu.*`, `theme.*`, `lang.*`.
- A visually hidden "Skip to content" link is the first focusable element.

**MobileMenu:** full-screen `--bg-elev` sheet. Links in Outfit 500 2rem, numbered `01`–`08` in mono, separated by R1; full-row 56px hit areas. Bottom block: `ButtonPrimary` (Start a conversation), WhatsApp `LinkArrow`, `LangSwitch`, `ThemeSettings`. Focus trapped; `Esc` and the `Close` button close it; `<main>` and `<footer>` get `inert` while open; body scroll locked; focus returns to the `Menu` button.

### 6.1 00 Hero

**Purpose:** say what DataHub is in five seconds, show the brand board alive, and draw "From Data to Decisions".

**Layers, back to front (desktop):**

1. **Wash** (CSS): `radial-gradient(48% 62% at 80% 46%, color-mix(in srgb, var(--silk-wash) 55%, transparent), transparent 72%)` on the hero `<section>` (dark: navy glow; light: pale blue).
2. **Silk layer** (`.silk-layer`, `position:absolute; inset:0; bottom: var(--index-h)`; `aria-hidden`): tier 0 `SilkField preset="hero-desktop"` SVG, tier 1 `SilkCanvas` on top when allowed. The layer has the text-safe mask:
   ```css
   .silk-layer.is-hero {
     --a: var(--silk-safe-alpha);
     -webkit-mask-image: linear-gradient(to bottom, rgb(0 0 0 / var(--a)) 0 74%, #000 84%), linear-gradient(to right, transparent 0 64%, #000 74%);
             mask-image: linear-gradient(to bottom, rgb(0 0 0 / var(--a)) 0 74%, #000 84%), linear-gradient(to right, transparent 0 64%, #000 74%);
     -webkit-mask-composite: source-over; mask-composite: add;
   }
   ```
   Effect: inside the text zone (x < 64%, y < 74%) filaments render at 20% of their alpha. With `--silk-max-alpha` 0.55 dark / 0.32 light and at most two overlapping filaments, the worst case is the "hero-safe-worst" background in §1.3, which passes for all text tokens.
3. **Mark** (`HeroMark`), absolutely positioned with its centre at `left: 80%; top: 46%` of the silk layer, size `clamp(240px, 26vw, 380px)` square, `translate(-50%,-50%)`. These are the same normalised coordinates as the silk sink, so tier 0 and tier 1 line up by construction.
4. **Text block** (static; never animated, it is the LCP): grid cols 1–8, top padding `clamp(96px, 14vh, 160px)` below the header.
   - Eyebrow `.t-eyebrow`: `hero.eyebrow`.
   - `<h1>`: line 1–2 in `.t-display`: `hero.title.line1` `<br>` `hero.title.line2Before` + `<em class="not-italic text-accent-display">hero.title.accent</em>`; then a `.t-sub` block (`mt-6`): `hero.title.sub`. (One `<h1>`; the sub line is inside it.)
   - Lead `.t-lead` (`mt-6`, cols 1–6): `hero.lead`.
   - Actions (`mt-10`, gap 24px): `ButtonPrimary` `hero.ctaPrimary` → `#contact`; `LinkArrow` `hero.ctaSecondary` with `↓` → `#dashboards`.
5. **Pause control:** `ButtonText` `.t-eyebrow` at the silk layer's bottom-right, 16px above the index rule: `motion.pause` / `motion.resume`. Rendered only after hydration when the canvas is running.
6. **Service index** (`ServiceIndex`, `--index-h` ≈ 112px desktop): R2 rule whose thread start is the landing point of the decision filament; three columns (cols 1–4, 5–8, 9–12) divided by vertical R1 that start at the rule and stop at the section bottom. Each column is one `<a>` to `/services/<slug>` (locale-prefixed): `.t-eyebrow` `01.1` + `.t-title` label + `→`. Hover: thread over the column's top, arrow 6px.

**Height:** `min-height: min(100svh - var(--header-h), 920px)`, never below 640px on desktop.

**1024–1279:** same layout; mark size `clamp(200px, 22vw, 300px)`; H1 may span cols 1–9 if the screenshot test needs it (mark stays clear).

**Mobile (<1024), stacked:** eyebrow, H1, sub, lead, actions on plain `--bg` (no silk behind text). Then a **silk band** 300px tall (`SilkField preset="hero-mobile"`, same wash, mark centred at 50%/50%, size 168px), no text mask needed. Pause control under the band, right-aligned. Then the service index as three stacked rows (R1 between, full-row links, 56px). The ActionRail appears once the hero CTA scrolls out of view.

**The silk function (`src/lib/silk.ts`, pure, deterministic, shared by SVG and canvas):**

```ts
export type SilkPreset = { W: number; H: number; N: number; samples: number; sinkX: number; sinkY: number;
  leftY: number; spreadIn: number; spreadPinch: number; spreadOut: number; amp: number; decision: number };
export const PRESETS = {
  "hero-desktop": { W: 1440, H: 900, N: 40, samples: 24, sinkX: 0.80, sinkY: 0.46, leftY: 0.86, spreadIn: 0.30, spreadPinch: 0.10, spreadOut: 0.34, amp: 0.09, decision: 19 },
  "hero-mobile":  { W: 390,  H: 300, N: 24, samples: 18, sinkX: 0.50, sinkY: 0.50, leftY: 0.60, spreadIn: 0.70, spreadPinch: 0.20, spreadOut: 0.60, amp: 0.10, decision: 11 },
  "plate":        { W: 1440, H: 420, N: 32, samples: 24, sinkX: 0.85, sinkY: 0.40, leftY: 0.70, spreadIn: 0.80, spreadPinch: 0.30, spreadOut: 0.70, amp: 0.08, decision: -1 },
  "service":      { W: 1440, H: 520, N: 28, samples: 20, sinkX: 0.88, sinkY: 0.45, leftY: 0.75, spreadIn: 0.60, spreadPinch: 0.18, spreadOut: 0.40, amp: 0.07, decision: -1 },
} satisfies Record<string, SilkPreset>;

const ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** y (px) of filament i at normalised x, time t (s), order k in [0,1]. */
export function silkY(p: SilkPreset, i: number, x: number, t: number, k: number): number {
  const u = p.N === 1 ? 0.5 : i / (p.N - 1);
  const into = ss(0, p.sinkX, x);                          // 0 at left edge -> 1 at sink
  const after = ss(p.sinkX, Math.min(1, p.sinkX + 0.12), x); // 0 before sink -> 1 shortly after
  const pinch = Math.exp(-(((x - p.sinkX) / 0.09) ** 2));
  let cy = lerp(p.leftY, p.sinkY, into);
  let spread = lerp(lerp(p.spreadIn, p.spreadPinch, into), p.spreadOut, after) - 0.04 * pinch;
  const turb = 1 - ss(0.25, p.sinkX, x);                   // silk lives on the left
  const dy = 0.55 * Math.sin(5.1 * x + 6.3 * u + 0.11 * t)
           + 0.30 * Math.sin(9.7 * x - 4.1 * u - 0.07 * t)
           + 0.15 * Math.sin(17.3 * x + 11.6 * u);
  const fold = 0.06 * Math.sin(3 * Math.PI * u);           // the silk "bunching"
  // order k: straighten everything towards evenly spaced parallel rules
  cy = lerp(cy, p.sinkY, k);
  spread = lerp(spread, p.spreadOut, k);
  let y = p.H * (cy + (u - 0.5 + fold * (1 - after)) * spread) + p.H * p.amp * turb * (1 - k) * dy;
  if (i === p.decision) {                                  // decision filament lands on the bottom rule
    const land = ss(p.sinkX + 0.06, 0.96, x);
    y = lerp(y, p.H - 0.75, land);
  }
  return y;
}

/** 0..1 brightness of filament i at time t: travelling sheen across the bundle. */
export const silkSheen = (u: number, t: number) => 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(2 * Math.PI * (u * 1.6 - t / 14)), 6);
```

Rendering rules:
- **Tier 0 SVG** (`SilkField`, server): `viewBox="0 0 W H" preserveAspectRatio="xMidYMid slice"`, one `<path>` per filament, `fill="none"`, `vector-effect="non-scaling-stroke"`, stroke width 1 (decision filament 1.5), `t = 0`, `k = 0`. Points at `samples` evenly spaced x, converted Catmull-Rom → cubic Bézier, coordinates **rounded to integers**. Colour: `stroke` = `color-mix(in oklab, var(--silk-a), var(--silk-b) {u*100}%)`; `stroke-opacity` = `calc(var(--silk-max-alpha) * b)` where b = `silkSheen(u, 0)` quantised to 6 buckets; set colour and opacity through the `style` attribute (custom properties do not work in presentation attributes), so a theme switch needs no re-render. Decision filament: `stroke="var(--silk-decision)"`, opacity 0.95. Budget: hero-desktop SVG <= 20 KB raw (≈ 6 KB gzip); hero-mobile <= 6 KB raw. Desktop SVG is `hidden lg:block`; mobile band SVG is in the mobile band only.
- **Tier 1 canvas** (`SilkCanvas`, client): same function, `samples = 96`, `t` advancing in seconds, `k = kScroll(+ kPointer)`. Per frame: clear; draw 6 alpha buckets as 6 batched `stroke()` calls with `globalCompositeOperation = var(--silk-blend)` value, then the decision filament. Colours read once per theme change.
- **Scroll order:** `kScroll = 0.85 * clamp(scrollY / heroHeight, 0, 1)`. As the visitor scrolls into §01 the silk straightens into parallel rules.
- **Pointer calm** (`(hover: hover) and (pointer: fine)` only): inside a 180px radius of the pointer, `k += 0.6 * (1 - d/180)^2`, eased with a 300ms lerp. Listener is on the hero element only (never `:root`), passive, read in the frame loop.
- **Drift:** `t` advances in real seconds; at the given frequencies one visible cycle ≈ 40–60s. Sheen bands travel across the bundle every 14s.

**`HeroMark` (server SVG, `viewBox 0 0 100 100`, `aria-hidden`; the H1 carries the meaning):**
- `<path d={MARK_D}>` filled `var(--mark-d)`, wrapped in a `<g>` with CSS `mask: conic-gradient(from 302deg at 50% 50%, #000 var(--sweep), transparent 0)`; animation `dh-sweep var(--dur-mark) var(--ease-thread) 100ms both`. Browsers without `@property` show the full D (its initial value is 360deg).
- `<path d={MARK_HAND}>` filled `var(--mark-hand)`, `dh-hand 700ms var(--ease-silk) 500ms both`, `transform-box: fill-box`.
- **D spine** (invisible guide, also used by the sending loader): `MARK_D_SPINE = "M 5.6 22 C 6.5 12 12 4.7 21.5 4.7 L 56 4.7 C 78 6 94.7 25 94.7 49.5 C 94.7 66 86 80 70.5 88.5"`. Add it to `mark-paths.ts`; verify by overlaying it on `MARK_D` at 400% (must stay inside the stroke within 1 unit; adjust control points if not).
- **Probe dot:** `<circle r="2.2" fill="var(--sky)" opacity="0">` with `<animateMotion dur="1.3s" begin="indefinite" fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".65 0 .35 1"><mpath href="#d-spine"/></animateMotion>`. A ~1KB client effect, after hydration and only if motion is allowed, sets opacity 1 and calls `beginElement()` 300ms after mount; on `endEvent` it adds a class that plays `dh-ring` once on a `<circle r="7" stroke="var(--sky)" fill="none">` at the spine's end point (70.5, 88.5), then fades the dot over 400ms. No JS or reduced motion: dot never shows. No loop, no pulse.

**Strings:** `hero.eyebrow`, `hero.title.*`, `hero.lead`, `hero.ctaPrimary`, `hero.ctaSecondary`, `hero.markLabel` (sr-only caption, optional), `motion.pause`, `motion.resume`, `serviceIndex.*`.

### 6.2 01 Services ("What we do")

- **Purpose:** the three services as one ledger of links to `/services/*`.
- **Desktop:** `SectionHeader` (01). Then three index rows between R2 (top) and R2 (bottom), R1 between rows. Each row is one `<a href={localePath(lang, "/services/" + slug)}>` containing an `<h3>`. Row grid (12 cols, padding-block 40px): cols 1–2 index `.t-eyebrow` `01.1`; cols 3–6 `.t-h3` title; cols 7–10 `.t-body` tagline (Manrope 600, `--fg`) + one-line description (`--fg-muted`) + deliverables as an inline mono list joined with ` · ` (`.t-data`); cols 11–12 right-aligned `ServiceGlyph` (64×40 SVG, 1.25px strokes `--accent-display`, `pathLength=1`) above `services.readMore →`.
  - Glyphs: dashboards = sparkline rising to a target tick; automation = three flow lines merging into one; ai-agents = three nodes with one marked by a small check (human approval).
- **Hover/focus:** a thread draws over the row's top R1 (280ms); the title stays `--fg`; the index turns `--accent`; the arrow moves 6px right; the glyph strokes draw (`a-draw`). The whole row is the hit area.
- **Mobile:** each row stacks: index + arrow on one line, `.t-h3` title, tagline, description, deliverables as an en-dash list. Glyph hidden <640.
- **Strings:** `services.eyebrow`, `services.title`, `services.lead`, `services.items.{dashboards,automation,aiAgents}.{index,title,tagline,description,glyphLabel}`, `services.readMore`. Deliverable labels are read from `services.ts` (`deliverables[].title`, English); the home-page summaries live in the dictionary.

### 6.3 02 Sample dashboards (ink band)

- **Purpose:** show the product without showing anyone's data; prove that DataHub thinks in decisions.
- **Surface:** `Section ink` → `.surface-ink`, full bleed, in both themes (dark tokens always). In dark theme it is visually distinct through the navy wash and the R2 rules at its top and bottom edges.
- **Desktop:**
  - `SectionHeader` (02) with H2 + lead in cols 4–12; the honesty notice `.t-eyebrow` in `--accent` under the lead: `dash.notice`.
  - Cols 1–3: **view tabs** (`role="tablist"`, `aria-orientation="vertical"`), four rows separated by R1: index `02.1` mono, name `.t-title`, one-line description `.t-small --fg-muted`. Active tab: 2px vertical thread on its left edge, name `--fg`; inactive names `--fg-muted`. Below the tabs (R1 above): `Explain this view` toggle (`ButtonText`, `aria-pressed`) and a `.t-data` note `dash.readHint`.
  - Cols 4–12: the **plate** for the active view (`role="tabpanel"`). No frame. Structure top to bottom:
    1. Header line `.t-data`: `{entity} · {period} · TZS` left; the **SAMPLE stamp** right (also drawn inside every chart SVG, see §8).
    2. R1.
    3. KPI strip: 4 equal columns divided by vertical R1 (start/stop 8px inside the strip; no outer verticals). Each: label `.t-eyebrow`, value `.t-kpi`, context line `.t-data` with status glyph (`✓` on target `--ok`, `△` watch `--warn`, `✕` breach `--error`) + word.
    4. R1.
    5. Figures in a 12-col sub-grid; rows separated by R1, a vertical R1 between two figures in the same row (T-junctions only, never reaching the plate's outer edge).
    6. R1, then the footnote line: `dash.footnote` left, view credit right.
- **Mobile:** tabs become a horizontal scroll-snap row of mono labels (`02.1 Overview`…) with a thread underline on the active one; plate full width; KPI strip 2×2 with one hairline cross (`+`), no outer edges; figures stack full width; read-mode notes as a numbered list under each figure.
- **No JS:** the tablist renders; panels 2–4 have `hidden="until-found"` (content stays in the DOM for crawlers and find-in-page); view 1 is visible. After hydration the island takes over (no layout shift).
- **Moves:** chart draw sequence on first reveal and on every tab change (§4.3 item 7). Tab change crossfade 280ms.
- **Keyboard:** WAI-ARIA tabs (arrow keys move and activate, Home/End). Figures with a crosshair are `tabIndex=0`; Left/Right step points, readout updates in an `aria-live="polite"` line. Read markers are buttons in the tab order only while read mode is on.
- **Strings:** `dash.*` (see copy deck).

### 6.4 03 Where do the hours go? (advanced feature B)

See §10.2 for exact behaviour and maths.
- **Desktop:** `SectionHeader` (03). Cols 1–7: the fill-in sentence in `.t-title` scale (Outfit 500, 26px desktop) with inline underline inputs (R3, focus thread). Cols 8–12: the result (`.t-result` hours, then `.t-title` working days, then the TZS line if salary given), the formula `.t-data`, the honesty note `.t-small --fg-muted`, and `ButtonText` `estimator.addToMessage →`. A vertical R1 separates the two halves.
- **Mobile:** sentence first; each number input has − / + stepper buttons (44px, typographic `−` `+`, no circles); result below an R1.
- **Moves:** result digits settle (200ms crossfade of the number, no count-up on every keystroke).
- **Strings:** `estimator.*`.

### 6.5 04 How we work

- **Desktop:** `SectionHeader` (04). A 1px R3 track across cols 1–12 with four 7px nodes (filled `--accent-display` once reached) at the start of cols 1, 4, 7, 10. A thread fills the track: `@supports (animation-timeline: view())` → scroll-driven over the section's `cover 20%–60%` range; otherwise `a-draw-x` on reveal. Under each node, a 3-col step separated from the next by a vertical R1 (from track down): `.t-eyebrow` `04.1`, `.t-title` step name, `.t-body` description, then `.t-data` "You receive:" + deliverable.
- Closing line under the steps, cols 4–12, `.t-lead`: `process.closing`.
- **Mobile:** vertical track at x = 4px with nodes; steps indented 28px; R1 between steps.
- **Strings:** `process.*`.

### 6.6 05 Why DataHub and security

Three parts, separated by R2 sub-rules (no thread on sub-rules):

1. **Ledger** (`security.ledger`): two columns with headers `.t-eyebrow` "Today" (cols 1–6) / "With DataHub" (cols 7–12), a vertical R1 between them, five R1 rows. "Today" items in `--fg-subtle` with a 1px `--fg-subtle` strike line drawn across the text on reveal (`a-draw-x`, 60ms stagger; the line is a pseudo-element, the text is not `<del>` so screen readers read it plainly, preceded by sr-only "Today:"). "With DataHub" in `--fg` with a `✓` in `--ok`. Mobile: pairs stack (Today line, then With line, R1 between pairs).
2. **Your data stays yours**: cols 1–5 `.t-h3` statement + `.t-body` paragraph; cols 6–12 a definition list, R1 rows: term `.t-small` 600 (cols 6–8), definition `.t-body --fg-muted` (cols 9–12). Six items (copy deck).
3. **Proof on this page** (colophon): `.t-eyebrow` heading, then five plain-language lines (`.t-body`), each a fact the page enforces. Then `<details>` "Show the exact policy": the CSP string from `describeCsp()` (`src/lib/csp.ts`) with the nonce replaced by `'nonce-…'`, rendered in `.t-mono`, `overflow-wrap: anywhere` (wraps; no horizontal scroll). Then `LinkArrow` to `https://securityheaders.com/?q=datahub.co.tz&followRedirects=on` (`rel="noopener noreferrer"`, `target="_blank"`). Never render the live nonce.
- **Strings:** `security.*`.

### 6.7 06 Team

- **Purpose:** the three people a client will work with. Equal size, equal spacing, no implied hierarchy. Order: Daniel, Kanuda, Yohana (DOM order = visual order).
- **Assets:** `public/team/daniel-masubi.png`, `kanuda-sasi.png`, `yohana-mussa.png`: transparent background, 900×1100 canvas, head height ≈ 300px, eye line at y ≈ 380, crop at mid-chest exactly at the canvas bottom. 1px edge choke + colour decontamination at matting; check on `#030A1C` and `#F6F9FE` at 1× and 3×. Served with `next/image` (`width 900 height 1100`, `sizes="(min-width:1024px) 360px, 40vw"`, `quality 80`, lazy, AVIF/WebP via `images.formats` in `next.config.ts`).
- **Desktop:** `SectionHeader` (06). A 3-col line-up (cols 1–4, 5–8, 9–12): portraits bottom-aligned on one shared **floor rule** (R2, full container width, drawn on reveal). Behind each head a soft radial glow: `radial-gradient(closest-side, rgb(104 212 251 / .18), transparent)` dark, `rgb(2 41 112 / .08)` light, centred at the head, 70% of the portrait width, no edges. Below the floor: three text columns divided by vertical R1 that start at the floor and run down (never above it). Each: `.t-eyebrow` `06.1`, name `.t-title`, role `.t-eyebrow` in `--accent`, `.t-body --fg-muted` two-line bio.
- **Spotlight:** on `(hover: hover)` hover, and on `:focus-within` for everyone, the other two members go to `opacity: .5` (280ms). Nothing else changes.
- **Mobile:** one row per person: portrait (40% width) left, standing on its own short floor rule; text right. R1 between rows.
- **Alt text:** `team.members.*.alt`.
- **JSON-LD:** in `seo.ts` change `founder.jobTitle` to "Chief Technology Officer", `founder.name` to "Daniel C. Masubi" (keep `alternateName: "Daniel Clement Masubi"`), image `/team/daniel-masubi.png`; add `employee: [Person Kanuda L. Sasi "Head of Operations", Person Yohana K. Mussa "Head of Marketing"]` with images. Update `layout` description/authors (no more "data engineer").
- **Strings:** `team.*`.

### 6.8 07 FAQ

- **Desktop:** cols 1–4 sticky (`top: calc(var(--header-h) + 32px)`): `SectionHeader` variant (eyebrow + H2 + `faq.aside` with WhatsApp `LinkArrow`). Cols 5–12: native `<details>` rows between R2 top / R2 bottom, R1 between. Summary: `.t-eyebrow` `Q 07.1` above the question `.t-title`; right side a `+` made of two 1.5px lines (16px), the vertical one rotates to flat on open (280ms). No circle. Answer `.t-body --fg-muted`, padding-bottom 24px. Use `::details-content` + `interpolate-size: allow-keywords` inside `@supports`; otherwise instant.
- **Mobile:** stacked.
- FAQPage JSON-LD built per locale from the dictionary array (the same one rendered). `/sw` gets Kiswahili markup.
- **Strings:** `faq.*`.

### 6.9 08 Contact

- **Desktop:** `SectionHeader` (08). Cols 1–5: direct lines as R1 rows (WhatsApp first, then email, then location), each a full-row link where applicable with `.t-eyebrow` label + `.t-title` value; then `.t-eyebrow` `contact.next.title` and three numbered lines; then the privacy line with a link to `/privacy` (`/sw/privacy`). Cols 7–12: the form.
- **Form layout:** Name | Phone/WhatsApp (two columns ≥640), Email | Company, then "Interested in" (`<fieldset>` + `<legend>`, four native radios as R1 rows, 48px each, ring 18px `--rule-input`, dot `--action`), Message (textarea "ruled paper": `background-image: repeating-linear-gradient(to bottom, transparent 0 calc(1.75rem - 1px), var(--rule) calc(1.75rem - 1px) 1.75rem); background-attachment: local; line-height: 1.75rem`, min 5 rows, auto-grow to 12), then `ButtonPrimary` submit, then the WhatsApp alternative line and the data-use line.
- **Fields:** label above (`.t-eyebrow`, always visible; "optional" suffix in `--fg-subtle`), value Manrope 18px, R3 underline; focus: thread draws from left, label turns `--accent`. Error: underline `--error` 2px, message below with `✕` glyph, `aria-invalid`, `aria-describedby`. Tap targets >= 48px.
- **Behaviour (unchanged pipeline):** same payload keys (`name,email,company,phone,service,message,source,website`), honeypot input named `hp` sent as `website`, `POST /api/contact`. `source` = `?ref` / `?utm_source` from the URL, else `sessionStorage["dh-ref"]`, sanitised `/[^a-z0-9_-]/g`, max 40. Radios send `dashboards | automation | custom-software | other`; `custom-software` is labelled "AI agents & custom software". zod schema untouched.
- **Client validation** mirrors the schema to choose the localised message (server decides validity; the client only picks text): name 2–100; email 5–160 + email shape; phone `^[0-9+()\s-]*$`, max 30; company max 140; message 10–4000.
- **Status mapping:** 200 `ok` → success; 422 → field errors + `form.status.checkFields`; 429 → `form.status.rateLimited`; 400/413/415 → `form.status.invalid`; other → `form.status.server`; fetch throws → `form.status.network`. Error summary is an `aria-live="assertive"` line above the button with `✕`.
- **Sending:** button label `form.sending` with the D spine loop (`dh-sending`, 16px); reduced motion: label only. Button `aria-busy`.
- **Success:** the form is replaced by an R2 rule, `.t-h2` `form.success.title`, `.t-body` `form.success.body`, `ButtonText` `form.success.again`. Focus moves to the heading (`tabIndex=-1`).
- **Mobile:** single column in this order: WhatsApp row, the form, then email, location and "what happens next".
- **Strings:** `contact.*`, `form.*`.

### 6.10 Footer (ink)

- `.surface-ink`, full bleed, both themes. Top: a 260px (desktop) / 160px (mobile) static **silk plate** (`SilkField preset="plate"`, no canvas) with the tagline over its lower-left in `.t-footer-mark`: line 1 `footer.tagline.line1Before` + `footer.tagline.line1Accent` ("Data" in `--accent-display`), line 2 `footer.tagline.line2`. The plate's filaments sit to the right of the tagline (preset sink at 0.85).
- Then R2 and four columns divided by vertical R1 (desktop), stacked with R1 (mobile): (1) `BrandLockup` + `footer.about`; (2) Services links; (3) Company links (Process, Security, Team, FAQ, Privacy); (4) Contact (WhatsApp, email, Dar es Salaam).
- Then an R1 row "Preferences": `LangSwitch` (full names English · Kiswahili), `ThemeSettings`, `MotionToggle`.
- Bottom line `.t-data`: `footer.legal`.
- **Strings:** `footer.*`.

### 6.11 ActionRail (mobile <1024 only)

Fixed bottom, height 56px + `env(safe-area-inset-bottom)`, background `var(--header-bg)` with a top R1. Left half: `footer`-style WhatsApp link (`rail.whatsapp`, glyph + word); right half: royal half-width button `rail.cta` → `#contact`. Appears (translateY 100%→0, 280ms) once the hero CTA leaves the viewport; hides while `#contact` intersects or while any `input, textarea, select` on the page has focus (`focusin`/`focusout`), or while the menu is open. `html { scroll-padding-bottom: 88px }` keeps focused elements clear of it. Without `NEXT_PUBLIC_WHATSAPP_NUMBER`, the CTA takes the full width.

### 6.12 LangHint

One line under the header, `.t-small`, full-width R1 below it: `langHint.toSw` on English pages when `localStorage["dh-lang"] === "sw"` or (first visit and `navigator.language` starts with `sw`); `langHint.toEn` on Kiswahili pages when `dh-lang === "en"`. Link to the equivalent page (query + hash preserved) and a `×` dismiss (`aria-label` `langHint.dismiss`), stored in `localStorage["dh-lang-hint"] = "dismissed"`. Client-only; renders nothing on the server.

---

## 7. Service pages (`/services/[slug]`, `/sw/services/[slug]`)

Same language, shorter. Body copy comes from `src/lib/services.ts` unchanged (English). Chrome strings from the dictionary (`servicePage.*`).

1. **Hero (no canvas):** `SilkField preset="service"` static SVG on the right, with the same text-safe mask rule as the home hero (text cols 1–8). Breadcrumb `.t-data` (`Home / Dashboards`, `<nav aria-label>`), eyebrow = `service.tagline`, `<h1 class="t-h1-page">` = `service.title`, intro paragraphs `.t-lead`, actions `ButtonPrimary` `servicePage.cta` → `#contact`, `LinkArrow` `servicePage.allServices` → home `#services`. Height: natural, min 520px desktop.
2. **01 Signs you need this:** `SectionHeader` (01 / 05), then `service.signals` as numbered R1 rows (`01.1`…) in cols 4–12, `.t-title` weight 500.
3. **02 What you get:** index rows like §6.2 without links: `02.1` index (cols 1–2), title `.t-title` (cols 3–6), desc `.t-body` (cols 7–12).
4. **03 See it in a sample:** an ink band reusing dashboard figures (server-rendered, no tabs, read-mode notes shown as static numbered lists): dashboards → View 1 KPI strip + Fig 02.1 + Fig 02.2; automation → View 4 KPI strip + Fig 02.10 + Fig 02.11; ai-agents → "What changed this week" (View 1) + the agent log (View 4). Same SAMPLE stamp, notice and credit lines.
5. **04 Questions:** FAQ rows like §6.8 from `service.faq`; FAQPage JSON-LD as today.
6. **05 Also from DataHub:** the other two services as index rows with links.
7. Contact section (§6.9) and footer.

JSON-LD (`serviceSchema`, `breadcrumbSchema`, `faqSchema`) unchanged, with locale-correct URLs.

**Kiswahili service pages:** until a reviewed `services.sw.ts` exists, `/sw/services/[slug]` renders Kiswahili chrome with the English body wrapped in `lang="en"`, sets `robots: { index: false, follow: true }`, is omitted from the sitemap, and the English page lists no `sw-TZ` alternate for it. When `services.sw.ts` lands (same shape, `satisfies Service[]`), flip a flag to index it and add the hreflang pair.

---

## 8. Sample dashboards

### 8.1 Shared rules

- **Two sample organisations, named generically:** "Sample lender (microfinance)" / "Taasisi ya mfano ya mikopo" for views 1, 2, 4; "Sample distributor (consumer goods)" / "Msambazaji wa mfano" for view 3. No real organisation names. Loan officers appear only as codes (`LO-014`). Branch and region names are real places (they are geography, not clients).
- **SAMPLE stamp inside every chart SVG** (`SampleStamp`): top-right of each figure's SVG, `.t-eyebrow` size, text `dash.stamp` ("SAMPLE DATA" / "DATA YA MFANO"), `fill="var(--fg-subtle)"`, the text alone (iteration-5 §A removed the 1px `--rule-strong` line that sat under it; no box either). Every figure SVG also includes a `<title>` with the figure summary.
- **Credit line under every figure:** `.t-data` `dash.credit` with `{period}` ("Source: DataHub sample data · TZS · Sep 2026"). Notice once per plate: `dash.footnote`.
- **Home teaser (iteration 2; superseded by iteration-5 §H/§I: the teaser and `/dashboards` are gone, the home page shows a live sample dashboard instead):** the home page's teaser (`TeaserPlate`) is a shortened plate: one credit line (the figure's) at every width, and below 640px only the chart and its credit line; the KPI strip, summary, table, stamp line and footnote are on `/dashboards`. See docs/design/iteration-2.md, section A. Every other plate follows the rules here.
- **Figure anatomy:** `<figure>`: `.t-eyebrow` `Fig. 02.n` + `.t-title` title; readout line `.t-data` (crosshair value, `aria-live="polite"`; idle text = latest point); the SVG; credit line; `<details>` `dash.showTable` with a booktabs `<table>` of the data (R2 top/bottom, R3 under header, R1 rows, numbers right-aligned tabular). `<figcaption>` = one-sentence summary (`dash.views.*.figures.*.summary`).
- **Rendering:** server components emit SVG with fills/strokes from CSS variables (`var(--s1)` etc.); text in SVG uses `font-family: var(--font-mono)`, 11px, `fill: var(--fg-subtle)`. A theme switch needs no JS. Charts set `viewBox` and `width:100%`; text sizes stay constant by using `vector-effect` on strokes and placing axis labels in HTML where scaling would distort them (KPI strip, tables) or in SVG with a fixed `viewBox` width of 640 (main charts) / 320 (half charts).
- **Line/area:** 2px stroke `--s1`, area `--s-fill`, target dashed `--s-ref`. **Bars:** 4px-radius-free rects, 2px gap. **Breach zone:** 45° hatch pattern `--s-hatch`. Series are labelled directly at their ends; no legends with swatches unless 3 series.
- **Interaction (client island):** crosshair on line and bar charts (pointer move/drag; Left/Right on focus): 1px `--fg-subtle` vertical line + 4px dot; readout updates. Hover on a bar or dot highlights it (others to 50% opacity). Read mode (§10.1).
- **Bundle:** dashboard island <= 14 KB gzip including sample data and formatters.

### 8.2 Language and number formatting (`src/lib/format.ts`)

- Months: en `Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec`; sw `Jan Feb Mac Apr Mei Jun Jul Ago Sep Okt Nov Des`.
- Money (hand-rolled, never `Intl` compact): `formatTZS(v, lang)`:
  - v >= 1e9: en `TZS 18.4 bn`, sw `TZS bilioni 18.4` (1 decimal; 2 decimals below 10 bn when the source has 2: `TZS 2.24 bn`).
  - 1e6 <= v < 1e9: en `TZS 418 mn`, sw `TZS milioni 418`.
  - v < 1e6: `TZS 412,000` in both (comma thousands, dot decimal).
- Percent `4.6%` in both. Counts `48,210` in both. Hours: en `288 h`, sw `saa 288`. Durations: `38 s` / `sek 38`.
- Axis titles carry the unit ("TZS bn" / "TZS bilioni").

### 8.3 The four views (exact sample numbers; internally consistent)

**View 1 · Executive overview / Muhtasari wa uongozi** — Sample lender, Jan–Sep 2026.

KPI strip:
| KPI | Value | Context (status) |
|---|---|---|
| Revenue, year to date | TZS 18.4 bn | 94% of TZS 19.6 bn target (△ watch) |
| Collection efficiency | 96.8% | Target 95.0% (✓) |
| Active borrowers | 48,210 | +6.1% vs end of Q2 (✓) |
| Cost-to-income | 58.3% | Ceiling 60.0% (✓) |

- **Fig. 02.1 Revenue vs target, by month (TZS bn):** area+line Jan 1.86, Feb 1.92, Mar 2.08, Apr 1.98, May 2.11, Jun 2.16, Jul 2.02, Aug 1.97, Sep 2.30 (sum 18.40); dashed target 2.18 each month (sum 19.62). Y axis 0–2.5, ticks 0.5. Full width (cols 1–12 of the plate).
- **Fig. 02.2 Branches, % of revenue target (bullet bars, sorted):** Kariakoo 104, Mlimani City 99, Arusha CBD 97, Mwanza 95, Moshi 93, Zanzibar Stone Town 91, Dodoma 88, Mbeya 84. Target tick at 100; bars below 90 in `--warn` with `△`. Cols 1–7.
- **Fig. 02.3 Exceptions / Tahadhari (list, not a chart):** R1 rows with status glyph + word: `✕ Breach` Mbeya PAR30 7.2% (limit 5.0%) · `✕ Breach` Dodoma PAR30 5.4% (limit 5.0%) · `△ Watch` Dodoma disbursements 18% below plan · `✓ Done` Board pack generated 05:58, sent to 9 recipients. Cols 8–12.
- **What changed this week / Kilichobadilika wiki hii** (full width, under an R1; three `.t-body` lines prefixed `—`, labelled `.t-eyebrow` "Written by the reporting agent · sample"): see copy deck `dash.views.overview.changed[]`.

**View 2 · Loan portfolio / Jalada la mikopo** — Sample lender, as at 30 Sep 2026.

| KPI | Value | Context |
|---|---|---|
| Gross loan portfolio | TZS 64.2 bn | +2.1% vs Aug |
| PAR30 | 4.6% | Limit 5.0% (✓) |
| Non-performing (90+ days) / Mikopo chechefu | 1.5% | of portfolio |
| Disbursed in September | TZS 5.9 bn | Plan 6.1 bn (△ watch) |

- **Fig. 02.4 PAR30 trend, 12 months (%):** Oct 3.8, Nov 3.9, Dec 4.1, Jan 4.3, Feb 4.4, Mar 4.6, Apr 4.9, May 5.1, Jun 5.3, Jul 5.4, Aug 5.0, Sep 4.6. Limit line at 5.0 with the hatched zone above it. Cols 1–7.
- **Fig. 02.5 Ageing, % of portfolio (one 100% bar):** Current 91.2 · 1–30 days 4.2 · 31–60 days 2.1 · 61–90 days 1.0 · 90+ days 1.5 (31+ sums to 4.6 = PAR30; 90+ = 1.5 = NPL KPI). Ramp steps 1–5 from current to 90+ (ramp-1 = current). Direct labels. Cols 8–12.
- **Fig. 02.6 Product mix (TZS bn, one 100% bar):** Group loans (vikundi) 21.8 · SME (biashara ndogo) 18.0 · Salary (mishahara) 15.4 · Agriculture (kilimo) 9.0 = 64.2. Cols 1–7.
- **Fig. 02.7 Disbursed vs repaid, Apr–Sep (TZS bn, paired bars):** disbursed 5.2, 5.5, 5.8, 5.4, 5.6, 5.9; repaid 5.0, 5.3, 5.5, 5.6, 5.7, 5.8. Series s1 / s3. Cols 8–12.
- **Officer table (booktabs, full width):** code · branch · portfolio · PAR30 · 12-month sparkline (60×16 SVG, `--s1`, last point dot):
  | Code | Branch | Portfolio | PAR30 |
  |---|---|---|---|
  | LO-014 | Kariakoo | TZS 2.84 bn | 2.1% |
  | LO-022 | Arusha | TZS 2.31 bn | 3.4% |
  | LO-031 | Mwanza | TZS 2.12 bn | 4.2% |
  | LO-018 | Zanzibar | TZS 1.92 bn | 3.0% |
  | LO-009 | Dodoma | TZS 1.76 bn | 5.6% ✕ |
  | LO-047 | Mbeya | TZS 1.58 bn | 7.9% ✕ |
  Sparkline series: `p[j] = end - (11 - j) * slope + 0.15 * Math.sin(j * 1.7 + n)` for j = 0..11, where `end` = PAR30, `slope` = 0.05, 0.06, 0.08, 0.04, 0.14, 0.22 respectively and `n` = row index. Rows with PAR30 > 5.0 get `✕` + `--error` value text and a `--bg-sunk` row tint.

**View 3 · Sales by region / Mauzo kwa mkoa** — Sample distributor, Q3 2026 (Jul–Sep).

| KPI | Value | Context |
|---|---|---|
| Sales, Q3 | TZS 7.32 bn | +11.3% vs Q3 2025 (✓) |
| Active outlets | 3,940 | ordered at least once in Q3 |
| Average order | TZS 412,000 | |
| Regions above plan | 6 of 10 | |

- **Fig. 02.8 Tanzania, sales by region (dot map):** dot matrix of Tanzania land at 0.25° spacing (≈ 1,100 dots) drawn as one `<path>` of zero-length round-cap segments (stroke-width 3.2 in viewBox units), coloured by nearest hub ("territory") with the 5-step ramp by YoY growth: ramp-1 <= 6%, ramp-2 7–9%, ramp-3 10–13%, ramp-4 14–17%, ramp-5 >= 18%. Lakes Victoria, Tanganyika and Nyasa are empty space; Unguja, Pemba and Mafia included; **no border lines of any kind**. Proportional rings (r ∝ √sales, max r 28 for Dar) at hub coordinates, 1.5px `--fg` stroke, no fill. Hub coordinates: Dar es Salaam 6.79S 39.21E · Arusha 3.37S 36.68E · Mwanza 2.52S 32.90E · Dodoma 6.16S 35.75E · Mbeya 8.90S 33.46E · Kilimanjaro (Moshi) 3.35S 37.34E · Zanzibar 6.16S 39.19E · Morogoro 6.82S 37.66E · Tanga 5.07S 39.10E. Projection: `x = (lon - 29.3) * cos(6.4°) * s`, `y = (-0.95 - lat) * s` (lat negative south), bounds lon 29.3–40.6, lat −0.95 to −11.8. Cols 1–7.
  - Dots: generate once with `scripts/make-tz-dots.mjs` from Natural Earth 1:50m admin-0 land and lakes (public domain), commit only the output `src/lib/tz-dots.ts` (path string, ≈ 4 KB gzip). No runtime fetch, no external origin.
- **Fig. 02.9 Ranked regions (bars + share + YoY):**
  | Region | Sales | Share | YoY |
  |---|---|---|---|
  | Dar es Salaam | TZS 2.24 bn | 30.6% | +8% |
  | Arusha | 0.88 bn | 12.0% | +14% |
  | Mwanza | 0.81 bn | 11.1% | +17% |
  | Dodoma | 0.59 bn | 8.1% | +21% |
  | Mbeya | 0.58 bn | 7.9% | +9% |
  | Kilimanjaro | 0.44 bn | 6.0% | +6% |
  | Zanzibar | 0.44 bn | 6.0% | +12% |
  | Morogoro | 0.37 bn | 5.1% | +10% |
  | Tanga | 0.36 bn | 4.9% | +4% |
  | Other regions | 0.61 bn | 8.3% | +15% |
  Sum 7.32 bn; value-weighted YoY = +11.3%. YoY shown as `+14%` with `▲` (all positive here; a negative would use `▼` `--warn`). Cols 8–12. Hovering/focusing a bar or a ring highlights both and updates the shared readout (`Mwanza · TZS 0.81 bn · 11.1% · +17%`).
- "Regions above plan: 6 of 10" is a label only; plan figures are not shown.

**View 4 · Automation & operations / Otomatiki na uendeshaji** — Sample lender's reporting system, September 2026; schedule shows a sample Monday.

| KPI | Value | Context |
|---|---|---|
| Reports delivered automatically | 1,284 | September |
| Median generation time | 38 s | last 14 runs |
| Staff hours returned (estimate) | 212 h | vs building by hand |
| Failed runs | 2 | both re-run the same morning (✓) |

- **Fig. 02.10 Monday schedule (swimlane, 05:00–20:00 EAT):** lanes Reports / Alerts / Agent. Marks (6px dots + label): 05:30 Daily PAR report → 14 branch managers · 05:58 Board pack (Mondays) → 9 recipients · 07:00 Collections exceptions → agent drafts · 12:00 Cash position · 18:30 Daily close. Static `✓` glyphs; no "now" line, no pulse. Full width.
- **Fig. 02.11 Generation time, last 14 runs (s, bars):** 36, 41, 38, 35, 39, 37, 61, 38, 36, 40, 37, 39, 38, 36 (median 38). Run 7 (61 s) in `--warn` with `△ watch` label. Cols 1–6.
- **Fig. 02.12 Monthly management pack: by hand vs automated (slope chart):** 14 h → 4 min. Cols 7–12.
- **Agent log / Kumbukumbu za wakala** (full width, R1 rows, `.t-mono` time + `.t-body` text + status word; a 2px thread on the left of the "awaiting approval" row, no box): see copy deck `dash.views.operations.log[]`. Human-in-the-loop is explicit.

Consistency checks (keep true if numbers change): view 1 Mbeya/Dodoma PAR30 breaches = agent log entries; view 2 PAR30 4.6% = 31+ day ageing sum; NPL 1.5% = 90+ bucket; product mix sums to portfolio; view 3 regions sum to 7.32 bn; view 4 median = 38 s.

### 8.4 Theme and language adaptation

- In the home page ink band, figures always use dark tokens (the band is `.surface-ink`). On service pages they sit on the page background and follow the theme. No figure hard-codes a colour.
- All labels, units, months, summaries and read-mode notes come from the dictionary; numbers from `sample-data.ts` formatted by `format.ts`. `sw` labels use the finance terms in the copy deck glossary (PAR30 stays "PAR30").

---

## 9. Theme and language toggles

**Theme**
- Header (all breakpoints): `ThemeToggle`, 44×44 hit area, 20px half-filled circle glyph in `currentColor`, rotates 180° (280ms). Toggles explicit light↔dark, writes `localStorage["theme"]`, toggles `.dark`/`.light` on `<html>`, updates `<meta name="theme-color">` (`#F6F9FE` / `#030A1C`), runs inside `document.startViewTransition` when available and motion is allowed (circular clip from the button centre, 450ms). `aria-label`: `theme.toggle.toDark` / `theme.toggle.toLight`.
- Footer: `ThemeSettings` radio group System · Light · Dark. System removes the key and follows `prefers-color-scheme` live (listen to `change`).
- Bootstrap: existing nonce-carrying `ThemeScript` in `<head>`, `suppressHydrationWarning` on `<html>` and the script. Two `<meta name="theme-color">` with `media` for first paint.

**Language**
- English at root URLs (`/`, `/services/x`, `/privacy`); Kiswahili under `/sw` (`/sw`, `/sw/services/x`, `/sw/privacy`). Proxy and `src/i18n/config.ts` already implement this; keep both.
- `LangSwitch`: `EN | SW` in the header (all breakpoints, outside the menu) and `English · Kiswahili` in the footer and menu. Real `<a href hreflang lang>` links to `localePath(target, stripLocale(pathname))` + current `search` + `hash` (read on click so `?ref=` survives). Clicking stores `localStorage["dh-lang"]`. No automatic redirects.
- `<html lang>` = `LANG_TAG[lang]` from the `[lang]` root layout. `metadata.alternates`: `canonical` = own URL; `languages: { "en-TZ": enUrl, "sw-TZ": swUrl, "x-default": enUrl }` (only for translated pages, §7). Sitemap lists both locales with `alternates.languages`. JSON-LD `inLanguage` per locale. OpenGraph `locale` from `OG_LOCALE`.
- Titles: en keeps exactly "DataHub — Data Analytics & Dashboards in Tanzania"; sw "DataHub — Uchambuzi wa Data na Dashibodi Tanzania".
- Dictionaries: `src/i18n/dictionaries/en.ts` (from `copy.en.md`), `sw.ts` typed against it. A unit test asserts identical key sets. All `sw` copy reviewed by a native speaker (Kanuda and Yohana) before launch; nothing machine-translated at runtime.
- Client validation messages and estimator templates come from the dictionary passed as props to client components (never import the full dictionary into the client bundle: pass only the needed sub-tree).

**Motion:** hero pause control + footer On/Off (§4.4).

---

## 10. The two advanced features

### 10.1 A. Read mode: "Explain this view" (dashboards)

- **Control:** `ButtonText` under the tab list (mobile: under the tab row), `aria-pressed`, label `dash.read.on` / `dash.read.off`. State is per page (not per tab), default off, not persisted.
- **When on:** each figure in the active view shows numbered markers (24px rings, 1.5px `--accent` stroke, mono numeral, focusable `<button>` with `aria-describedby` → its note) placed at the data coordinates listed in the copy deck (`dash.views.*.read[]` gives `{ figure, anchor, shows, decision }`; anchor = a data point key such as `"Jul"`, `"Mbeya"`, a row code or a list index). Notes render:
  - ≥1280: beside the figure (figure takes 8 of the plate's 12 columns, notes the remaining 4), as an ordered list with R1 between notes;
  - <1280: as an ordered list directly under the figure.
  Each note: marker numeral + `.t-small` 600 "what it shows" sentence + `.t-small --fg-muted` "the decision it supports" sentence.
- **Linking:** hovering or focusing a marker gives its note a `--bg-sunk` tint and a 2px thread on its left; hovering/focusing a note highlights its marker (ring fill `--accent`, numeral `--bg`). Nothing moves.
- **Motion:** markers fade in 60ms apart; reduced motion: instant.
- **A11y:** notes are real DOM text (indexable). With read mode off, markers and notes are removed from the accessibility tree (`hidden`), not merely transparent.
- **Count:** 3–4 notes per view (copy deck). Every note names the decision, not just the chart.

### 10.2 B. "Where do the hours go?" (fill-in-the-sentence estimator)

- **Sentence (en):** "We prepare [count] reports every [period]. Each one takes [people] [person|people] about [hours] hours." Kiswahili uses its own template with the same slots (`estimator.sentence` is an array of text/slot tokens per locale, so word order can differ).
- **Inputs:** native `<input type="number" inputmode="decimal">` with visible-on-focus thread underline, width sized to content (`field-sizing: content` where supported, `min-width: 3ch`), each with an `aria-label` (`estimator.labels.*`). `period` is a native `<select>` styled as an underline (`appearance: none` + `▾`). Optional salary field below the sentence: label `estimator.salary.label`, TZS input with thousands formatting on blur.
  - count: 1–100, step 1, default 3
  - period: `day | week | month`, default `week`
  - people: 1–20, step 1, default 1
  - hours: 0.5–40, step 0.5, default 2
  - salary (monthly, per person, TZS): 0–50,000,000, default empty
  - Out-of-range values clamp on blur; empty → treated as the minimum but shown as a field error line `estimator.error.range`.
- **Maths:**
  - `periodsPerYear = { day: 240, week: 48, month: 12 }` (240 working days, 48 working weeks: leave and public holidays excluded).
  - `hoursPerYear = count × periodsPerYear[period] × people × hours`
  - `workingDays = hoursPerYear / 8`
  - if salary > 0: `hourlyCost = salary / 176` (22 days × 8 h); `costPerYear = hoursPerYear × hourlyCost`
  - Display: hours rounded to the nearest whole hour, formatted `≈ 288 hours a year`; days to 1 decimal if < 10 else whole, `36 working days`; cost rounded to the nearest 10,000 TZS, `≈ TZS 2,450,000 a year in staff time`.
  - Formula line (`.t-data`), always visible: en `3 reports × 48 weeks × 1 person × 2 h = 288 h a year · 8 h = 1 working day` and, with salary, `· TZS 1,500,000 ÷ 176 h = TZS 8,523 per hour`.
  - Defaults give 3 × 48 × 1 × 2 = 288 h = 36 working days.
- **Result region:** `aria-live="polite"`, updated 300ms after the last input (debounced) so screen readers are not flooded.
- **Honesty line (always visible):** `estimator.note`. No savings percentage, no ROI claim, nothing sent anywhere.
- **Add to my message:** `ButtonText` `estimator.addToMessage`. Builds the localised sentence `estimator.messageTemplate` (with the computed numbers), writes it into the contact `message` field (appends with a blank line if the field has text; dispatches an `input` event so React state syncs), scrolls to `#contact`, focuses the **Name** field, and announces `estimator.added` in a polite live region. Communicates via a tiny module-level event (`window.dispatchEvent(new CustomEvent("dh:prefill", { detail }))`) that `ContactForm` listens to.
- **Bundle:** <= 3 KB gzip. No API changes.

---

## 11. Content and claims the page makes about itself

The colophon (§6.6.3) and footer state these; they must stay true. Add `tests/claims.test.ts` that fails if any becomes false:
- No cookies set by any page or API response (check `Set-Cookie` absent on `/`, `/sw`, `/api/contact`).
- `script-src` contains a nonce and `'strict-dynamic'`, no `'unsafe-inline'` in production; `connect-src 'self'`; `img-src 'self' data: blob:`; `font-src 'self' data:`.
- No `<script src>` or `<link>` to another origin in the rendered HTML.
Theme, language, motion and hint preferences use `localStorage`; attribution uses `sessionStorage`. All wrapped in try/catch; the site works without storage.

---

## 12. Privacy page (`/privacy`, `/sw/privacy`)

Simple text page in the same language: `t-h1-page`, R2-separated sections, `.t-body`. Copy in `copy.en.md` (`privacy.*`). Linked from the form and footer. In the sitemap, both locales once `sw` is reviewed. Facts only: what the form collects (name, email, phone, company, interest, message, campaign tag), that the IP address is stored only as a salted hash for rate limiting, purpose (replying), no sale or sharing, request deletion by email, reference to Tanzania's Personal Data Protection Act, 2022. No retention period, data-centre location or officer name unless the owner supplies them.

---

## 13. Performance budgets (home page, Moto G-class phone, 4G)

- LCP < 2.0 s (the H1 text); CLS < 0.02; INP < 200 ms.
- First-party client JS beyond the framework <= 40 KB gzip: header + menu + toggles ≈ 5, silk canvas ≈ 4 (lazy, idle), hero probe ≈ 1, dashboard island ≈ 14, estimator ≈ 3, contact form ≈ 6, reveal/countup ≈ 2.
- Fonts <= 120 KB; inline SVG (silk + mark + charts + map) <= 45 KB gzip in the HTML; portraits lazy, AVIF.
- No `filter: blur`, `backdrop-filter`, or `box-shadow`. Animate only `transform`, `opacity`, `stroke-dashoffset`, `clip-path`, and the registered `--sweep`.
- `will-change` only while an animation runs.

---

## 14. DON'Ts

1. **No boxes.** No cards, panels, tiles, bordered inputs, bordered tables (vertical lines in tables), outlined buttons, pill tags, chips, badges, tooltip boxes, glass, glow rings, shadows, rounded containers. No element with rules on three or four sides.
2. **No live theatre.** No "LIVE" badge, pulsing dot, blinking cursor, ticker, marquee, auto-rotating carousel, "now" line, "last updated x seconds ago", fake real-time counters.
3. **No invented facts.** No client names or logos, testimonials, case-study numbers, years in business, team sizes, awards, certifications, response-time promises, uptime figures, savings percentages, ROI claims. Sample dashboard numbers appear only inside labelled sample figures, never in the hero, headings or metadata. No invented personal history in bios.
4. **No external origins.** No CDN, Google Fonts link, analytics, tag manager, chat widget, embedded map, YouTube, external image, `connect-src` beyond `'self'`. The only outbound links are `wa.me`, `mailto:`, and securityheaders.com (plain links).
5. **No heavy libraries.** No three.js, WebGL, framer-motion, GSAP, d3, chart libraries, Lottie, carousel or UI kits. lucide-react only where a typographic glyph will not do (WhatsApp logo, theme glyph may be inline SVG instead).
6. **No inline script without the nonce.** No `dangerouslySetInnerHTML` script without `nonce` + `suppressHydrationWarning`. No `eval`, no `new Function`, no inline event handler attributes.
7. **No pipeline changes.** Do not touch `/api/contact`, `validation.ts`, `rate-limit.ts`, `mailer.ts`, `/api/poster/*`, `posters.ts`, `assets/fonts/`. Do not rename payload keys or the `hp` honeypot. Do not change service slugs.
8. **No redirects by language** and no localised slugs. English stays at root URLs.
9. **No colour-only meaning.** Status always = glyph + word + colour. Sky never as text on light. Royal never as small text on light.
10. **No placeholders as labels**, no disabled-looking submit, no custom select/listbox, no scroll-jacking, no smooth-scroll under reduced motion, no hiding content until JS runs (except `hidden="until-found"` dashboard panels).
11. **No text gradients**, no gradient fills on text, no animated gradients, no emoji in UI.
12. **No Decode/scramble text, no Tilt, no Spotlight, no AnimatedDots, no Ticker** (deleted).
13. **No marketing hype in copy:** no "revolutionary", "cutting-edge", "world-class", "seamless", "unlock", "empower", "leverage", "next-generation", "AI-powered" as an adjective, and no exclamation marks.
14. **Do not alter the logo artwork.** Theme-swap only the hand colour (navy → `#EAF1FF` on dark) and the "Hub" sky value on light (flagged for owner sign-off). Never relabel, outline or annotate the mark.
15. **Do not show real dashboards or any person's data**, and never use a real person's name in sample data.

---

## 15. Follow-ups to flag to the owner (not in this build)

- Confirm the deeper sky `#1FA2E0` for "Hub" on light backgrounds (or supply the designer's value).
- Recolour `poster-art.ts` (`BG`, `ACCENT`, `ACCENT_2`) and `opengraph-image.tsx` to the new blues; point Kiswahili posters at `/sw?ref=<channel>`.
- Supply a reviewed `services.sw.ts` to index `/sw/services/*`.
- Confirm whether to state a reply time on the contact section (the current site says "within one business day"; this build omits it until confirmed).
