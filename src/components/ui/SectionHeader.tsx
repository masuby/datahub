import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

/**
 * Section header anatomy (iteration-5 §B), centred at every width:
 *
 *                         SIGNS YOU NEED THIS
 *                  H2 (or the page's H1), centred
 *            lead, centred, at most ~40rem (about 65 characters)
 *
 * No rule above it (iteration-5 §A: the R2 with its short thread is gone);
 * the space between sections does the separating. The eyebrow is a <p> and
 * the heading carries the id the section is labelled by. No chapter numbers
 * or "01 / 05" counters anywhere (owner, 2 Nov 2026): the eyebrow is just
 * its words.
 *
 * With `headingLevel` 1 the title is that page's one h1, set in the
 * page-title size, and marks where the mobile action rail may slide in.
 * `compact` (the home page's teasers) closes up the space under the title
 * and before the lead on phones; from 640px it is the same as the default.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  lead,
  headingLevel = 2,
  compact = false,
  children,
  className,
}: {
  /** The eyebrow from the dictionary: "How we work". */
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
        {eyebrow}
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
