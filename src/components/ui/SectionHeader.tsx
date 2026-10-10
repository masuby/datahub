import type { ReactNode } from "react";
import { Grid } from "./Grid";
import { Reveal } from "./Reveal";
import { Rule } from "./Rule";
import { cn } from "@/lib/utils";

/**
 * Section header anatomy:
 *
 *   R2 rule (thread first 48px) ─────────────────────────────────
 *   02 — Sample dashboards                              02 / 08
 *             [cols 4–12] H2
 *             [cols 4–10] lead
 *
 * Desktop: the eyebrow sits in cols 1–3 on the H2's first baseline. Below
 * 1024px it stacks above the H2. The counter is decorative (aria-hidden); the
 * eyebrow is a <p> and the H2 carries the id the section is labelled by.
 */
export function SectionHeader({
  index,
  total = 8,
  eyebrow,
  title,
  titleId,
  lead,
  children,
  className,
}: {
  /** "02" */
  index: string;
  total?: number;
  /** Full eyebrow from the dictionary, already numbered: "02 — Sample dashboards". */
  eyebrow: string;
  title: ReactNode;
  titleId: string;
  lead?: ReactNode;
  /** Extra content under the lead in the same columns (e.g. a notice). */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-[clamp(2.5rem,1.8rem+3vw,4.5rem)]", className)}>
      <Rule variant="section" animate />
      <Grid className="mt-5 lg:mt-6">
        <p className="t-eyebrow col-span-3 sm:col-span-6 lg:col-span-3 a-rise" style={{ animationDelay: "120ms" }}>
          {eyebrow}
        </p>
        <p
          aria-hidden="true"
          className="t-eyebrow col-span-1 sm:col-span-2 text-right lg:hidden a-fade"
          style={{ animationDelay: "120ms" }}
        >
          {index} / {String(total).padStart(2, "0")}
        </p>
        <div className="col-span-4 mt-4 sm:col-span-8 lg:col-span-8 lg:col-start-4 lg:mt-0 lg:pt-[0.45em]">
          <h2 id={titleId} className="t-h2 a-rise" style={{ animationDelay: "180ms" }}>
            {title}
          </h2>
        </div>
        <p
          aria-hidden="true"
          className="t-eyebrow hidden text-right lg:col-span-1 lg:block a-fade"
          style={{ animationDelay: "120ms" }}
        >
          {index} / {String(total).padStart(2, "0")}
        </p>
        {(lead || children) && (
          <div className="col-span-4 mt-6 sm:col-span-8 lg:col-span-7 lg:col-start-4 a-rise" style={{ animationDelay: "240ms" }}>
            {lead && <p className="t-lead">{lead}</p>}
            {children}
          </div>
        )}
      </Grid>
    </Reveal>
  );
}
