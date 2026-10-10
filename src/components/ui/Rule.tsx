import { cn } from "@/lib/utils";

/**
 * The site's only structural element.
 *
 *   hair    R1 — 1px --rule, between rows and as vertical column dividers
 *   section R2 — 1px --rule-strong whose first 48px is a 2px royal→sky thread;
 *                tops every section, carries the scroll-lit sheen
 *   floor   R2 used as the shared floor the team portraits stand on
 *
 * Lines may run, cross and stop; they never close into a box. Drawn with
 * `background`, not `border`, so the thread can sit on the same baseline.
 * `animate` draws it in from the left (paused until its <Reveal> fires).
 */
export function Rule({
  variant = "hair",
  vertical = false,
  animate = false,
  className,
}: {
  variant?: "hair" | "section" | "floor";
  vertical?: boolean;
  animate?: boolean;
  className?: string;
}) {
  if (vertical) {
    return <span role="presentation" aria-hidden="true" className={cn("rule-hair-v", className)} />;
  }
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(variant === "hair" ? "rule-hair" : "rule-section", animate && "a-draw-x", className)}
    />
  );
}
