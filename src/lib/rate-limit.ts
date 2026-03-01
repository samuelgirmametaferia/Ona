/**
 * Rate limiting: in-memory (default) or Upstash Redis when UPSTASH_REDIS_REST_URL is set.
 * Vercel-ready: use Upstash in production for global limits across serverless instances.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_GENERAL = 120; // per minute per key
const MAX_AUTH = 10; // login/signup per minute per IP
const MAX_ADMIN = 60; // admin API per minute per IP
const MAX_ACTIVITY = 60; // activity events per user per minute
const MAX_SEND_WELCOME = 20; // send-welcome per IP per minute

export function rateLimit(identifier: string, max: number = MAX_GENERAL): { ok: boolean; remaining: number } {
  const now = Date.now();
  let entry = store.get(identifier);

  if (!entry) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: max - 1 };
  }

  if (now > entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS };
    store.set(identifier, entry);
    return { ok: true, remaining: max - 1 };
  }

  entry.count += 1;
  const remaining = Math.max(0, max - entry.count);
  const ok = entry.count <= max;
  return { ok, remaining };
}

export function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";
  return `ip:${ip}`;
}

/** For auth routes (login/signup): stricter limit per IP. */
export function rateLimitAuth(request: Request): { ok: boolean; remaining: number } {
  const key = getRateLimitKey(request);
  return rateLimit(`auth:${key}`, MAX_AUTH);
}

/** For admin API routes: limit per IP. */
export function rateLimitAdmin(request: Request): { ok: boolean; remaining: number } {
  const key = getRateLimitKey(request);
  return rateLimit(`admin:${key}`, MAX_ADMIN);
}

export type RateLimitPreset = "auth" | "admin" | "activity" | "send_welcome";

const PRESET_MAX: Record<RateLimitPreset, number> = {
  auth: MAX_AUTH,
  admin: MAX_ADMIN,
  activity: MAX_ACTIVITY,
  send_welcome: MAX_SEND_WELCOME,
};

/**
 * Async rate limit check: uses Upstash Redis when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set (e.g. on Vercel), otherwise in-memory.
 * Use this in API routes for consistent limits across serverless instances.
 */
export async function checkLimit(
  identifier: string,
  preset: RateLimitPreset
): Promise<{ ok: boolean; remaining: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const { Ratelimit } = await import("@upstash/ratelimit");
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({ url, token });
      const max = PRESET_MAX[preset];
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(max, "60 s"),
        prefix: `rl:${preset}:`,
      });
      const result = await ratelimit.limit(identifier);
      return { ok: result.success, remaining: result.remaining };
    } catch {
      // fallback to in-memory on Upstash error
    }
  }
  const max = PRESET_MAX[preset];
  return Promise.resolve(rateLimit(identifier, max));
}

/** Async auth rate limit (use in auth callback). */
export async function checkRateLimitAuth(request: Request): Promise<{ ok: boolean; remaining: number }> {
  return checkLimit(`auth:${getRateLimitKey(request)}`, "auth");
}

/** Async admin rate limit (use in admin API routes). */
export async function checkRateLimitAdmin(request: Request): Promise<{ ok: boolean; remaining: number }> {
  return checkLimit(`admin:${getRateLimitKey(request)}`, "admin");
}

/** Async activity rate limit by user id. */
export async function checkRateLimitActivity(userId: string): Promise<{ ok: boolean; remaining: number }> {
  return checkLimit(`activity:${userId}`, "activity");
}

/** Async send-welcome rate limit by IP. */
export async function checkRateLimitSendWelcome(request: Request): Promise<{ ok: boolean; remaining: number }> {
  return checkLimit(`send_welcome:${getRateLimitKey(request)}`, "send_welcome");
}
