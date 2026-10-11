# Third-party assets

What the site ships that it did not make itself: where it came from, its
licence, and what was done to it. One section per part of the site.

## Home page tiles (iteration-3 §C, iteration-5 §D)

Nothing third-party any more. The Microsoft Fluent Emoji 3D icons (MIT)
that the tiles carried in iterations 3 and 4 were replaced on 11 Oct 2026 by
the owner's own 3D icons, and removed: `src/assets/fluent-3d/` is deleted,
`scripts/make-home-art.mjs` no longer fetches or re-encodes them, and their
credit and MIT notice are gone from the home page's "Credits and licences"
(`ArtCredit`).

**The owner's icons** (`src/assets/icons/*.png`) are DataHub's own artwork,
supplied by the owner, with their backgrounds removed (384×384 RGBA PNG),
placed by hand; no script makes them. Served first-party through next/image
(AVIF/WebP); decorative (`alt=""`), the titles carry the meaning.

| File in the repo | Used for |
|---|---|
| `src/assets/icons/dashboards.png` | "Dashboards & business intelligence": its home tile, /services and its service page; and the home dashboards section |
| `src/assets/icons/automation.png` | "Reporting automation": its home tile, /services and its service page |
| `src/assets/icons/agent.png` | "AI agents": its home tile, /services and its service page |
| `src/assets/icons/process.png` | "A clear process" home tile |
| `src/assets/icons/security.png` | "Security first" home tile |

All from `src/components/site/home/home-art.ts` (`SERVICE_ICON`,
`DASHBOARDS_ICON`, `REASON_ICON`), so the same thing has the same icon
everywhere.

**Team avatars** (`src/assets/team-avatars/*.png`) are not third-party: they
are crops of DataHub's own portraits in `public/team/` (one 540px square from
y = 105, x = 100 of each aligned 740×990 portrait, resized to 192×192 with
transparency kept). To rebuild them: `node scripts/make-home-art.mjs`; on
11 Oct 2026 its output was byte-identical to the committed files.


## Site chrome: social icons, WhatsApp button, footer wordmark (iteration-3 §A)

**Simple Icons 13.21.0** (CC0 1.0 Universal — public domain dedication)
Source: https://simpleicons.org, fetched over HTTPS from
`https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/<name>.svg` on
11 Oct 2026. 13.21.0 (December 2024) is the last release that still carries
LinkedIn's icon; all five come from that one release.

| Icon | Source file | Used for |
|---|---|---|
| Instagram | `instagram.svg` | Header, footer and mobile-menu social icons |
| Facebook | `facebook.svg` | ditto |
| TikTok | `tiktok.svg` | ditto |
| LinkedIn | `linkedin.svg` | ditto |
| WhatsApp | `whatsapp.svg` | The floating WhatsApp button, and the glyph beside the footer's WhatsApp link |

Treatment: only each file's path `d` string was kept, unchanged, as a
TypeScript constant in `src/components/brand/social-glyphs.ts` (the SVG
files themselves are not in the repo). Drawn inline from one sprite per page
(`SocialSprite`), filled with each brand's own colours: Instagram's gradient,
Facebook #0866FF, TikTok black/white with #25F4EE and #FE2C55 edges, LinkedIn
#0A66C2, WhatsApp #25D366 (with #075E54 behind the button's label).
Facebook's "f" and LinkedIn's "in" are knock-outs in the path data; a white
circle / rounded square is drawn under each so they stay white, as in the
logos, on the dark theme too.

The CC0 dedication covers Simple Icons' drawings; the marks themselves remain
trademarks of Meta (Instagram, Facebook, WhatsApp), ByteDance (TikTok) and
Microsoft (LinkedIn); the site shows them only to link to DataHub's own
profiles and chat.

**Poppins** (SIL Open Font License 1.1; see "Type" below): the footer
wordmark's word is written with the outlines of its capitals and lower case,
generated from `assets/fonts/Poppins-SemiBold.ttf` by
`scripts/make-glyphs.mjs` into `src/components/hero/glyphs.ts` (a–z, as the
hero's word is) and `src/components/hero/glyphs-upper.ts` (A–Z, loaded only
by the footer). Until iteration 5 these were Outfit 700 outlines.


## Liquid glass and liquid metal (iteration 4)

**liquid-glass-react 1.1.1** — MIT, Copyright 2025 Max Rovensky
(npm `liquid-glass-react`, github.com/rdev/liquid-glass-react). Used for the
refraction layer of the primary and WhatsApp buttons
(`src/components/ui/glass/GlassSurface.tsx`), client-only, on desktop
Chromium while a pointer is near or the button has keyboard focus. Pinned
exactly. The MIT notice is shown on the home page under "Credits and
licences" (`ArtCredit`).

**@paper-design/shaders 0.0.81** — Apache-2.0, Copyright 2026 Paper
(npm `@paper-design/shaders`). Used for the hero's liquid-metal mark
(LiquidMetal) and mesh gradient (MeshGradient) in
`src/components/hero/hero-shaders.ts`. NOTICE: "Paper Shaders, Copyright
2026 Paper. Powered by Paper Shaders: https://shaders.paper.design".
Modified: the LiquidMetal fragment shader's two stripe colours are made
uniforms (three exact string replacements, guarded — any mismatch keeps the
flat mark) and the logo maps are precomputed at build time by
`scripts/make-metal-maps.mjs` (a port of the library's own processing) into
`src/assets/metal/`. The NOTICE text and the licence link are shown on the
home page under "Credits and licences". Pinned exactly; an upgrade needs the
shader patch re-checked.


## Type (iteration-5 §F)

**Poppins** — SIL Open Font License 1.1, Copyright 2020 The Poppins Project
Authors (github.com/itfoundry/Poppins). The display face: headings, UI
labels and the wordmark, weights 500, 600 and 700.

**Lato** — SIL Open Font License 1.1, Copyright 2010–2011 tyPoland Łukasz
Dziedzic, with Reserved Font Name "Lato" (version 1.104, as Google Fonts
serves it). The body face, weights 400 and 700.

Both are self-hosted by `next/font/google` (`src/app/fonts.ts`): fetched at
build time, served from the site's own origin as subsetted WOFF2 (latin),
unmodified apart from that subsetting, so the CSP keeps `font-src 'self'`.
Geist Mono (OFL 1.1, Vercel) is served the same way, as before.

**`assets/fonts/Poppins-SemiBold.ttf`** (Poppins 600, version 4.004, the
same version Google Fonts serves: every advance width matches the served
font) with its licence beside it, `assets/fonts/OFL-Poppins.txt`. Not
served: `scripts/make-glyphs.mjs` reads it to generate the outlines of a–z
and A–Z (`src/components/hero/glyphs.ts`, `glyphs-upper.ts`, overlaps
removed) and the advance widths (`src/components/hero/font-metrics.ts`) that
the hero's and the footer's words that write themselves trace and size by.
The generated files carry the OFL notice in their header.

**Outfit** (SIL Open Font License 1.1, `assets/fonts/Outfit-*.ttf`) is no
longer a site face; the share posters (`/api/poster`) and the Open Graph
image still render with it, as published.
