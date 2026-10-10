#!/usr/bin/env node
/**
 * Runs `prisma migrate deploy` only for a production deployment.
 *
 * Vercel runs `npm run vercel-build` for every deployment. Preview builds (a
 * pushed branch) have no DATABASE_URL, and must not migrate the production
 * database even if they had one — a preview is for looking at, not for
 * changing data. Production keeps migrating before every build, as before.
 */
import { spawnSync } from "node:child_process";

const env = process.env.VERCEL_ENV;
if (env && env !== "production") {
  console.log(`[migrate] skipped: ${env} deployment (migrations run on production only)`);
  process.exit(0);
}
if (!process.env.DATABASE_URL) {
  console.error("[migrate] DATABASE_URL is not set for a production build.");
  process.exit(1);
}
const r = spawnSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
