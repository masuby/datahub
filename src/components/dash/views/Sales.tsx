import { fill } from "@/i18n/fill";
import { formatNumber, formatPercent, formatTZS } from "@/lib/format";
import { KPI_STATUS, REGIONS, SALES, growthStep, regionShare } from "@/lib/sample-data";
import type { TzTerritory } from "@/lib/tz-dots";
import { marksFor, notesFor, type DashCtx } from "../context";
import { Cell, Figure, PlateRow } from "../Figure";
import type { Kpi } from "../KpiStrip";
import { Plate } from "../Plate";
import { DotMap, type MapHub } from "../kit/DotMap";
import { RankedBars } from "../kit/RankedBars";
import styles from "../dash.module.css";

/** View 3 · Sales by region — Sample distributor, Q3 2026 (Jul–Sep). */

const MAX_RING = 28;

export function salesKpis(ctx: DashCtx): Kpi[] {
  const k = ctx.t.views.sales.kpis;
  const s = KPI_STATUS.sales;
  return [
    { label: k[0].label, value: formatTZS(SALES.total, ctx.lang, { decimals: 2 }), context: k[0].context, status: s[0] },
    { label: k[1].label, value: formatNumber(SALES.activeOutlets), context: k[1].context, status: s[1] },
    { label: k[2].label, value: formatTZS(SALES.averageOrder, ctx.lang), context: k[2].context, status: s[2] },
    { label: k[3].label, value: "value" in k[3] ? k[3].value : "", context: k[3].context, status: s[3] },
  ];
}

/** Region rows with their localised name and readout sentence. */
function regionRows(ctx: DashCtx) {
  const f = ctx.t.views.sales.figures.ranked;
  return REGIONS.map((r) => {
    const name = r.key === "other" ? f.other : r.name;
    const share = regionShare(r.sales);
    return {
      ...r,
      name,
      shareText: formatPercent(share),
      read: fill(f.readout, {
        region: name,
        value: r.sales.toFixed(2),
        share: share.toFixed(1),
        growth: `${r.yoy >= 0 ? "+" : "−"}${Math.abs(r.yoy)}`,
      }),
    };
  });
}

function MapFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.sales;
  const f = v.figures.map;
  const id = `${ctx.idp}-map`;
  const rows = regionRows(ctx).filter((r) => r.hub);
  const maxSales = Math.max(...rows.map((r) => r.sales));
  const hubs: MapHub[] = rows.map((r) => ({
    key: r.key as TzTerritory,
    lat: r.hub!.lat,
    lon: r.hub!.lon,
    r: MAX_RING * Math.sqrt(r.sales / maxSales),
    tone: `var(--ramp-${growthStep(r.yoy)})`,
  }));
  const notes = notesFor(ctx, "sales", "map");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={rows[0].read}
      notes={notes}
      table={{
        head: [ctx.x.columns.region, f.legendTitle],
        rows: rows.map((r) => [r.name, `+${r.yoy}%`]),
        numeric: [false, true],
      }}
    >
      <DotMap
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        hubs={hubs}
        reads={rows.map((r) => r.read)}
        marks={marksFor(notes, (a) => rows.findIndex((r) => r.name === a))}
      />
      <div className="mt-5">
        <p className="t-data">{f.legendTitle}</p>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {f.legend.map((l, i) => (
            <li key={l} className="t-data flex items-center gap-2 text-muted">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-3"
                style={{ background: `var(--ramp-${i + 1})` }}
              />
              {l}
            </li>
          ))}
        </ul>
        <p className="t-data mt-2">
          <svg aria-hidden="true" width={12} height={12} className="mr-2 inline-block align-[-2px]">
            <circle cx={6} cy={6} r={5} fill="none" strokeWidth={1.5} style={{ stroke: "var(--fg)" }} />
          </svg>
          {f.ringNote}
        </p>
      </div>
    </Figure>
  );
}

function RankedFigure({ ctx }: { ctx: DashCtx }) {
  const v = ctx.t.views.sales;
  const f = v.figures.ranked;
  const id = `${ctx.idp}-ranked`;
  const rows = regionRows(ctx);
  const notes = notesFor(ctx, "sales", "ranked");
  return (
    <Figure
      ctx={ctx}
      id={id}
      number={f.number}
      title={f.title}
      summary={f.summary}
      creditPeriod={v.creditPeriod}
      readout={rows[0].read}
      notes={notes}
      table={{
        head: [f.columns.region, `${f.columns.sales} (${ctx.x.columns.amount})`, f.columns.share, f.columns.growth],
        rows: rows.map((r) => [r.name, r.sales.toFixed(2), r.shareText, `+${r.yoy}%`]),
        numeric: [false, true, true, true],
      }}
    >
      <RankedBars
        ctx={ctx}
        id={id}
        label={f.title}
        summary={f.summary}
        readoutId={`${id}-readout`}
        rows={rows.map((r) => ({
          key: r.key,
          name: r.name,
          value: r.sales,
          valueText: r.sales.toFixed(2),
          share: r.shareText,
          growth: r.yoy,
        }))}
        columns={{ ...f.columns, sales: `${f.columns.sales} · ${ctx.x.columns.amount}` }}
        reads={rows.map((r) => r.read)}
        marks={marksFor(notes, (a) => REGIONS.findIndex((r) => r.name === a))}
      />
    </Figure>
  );
}

export function Sales({ ctx }: { ctx: DashCtx }) {
  return (
    <Plate
      ctx={ctx}
      view="sales"
      kpis={salesKpis(ctx)}
      rows={[
        <PlateRow key="a" className={styles.link} link>
          <Cell span={7}>
            <MapFigure ctx={ctx} />
          </Cell>
          <Cell span={5}>
            <RankedFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
      ]}
    />
  );
}
