import type { Status } from "@/lib/sample-data";
import { cn } from "@/lib/utils";
import type { DashCtx } from "./context";
import { StatusMark } from "./Figure";
import { KpiValue } from "./KpiValue";
import styles from "./dash.module.css";

export type Kpi = {
  label: string;
  /** The final, localised display string ("TZS 18.4 bn", "6 of 10"). */
  value: string;
  context: string;
  status?: Status | null;
};

/** Splits "TZS bilioni 18.4" into the text around the first number and the number. */
function splitNumber(s: string) {
  const m = /\d[\d,]*(?:\.(\d+))?/.exec(s);
  if (!m) return null;
  return {
    before: s.slice(0, m.index),
    value: Number(m[0].replace(/,/g, "")),
    decimals: m[1]?.length ?? 0,
    after: s.slice(m.index + m[0].length),
  };
}

/**
 * Four KPIs divided by vertical hairlines that stop 8px short of the strip's
 * top and bottom; no outer verticals. Phones: 2×2 with one hairline cross.
 * Each context line carries its status as glyph + word + colour.
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
      {items.map((k) => {
        const parts = ctx.live ? splitNumber(k.value) : null;
        return (
          <div key={k.label} className={styles.kpi}>
            <dt className="t-eyebrow">{k.label}</dt>
            <dd className={cn("t-kpi mt-3 text-fg", size)}>
              {parts && /^\d/.test(k.value.slice(parts.before.length)) && !/\d/.test(parts.after) ? (
                <KpiValue {...parts} />
              ) : (
                k.value
              )}
            </dd>
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
        );
      })}
    </dl>
  );
}
