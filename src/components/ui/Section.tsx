import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section: landmark with its heading as accessible name, the shared
 * vertical rhythm (--section-y), and optionally the full-bleed ink surface
 * (dark tokens in either theme — the footer).
 *
 * `compact` halves the rhythm for the short home page, whose sections are
 * one-screen teasers of the pages they link to.
 *
 * No content-visibility: a section can be a link target (/services#estimator,
 * a service page's #faq…), and sections standing in at a placeholder height
 * until painted made every jump to them — smooth, instant, from another
 * page, on reload — land off.
 */
export function Section({
  id,
  labelledBy,
  ink = false,
  compact = false,
  className,
  children,
}: {
  id: string;
  labelledBy: string;
  ink?: boolean;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative", ink && "surface-ink", className)}
      style={{ paddingBlock: compact ? "calc(var(--section-y) / 2)" : "var(--section-y)" }}
    >
      {children}
    </section>
  );
}
