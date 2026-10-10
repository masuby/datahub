"use client";

import { Cell, PlateRow } from "./Figure";
import { Plate } from "./Plate";
import type { DashCtx } from "./context";
import { BranchesFigure, ChangedBlock, RevenueFigure, overviewKpis } from "./views/Overview";
import { AgentLog, RunsFigure, ScheduleFigure, operationsKpis } from "./views/Operations";

export type SampleService = "dashboards" | "automation" | "ai-agents";

/**
 * The plate inside a service page's sample band (see SampleBand). A client
 * component for the same reason as the dashboards views: as server output
 * its SVG was sent twice, as HTML and again in the React payload. It still
 * renders into the server HTML; only `ctx` (plain data) crosses over.
 *
 *   dashboards  View 1 KPI strip + Fig. 02.1 + Fig. 02.2
 *   automation  View 4 KPI strip + Fig. 02.10 + Fig. 02.11
 *   ai-agents   "What changed this week" (View 1) + the agent log (View 4)
 *
 * On the page they are renumbered within the band (Fig. 03.1, 03.2, notes
 * from 1), so they do not clash with the page's own 02.x items.
 */
export function SamplePlate({
  ctx: base,
  service,
  section,
}: {
  ctx: DashCtx;
  service: SampleService;
  /** The band's own section number ("03"): its figures read 03.1, 03.2. */
  section: string;
}) {
  const v = base.t.views;
  // [figure number in section 02, read-mode figure id] for each numbered
  // figure on this plate, in order. The agent log carries no number.
  const shown: [string | null, string][] =
    service === "dashboards"
      ? [
          [v.overview.figures.revenue.number, "revenue"],
          [v.overview.figures.branches.number, "branches"],
        ]
      : service === "automation"
        ? [
            [v.operations.figures.schedule.number, "schedule"],
            [v.operations.figures.runs.number, "runs"],
          ]
        : [[null, "log"]];
  const numbered = shown.flatMap(([n]) => (n ? [n] : []));
  const ctx: DashCtx = {
    ...base,
    plate: {
      numbers: Object.fromEntries(numbered.map((n, i) => [n, `${section}.${i + 1}`])),
      figures: shown.map(([, id]) => id),
    },
  };

  if (service === "dashboards") {
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
            <Cell span={8}>
              <BranchesFigure ctx={ctx} />
            </Cell>
          </PlateRow>,
        ]}
      />
    );
  }
  if (service === "automation") {
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
            <Cell span={8}>
              <RunsFigure ctx={ctx} />
            </Cell>
          </PlateRow>,
        ]}
      />
    );
  }
  return (
    <Plate
      ctx={ctx}
      view="operations"
      rows={[
        <PlateRow key="a">
          <Cell>
            <ChangedBlock ctx={ctx} />
          </Cell>
        </PlateRow>,
        <PlateRow key="b">
          <Cell>
            <AgentLog ctx={ctx} />
          </Cell>
        </PlateRow>,
      ]}
    />
  );
}
