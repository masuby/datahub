import styles from "./dash.module.css";

/**
 * The SAMPLE stamp drawn inside every figure's SVG (spec §8.1): eyebrow-size
 * text at the top-right, the text alone — no line under it and no box
 * (iteration-5 §A: no short decorative lines). Rendered as a nested
 * <svg x="100%"> so it sits flush right in charts whose outer SVG has no
 * viewBox (x in %, y in px), at a constant size.
 *
 * Pass `x`/`y` when placing it inside a scaled viewBox instead.
 */
export function SampleStamp({ text, x = "100%", y = 0 }: { text: string; x?: string | number; y?: number }) {
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
    </svg>
  );
}
