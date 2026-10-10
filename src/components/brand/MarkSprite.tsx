"use client";

import { MARK_D, MARK_D_REF, MARK_HAND, MARK_HAND_REF } from "./mark-paths";

/**
 * The mark's two shapes, once per page, for every <BrandMark> and <HeroMark>
 * to draw with <use>. The path data is ~6 KB; inlined, it was repeated in the
 * header, the footer, both hero marks — and, for server components, again in
 * the React payload. A client component, so its paths travel in a cached
 * script chunk instead of the payload.
 *
 * The shapes carry no fill: each <use> sets one, and it inherits into the
 * copy, so the theme's --mark-d / --mark-hand still decide the colours.
 * Zero-sized rather than display:none, which some engines treat as "do not
 * render the referenced content" either.
 */
export function MarkSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", overflow: "hidden", pointerEvents: "none" }}
    >
      <defs>
        <path id={MARK_D_REF.slice(1)} d={MARK_D} />
        <path id={MARK_HAND_REF.slice(1)} d={MARK_HAND} />
      </defs>
    </svg>
  );
}
