import styles from "./dash.module.css";

/** Approximate advance of an 11px Geist Mono glyph with 0.14em tracking. */
const ADVANCE = 11 * (0.6 + 0.14);

/**
 * The SAMPLE stamp drawn inside every figure's SVG (spec §8.1): eyebrow-size
 * text at the top-right with one --rule-strong line under it. One line, not a
 * box. Rendered as a nested <svg x="100%"> so it sits flush right in charts
 * whose outer SVG has no viewBox (x in %, y in px), at a constant size.
 *
 * Pass `x`/`scale` when placing it inside a scaled viewBox instead.
 */
export function SampleStamp({ text, x = "100%", y = 0 }: { text: string; x?: string | number; y?: number }) {
  const w = Math.round(text.length * ADVANCE - 11 * 0.14);
  return (
    <svg x={x} y={y} overflow="visible" aria-hidden="true">
      <text
        x={0}
        y={11}
        textAnchor="end"
        className={styles.stampText}
        style={{ fill: "var(--fg-subtle)" }}
      >
        {text}
      </text>
      <line x1={-w} x2={0} y1={17.5} y2={17.5} style={{ stroke: "var(--rule-strong)" }} strokeWidth={1} />
    </svg>
  );
}
