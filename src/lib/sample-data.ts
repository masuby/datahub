// SAMPLE DATA — invented for illustration. Not client data.
//
// Every number in the sample dashboards (spec §8.3) lives here, once. Totals
// and headline KPIs are derived from the detail rows wherever the spec lets
// them be, so the consistency checks hold by construction:
//   - view 1 Mbeya / Dodoma PAR30 breaches = the agent log entries (copy deck)
//   - view 2 PAR30 4.6% = the 31+ day ageing buckets; NPL 1.5% = the 90+ bucket
//   - view 2 product mix sums to the gross portfolio (64.2 bn)
//   - view 3 regions sum to Q3 sales (7.32 bn); value-weighted YoY = +11.3%
//   - view 4 median of the 14 runs = 38 s
// `sampleChecks()` recomputes each one; it is cheap and side-effect free.
//
// No organisation names, no person names: loan officers are codes, branches
// and regions are real places (geography, not clients).

import type { TzTerritory } from "./tz-dots";

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

/** Fig. 02.3 — statuses for the four exception lines (text in the dictionary). */
export const EXCEPTION_STATUS: readonly Status[] = ["breach", "breach", "watch", "done"];

export const KPI_STATUS = {
  overview: ["watch", "onTarget", "onTarget", "onTarget"],
  loans: [null, "onTarget", null, "watch"],
  sales: ["onTarget", null, null, null],
  operations: [null, null, null, "done"],
} as const satisfies Record<string, readonly (Status | null)[]>;

/* ── View 2 · Loan portfolio (as at 30 Sep 2026) ─────────────────────── */

/** PAR30 %, Oct 2025..Sep 2026 (first month index 9 = October). */
export const PAR30 = [3.8, 3.9, 4.1, 4.3, 4.4, 4.6, 4.9, 5.1, 5.3, 5.4, 5.0, 4.6] as const;
export const PAR30_START_MONTH = 9;
export const PAR30_LIMIT = 5.0;

/** Ageing buckets, % of portfolio: current, 1–30, 31–60, 61–90, 90+. */
export const AGEING = [91.2, 4.2, 2.1, 1.0, 1.5] as const;

/** Product mix, TZS bn: group, SME, salary, agriculture. */
export const MIX = [21.8, 18.0, 15.4, 9.0] as const;

/** Disbursed vs repaid, TZS bn, Apr..Sep 2026. */
export const FLOWS_START_MONTH = 3;
export const DISBURSED = [5.2, 5.5, 5.8, 5.4, 5.6, 5.9] as const;
export const REPAID = [5.0, 5.3, 5.5, 5.6, 5.7, 5.8] as const;

export const LOANS = {
  /** Sum of the product mix. */
  portfolio: round(sum(MIX), 1) * 1e9, // 64.2 bn
  portfolioGrowth: 2.1,
  /** Loans 31+ days overdue = PAR30. */
  par30: round(AGEING[2] + AGEING[3] + AGEING[4], 1), // 4.6
  /** 90+ days = non-performing. */
  npl: AGEING[4], // 1.5
  disbursedSep: DISBURSED[DISBURSED.length - 1] * 1e9, // 5.9 bn
  disbursedPlan: 6.1e9,
} as const;

/** Loan officers, by code only. Sparkline slope per spec §8.3. */
export const OFFICERS = [
  { code: "LO-014", branch: "Kariakoo", portfolio: 2.84e9, par: 2.1, slope: 0.05 },
  { code: "LO-022", branch: "Arusha", portfolio: 2.31e9, par: 3.4, slope: 0.06 },
  { code: "LO-031", branch: "Mwanza", portfolio: 2.12e9, par: 4.2, slope: 0.08 },
  { code: "LO-018", branch: "Zanzibar", portfolio: 1.92e9, par: 3.0, slope: 0.04 },
  { code: "LO-009", branch: "Dodoma", portfolio: 1.76e9, par: 5.6, slope: 0.14 },
  { code: "LO-047", branch: "Mbeya", portfolio: 1.58e9, par: 7.9, slope: 0.22 },
] as const;

/** 12-month PAR30 sparkline for officer row n: p[j] = end − (11 − j)·slope + 0.15·sin(1.7j + n). */
export function officerSeries(n: number): number[] {
  const { par, slope } = OFFICERS[n];
  return Array.from({ length: 12 }, (_, j) => par - (11 - j) * slope + 0.15 * Math.sin(j * 1.7 + n));
}

/* ── View 3 · Sales by region (Sample distributor, Q3 2026) ─────────── */

export type RegionKey = TzTerritory | "other";

/** Ranked regions: sales TZS bn, YoY %. Hubs carry map coordinates. */
export const REGIONS: readonly {
  key: RegionKey;
  name: string;
  sales: number;
  yoy: number;
  hub?: { lat: number; lon: number };
}[] = [
  { key: "dar", name: "Dar es Salaam", sales: 2.24, yoy: 8, hub: { lat: -6.79, lon: 39.21 } },
  { key: "arusha", name: "Arusha", sales: 0.88, yoy: 14, hub: { lat: -3.37, lon: 36.68 } },
  { key: "mwanza", name: "Mwanza", sales: 0.81, yoy: 17, hub: { lat: -2.52, lon: 32.9 } },
  { key: "dodoma", name: "Dodoma", sales: 0.59, yoy: 21, hub: { lat: -6.16, lon: 35.75 } },
  { key: "mbeya", name: "Mbeya", sales: 0.58, yoy: 9, hub: { lat: -8.9, lon: 33.46 } },
  { key: "kilimanjaro", name: "Kilimanjaro", sales: 0.44, yoy: 6, hub: { lat: -3.35, lon: 37.34 } },
  { key: "zanzibar", name: "Zanzibar", sales: 0.44, yoy: 12, hub: { lat: -6.16, lon: 39.19 } },
  { key: "morogoro", name: "Morogoro", sales: 0.37, yoy: 10, hub: { lat: -6.82, lon: 37.66 } },
  { key: "tanga", name: "Tanga", sales: 0.36, yoy: 4, hub: { lat: -5.07, lon: 39.1 } },
  { key: "other", name: "Other regions", sales: 0.61, yoy: 15 },
];

/** Ramp step 1..5 for a YoY growth (%): <=6, 7–9, 10–13, 14–17, >=18. */
export function growthStep(yoy: number): 1 | 2 | 3 | 4 | 5 {
  if (yoy <= 6) return 1;
  if (yoy <= 9) return 2;
  if (yoy <= 13) return 3;
  if (yoy <= 17) return 4;
  return 5;
}

const salesTotal = round(sum(REGIONS.map((r) => r.sales)), 2);
const salesPrior = sum(REGIONS.map((r) => r.sales / (1 + r.yoy / 100)));

export const SALES = {
  /** Sum of the regions. */
  total: salesTotal * 1e9, // 7.32 bn
  /** Value-weighted growth on Q3 2025. */
  yoy: round((salesTotal / salesPrior - 1) * 100, 1), // 11.3
  activeOutlets: 3940,
  averageOrder: 412000,
} as const;

/** Share of Q3 sales, % (one decimal when displayed). */
export const regionShare = (sales: number) => (sales / salesTotal) * 100;

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

/** Monthly management pack, minutes: by hand vs automated. */
export const PACK = { beforeMinutes: 14 * 60, afterMinutes: 4 } as const;

/** Agent log statuses come from the dictionary; these map them to glyph tone. */
export const LOG_TONE = { sent: "ok", awaiting: "warn", queued: "muted" } as const;

/* ── Consistency ──────────────────────────────────────────────────────── */

export function sampleChecks(): Record<string, boolean> {
  return {
    revenueYtd: round(sum(REVENUE), 2) === 18.4,
    par30IsAgeing31Plus: LOANS.par30 === PAR30[PAR30.length - 1],
    nplIs90Plus: LOANS.npl === 1.5,
    ageingSums100: round(sum(AGEING), 1) === 100,
    mixSumsToPortfolio: round(sum(MIX), 1) === 64.2,
    regionsSumToSales: salesTotal === 7.32,
    weightedYoy: SALES.yoy === 11.3,
    medianRun: OPERATIONS.medianSeconds === 38,
    officersOverLimit:
      OFFICERS.filter((o) => o.par > PAR30_LIMIT).map((o) => o.branch).join() === "Dodoma,Mbeya",
  };
}
