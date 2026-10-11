import { fill } from "@/i18n/fill";
import { formatNumber, formatPercent, formatTZS } from "@/lib/format";
import {
  BRANCHES,
  BRANCH_WATCH_BELOW,
  KPI_STATUS,
  OVERVIEW,
  REVENUE,
  REVENUE_START_MONTH,
  REVENUE_TARGET,
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { marksFor, notesFor, type DashCtx } from "../context";
import { Figure, FigureTitle } from "../Figure";
import type { Kpi } from "../KpiStrip";
import { monthAnchor, monthLabels } from "../Plate";
import { Bullet } from "../kit/Bullet";
import { LineArea } from "../kit/LineArea";
import styles from "../dash.module.css";

/**
 * View 1 · Executive overview — Sample lender, Jan–Sep 2026. The parts the
 * service pages' sample bands show (SamplePlate): the KPIs and two figures
 * on the dashboards page, "What changed this week" on the AI agents page.
 */

export function overviewKpis(ctx: DashCtx): Kpi[] {
  const k = ctx.t.views.overview.kpis;
  const s = KPI_STATUS.overview;
  return [
    { label: k[0].label, value: formatTZS(OVERVIEW.revenueYtd, ctx.lang), context: k[0].context, status: s[0] },
    { label: k[1].label, value: formatPercent(OVERVIEW.collectionEfficiency), context: k[1].context, status: s[1] },
    { label: k[2].label, value: formatNumber(OVERVIEW.activeBorrowers), context: k[2].context, status: s[2] },
    { label: k[3].label, value: formatPercent(OVERVIEW.costToIncome), context: k[3].context, status: s[3] },
  ];
}

export function RevenueFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.overview;
  const f = v.figures.revenue;
  const id = `${ctx.idp}-revenue`;
  const months = monthLabels(ctx, REVENUE_START_MONTH, REVENUE.length);
  const last = REVENUE.length - 1;
  const notes = notesFor(ctx, "overview", "revenue");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={fill(f.readout, {
        month: months[last],
        value: REVENUE[last].toFixed(2),
        pct: Math.round((REVENUE[last] / REVENUE_TARGET) * 100),
      })}
      notes={notes}
      table={{
        head: [ctx.t.table.month, `${f.seriesActual} (${f.axis})`, `${f.seriesTarget} (${f.axis})`],
        rows: REVENUE.map((val, i) => [months[i], val.toFixed(2), REVENUE_TARGET.toFixed(2)]),
        numeric: [false, true, true],
      }}
    >
      <LineArea
        ctx={ctx}
        id={id}
        summary={f.summary}
        values={REVENUE}
        xLabels={months}
        max={2.5}
        step={0.5}
        tickDecimals={1}
        unit={f.axis}
        area
        seriesLabel={f.seriesActual}
        reference={{ value: REVENUE_TARGET, label: f.seriesTarget }}
        marks={marksFor(notes, monthAnchor(REVENUE_START_MONTH, REVENUE.length))}
        height={260}
      />
    </Figure>
  );
}

export function BranchesFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.overview;
  const f = v.figures.branches;
  const id = `${ctx.idp}-branches`;
  const lastBranch = BRANCHES[BRANCHES.length - 1];
  const notes = notesFor(ctx, "overview", "branches");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={fill(f.readout, { branch: lastBranch.name, pct: lastBranch.pct })}
      notes={notes}
      table={{
        head: [ctx.x.columns.branch, f.axis],
        rows: BRANCHES.map((b) => [b.name, `${b.pct}%`]),
        numeric: [false, true],
      }}
    >
      <Bullet
        ctx={ctx}
        id={id}
        summary={f.summary}
        rows={BRANCHES.map((b) => ({ name: b.name, value: b.pct }))}
        watchBelow={BRANCH_WATCH_BELOW}
        targetLabel={v.figures.revenue.seriesTarget}
        marks={marksFor(notes, (a) => BRANCHES.findIndex((b) => b.name === a))}
      />
    </Figure>
  );
}

/** "What changed this week": three lines written by the reporting agent (sample). */
export function ChangedBlock({ ctx }: { ctx: DashCtx }) {
  const c = ctx.t.views.overview.changed;
  return (
    <section aria-labelledby={`${ctx.idp}-changed`} className="grid gap-x-[var(--col-gap)] gap-y-4 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <FigureTitle id={`${ctx.idp}-changed`}>{c.label}</FigureTitle>
        <p className="t-small mt-2 font-normal text-subtle">{c.byline}</p>
      </div>
      <ul className="lg:col-span-8">
        {c.items.map((line, i) => (
          <li key={i} className={cn(styles.listRow, "t-body flex gap-3 py-3 text-fg")}>
            <span aria-hidden="true" className="text-subtle">
              —
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
