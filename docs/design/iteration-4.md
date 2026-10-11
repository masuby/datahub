# Iteration 4 — liquid glass buttons, a liquid-metal mark, a shader gradient

Owner's request (Daniel, 11 Oct 2026): "Add Liquid glass js library from
github, the liquid logo and the shader gradient, so we advance our logo and
button to be like Apple's glass buttons as well."

This brief **overrides spec.md** where they disagree: spec §0, §4.5 and
§14.5 banned WebGL, §3.1/§13/§14 banned glass, backdrop-filter and shadows,
§14.14 forbade altering the logo's material. The owner asked for these
effects; they are allowed for the elements below and nowhere else.

## Glass buttons (`src/components/ui/glass/`, `Button.tsx`)

- Library: `liquid-glass-react` 1.1.1 (MIT), pinned.
- Three tiers, chosen after measuring (the library's refraction layer always
  on dropped the page from ~58 to 15–21 fps):
  1. **CSS glass** — tinted gradient, top sheen, 1px light rim, soft shadow,
     `backdrop-filter: blur(14px) saturate(180%)`. Server HTML, no-JS,
     Safari, Firefox, every touch screen, and Chromium at rest.
  2. **Liquid layer** — the library's refraction, desktop Chromium only,
     woken by a pointer near the button or keyboard focus, asleep ~1 s later
     and always asleep while the animated hero is on screen. Never leans
     toward the pointer.
  3. **Reduced** — low-end/Save-Data: no blur; reduced transparency: opaque;
     forced colours: system button colours.
- Used on: the primary "Start a conversation" button (hero, header, closing
  band, contact submit) and the floating WhatsApp button. Not on cards or
  the navigation.
- Labels stay in the real `<a>`/`<button>`; the glass is an aria-hidden
  layer under them. Contrast measured on screen ≥ 4.89:1 everywhere.

## Liquid-metal mark and mesh gradient (`src/components/hero/hero-shaders.ts`)

- Library: `@paper-design/shaders` 0.0.81 (Apache-2.0, core package only),
  pinned. `LiquidMetal` for the hero's big mark — the D and the hand as two
  maps so the hand keeps its wave — and `MeshGradient` behind the hero.
  Not `@shadergradient/react` (three.js; too heavy for this site).
- On the hero only. The header, footer and favicon marks stay flat.
- Brand colours per theme as tokens (`--metal-*`, `--mesh-*` in
  globals.css); the shader's stripe colours are patched into uniforms.
- Gated like the rest of the hero: device tier, Save-Data, WebGL2 and a
  real GPU (software GL falls back), reduced motion (one still frame),
  pause control, off screen, hidden tab, 30 fps on the hero's frame clock,
  pixel caps, a 12 ms kill switch. The flat SVG mark is the server HTML and
  every fallback; the comet pauses while the metal shows.

## Credits

Both libraries' notices are on the home page under "Credits and licences"
and in THIRD_PARTY.md.
