"use client";

import { Cell, PlateRow } from "./Figure";
import { Plate } from "./Plate";
import type { DashCtx } from "./context";
import { BranchesFigure, ChangedBlock, RevenueFigure, overviewKpis } from "./views/Overview";
import { AgentLog, RunsFigure, ScheduleFigure, operationsKpis } from "./views/Operations";

export type SampleService = "dashboards" | "automation" | "ai-agents";

/**
 * The plate inside a service page's sample band (see SampleBand). A client
 * component on purpose: as server output its SVG was sent twice, as HTML and
 * again in the React payload. It still renders into the server HTML; only
 * `ctx` (plain data) crosses over.
 *
 *   dashboards  View 1 KPI strip + the revenue and branches figures
 *   automation  View 4 KPI strip + the schedule and runs figures
 *   ai-agents   "What changed this week" (View 1) + the agent log (View 4)
 *
 * Figures carry no numbers (owner, 2 Nov 2026); the read-mode notes count
 * from 1 on the plate.
 */
export function SamplePlate({ ctx: base, service }: { ctx: DashCtx; service: SampleService }) {
  // The read-mode figure ids on this plate, in order.
  const figures =
    service === "dashboards" ? ["revenue", "branches"] : service === "automation" ? ["schedule", "runs"] : ["log"];
  const ctx: DashCtx = { ...base, plate: { figures } };

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
