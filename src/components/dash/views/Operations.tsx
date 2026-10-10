import { fill } from "@/i18n/fill";
import { formatHours, formatNumber, formatSeconds } from "@/lib/format";
import {
  KPI_STATUS,
  OPERATIONS,
  PACK,
  RUNS,
  SCHEDULE,
  SCHEDULE_FROM_HOUR,
  SCHEDULE_TO_HOUR,
  SLOW_RUN_INDEX,
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import { marksFor, notesFor, type DashCtx } from "../context";
import { Cell, Figure, FigureTitle, PlateRow, StatusMark } from "../Figure";
import type { Kpi } from "../KpiStrip";
import { Plate } from "../Plate";
import { ReadMarker, ReadNotes } from "../ReadMarker";
import { Bars } from "../kit/Bars";
import { Slope } from "../kit/Slope";
import { Swimlane } from "../kit/Swimlane";
import styles from "../dash.module.css";

/** View 4 · Automation & operations — Sample lender's reporting system, September 2026. */

export function operationsKpis(ctx: DashCtx): Kpi[] {
  const k = ctx.t.views.operations.kpis;
  const s = KPI_STATUS.operations;
  return [
    { label: k[0].label, value: formatNumber(OPERATIONS.reportsDelivered), context: k[0].context, status: s[0] },
    { label: k[1].label, value: formatSeconds(OPERATIONS.medianSeconds, ctx.lang), context: k[1].context, status: s[1] },
    { label: k[2].label, value: formatHours(OPERATIONS.hoursReturned, ctx.lang), context: k[2].context, status: s[2] },
    { label: k[3].label, value: formatNumber(OPERATIONS.failedRuns), context: k[3].context, status: s[3] },
  ];
}

export function ScheduleFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.operations;
  const f = v.figures.schedule;
  const id = `${ctx.idp}-schedule`;
  const items = SCHEDULE.map((s) => ({
    time: s.time,
    lane: s.lane,
    label: s.item === "agentDraft" ? ctx.x.schedule.agentDraft : f.items[s.item],
  }));
  const strip = (l: string) => l.replace(/^\d{1,2}:\d{2}\s+/, "");
  const alert = SCHEDULE.findIndex((s) => s.lane === 1);
  const agent = SCHEDULE.findIndex((s) => s.lane === 2);
  const notes = notesFor(ctx, "operations", "schedule");
  const byTime = [...items].sort((a, b) => a.time.localeCompare(b.time));
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      notes={notes}
      table={{
        head: [ctx.x.columns.time, ctx.x.columns.lane, ctx.x.columns.job],
        rows: byTime.map((it) => [it.time, f.lanes[it.lane], strip(it.label)]),
        numeric: [false, false, false],
      }}
    >
      <Swimlane
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        lanes={f.lanes}
        items={items}
        fromHour={SCHEDULE_FROM_HOUR}
        toHour={SCHEDULE_TO_HOUR}
        axisTitle={f.timeAxis}
        links={alert >= 0 && agent >= 0 ? [[alert, agent]] : []}
        marks={marksFor(notes, (a) => SCHEDULE.findIndex((s) => s.time === a))}
      />
    </Figure>
  );
}

export function RunsFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.operations;
  const f = v.figures.runs;
  const id = `${ctx.idp}-runs`;
  const reads = RUNS.map((s, i) => fill(f.readout, { n: i + 1, value: s }));
  const notes = notesFor(ctx, "operations", "runs");
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
        head: [ctx.x.columns.run, ctx.x.columns.seconds],
        rows: RUNS.map((s, i) => [String(i + 1), i === SLOW_RUN_INDEX ? `${s} △ ${f.slowLabel}` : String(s)]),
        numeric: [false, true],
      }}
    >
      <Bars
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        values={RUNS}
        xLabels={RUNS.map((_, i) => String(i + 1))}
        max={80}
        step={20}
        unit={f.axis}
        flagIndex={SLOW_RUN_INDEX}
        flagLabel={f.slowLabel}
        reference={{
          value: OPERATIONS.medianSeconds,
          label: fill(ctx.x.runs.median, { value: formatSeconds(OPERATIONS.medianSeconds, ctx.lang) }),
        }}
        reads={reads}
        marks={marksFor(notes, (a) => Number(a) - 1)}
      />
    </Figure>
  );
}

export function PackFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.operations;
  const f = v.figures.pack;
  const id = `${ctx.idp}-pack`;
  const notes = notesFor(ctx, "operations", "pack");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      notes={notes}
      table={{
        head: [ctx.x.columns.method, ctx.x.columns.duration],
        rows: [
          [f.before, f.beforeValue],
          [f.after, f.afterValue],
        ],
        numeric: [false, true],
      }}
    >
      <Slope
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        before={{ label: f.before, value: PACK.beforeMinutes, display: f.beforeValue }}
        after={{ label: f.after, value: PACK.afterMinutes, display: f.afterValue }}
        marks={marksFor(notes, (a) => (a === "before" ? 0 : a === "after" ? 1 : -1))}
      />
    </Figure>
  );
}

/** The agent's log: time, what it did, and whether a person has approved it. */
export function AgentLog({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.operations;
  const log = v.log;
  const notes = notesFor(ctx, "operations", "log");
  const id = `${ctx.idp}-log`;
  return (
    <figure className={cn(styles.fig, "min-w-0")} aria-labelledby={`${id}-h`}>
      <figcaption>
        <FigureTitle ctx={ctx} id={`${id}-h`}>
          {log.title}
        </FigureTitle>
        <p className="t-small mt-2 font-normal text-muted">{log.caption}</p>
      </figcaption>
      <div className={cn(styles.figBody, "mt-4")}>
        <ol className="min-w-0">
          {log.items.map((item) => {
            const status = item.status as "sent" | "awaiting" | "queued";
            const note = notes.find((n) => n.anchor === item.time);
            return (
              <li
                key={item.time}
                className={cn(
                  styles.listRow,
                  status === "awaiting" && styles.awaitRow,
                  "grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-3.5 pl-4 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-baseline",
                )}
              >
                <span className="t-mono text-subtle">{item.time}</span>
                <span className="t-small font-normal text-fg">
                  {item.text}
                  {note && (
                    <span className="ml-3 inline-flex align-middle">
                      <ReadMarker ctx={ctx} n={note.n} noteId={note.noteId} inline />
                    </span>
                  )}
                </span>
                <StatusMark ctx={ctx} status={status} className="t-data col-start-2 sm:col-start-3" />
              </li>
            );
          })}
        </ol>
        <ReadNotes ctx={ctx} notes={notes} />
      </div>
      <p className="t-data mt-4">{fill(ctx.t.credit, { period: v.creditPeriod })}</p>
    </figure>
  );
}

export function Operations({ ctx }: { ctx: DashCtx }) {
  return (
    <Plate
      ctx={ctx}
      view="operations"
      kpis={operationsKpis(ctx)}
      rows={[
        <PlateRow key="a">
          <Cell>
            <ScheduleFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="b">
          <Cell span={6}>
            <RunsFigure ctx={ctx} />
          </Cell>
          <Cell span={6}>
            <PackFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="c">
          <Cell>
            <AgentLog ctx={ctx} />
          </Cell>
        </PlateRow>,
      ]}
    />
  );
}
