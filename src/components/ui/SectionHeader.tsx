import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/**
 * Section header anatomy (iteration-5 §B), centred at every width:
 *
 *                    01 / 05 — SIGNS YOU NEED THIS
 *                  H2 (or the page's H1), centred
 *            lead, centred, at most ~40rem (about 65 characters)
 *
 * No rule above it (iteration-5 §A: the R2 with its short thread is gone);
 * the space between sections does the separating. The eyebrow is a <p> and
 * the heading carries the id the section is labelled by.
 *
 * The "/ 05" total shows only when `total` is given: on a page with a
 * numbered run of sections (a service page). Centred, a counter of its own
 * would repeat the eyebrow's number on a second line, so the total joins the
 * eyebrow instead — "01 / 05 — Signs you need this" — where the number
 * already is. It is decoration, hidden from screen readers as before: they
 * hear the eyebrow as written. A section that is a page of its own
 * (/process, /team…) keeps its chapter number in the eyebrow and shows no
 * total. With `headingLevel` 1 the title is that page's one h1, set in the
 * page-title size, and marks where the mobile action rail may slide in.
 * `compact` (the home page's teasers) closes up the space under the title
 * and before the lead on phones; from 640px it is the same as the default.
 */
export function SectionHeader({
  index,
  total,
  eyebrow,
  title,
  titleId,
  lead,
  headingLevel = 2,
  compact = false,
  children,
  className,
}: {
  /** "02" */
  index: string;
  /** Sections on the page; omit for no "/ 05" total. */
  total?: number;
  /** Full eyebrow from the dictionary, already numbered: "03 — How we work". */
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  lead?: ReactNode;
  /** 1 where this section is the page (its title is the page's h1). */
  headingLevel?: 1 | 2;
  /** Tighter spacing on phones, for the home page's short sections. */
  compact?: boolean;
  /** Extra content under the lead, centred with it (e.g. a notice). */
  children?: ReactNode;
  className?: string;
}) {
  const totalLabel = total ? ` / ${String(total).padStart(2, "0")}` : null;
  // The total sits right after the eyebrow's own number; an eyebrow written
  // without it at the front ends with the whole counter instead.
  const numbered = eyebrow.startsWith(index);
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <Reveal
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "mb-6 sm:mb-[clamp(2.5rem,1.8rem+3vw,4.5rem)]" : "mb-[clamp(2.5rem,1.8rem+3vw,4.5rem)]",
        className,
      )}
    >
      <p className="t-eyebrow a-rise" style={{ animationDelay: "120ms" }}>
        {totalLabel && numbered ? (
          <>
            {index}
            <span aria-hidden="true">{totalLabel}</span>
            {eyebrow.slice(index.length)}
          </>
        ) : (
          <>
            {eyebrow}
            {totalLabel && <span aria-hidden="true">{` · ${index}${totalLabel}`}</span>}
          </>
        )}
      </p>
      <Heading
        id={titleId}
        // The rail (ActionRail) appears once a page's title has scrolled away.
        data-rail-anchor={headingLevel === 1 ? "" : undefined}
        className={cn(headingLevel === 1 ? "t-h1-page" : "t-h2", "a-rise mt-4 max-w-[24ch] lg:mt-5")}
        style={{ animationDelay: "180ms" }}
      >
        {title}
      </Heading>
      {(lead || children) && (
        <div
          className={cn("a-rise w-full max-w-[40rem] sm:mt-6", compact ? "mt-3" : "mt-5")}
          style={{ animationDelay: "240ms" }}
        >
          {lead && <p className="t-lead mx-auto">{lead}</p>}
          {children}
        </div>
      )}
    </Reveal>
  );
}
