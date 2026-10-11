# Third-party assets

What the site ships that it did not make itself: where it came from, its
licence, and what was done to it. One section per part of the site.

## Home page tiles (iteration-3 §C)

**Microsoft Fluent Emoji — 3D style** (MIT licence)
Source: https://github.com/microsoft/fluentui-emoji at commit
`1ffb34c752ecf5d402f04cfb4b392c77f57c54bc` (`main` on 11 Oct 2026), fetched
over HTTPS from
`https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@1ffb34c752ecf5d402f04cfb4b392c77f57c54bc/assets/<Name>/3D/<name>_3d.png`
(`<Name>` URL-encoded, e.g. `Bar%20chart`), and the licence from the same
commit's `/LICENSE`. The SHA-256 of each upstream file is recorded in
`scripts/make-home-art.mjs`, which refuses a file that differs.

| File in the repo | Source asset | Used for |
|---|---|---|
| `src/assets/fluent-3d/chart-increasing.png` | Chart increasing / `chart_increasing_3d.png` | "Dashboards & business intelligence" tile |
| `src/assets/fluent-3d/gear.png` | Gear / `gear_3d.png` | "Reporting automation" tile |
| `src/assets/fluent-3d/robot.png` | Robot / `robot_3d.png` | "AI agents" tile |
| `src/assets/fluent-3d/bar-chart.png` | Bar chart / `bar_chart_3d.png` | Dashboard teaser (from 1440px) |
| `src/assets/fluent-3d/spiral-notepad.png` | Spiral notepad / `spiral_notepad_3d.png` | "A clear process" tile |
| `src/assets/fluent-3d/shield.png` | Shield / `shield_3d.png` | "Security first" tile |

Treatment: decoded to raw RGBA pixels with sharp and written as new PNGs
(256×256, nothing of the source file but its pixels kept — no metadata).
Unmodified otherwise. Served first-party through next/image (AVIF/WebP);
decorative (`alt=""`), the tile titles carry the meaning.

On the site: the home page, which serves the icons, carries their credit
and the licence below the "Why DataHub" tiles — "+ 3D icons: Microsoft
Fluent Emoji, MIT licence" / "+ Aikoni za 3D: Microsoft Fluent Emoji, leseni
ya MIT", a disclosure that opens on the notice below, word for word
(`src/components/site/home/ArtCredit.tsx`, text in `home-art.ts`).

Licence text (MIT), verbatim as published with the source (only the file's
four-space indent removed):

```
MIT License

Copyright (c) Microsoft Corporation.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE
```

**Team avatars** (`src/assets/team-avatars/*.png`) are not third-party: they
are crops of DataHub's own portraits in `public/team/` (one 540px square from
y = 105, x = 100 of each aligned 740×990 portrait, resized to 192×192 with
transparency kept).

To rebuild or audit both sets: fetch the six PNGs above from the pinned
commit into an empty folder, then run
`node scripts/make-home-art.mjs <that folder>`. It checks each file's
SHA-256, re-encodes the icons and cuts the avatars into `src/assets/`; on
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

**Outfit** (SIL Open Font License 1.1), already in `assets/fonts/`: the
footer wordmark's word is written with the outlines of its capitals and
lower case, generated from `Outfit-700.ttf` by `scripts/make-glyphs.mjs`
into `src/components/hero/glyphs.ts` (a–z, as the hero's word already was)
and `src/components/hero/glyphs-upper.ts` (A–Z, loaded only by the footer).
