import type { CSSProperties, ReactNode } from "react";
import { fill } from "@/i18n/fill";
import { cn } from "@/lib/utils";
import { STATUS_GLYPH, STATUS_TONE, figLabel, type DashCtx, type Note } from "./context";
import { ReadNotes } from "./ReadMarker";
import styles from "./dash.module.css";

export type TableSpec = {
  head: string[];
  rows: ReactNode[][];
  /** Right-align (tabular) these columns. */
  numeric?: boolean[];
  /** Per-row class (e.g. the breach tint). */
  rowClass?: (string | undefined)[];
};

/**
 * Figure anatomy (spec §8.1):
 *
 *   <figcaption>  Fig. 03.n · title (h3) · one-sentence summary
 *   readout       the latest point, in words
 *   chart         server SVG (stamp + <title> inside)   | read-mode notes
 *   credit        "Source: DataHub sample data · TZS · {period}"
 *   <details>     "View as table": booktabs table of the same numbers
 */
export function Figure({
  ctx,
  id,
  number,
  title,
  summary,
  creditPeriod,
  readout,
  notes = [],
  table,
  children,
  className,
}: {
  ctx: DashCtx;
  id: string;
  number: string;
  title: string;
  summary: string;
  creditPeriod: string;
  readout?: string;
  notes?: Note[];
  table?: TableSpec;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn(styles.fig, "min-w-0", className)} aria-labelledby={`${id}-h`}>
      <figcaption>
        <p className="t-eyebrow">{figLabel(ctx, number)}</p>
        <FigureTitle id={`${id}-h`} className="mt-2">
          {title}
        </FigureTitle>
        <p className="t-small mt-2 max-w-[60ch] font-normal text-muted">{summary}</p>
      </figcaption>
      {readout !== undefined && <p className="t-data mt-3 min-h-[1.4em] text-muted">{readout}</p>}
      <div className={cn(styles.figBody, "mt-4")}>
        <div className="min-w-0">{children}</div>
        <ReadNotes ctx={ctx} notes={notes} />
      </div>
      <p className="t-data mt-4">{fill(ctx.t.credit, { period: creditPeriod })}</p>
      {table && <DataTable ctx={ctx} caption={title} spec={table} />}
    </figure>
  );
}

/** A figure's title: an h3 under the sample band's h2. */
export function FigureTitle({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <h3 id={id} className={cn("t-title text-fg", className)}>
      {children}
    </h3>
  );
}

export function DataTable({ ctx, caption, spec }: { ctx: DashCtx; caption: string; spec: TableSpec }) {
  return (
    <details className={cn(styles.details, "mt-1")}>
      <summary className="t-data">{ctx.t.showTable}</summary>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {spec.head.map((h, i) => (
                <th key={i} scope="col" className={spec.numeric?.[i] ? styles.num : undefined}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, r) => (
              <tr key={r} className={spec.rowClass?.[r]}>
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="font-normal">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className={spec.numeric?.[i] ? styles.num : undefined}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** One row of the plate: one or two figures, a vertical R1 between them on desktop. */
export function PlateRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(styles.row, className)}>{children}</div>;
}

/** A cell of a plate row; `span` of 12 from 1024px. */
export function Cell({ span = 12, children }: { span?: number; children: ReactNode }) {
  return (
    <div className={styles.cell} style={{ "--span": span } as CSSProperties}>
      {children}
    </div>
  );
}

/** Status is always glyph + word + colour. */
export function StatusMark({
  ctx,
  status,
  className,
}: {
  ctx: DashCtx;
  status: keyof typeof STATUS_GLYPH;
  className?: string;
}) {
  return (
    <span className={cn("whitespace-nowrap", STATUS_TONE[status], className)}>
      <span aria-hidden="true">{STATUS_GLYPH[status]}</span> {ctx.t.status[status]}
    </span>
  );
}
