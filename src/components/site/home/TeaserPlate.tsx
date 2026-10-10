"use client";

import { Cell, PlateRow } from "@/components/dash/Figure";
import { Plate } from "@/components/dash/Plate";
import type { DashCtx, DashT } from "@/components/dash/context";
import { RevenueFigure, overviewKpis } from "@/components/dash/views/Overview";

/**
 * What the teaser is given: the dashboards context with View 1's strings
 * only. Everything here is serialised into the home page's payload, and the
 * home page is the poster/QR landing on phones; the other three views'
 * tables and notes (most of dict.dash) would travel for nothing.
 */
export type TeaserCtx = Omit<DashCtx, "t"> & {
  t: Omit<DashT, "views"> & { views: Pick<DashT["views"], "overview"> };
};

/**
 * The home page's dashboard teaser: View 1's KPI strip and its revenue chart
 * (Fig. 02.1, the same number it has on /dashboards), on a plate with the
 * SAMPLE stamp, honesty footnote and credit line like every other plate.
 *
 * Static: no tabs, crosshair or read-mode notes (the plate lists no
 * read-mode figures, so the chart carries no markers either); the full,
 * explorable views are one link away. A client component for the same
 * reason as SamplePlate: as server output its SVG was sent twice, as HTML
 * and again in the React payload. It still renders into the server HTML;
 * only `ctx` (plain data) crosses over.
 */
export function TeaserPlate({ ctx: base }: { ctx: TeaserCtx }) {
  // The plate, the KPI strip and the revenue figure read View 1 only
  // (view="overview"), so the views left out of TeaserCtx are never touched.
  const plate: DashCtx["plate"] = { numbers: {}, figures: [] };
  const ctx = { ...base, plate } as DashCtx;
  return (
    <Plate
      ctx={ctx}
      view="overview"
      kpis={overviewKpis(ctx)}
      rows={[
        <PlateRow key="revenue">
          <Cell>
            <RevenueFigure ctx={ctx} />
          </Cell>
        </PlateRow>,
      ]}
    />
  );
}
