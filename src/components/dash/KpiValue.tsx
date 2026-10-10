"use client";

import { CountUp } from "@/components/ui/CountUp";
import { formatNumber } from "@/lib/format";

/**
 * A KPI value that counts up once when its panel is first shown (spec §4.3
 * item 7). The server splits the final, already-localised string into the
 * text around the number and the number itself, so the last frame is exactly
 * the server's text ("TZS 18.4 bn", "TZS bilioni 18.4", "48,210", "38 s").
 */
export function KpiValue({
  before,
  value,
  decimals,
  after,
}: {
  before: string;
  value: number;
  decimals: number;
  after: string;
}) {
  return <CountUp value={value} format={(v) => `${before}${formatNumber(v, decimals)}${after}`} />;
}
