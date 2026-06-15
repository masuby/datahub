import Redis from "ioredis";

/**
 * Fixed-window rate limiter.
 *
 * Uses Redis when REDIS_URL is configured (shared across instances, survives
 * restarts) and otherwise falls back to a per-process in-memory window so the
 * endpoint stays protected even if Redis is unavailable.
 */

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

const WINDOW_SECONDS = Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 600); // 10 min
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 5);

// --- Redis (optional) -------------------------------------------------------
const globalForRedis = globalThis as unknown as { redis?: Redis | null };

function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (globalForRedis.redis !== undefined) return globalForRedis.redis;
  try {
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: false,
    });
    client.on("error", () => {
      /* swallow — we fall back to in-memory on failure */
    });
    globalForRedis.redis = client;
    return client;
  } catch {
    globalForRedis.redis = null;
    return null;
  }
}

// --- In-memory fallback -----------------------------------------------------
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    const resetAt = now + WINDOW_SECONDS * 1000;
    memoryStore.set(key, { count: 1, resetAt });
    return { success: true, remaining: MAX_REQUESTS - 1, resetAt };
  }
  entry.count += 1;
  const success = entry.count <= MAX_REQUESTS;
  return {
    success,
    remaining: Math.max(0, MAX_REQUESTS - entry.count),
    resetAt: entry.resetAt,
  };
}

// Opportunistic cleanup so the map cannot grow unbounded.
function sweepMemory() {
  if (memoryStore.size < 5000) return;
  const now = Date.now();
  for (const [k, v] of memoryStore) {
    if (v.resetAt < now) memoryStore.delete(k);
  }
}

export async function rateLimit(identifier: string): Promise<RateLimitResult> {
  const key = `rl:contact:${identifier}`;
  const redis = getRedis();

  if (redis && redis.status === "ready") {
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, WINDOW_SECONDS);
      }
      const ttl = await redis.ttl(key);
      const resetAt = Date.now() + (ttl > 0 ? ttl : WINDOW_SECONDS) * 1000;
      return {
        success: count <= MAX_REQUESTS,
        remaining: Math.max(0, MAX_REQUESTS - count),
        resetAt,
      };
    } catch {
      // fall through to memory
    }
  }

  sweepMemory();
  return memoryLimit(key);
}
