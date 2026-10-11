// SAMPLE DATA — invented for illustration. Not client data.
//
// Every number in the service pages' sample figures (spec §8.3) lives here,
// once: views 1 and 4 of the sample dashboards, the two the sample bands
// draw from (the loans and sales views went with the /dashboards page,
// iteration-5 §I). Totals and headline KPIs are derived from the detail
// rows wherever the spec lets them be, so the consistency checks hold by
// construction:
//   - view 1 Mbeya / Dodoma PAR30 breaches = the agent log entries (copy deck)
//   - view 4 median of the 14 runs = 38 s
// `sampleChecks()` recomputes each one; it is cheap and side-effect free.
//
// No organisation names, no person names: branches are real places
// (geography, not clients).

export type Status = "onTarget" | "watch" | "breach" | "done";

const round = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;
const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);

/* ── View 1 · Executive overview (Sample lender, Jan–Sep 2026) ───────── */

/** Monthly revenue, TZS bn, Jan..Sep 2026 (month index 0..8). */
export const REVENUE = [1.86, 1.92, 2.08, 1.98, 2.11, 2.16, 2.02, 1.97, 2.3] as const;
/** Monthly target, TZS bn. */
export const REVENUE_TARGET = 2.18;
/** First month of the series (0-based: January). */
export const REVENUE_START_MONTH = 0;

export const OVERVIEW = {
  revenueYtd: round(sum(REVENUE), 2) * 1e9, // 18.40 bn
  revenueTargetYtd: round(REVENUE_TARGET * REVENUE.length, 2) * 1e9, // 19.62 bn
  collectionEfficiency: 96.8,
  collectionTarget: 95.0,
  activeBorrowers: 48210,
  borrowersGrowth: 6.1,
  costToIncome: 58.3,
  costCeiling: 60.0,
} as const;

/** % of revenue target by branch, sorted high to low. Below 90 is "watch". */
export const BRANCHES = [
  { name: "Kariakoo", pct: 104 },
  { name: "Mlimani City", pct: 99 },
  { name: "Arusha CBD", pct: 97 },
  { name: "Mwanza", pct: 95 },
  { name: "Moshi", pct: 93 },
  { name: "Zanzibar Stone Town", pct: 91 },
  { name: "Dodoma", pct: 88 },
  { name: "Mbeya", pct: 84 },
] as const;
export const BRANCH_WATCH_BELOW = 90;

export const KPI_STATUS = {
  overview: ["watch", "onTarget", "onTarget", "onTarget"],
  operations: [null, null, null, "done"],
} as const satisfies Record<string, readonly (Status | null)[]>;

/* ── View 4 · Automation & operations (September 2026, a sample Monday) ─ */

/** Generation time of the last 14 runs, seconds. Run 7 (index 6) is the slow one. */
export const RUNS = [36, 41, 38, 35, 39, 37, 61, 38, 36, 40, 37, 39, 38, 36] as const;
export const SLOW_RUN_INDEX = 6;

function median(xs: readonly number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const OPERATIONS = {
  reportsDelivered: 1284,
  medianSeconds: median(RUNS), // 38
  hoursReturned: 212,
  failedRuns: 2,
} as const;

/**
 * Monday schedule (EAT). `item` indexes the dictionary's schedule items; the
 * extra row at 07:02 is the agent's follow-up draft (agent log entry 3).
 * lane: 0 Reports, 1 Alerts, 2 Agent.
 */
export const SCHEDULE: readonly { time: string; lane: 0 | 1 | 2; item: number | "agentDraft" }[] = [
  { time: "05:30", lane: 0, item: 0 },
  { time: "05:58", lane: 0, item: 1 },
  { time: "12:00", lane: 0, item: 3 },
  { time: "18:30", lane: 0, item: 4 },
  { time: "07:00", lane: 1, item: 2 },
  { time: "07:02", lane: 2, item: "agentDraft" },
];
export const SCHEDULE_FROM_HOUR = 5;
export const SCHEDULE_TO_HOUR = 20;

/* ── Consistency ──────────────────────────────────────────────────────── */

export function sampleChecks(): Record<string, boolean> {
  return {
    revenueYtd: round(sum(REVENUE), 2) === 18.4,
    medianRun: OPERATIONS.medianSeconds === 38,
  };
}
