import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight liveness probe for Docker / load balancers. */
export function GET() {
  return NextResponse.json({ ok: true, service: "datahub", ts: Date.now() });
}
