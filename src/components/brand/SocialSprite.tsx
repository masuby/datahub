"use client";

import { INSTAGRAM_GRADIENT_ID, SOCIAL_GLYPHS, socialRef } from "./social-glyphs";

/**
 * The social networks' glyphs and Instagram's gradient, once per page, for
 * every <SocialLinks> icon to draw with <use> — the header's, the footer's
 * and the mobile menu's would otherwise each carry the ~3 KB of path data,
 * twice for server components (HTML and React payload). A client component,
 * like MarkSprite, so the paths travel in a cached script chunk instead.
 *
 * The paths carry no fill: each <use> sets one. The gradient is in user
 * space, so it lies the same way on every icon: Instagram's yellow at the
 * bottom left, through orange, pink and magenta, to purple at the top right.
 */
export function SocialSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden", pointerEvents: "none" }}
    >
      <defs>
        <radialGradient id={INSTAGRAM_GRADIENT_ID} gradientUnits="userSpaceOnUse" cx="4" cy="26" r="30">
          <stop offset="0" stopColor="#ffd600" />
          <stop offset="0.25" stopColor="#ff7a00" />
          <stop offset="0.5" stopColor="#ff0069" />
          <stop offset="0.75" stopColor="#d300c5" />
          <stop offset="1" stopColor="#7638fa" />
        </radialGradient>
        {(Object.keys(SOCIAL_GLYPHS) as (keyof typeof SOCIAL_GLYPHS)[]).map((id) => (
          <path key={id} id={socialRef(id).slice(1)} d={SOCIAL_GLYPHS[id]} />
        ))}
      </defs>
    </svg>
  );
}
