import { fill } from "@/i18n/fill";
import { formatNumber, formatPercent, formatTZS } from "@/lib/format";
import {
  BRANCHES,
  BRANCH_WATCH_BELOW,
  EXCEPTION_STATUS,
  KPI_STATUS,
  OVERVIEW,
  REVENUE,
  REVENUE_START_MONTH,
  REVENUE_TARGET,
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { marksFor, notesFor, type DashCtx } from "../context";
import { Cell, Figure, PlateRow, StatusMark } from "../Figure";
import type { Kpi } from "../KpiStrip";
import { Plate, monthAnchor, monthLabels } from "../Plate";
import { ReadMarker } from "../ReadMarker";
import { Bullet } from "../kit/Bullet";
import { LineArea } from "../kit/LineArea";
import styles from "../dash.module.css";

/** View 1 · Executive overview — Sample lender, Jan–Sep 2026. */

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
  const reads = REVENUE.map((val, i) =>
    fill(f.readout, { month: months[i], value: val.toFixed(2), pct: Math.round((val / REVENUE_TARGET) * 100) }),
  );
  const notes = notesFor(ctx, "overview", "revenue");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={reads[reads.length - 1]}
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
  const reads = BRANCHES.map((b) => fill(f.readout, { branch: b.name, pct: b.pct }));
  const notes = notesFor(ctx, "overview", "branches");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={reads[reads.length - 1]}
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
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        rows={BRANCHES.map((b) => ({ name: b.name, value: b.pct }))}
        watchBelow={BRANCH_WATCH_BELOW}
        targetLabel={v.figures.revenue.seriesTarget}
        reads={reads}
        marks={marksFor(notes, (a) => BRANCHES.findIndex((b) => b.name === a))}
      />
    </Figure>
  );
}

export function ExceptionsFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.overview;
  const f = v.figures.exceptions;
  const notes = notesFor(ctx, "overview", "exceptions");
  return (
    <Figure
      ctx={ctx}
      id={`${ctx.idp}-exceptions`}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      notes={notes}
    >
      <ul>
        {f.items.map((item, i) => {
          const note = notes.find((n) => Number(n.anchor) === i);
          return (
            <li key={i} className={cn(styles.listRow, "flex flex-wrap items-start gap-x-3 gap-y-1 py-3.5 sm:flex-nowrap")}>
              <StatusMark ctx={ctx} status={EXCEPTION_STATUS[i]} className="t-data w-full shrink-0 pt-0.5 sm:w-[8.5rem]" />
              <span className="t-small min-w-0 flex-1 font-normal text-fg">{item}</span>
              {note && <ReadMarker ctx={ctx} n={note.n} noteId={note.noteId} inline />}
            </li>
          );
        })}
      </ul>
    </Figure>
  );
}

/** "What changed this week": three lines written by the reporting agent (sample). */
export function ChangedBlock({ ctx }: { ctx: DashCtx }) {
  const c = ctx.t.views.overview.changed;
  return (
    <section aria-labelledby={`${ctx.idp}-changed`} className="grid gap-x-[var(--col-gap)] gap-y-4 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h3 id={`${ctx.idp}-changed`} className="t-title text-fg">
          {c.label}
        </h3>
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

export function Overview({ ctx }: { ctx: DashCtx }) {
  return (
    <Plate
      ctx={ctx}
      view="overview"
      kpis={overviewKpis(ctx)}
      rows={[
        <PlateRow key="a">
          <Cell>
            <RevenueFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="b">
          <Cell span={7}>
            <BranchesFigure ctx={ctx} />
          </Cell>
          <Cell span={5}>
            <ExceptionsFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="c">
          <Cell>
            <ChangedBlock ctx={ctx} />
          </Cell>
        </PlateRow>,
      ]}
    />
  );
}
