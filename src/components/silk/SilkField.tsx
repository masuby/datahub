"use client";

import { PRESETS, filamentPath, sheenBucket, silkSheen, type SilkPresetName } from "@/lib/silk";

/**
 * Tier-0 silk: a static SVG of the silk function at t = 0.
 *
 * A client component on purpose, though it has no state or effects: it is
 * still rendered into the server HTML for first paint, but a client
 * component's output is not repeated in the React payload — only its props
 * ({ preset }) are. As a server component every filament was sent twice,
 * which made silk the heaviest thing on the page. The function is
 * deterministic, so hydration recomputes exactly the same paths.
 *
 * Colour and opacity come from CSS custom properties set in the `style`
 * attribute (custom properties do not work in SVG presentation attributes),
 * so switching theme repaints it with no re-render. Strokes are
 * `non-scaling-stroke`, so the hairlines stay 1px however the box scales.
 */
export function SilkField({
  preset,
  className,
}: {
  preset: SilkPresetName;
  className?: string;
}) {
  const p = PRESETS[preset];
  const filaments = Array.from({ length: p.N }, (_, i) => {
    const u = p.N === 1 ? 0.5 : i / (p.N - 1);
    const decision = i === p.decision;
    const style = decision
      ? { stroke: "var(--silk-decision)", strokeOpacity: 0.95 }
      : {
          stroke: `color-mix(in oklab, var(--silk-a), var(--silk-b) ${Math.round(u * 100)}%)`,
          strokeOpacity: `calc(var(--silk-max-alpha) * ${sheenBucket(silkSheen(u, 0)).toFixed(2)})`,
        };
    return (
      <path
        key={i}
        d={filamentPath(p, i)}
        fill="none"
        strokeWidth={decision ? 1.5 : 1}
        vectorEffect="non-scaling-stroke"
        style={style}
      />
    );
  });

  return (
    <svg
      viewBox={`0 0 ${p.W} ${p.H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {filaments}
    </svg>
  );
}
