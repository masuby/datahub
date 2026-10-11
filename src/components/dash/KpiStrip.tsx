import type { Status } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import type { DashCtx } from "./context";
import { StatusMark } from "./Figure";
import styles from "./dash.module.css";

export type Kpi = {
  label: string;
  /** The final, localised display string ("TZS 18.4 bn", "6 of 10"). */
  value: string;
  context: string;
  status?: Status | null;
};

/**
 * Four KPIs divided by vertical hairlines that stop 8px short of the strip's
 * top and bottom; no outer verticals. Phones: 2×2 with one hairline cross.
 * Each context line carries its status as glyph + word + colour. Values are
 * the final, localised text as the server wrote it; nothing counts up.
 */
export function KpiStrip({ ctx, items, className }: { ctx: DashCtx; items: Kpi[]; className?: string }) {
  // One size per strip, chosen by its longest value, so "TZS bilioni 18.4"
  // fits a quarter of the plate without the four values changing size.
  const longest = Math.max(...items.map((k) => k.value.length));
  const size =
    longest > 13
      ? "text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)]"
      : longest > 10
        ? "text-[clamp(1.5rem,1.2rem+1.1vw,2.125rem)]"
        : undefined;
  return (
    <dl className={cn(styles.kpis, className)}>
      {items.map((k) => (
        <div key={k.label} className={styles.kpi}>
          <dt className="t-eyebrow">{k.label}</dt>
          <dd className={cn("t-kpi mt-3 text-fg", size)}>{k.value}</dd>
          <dd className="t-data mt-3">
            {k.status && (
              <>
                <StatusMark ctx={ctx} status={k.status} />
                <span aria-hidden="true"> · </span>
              </>
            )}
            <span className="text-muted">{k.context}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
