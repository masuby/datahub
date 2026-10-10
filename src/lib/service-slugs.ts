/**
 * The service pages that exist, by URL slug — the one list shared by the
 * route, the content (src/lib/services*.ts) and src/proxy.ts. Proxy is
 * bundled separately from the app, so this file must import nothing.
 */
export const SERVICE_SLUGS = ["dashboards", "automation", "ai-agents"] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const isServiceSlug = (s: string): s is ServiceSlug =>
  (SERVICE_SLUGS as readonly string[]).includes(s);
