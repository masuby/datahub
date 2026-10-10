import { MARK_D_REF, MARK_HAND_REF, MARK_VIEWBOX } from "./mark-paths";

/**
 * The DataHub mark: an open "D" with a hand forming its stem.
 *
 * Colours come from CSS custom properties so the theme decides them — on a
 * dark background the navy hand would disappear, so `.dark` swaps it for the
 * foreground colour. Defaults (defined in globals.css) follow the brand board:
 * royal-blue D, navy hand. The shapes themselves are drawn from
 * <MarkSprite> (rendered once by the layout).
 */
export function BrandMark({
  className,
  title,
}: {
  className?: string;
  /** Accessible name. Omit when the mark sits next to the visible wordmark. */
  title?: string;
}) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <use href={MARK_D_REF} style={{ fill: "var(--mark-d)" }} />
      <use href={MARK_HAND_REF} style={{ fill: "var(--mark-hand)" }} />
    </svg>
  );
}

/**
 * Mark + wordmark lockup. "Data" in royal blue and "Hub" in sky blue, as on
 * the brand board; both are tokens so they hold contrast in either theme.
 */
export function BrandLockup({
  className,
  markClassName = "h-8 w-8",
  wordClassName = "text-[1.35rem]",
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <BrandMark className={markClassName} />
      <span className={`font-display font-extrabold leading-none tracking-[-0.02em] ${wordClassName}`}>
        <span style={{ color: "var(--wordmark-data)" }}>Data</span>
        <span style={{ color: "var(--wordmark-hub)" }}>Hub</span>
      </span>
    </span>
  );
}
