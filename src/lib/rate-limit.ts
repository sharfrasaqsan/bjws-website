/**
 * In-memory sliding-window rate limiter for server actions.
 * Designed to prevent automated abuse without external dependencies.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetAt) {
          rateLimitMap.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
}

export interface RateLimitOptions {
  limit?: number; // Maximum allowed attempts
  windowMs?: number; // Time window in milliseconds
}

/**
 * Checks whether an identifier (e.g. client IP or composite key) is rate-limited.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetInSeconds: number } {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000; // 10 minutes default
  const now = Date.now();

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}
