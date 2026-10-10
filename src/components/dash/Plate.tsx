import { Fragment, type ReactNode } from "react";
import { fill } from "@/i18n/fill";
import { Rule } from "@/components/ui/Rule";
import { monthShort } from "@/lib/format";
import type { DashCtx, ViewKey } from "./context";
import { KpiStrip, type Kpi } from "./KpiStrip";

/**
 * The plate for one view (spec §6.3): no frame. Header line with entity,
 * period and currency on the left and the SAMPLE stamp on the right; R1; the
 * KPI strip; R1; rows of figures separated by R1; R1; the honesty footnote
 * (once per plate) and the view's credit line.
 */
export function Plate({
  ctx,
  view,
  kpis,
  rows,
}: {
  ctx: DashCtx;
  view: ViewKey;
  kpis?: Kpi[];
  rows: ReactNode[];
}) {
  const v = ctx.t.views[view];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 pb-4">
        <p className="t-data text-muted">
          {v.entity} · {v.period} · TZS
        </p>
        <p className="t-eyebrow border-b border-rule-strong pb-1.5">
          {ctx.t.stamp}
        </p>
      </div>
      <Rule />
      {kpis && (
        <>
          <KpiStrip ctx={ctx} items={kpis} />
          <Rule />
        </>
      )}
      {rows.map((row, i) => (
        <Fragment key={i}>
          {i > 0 && <Rule />}
          {row}
        </Fragment>
      ))}
      <Rule />
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3 pt-5">
        <p className="t-small max-w-[64ch] font-normal text-muted">{ctx.t.footnote}</p>
        <p className="t-data">{fill(ctx.t.credit, { period: v.creditPeriod })}</p>
      </div>
    </div>
  );
}

/** Index of an English month anchor ("Jul") in a series starting at `start` (0-based month). */
export function monthAnchor(start: number, length: number) {
  return (anchor: string) => {
    for (let i = 0; i < length; i++) if (monthShort(start + i, "en") === anchor) return i;
    return -1;
  };
}

/** Localised month labels for a series starting at `start`. */
export function monthLabels(ctx: DashCtx, start: number, length: number): string[] {
  return Array.from({ length }, (_, i) => ctx.t.months[(start + i) % 12]);
}

/**
 * The ink band's top and bottom edges (spec §6.3): full-bleed 1px
 * --rule-strong lines, so in dark theme the band separates from the page by
 * more than its navy wash. Two parallel rules, never a frame. Place inside a
 * `Section ink` (which is position: relative).
 */
export function BandEdges() {
  return (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rule-strong" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-rule-strong" />
    </>
  );
}
