"use client";

import { fill } from "@/i18n/fill";
import { figLabel, type DashCtx, type DashT } from "@/components/dash/context";
import { DataTable, FigureTitle } from "@/components/dash/Figure";
import { KpiStrip } from "@/components/dash/KpiStrip";
import { monthLabels } from "@/components/dash/Plate";
import { overviewKpis } from "@/components/dash/views/Overview";
import { LineArea } from "@/components/dash/kit/LineArea";
import dashStyles from "@/components/dash/dash.module.css";
import { REVENUE, REVENUE_START_MONTH, REVENUE_TARGET } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

/**
 * What the teaser is given: the dashboards context with View 1's strings
 * only. Everything here is serialised into the home page's payload, and the
 * home page is the poster/QR landing on phones; the other three views'
 * tables and notes (most of dict.dash) would travel for nothing.
 */
export type TeaserCtx = Omit<DashCtx, "t"> & {
  t: Omit<DashT, "views"> & { views: Pick<DashT["views"], "overview"> };
};

/** Chart height: lower than on /dashboards (260), as befits a teaser. */
const CHART_H = 200;

/**
 * The home page's dashboard teaser: View 1's KPI strip and its revenue chart
 * (Fig. 02.1, the same number it has on /dashboards), laid out like a plate:
 * header line with the SAMPLE stamp, KPIs, the figure and the honesty
 * footnote — held apart by space, not rules, in the home page's rhythm of
 * vertical hairlines (iteration-3 §C; the KPI strip keeps its own dividers).
 *
 * Shorter than a plate, because the home page has to stay about three
 * screens long on a phone: one credit line (the figure's; the plate's own
 * repeated it), and below 640px the chart and its credit line alone — no
 * KPI strip, stamp, summary, table or footnote; all of them are one link
 * away on /dashboards. There the notice under the section title, the entity
 * line ("Sample lender …"), the stamp inside the chart and the credit line
 * still say it is sample data, and the chart's <title> carries the summary.
 *
 * The figure is drawn here rather than through RevenueFigure for those
 * differences; its series, scale, readout and table are RevenueFigure's
 * (Overview.tsx) and have to change with it.
 * Static: no tabs, crosshair or read-mode notes. A client component for the
 * same reason as SamplePlate: as server output its SVG was sent twice, as
 * HTML and again in the React payload. It still renders into the server
 * HTML; only `ctx` (plain data) crosses over.
 */
export function TeaserPlate({ ctx: base }: { ctx: TeaserCtx }) {
  // The KPI strip and the figure read View 1 only, so the views left out of
  // TeaserCtx are never touched. No read-mode figures on this plate.
  const plate: DashCtx["plate"] = { numbers: {}, figures: [] };
  const ctx = { ...base, plate } as DashCtx;
  const v = ctx.t.views.overview;
  const f = v.figures.revenue;
  const id = `${ctx.idp}-revenue`;
  const months = monthLabels(ctx, REVENUE_START_MONTH, REVENUE.length);
  const reads = REVENUE.map((val, i) =>
    fill(f.readout, { month: months[i], value: val.toFixed(2), pct: Math.round((val / REVENUE_TARGET) * 100) }),
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <p className="t-data text-muted">
          {v.entity} · {v.period} · TZS
        </p>
        <p className="t-eyebrow hidden border-b border-rule-strong pb-1.5 sm:block">{ctx.t.stamp}</p>
      </div>
      <div className="mt-2 hidden sm:block">
        <KpiStrip ctx={ctx} items={overviewKpis(ctx)} />
      </div>
      <figure className={cn(dashStyles.fig, "min-w-0 pt-5 sm:pt-6")} aria-labelledby={`${id}-h`}>
        <figcaption>
          <p className="t-eyebrow">{figLabel(ctx, f.number)}</p>
          <FigureTitle ctx={ctx} id={`${id}-h`} className="mt-2">
            {f.title}
          </FigureTitle>
          <p className="t-small mt-2 hidden max-w-[60ch] font-normal text-muted sm:block">{f.summary}</p>
        </figcaption>
        <p id={`${id}-readout`} className="t-data mt-3 min-h-[1.4em] text-muted">
          {reads[reads.length - 1]}
        </p>
        <div className="mt-4">
          <LineArea
            ctx={ctx}
            id={id}
            label={f.title}
            summary={f.summary}
            readoutId={`${id}-readout`}
            values={REVENUE}
            xLabels={months}
            max={2.5}
            step={0.5}
            tickDecimals={1}
            unit={f.axis}
            area
            seriesLabel={f.seriesActual}
            reference={{ value: REVENUE_TARGET, label: f.seriesTarget }}
            reads={reads}
            marks={[]}
            height={CHART_H}
          />
        </div>
        <p className="t-data mt-4">{fill(ctx.t.credit, { period: v.creditPeriod })}</p>
        <div className="hidden sm:block">
          <DataTable
            ctx={ctx}
            caption={f.title}
            spec={{
              head: [ctx.t.table.month, `${f.seriesActual} (${f.axis})`, `${f.seriesTarget} (${f.axis})`],
              rows: REVENUE.map((val, i) => [months[i], val.toFixed(2), REVENUE_TARGET.toFixed(2)]),
              numeric: [false, true, true],
            }}
          />
        </div>
      </figure>
      <p className="t-small mt-5 hidden max-w-[64ch] font-normal text-muted sm:block">{ctx.t.footnote}</p>
    </div>
  );
}
