import { fill } from "@/i18n/fill";
import { formatPercent, formatTZS } from "@/lib/format";
import {
  AGEING,
  DISBURSED,
  FLOWS_START_MONTH,
  KPI_STATUS,
  LOANS,
  MIX,
  OFFICERS,
  PAR30,
  PAR30_LIMIT,
  PAR30_START_MONTH,
  REPAID,
  officerSeries,
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { marksFor, notesFor, type DashCtx } from "../context";
import { Cell, Figure, PlateRow, StatusMark } from "../Figure";
import type { Kpi } from "../KpiStrip";
import { Plate, monthAnchor, monthLabels } from "../Plate";
import { ReadMarker, ReadNotes } from "../ReadMarker";
import { LineArea } from "../kit/LineArea";
import { PairedBars } from "../kit/PairedBars";
import { Sparkline } from "../kit/Sparkline";
import { StackBar100 } from "../kit/StackBar100";
import styles from "../dash.module.css";

/** View 2 · Loan portfolio — Sample lender, as at 30 Sep 2026. */

/** Read-mode anchors for the ageing buckets are the English bucket names. */
const AGEING_KEYS = ["Current", "1–30 days", "31–60 days", "61–90 days", "90+ days"];
const RAMP = ["var(--ramp-1)", "var(--ramp-2)", "var(--ramp-3)", "var(--ramp-4)", "var(--ramp-5)"];

export function loansKpis(ctx: DashCtx): Kpi[] {
  const k = ctx.t.views.loans.kpis;
  const s = KPI_STATUS.loans;
  return [
    { label: k[0].label, value: formatTZS(LOANS.portfolio, ctx.lang), context: k[0].context, status: s[0] },
    { label: k[1].label, value: formatPercent(LOANS.par30), context: k[1].context, status: s[1] },
    { label: k[2].label, value: formatPercent(LOANS.npl), context: k[2].context, status: s[2] },
    { label: k[3].label, value: formatTZS(LOANS.disbursedSep, ctx.lang), context: k[3].context, status: s[3] },
  ];
}

function ParFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.loans;
  const f = v.figures.par;
  const id = `${ctx.idp}-par`;
  const months = monthLabels(ctx, PAR30_START_MONTH, PAR30.length);
  const reads = PAR30.map((val, i) => fill(f.readout, { month: months[i], value: val.toFixed(1) }));
  const notes = notesFor(ctx, "loans", "par");
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
        head: [ctx.t.table.month, `PAR30 (${f.axis})`],
        rows: PAR30.map((val, i) => [months[i], formatPercent(val)]),
        numeric: [false, true],
      }}
    >
      <LineArea
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        values={PAR30}
        xLabels={months}
        max={6}
        step={1}
        tickDecimals={0}
        unit="%"
        seriesLabel="PAR30"
        reference={{ value: PAR30_LIMIT, label: f.limit }}
        breachAbove
        reads={reads}
        marks={marksFor(notes, monthAnchor(PAR30_START_MONTH, PAR30.length))}
      />
    </Figure>
  );
}

function AgeingFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.loans;
  const f = v.figures.ageing;
  const id = `${ctx.idp}-ageing`;
  const segments = AGEING.map((val, i) => ({ name: f.buckets[i], value: formatPercent(val), share: val }));
  const reads = segments.map((s) => `${s.name} · ${s.value}`);
  const notes = notesFor(ctx, "loans", "ageing");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={reads[0]}
      notes={notes}
      table={{
        head: [ctx.x.columns.bucket, ctx.x.columns.share],
        rows: segments.map((s) => [s.name, s.value]),
        numeric: [false, true],
      }}
    >
      <StackBar100
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        segments={segments}
        ramp={RAMP}
        reads={reads}
        marks={marksFor(notes, (a) => AGEING_KEYS.indexOf(a))}
      />
    </Figure>
  );
}

function MixFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.loans;
  const f = v.figures.mix;
  const id = `${ctx.idp}-mix`;
  const total = MIX.reduce((a, b) => a + b, 0);
  const segments = MIX.map((val, i) => ({
    name: f.products[i],
    value: formatTZS(val * 1e9, ctx.lang),
    share: (val / total) * 100,
  }));
  const reads = segments.map((s) => `${s.name} · ${s.value} · ${formatPercent(s.share)}`);
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={reads[0]}
      table={{
        head: [ctx.x.columns.product, ctx.x.columns.amount, ctx.x.columns.share],
        rows: MIX.map((val, i) => [f.products[i], val.toFixed(1), formatPercent((val / total) * 100)]),
        numeric: [false, true, true],
      }}
    >
      <StackBar100
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        segments={segments}
        ramp={RAMP.slice(1).reverse()}
        reads={reads}
        marks={[]}
      />
    </Figure>
  );
}

function FlowsFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.loans;
  const f = v.figures.flows;
  const id = `${ctx.idp}-flows`;
  const months = monthLabels(ctx, FLOWS_START_MONTH, DISBURSED.length);
  const reads = DISBURSED.map((d, i) =>
    fill(f.readout, { month: months[i], a: d.toFixed(1), b: REPAID[i].toFixed(1) }),
  );
  const notes = notesFor(ctx, "loans", "flows");
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
        head: [ctx.t.table.month, `${f.seriesDisbursed} (${f.axis})`, `${f.seriesRepaid} (${f.axis})`],
        rows: DISBURSED.map((d, i) => [months[i], d.toFixed(1), REPAID[i].toFixed(1)]),
        numeric: [false, true, true],
      }}
    >
      <PairedBars
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        a={DISBURSED}
        b={REPAID}
        names={[f.seriesDisbursed, f.seriesRepaid]}
        xLabels={months}
        max={6}
        step={2}
        unit={f.axis}
        reads={reads}
        marks={marksFor(notes, monthAnchor(FLOWS_START_MONTH, DISBURSED.length))}
      />
    </Figure>
  );
}

/** Officer table: booktabs, codes only, a 12-month sparkline per row; breaches tinted. */
function OfficersFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.loans;
  const o = v.officers;
  const notes = notesFor(ctx, "loans", "officers");
  const id = `${ctx.idp}-officers`;
  return (
    <figure className={cn(styles.fig, "min-w-0")} aria-labelledby={`${id}-h`}>
      <figcaption>
        <h3 id={`${id}-h`} className="t-title text-fg">
          {o.title}
        </h3>
        <p className="t-small mt-2 font-normal text-muted">{o.caption}</p>
      </figcaption>
      <div className={cn(styles.figBody, "mt-4")}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="sr-only">{o.title}</caption>
            <thead>
              <tr>
                <th scope="col">{o.columns.code}</th>
                <th scope="col">{o.columns.branch}</th>
                <th scope="col" className={styles.num}>
                  {o.columns.portfolio}
                </th>
                <th scope="col" className={styles.num}>
                  {o.columns.par}
                </th>
                <th scope="col" className={styles.num}>
                  {o.columns.trend}
                </th>
              </tr>
            </thead>
            <tbody>
              {OFFICERS.map((row, n) => {
                const breach = row.par > PAR30_LIMIT;
                const note = notes.find((x) => x.anchor === row.code);
                return (
                  <tr key={row.code} className={breach ? styles.breachRow : undefined}>
                    <th scope="row" className="font-normal text-fg">
                      <span className="inline-flex items-center gap-3">
                        {row.code}
                        {note && <ReadMarker ctx={ctx} n={note.n} noteId={note.noteId} inline />}
                      </span>
                    </th>
                    <td>{row.branch}</td>
                    <td className={styles.num}>{formatTZS(row.portfolio, ctx.lang, { decimals: 2 })}</td>
                    <td className={cn(styles.num, breach && "text-error")}>
                      {formatPercent(row.par)}
                      {breach && (
                        <>
                          <span aria-hidden="true"> · </span>
                          <StatusMark ctx={ctx} status="breach" />
                        </>
                      )}
                    </td>
                    <td className={styles.num}>
                      <Sparkline
                        values={officerSeries(n)}
                        tone={breach ? "var(--error)" : "var(--s1)"}
                        className="ml-auto inline-block align-middle"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <ReadNotes ctx={ctx} notes={notes} />
      </div>
      <p className="t-data mt-4">{fill(ctx.t.credit, { period: v.creditPeriod })}</p>
    </figure>
  );
}

export function Loans({ ctx }: { ctx: DashCtx }) {
  return (
    <Plate
      ctx={ctx}
      view="loans"
      kpis={loansKpis(ctx)}
      rows={[
        <PlateRow key="a">
          <Cell span={7}>
            <ParFigure ctx={ctx} />
          </Cell>
          <Cell span={5}>
            <AgeingFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="b">
          <Cell span={7}>
            <MixFigure ctx={ctx} />
          </Cell>
          <Cell span={5}>
            <FlowsFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="c">
          <Cell>
            <OfficersFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
      ]}
    />
  );
}
