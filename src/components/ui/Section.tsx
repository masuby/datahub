import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section: landmark with its heading as accessible name, the shared
 * vertical rhythm (.section-y: --section-y above and below), and optionally
 * the full-bleed ink surface (dark tokens in either theme — the footer).
 *
 * A page's first section (the first child of <main>) starts close under the
 * header instead: --section-y-first on top (iteration-5 §C). globals.css
 * does that once for every page, so no page has to say it is first.
 *
 * `compact` halves the rhythm for the short home page, whose sections are
 * teasers of the pages they link to. Below 640px it is a flat 24px instead:
 * there the home page has to stay about three screens long.
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
      className={cn(
        "relative",
        ink && "surface-ink",
        compact ? "py-6 sm:py-[calc(var(--section-y)/2)]" : "section-y",
        className,
      )}
    >
      {children}
    </section>
  );
}
