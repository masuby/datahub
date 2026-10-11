import type { ReactNode } from "react";
import { Grid } from "./Grid";
import { Reveal } from "./Reveal";
import { Rule } from "./Rule";
import { cn } from "@/lib/utils";

/**
 * Section header anatomy:
 *
 *   R2 rule (thread first 48px) ─────────────────────────────────
 *   02 — Sample dashboards                              02 / 05
 *             [cols 4–12] H2 (or the page's H1)
 *             [cols 4–10] lead
 *
 * Desktop: the eyebrow sits in cols 1–3 on the heading's first baseline.
 * Below 1024px it stacks above the heading. The eyebrow is a <p> and the
 * heading carries the id the section is labelled by.
 *
 * The "02 / 05" counter shows only when `total` is given: on a page with a
 * numbered run of sections (a service page). A section that is a page of its
 * own (/process, /team…) keeps its chapter number in the eyebrow and shows no
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
  /** Sections on the page; omit for no "02 / 05" counter. */
  total?: number;
  /** Full eyebrow from the dictionary, already numbered: "02 — Sample dashboards". */
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  lead?: ReactNode;
  /** 1 where this section is the page (its title is the page's h1). */
  headingLevel?: 1 | 2;
  /** Tighter spacing on phones, for the home page's short sections. */
  compact?: boolean;
  /** Extra content under the lead in the same columns (e.g. a notice). */
  children?: ReactNode;
  className?: string;
}) {
  const counter = total ? `${index} / ${String(total).padStart(2, "0")}` : null;
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <Reveal
      className={cn(compact ? "mb-6 sm:mb-[clamp(2.5rem,1.8rem+3vw,4.5rem)]" : "mb-[clamp(2.5rem,1.8rem+3vw,4.5rem)]", className)}
    >
      <Rule variant="section" animate />
      <Grid className="mt-5 lg:mt-6">
        <p
          className={cn(
            "t-eyebrow lg:col-span-3 a-rise",
            counter ? "col-span-3 sm:col-span-6" : "col-span-4 sm:col-span-8",
          )}
          style={{ animationDelay: "120ms" }}
        >
          {eyebrow}
        </p>
        {counter && (
          <p
            aria-hidden="true"
            className="t-eyebrow col-span-1 sm:col-span-2 text-right lg:hidden a-fade"
            style={{ animationDelay: "120ms" }}
          >
            {counter}
          </p>
        )}
        <div className="col-span-4 mt-4 sm:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0 lg:pt-[0.45em]">
          <Heading
            id={titleId}
            // The rail (ActionRail) appears once a page's title has scrolled away.
            data-rail-anchor={headingLevel === 1 ? "" : undefined}
            className={cn(headingLevel === 1 ? "t-h1-page" : "t-h2", "a-rise")}
            style={{ animationDelay: "180ms" }}
          >
            {title}
          </Heading>
        </div>
        {counter && (
          <p
            aria-hidden="true"
            className="t-eyebrow hidden text-right lg:col-span-1 lg:block a-fade"
            style={{ animationDelay: "120ms" }}
          >
            {counter}
          </p>
        )}
        {(lead || children) && (
          <div
            className={cn("col-span-4 sm:col-span-8 sm:mt-6 lg:col-span-7 lg:col-start-4 a-rise", compact ? "mt-3" : "mt-6")}
            style={{ animationDelay: "240ms" }}
          >
            {lead && <p className="t-lead">{lead}</p>}
            {children}
          </div>
        )}
      </Grid>
    </Reveal>
  );
}
