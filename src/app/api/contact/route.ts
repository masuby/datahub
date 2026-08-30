import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { contactSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendLeadNotification } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Best-effort client IP from common proxy headers (Nginx sets X-Forwarded-For). */
function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Salted SHA-256 of the IP — we store a hash, never the raw address. */
function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "datahub-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  // 1) Content-type guard — only accept JSON.
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { ok: false, error: "Unsupported content type." },
      { status: 415 },
    );
  }

  const ip = getClientIp(req);

  // 2) Rate limit per IP before doing any real work.
  const limit = await rateLimit(ip);
  if (!limit.success) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  // 3) Parse body defensively (cap size, handle malformed JSON).
  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > 20_000) {
      return NextResponse.json(
        { ok: false, error: "Payload too large." },
        { status: 413 },
      );
    }
    raw = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // 4) Validate against the schema (also checks the honeypot).
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // 5) Honeypot: if filled, pretend success but drop it silently.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // 6) Persist the lead. Email is best-effort and must not fail the request.
  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        service: data.service || null,
        source: data.source || null,
        message: data.message,
        ipHash: hashIp(ip),
        userAgent: (req.headers.get("user-agent") ?? "").slice(0, 400) || null,
      },
    });
  } catch (err) {
    console.error("[contact] failed to save lead:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  try {
    await sendLeadNotification(data);
  } catch (err) {
    // Lead is already saved; log and continue.
    console.error("[contact] notification email failed:", err);
  }

  return NextResponse.json({ ok: true });
}

// Reject other methods explicitly.
export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed." }, { status: 405 });
}
